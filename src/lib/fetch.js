import axios from 'axios'

export default function get (url) {
  return axios.get(url)
    .then((response) => response.data)
}
