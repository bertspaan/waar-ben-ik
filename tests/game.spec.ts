import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import type { Map } from 'maplibre-gl'
import type { Point } from 'geojson'
import type { Panorama } from '../src/types'

// Vue development metadata used to inspect the rendered map in integration tests.
interface MapElement extends HTMLElement {
  __vueParentComponent: { ctx: { map: Map; mapClick: (point: Point) => void } }
}

const image: Panorama = {
  pano_id: 'test-panorama',
  geometry: { type: 'Point', coordinates: [4.90034, 52.37278] },
  cubic_img_pattern: 'https://panorama.test/{f}/{z}/{x}/{y}.png',
  _links: { cubic_img_preview: { href: 'https://panorama.test/preview.png' } }
}

async function startGame (page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.route('https://api.data.amsterdam.nl/panorama/**', route => route.fulfill({
    json: { _embedded: { panoramas: [image] } }
  }))
  await page.route('https://panorama.test/**', route => route.fulfill({
    contentType: 'image/png',
    body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')
  }))
  // Keep interaction tests deterministic; the live provider is checked separately.
  await page.route('https://tiles.openfreemap.org/styles/positron', route => route.fulfill({
    json: {
      version: 8,
      sources: {},
      layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#eee' } }]
    }
  }))
  await page.route('https://www.google-analytics.com/**', route => route.abort())
  await page.route('https://www.googletagmanager.com/**', route => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Start', exact: true }).click()
  await expect(page.locator('.maplibregl-canvas')).toHaveCount(1)
  await expect.poll(() => page.locator('.map').evaluate(el => (el as MapElement).__vueParentComponent.ctx.map.isStyleLoaded())).toBe(true)
  return errors
}

async function guess (page: Page) {
  await page.locator('.maplibregl-canvas').click({ position: { x: 180, y: 160 } })
  await expect(page.locator('.maplibregl-marker')).toHaveCount(1)
  await page.getByRole('button', { name: 'Hier ben ik' }).click()
  await expect(page.locator('.modal .maplibregl-marker')).toHaveCount(2)
  await expect.poll(() => page.locator('.modal .map').evaluate(el => Boolean((el as MapElement).__vueParentComponent.ctx.map.getLayer('result-lines')))).toBe(true)
}

test('guess, show result and popup, complete five rounds, restart', async ({ page }) => {
  const errors = await startGame(page)
  await guess(page)
  await page.locator('.modal .maplibregl-marker').last().click()
  await expect(page.getByRole('link', { name: 'Bekijk deze locatie' })).toBeVisible()
  await page.getByRole('button', { name: 'Volgende foto' }).click()
  await expect(page.locator('.maplibregl-marker')).toHaveCount(0)
  for (let round = 1; round < 5; round++) {
    await guess(page)
    await page.getByRole('button', { name: round === 4 ? 'Naar eindresultaat' : 'Volgende foto' }).click()
  }
  await expect(page.getByText('In 5 rondes', { exact: false })).toBeVisible()
  await expect(page.locator('.maplibregl-canvas')).toHaveCount(1)
  await expect(page.locator('.maplibregl-marker')).toHaveCount(10)
  await page.getByRole('button', { name: 'Nieuw spel' }).click()
  await expect(page.getByText('Foto 1/5')).toBeVisible()
  await expect(page.locator('.maplibregl-marker')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('all skipped rounds still show a valid final map', async ({ page }) => {
  const errors = await startGame(page)
  for (let round = 0; round < 5; round++) {
    await page.getByRole('button', { name: 'Weet ik niet' }).click()
  }
  await expect(page.getByText('Totaal: 0 punten')).toBeVisible()
  await expect(page.locator('.maplibregl-canvas')).toHaveCount(1)
  await expect(page.locator('.maplibregl-marker')).toHaveCount(0)
  expect(errors).toEqual([])
})

test('mobile map resizes when opened and after returning from panorama', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const errors = await startGame(page)
  await page.getByRole('button', { name: 'Laat kaart zien' }).click()
  await expect.poll(() => page.locator('.inset .maplibregl-canvas').evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(500)
  await page.getByRole('button', { name: 'Terug naar de foto' }).click()
  await page.getByRole('button', { name: 'Laat kaart zien' }).click()
  await expect.poll(() => page.locator('.inset .maplibregl-canvas').evaluate(el => el.getBoundingClientRect().height)).toBeGreaterThan(500)
  await guess(page)
  await expect(page.getByRole('button', { name: 'Volgende foto' })).toBeVisible()
  expect(errors).toEqual([])
})

test('an exact guess earns full points and remains in the final results', async ({ page }) => {
  const errors = await startGame(page)
  await page.locator('.inset .map').evaluate((el, point) => {
    (el as MapElement).__vueParentComponent.ctx.mapClick(point)
  }, image.geometry)
  await page.getByRole('button', { name: 'Hier ben ik' }).click()
  await expect(page.locator('.modal .score .text')).toContainText('0 meter: 1000')
  await page.getByRole('button', { name: 'Volgende foto' }).click()
  for (let round = 1; round < 5; round++) {
    await page.getByRole('button', { name: 'Weet ik niet' }).click()
  }
  await expect(page.getByText('Totaal: 1000 punten')).toBeVisible()
  await expect(page.locator('.modal .maplibregl-marker')).toHaveCount(2)
  expect(errors).toEqual([])
})
