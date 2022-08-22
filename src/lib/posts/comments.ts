import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";
import { customFormat } from "./posts";

export let currentPost = writable({})
export let currentComments = writable([])

export let createComment = writable(false)

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

        // Format date
        const date = new Date(json.info.date)
        json.info.date = customFormat(date, "#DD#.#MM#.#YYYY#");

        // Set current post
        currentPost.set(json.info)

    })

}

/**
 * Loads all comments of a post
 * @param post id of the post
 */
export function loadComments(post: number, callback: any) {

    // Send a request to the server
    postRequest('/api/post/comment/list', { // Body of the request
        token: getToken(),
        post: post,
        offset: 0
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            // Send notification
            showNotification('Dieser Beitrag wurde nicht gefunden!', 'red', 5000)
            
            return;
        }

        // Format dates
        let newArray: any[] = []

        json.comments.sort(function(a,b){return a.date - b.date})

        json.comments.forEach(element => {
            element.date = customFormat(new Date(element.date), "#DD#.#MM#.#YYYY#")
            newArray.push(element)
        });

        // Trigger callback
        callback(newArray)

    })

}

/**
 * Creates a comment
 * @param id id of the post
 * @param content content of the comment
 * @param callback callback to add the comment
 */
export function create(id: number, content: string, callback: any) {

    // Send a request to the server
    postRequest('/api/post/comment/create', { // Body of the request
        token: getToken(),
        content: content,
        post: id
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) return;

        // Trigger callback to add comment
        callback()

        // Send notification
        showNotification('Dein Kommentar wurde erfolgreich erstellt!', 'green', 2000)

        // Close screen
        createComment.set(false)

    })

}