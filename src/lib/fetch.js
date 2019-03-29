import axios from 'axios'

export default function get (url) {
  return axios.get(url)
    .then((response) => response.data)
}

export function post (url, data) {
  return axios.post(url, data)
    .then((response) => response.data)
}
