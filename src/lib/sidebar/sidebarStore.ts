import { writable } from "svelte/store";
import { getToken, basePath } from "$lib/configuration"
import { showNotification } from "$lib/components/notificationStore";

export let currentTopic = writable(0)
export let requesting = writable(false)


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
        }
    }

    if(map.has(topicToRq)) {
        console.log('cache')
        topicList.set(map.get(topicToRq) || [])
    } else requesting.set(true)

    fetch(basePath + '/api/topic/list', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            topic: topicToRq
        })
    }).then(res => {
        requesting.set(false)
        
        if(res.ok) {
            return res.json()
        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
            return
        }

    }).then(json => {

        if(json.success) {
            map.set(topic, json.topics)
            topicList.set(json.topics)
        }

        switch(json.message) {

            case "server.error":
                showNotification('Es gab einen Fehler auf dem Server! Bitte spreche mit einem Administrator darüber.', 'red', 5000)
                break;

            case "session.expired.deleted":
            case "session.expired":

                showNotification('Deine Sitzung ist abgelaufen!', 'red', 5000)
                document.cookie = "token=test ; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                location.assign('/')

                break;
        }

    }).catch(e => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
        requesting.set(false)
    })

}

export function createTopic(name: string, parent: number) {

    requesting.set(true)
    fetch(basePath + '/api/topic/create', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            name: name,
            parent: parent
        })
    }).then(res => {
        requesting.set(false)
        console.log(res)
        
        if(res.ok) {
            return res.json()
        } else {
            showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
            return
        }

    }).then(json => {

        if(json.success) {

            loadNewTopic(false, parent)

            showNotification('Thema wurde erfolgreich erstellt!', 'green', 2000)
            return
        }

        switch(json.message) {

            case "server.error":
                showNotification('Es gab einen Fehler auf dem Server! Bitte spreche mit einem Administrator darüber.', 'red', 5000)
                break;

            case "session.expired.deleted":
            case "session.expired":

                showNotification('Deine Sitzung ist abgelaufen!', 'red', 5000)
                document.cookie = "token=test ; expires=Thu, 01 Jan 1970 00:00:01 GMT"
                location.assign('/')

                break;

            case "name_too_long":
                showNotification('Die Länge des Namens darf nicht größer als 50 sein.', 'red', 2000)
                break;

            case "name_too_short":
                showNotification('Die Länge des Namens darf nicht kleiner als 3 sein.', 'red', 2000)
                break;
        }


    }).catch(e => {
        showNotification('Der Server ist gerade offline. Bitte versuche es später nochmal!', 'red', 5000)
        requesting.set(false)
    })

}

export function test() {
    requesting.set(true)
    setTimeout(() => {
        requesting.set(false)
    }, 2000);
}