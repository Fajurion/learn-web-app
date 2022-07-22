import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken } from "$lib/configuration";
import { writable } from "svelte/store";
import { retrieveGroup } from "./groups";

export let newDescription = writable('')
export let editDescriptionForm = writable(false)

export function changeDescription(id: number, description: string) {

    fetch(basePath + '/api/group/edit', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            group: id,
            description: description
        })
    }).then(async res => {

        if(res.ok) {
            const json = await res.json()
            console.log(json)

            if(!json.success) {
                
                switch(json.message) {
                    case 'server.error':
                        showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                        break

                    case 'session.expired.deleted':
                    case 'session.expired':
                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        break

                    case 'no_permission':
                        showNotification('Du hast keine Rechte die Beschreibung dieser Gruppe zu ändern!', 'red', 2000)
                        break;

                    case 'not_found':
                        showNotification('Diese Gruppe wurde nicht gefunden!', 'red', 2000)
                        break;
                    
                    case 'description.too_long':
                        showNotification('Die Beschreibung darf nicht länger als 200 Zeichen sein!', 'red', 2000)
                        break;
                }

                return
            }

            editDescriptionForm.set(false)
            newDescription.set('')
            showNotification('Beschreibung wurde aktualisiert!', 'green', 2000)
            retrieveGroup(id)

        } else {
            showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
        }

    }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))
}