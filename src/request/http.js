import axios from "axios"
export function myaxios(axiosConfig) {
    const service = axios.create({
        baseURL: "/api",
        timeout: 10000
    })
    return service(axiosConfig)
}
export function myaxios2(axiosConfig) {
    const service = axios.create({
        baseURL: "/api",
        timeout: 10000,
        headers: {
            token: window.sessionStorage.getItem("token")
        }
    })
    return service(axiosConfig)
}
