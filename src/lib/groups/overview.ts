import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";
import { retrieveGroup } from "./groups";

export let newDescription = writable('')
export let editDescriptionForm = writable(false)

export function changeDescription(id: number, description: string) {

    postRequest('/api/group/edit', {
        token: getToken(),
        group: id,
        description: description
    }, (json: any) => {

        if(!json.success) {
            
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

        editDescriptionForm.set(false)
        newDescription.set('')
        showNotification('Beschreibung wurde aktualisiert!', 'green', 2000)
        retrieveGroup(id)

    })
}

export function changeJoinState(id: number, joined: boolean, callback: any) {

    postRequest('/api/group/' + (joined ? 'leave' : 'join'), {
        token: getToken(),
        group: id
    }, (json: any) => {

        if(!json.success) {
            callback()
            
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

        if(joined) {
            showNotification('Du hast die Gruppe verlassen!', 'green', 2000)
        } else showNotification('Du bist der Gruppe beigetreten!', 'green', 2000)

    })

}