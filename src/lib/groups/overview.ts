import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";
import { retrieveGroup } from "./groups";

export let newDescription = writable('')
export let editDescriptionForm = writable(false)

/**
 * Sets a new description for a group
 * @param id id of the group
 * @param description new description
 */
export function changeDescription(id: number, description: string) {

    // Send request to the server
    postRequest('/api/group/edit', { // Body of the request
        token: getToken(),
        group: id,
        description: description
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {
            
            // Send notification if something goes wrong
            switch(json.message) {
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

        // Hide description form and send notification
        editDescriptionForm.set(false)
        newDescription.set('')
        showNotification('Beschreibung wurde aktualisiert!', 'green', 2000)

        // Reload page
        retrieveGroup(id)

    })
}

/**
 * Leave/join a group
 * @param id id of the group
 * @param joined current state of join
 * @param callback callback for changing it back
 */
export function changeJoinState(id: number, joined: boolean, callback: any) {

    postRequest('/api/group/' + (joined ? 'leave' : 'join'), {
        token: getToken(),
        group: id
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            // Change joined state back to previous state
            callback()
            
            // Send notification
            switch(json.message) {
                case 'not_joined':
                    showNotification('Du bist nicht in dieser Gruppe!', 'red', 2000)
                    break;

                case 'already_joined':
                    showNotification('Du bist bereits in dieser Gruppe!', 'red', 2000)
                    break;

                case 'not_found':
                    showNotification('Diese Gruppe wurde nicht gefunden!', 'red', 2000)
                    break;
                
                case 'creator':
                    showNotification('Du kannst deine eigene Gruppe nicht verlassen!', 'red', 2000)
                    break;
            }

            return
        }

        // Send notification of success
        if(joined) {
            showNotification('Du hast die Gruppe verlassen!', 'green', 2000)
        } else showNotification('Du bist der Gruppe beigetreten!', 'green', 2000)

    })

}