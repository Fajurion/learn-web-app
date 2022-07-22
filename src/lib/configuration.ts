import cookie from "cookie"

export const basePath = 'http://localhost:8880'

export function getToken() {
    return cookie.parse(document.cookie).token
}