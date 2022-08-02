import { writable } from "svelte/store";
import { getToken, basePath, postRequest } from "$lib/configuration"
import { showNotification } from "$lib/components/notificationStore";

export let currentTopic = writable({})

export let topicList = writable([])
export let path = ''

// Caching
export let map = new Map<number, []>()
export let parentMap = new Map<number, number>()

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

export function createTopic(name: string, parent: number) {

    postRequest('/api/topic/create', {
        token: getToken(),
        name: name,
        parent: parent
    }, (json: any) => {

        if(!json.success) {

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

        loadNewTopic(false, parent)
        showNotification('Thema wurde erfolgreich erstellt!', 'green', 2000)

    })

}

export function test() {
    requesting.set(true)
    setTimeout(() => {
        requesting.set(false)
    }, 2000);
}

function onRequest() {
    requesting.set(true)
}

function stopRequest() {
    requesting.set(false)
}