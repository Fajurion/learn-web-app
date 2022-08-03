import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";

// Cache for current like state
export let likeCache = new Map<number, boolean>()

/**
 * Likes a post
 * @param post id of the post
 * @param callback callback if liking was successful
 */
export function likePost(post: any, callback: any) {

    // Send a request to the server
    postRequest('/api/post/like', { // Body of the request
        token: getToken(),
        post: post.id
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            switch(json.message) {
                case "already.liked":
                    showNotification('Du hast diesen Beitrag bereits bewertet.', 'red', 2000)
                    break;

                case "not_found":
                    showNotification('Dieser Beitrag existiert nicht mehr! Wurde er gelöscht?', 'red', 2000)
                    break;
            }

            return;
        }

        // Trigger callback and cache liked state
        likeCache.set(post.id, true)
        callback();
    })

}

/**
 * Unlikes a post
 * @param post id of the post
 * @param callback callback if unliking was successful
 */
export function unlikePost(post: any, callback: any) {

    // Send a request to the server
    postRequest('/api/post/unlike', { // Body of the request
        token: getToken(),
        post: post.id
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            switch(json.message) {
                case "not.liked":
                    showNotification('Du hast diesen Beitrag noch nicht bewertet.', 'red', 2000)
                    break;

                case "not_found":
                    showNotification('Dieser Beitrag existiert nicht mehr! Wurde er gelöscht?', 'red', 2000)
                    break;
            }

            return
        }

        // Trigger callback and cache state
        likeCache.set(post.id, false)
        callback();

    })

}