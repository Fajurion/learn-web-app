import cookie from "cookie"

export let basePath = 'http://localhost:8880'

export function getToken() {
    return cookie.parse(document.cookie).token
}