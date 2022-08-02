import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";

export let likeCache = new Map<number, boolean>()

export function likePost(post: any, callback: any) {

    postRequest('/api/post/like', {
        token: getToken(),
        post: post.id
    }, (json: any) => {

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

        likeCache.set(post.id, true)
        callback();
    })

}

export function unlikePost(post: any, callback: any) {

    postRequest('/api/post/unlike', {
        token: getToken(),
        post: post.id
    }, (json: any) => {

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

        likeCache.set(post.id, false)
        callback();

    })

}