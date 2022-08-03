import { writable } from "svelte/store";
import { getToken, basePath, postRequest } from "$lib/configuration"
import { showNotification } from "$lib/components/notificationStore";

export let currentTopic = writable({})

export let topicList = writable([])
export let path = ''

// Caching
export let map = new Map<number, []>()
export let parentMap = new Map<number, number>()

/**
 * Loads a topic
 * @param parent if the topic has a parent
 * @param topic id of the topic 
 */
export async function loadNewTopic(parent: boolean, topic: number) {

    let topicToRq = topic

    if(topic != 0 && parent) {

        if(parentMap.has(topic)) {
            topicToRq = parentMap.get(topic) || 0
        } else {

            try {
                const res = await fetch(basePath + '/api/topic/get', {
                    method: 'post',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        token: getToken(),
                        topic: topic
                    })
                })
    
                const json = await res.json()
                parentMap.set(json.topic.id, json.topic.parent)
                topicToRq = json.topic.parent
                currentTopic.set(json.topic)
                
            } catch (error) {}
        }
    }

    if(map.has(topicToRq)) {
        topicList.set(map.get(topicToRq) || [])
    }

    postRequest('/api/topic/list', {
        token: getToken(),
        topic: topicToRq
    }, (json: any) => {

        if(!json.success) return;

        map.set(topic, json.topics)
        topicList.set(json.topics)

    })

}

/**
 * Creates a new topic
 * @param name name of the topic
 * @param parent parent of the topic
 */
export function createTopic(name: string, parent: number) {

    // Send request to the server
    postRequest('/api/topic/create', { // Body of the request
        token: getToken(),
        name: name,
        parent: parent
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) {

            // Send notification
            switch(json.message) {
                case "name_too_long":
                    showNotification('Die Länge des Namens darf nicht größer als 50 sein.', 'red', 2000)
                    break;
    
                case "name_too_short":
                    showNotification('Die Länge des Namens darf nicht kleiner als 3 sein.', 'red', 2000)
                    break;
                
                case "no_permission":
                    showNotification('Du hast nicht genügend Rechte um ein Thema zu erstellen!', 'red', 2000)
                    break;
            }
            
            return
        }

        // Reload sidebar and send notification
        loadNewTopic(false, parent)
        showNotification('Thema wurde erfolgreich erstellt!', 'green', 2000)

    })

}