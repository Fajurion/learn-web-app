import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export let loadingComments = writable(false)
export let currentPost = writable({})

export function loadPost(id: number) {

    postRequest('/api/post/info', {
        token: getToken(),
        post: id
    }, (json: any) => {
        
        if(!json.success) {
            showNotification('Dieser Beitrag wurde nicht gefunden!', 'red', 3000)
            return
        }

        currentPost.set(json.info)

    })

}

export function loadComments(post: number) {

}