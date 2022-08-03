import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export let loadingComments = writable(false)
export let currentPost = writable({})

/**
 * Gets the info of a post
 * @param id id of the post
 */
export function loadPost(id: number) {

    // Send a request to the server
    postRequest('/api/post/info', { // Body of the request
        token: getToken(),
        post: id
    }, (json: any) => {
        
        // Return if request wasn't successful
        if(!json.success) {
            showNotification('Dieser Beitrag wurde nicht gefunden!', 'red', 3000)
            return
        }

        // Set current post
        currentPost.set(json.info)

    })

}

/**
 * Loads all comments of a post
 * @param post id of the post
 */
export function loadComments(post: number) {

}