import { showNotification } from "$lib/components/notificationStore";
import { basePath, getToken } from "$lib/configuration";
import { writable } from "svelte/store";

export let searchQuery = writable('')

export let currentGroup = writable({})
export let requesting = writable(false)
export let groupList = writable([])
export let addForm = writable(false)

export function createGroup(name: string) {

    fetch(basePath + '/api/group/create', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            name: name
        })
    }).then(async res => {

        if(res.ok) {
            const json = await res.json()

            if(!json.success) {
                
                switch(json.message) {
                    case 'server.error':
                        showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                        break

                    case 'session.expired.deleted':
                    case 'session.expired':
                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        break
                }

                return
            }

            showNotification('Gruppe wurde erstellt!', 'green', 2000)
            searchQuery.set('')
            listGroups('')
            addForm.set(false)

        } else {
            showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
        }


    }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))

}

export function reset() {
    groupList.set([])
}

export function listGroups(query: string) {
    requesting.set(true)

    fetch(basePath + '/api/group/' + (query ? 'search' : 'list'), {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: !query ? JSON.stringify({
            token: getToken(),
            limit: 12,
            offset: 0
        }) : JSON.stringify({
            token: getToken(),
            limit: 12,
            offset: 0,
            name: query + '%'
        })
    }).then(async res => {
        requesting.set(false)

        if(res.ok) {
            const json = await res.json()
            console.log(json)

            if(!json.success) {
                
                switch(json.message) {
                    case 'server.error':
                        showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                        break

                    case 'session.expired.deleted':
                    case 'session.expired':
                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        break
                }

                return
            }

            json.groups.sort(function(a, b){return a.id - b.id})
            groupList.set(json.groups)

        } else {
            showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
        }

    }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))

}

export function retrieveGroup(id: number) {

    requesting.set(true)
    fetch(basePath + '/api/group/get', {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            token: getToken(),
            group: id
        })
    }).then(async res => {

        requesting.set(false)

        if(res.ok) {
            const json = await res.json()
            console.log(json)

            if(!json.success) {
                
                switch(json.message) {
                    case 'server.error':
                        showNotification('Es gab einen Fehler auf dem Server. Bitte kontaktiere einen Administrator!', 'red', 2000)
                        break

                    case 'session.expired.deleted':
                    case 'session.expired':
                        showNotification('Deine Sitzung ist abgelaufen!', 'red', 2000)
                        break
                }

                return
            }

            currentGroup.set({
                name: json.name,
                description: json.description,
                memberCount: json.memberCount,
                id: id,
                member: json.member,
                creator: json.creator,
                members: json.members.sort(function(a,b){return b.id - a.id})
            })

        } else {
            showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000)
        }

    }).catch(() => showNotification('Der Server ist gerade offline! Bitte versuche es später nochmal.', 'red', 5000))
    
}