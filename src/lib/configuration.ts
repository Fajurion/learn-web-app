import cookie from "cookie"
import { writable } from "svelte/store"
import { showNotification } from "./components/notificationStore"

export let requesting = writable(false)
export let requestURL = writable(' ')
export let permissions = writable<any[]>([])

export let formOpen = writable(false)
export let formTitle = writable("")

export const basePath = 'http://localhost:8880'

export function getToken() {
    return cookie.parse(document.cookie).token
}

/**
 * Send a normal post request to the server
 * @param url url of the api
 * @param body body of the request
 * @param callback callback in case of request success
 */
export function postRequest(url: string, body: any, callback: any) {

    // Change requesting state
    requesting.set(true)
    requestURL.set(url)

    // Send the request
    fetch(basePath + url, {
        method: 'post',
        headers: { // Add default headers
            'Content-Type':'application/json'
        },
        body: JSON.stringify(body) // Attach body
    }).then(async res => {
        
        // Update requesting state
        requesting.set(false)

        // Check if request was successful
        if(res.ok) {
            const json = await res.json()

            // Return if request wasn't successful
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

            // Trigger callback
            callback(json)
        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
        }

    }).catch(() => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
        requesting.set(false)
    })

}