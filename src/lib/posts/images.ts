import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken } from "$lib/configuration";
import { writable } from "svelte/store";
import { uploadStatus } from "./posts";

export let uploadedImage = writable(0)
export let uploadDone = writable(false)
export let uploadFailed = writable(false)

export function uploadPicture(file: any) {

    uploadStatus.set(file.name + ' wird hochgeladen..')

    let data = new FormData()
    data.append('file', file)
    data.append('token', getToken())

    fetch(basePath + '/api/image/upload', {
        method: 'post',
        body: data
    }).then(res => {

        if(!res.ok) {
            throw console.error()
        } else {    
            return res.json()
        }

    }).then(json => {

        if(!json.success) {

            switch(json.data) {
                case 'file.too_large':
                    showNotification('Die Datei ist zu groß!', 'red', 2000)
                    break

                case 'session.expired.deleted':
                case 'session.expired':
                    showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                    break;

                case 'upload.failed':
                    showNotification('Das Hochladen der Datei ist schiefgegangen!', 'red', 2000)
                    break;
            }

            uploadFailed.set(true)

            return
        }

        uploadedImage.set(json.data)
        uploadDone.set(true)

    }).catch(() => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
    })

}