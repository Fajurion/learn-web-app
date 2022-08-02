import { goto } from "$app/navigation";
import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken } from "$lib/configuration";
import { writable } from "svelte/store";

export let likeLoading = writable(false)

export let likeCache = new Map<number, boolean>()

export function likePost(post: any, callback: any) {
    likeLoading.set(true)

    fetch(basePath + '/api/post/like', {
        method: 'post',
        body: JSON.stringify({
            token: getToken(),
            post: post.id
        }),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(async res => {
        likeLoading.set(false)

        if(res.ok) {
            const json = await res.json()

            if(json.success) {
                likeCache.set(post.id, true)
                callback();
            } else {

                switch(json.message) {

                    case "session.expired.deleted":
                    case "session.expired":

                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        document.cookie = "token=test ; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                        goto('/app')

                        break;
                    
                    case "server.error":
                        showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                        break;

                    case "already.liked":
                        showNotification('Du hast diesen Beitrag bereits bewertet.', 'red', 2000)
                        break;

                    case "not_found":
                        showNotification('Dieser Beitrag existiert nicht mehr! Wurde er gelöscht?', 'red', 2000)
                        break;
                }

            }

        } else {
            showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
        }

    }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))

}

export function unlikePost(post: any, callback: any) {
    likeLoading.set(true)

    fetch(basePath + '/api/post/unlike', {
        method: 'post',
        body: JSON.stringify({
            token: getToken(),
            post: post.id
        }),
        headers: {
            'Content-Type':'application/json'
        }
    }).then(async res => {
        likeLoading.set(false)

        if(res.ok) {
            const json = await res.json()

            if(json.success) {
                likeCache.set(post.id, false)
                callback();
            } else {

                switch(json.message) {

                    case "session.expired.deleted":
                    case "session.expired":

                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        document.cookie = "token=test ; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                        goto('/app')

                        break;
                    
                    case "server.error":
                        showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                        break;

                    case "not.liked":
                        showNotification('Du hast diesen Beitrag noch nicht bewertet.', 'red', 2000)
                        break;

                    case "not_found":
                        showNotification('Dieser Beitrag existiert nicht mehr! Wurde er gelöscht?', 'red', 2000)
                        break;
                }

            }

        } else {
            showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
        }

    }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))

}