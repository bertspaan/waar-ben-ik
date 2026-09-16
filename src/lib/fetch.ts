import axios from 'axios'

export default function get<T> (url: string): Promise<T> {
  return axios.get<T>(url)
    .then((response) => response.data)
}

export function post<T = unknown> (url: string, data: unknown): Promise<T> {
  return axios.post<T>(url, data)
    .then((response) => response.data)
}
