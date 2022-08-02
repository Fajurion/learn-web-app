import cookie from "cookie"
import { writable } from "svelte/store"
import { showNotification } from "./components/notificationStore"

export let requesting = writable(false)
export let requestURL = writable(' ')

export const basePath = 'http://localhost:8880'

export function getToken() {
    return cookie.parse(document.cookie).token
}

export function postRequest(url: string, body: any, callback: any) {
    requesting.set(true)
    requestURL.set(url)

    fetch(basePath + url, {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body)
    }).then(async res => {
        requesting.set(false)

        if(res.ok) {
            const json = await res.json()
            console.log(json)

            if(!json.success) {
                switch(json.message) {

                    case "server.error":
                        showNotification('Es gab einen Fehler auf dem Server! Bitte spreche mit einem Administrator darüber.', 'red', 5000)
                        return;
        
                    case "session.expired.deleted":
                    case "session.expired":
        
                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 5000)
                        document.cookie = "token=test ; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                        location.assign('/')
        
                        return;
                }
            }

            callback(json)
        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
        }

    }).catch(() => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
        requesting.set(false)
    })

}