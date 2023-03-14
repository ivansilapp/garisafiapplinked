import axios from 'axios'
// config
import { HOST_API_KEY } from '../config-global'

// ----------------------------------------------------------------------
// console.log({ HOST_API_KEY })
const axiosInstance = axios.create({ baseURL: HOST_API_KEY ?? '' })

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || 'Something went wrong'
        )
)

export default axiosInstance
