import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export let searchQuery = writable('')

export let currentGroup = writable({})
export let requesting = writable(false)
export let groupList = writable([])
export let addForm = writable(false)

export function createGroup(name: string) {

    postRequest('/api/group/create', {
        token: getToken(),
        name: name
    }, (json: any) => {
        if(!json.success) return;

        showNotification('Gruppe wurde erstellt!', 'green', 2000)
        searchQuery.set('')
        listGroups('')
        addForm.set(false)
    })

}

export function reset() {
    groupList.set([])
}

export function listGroups(query: string) {
    postRequest('/api/group/' + (query ? 'search' : 'list'), !query ? {
        token: getToken(),
        limit: 12,
        offset: 0
    } : {
        token: getToken(),
        limit: 12,
        offset: 0,
        name: query + '%'
    }, (json: any) => {

        if(!json.success) return

        json.groups.sort(function(a, b){return a.id - b.id})
        groupList.set(json.groups)

    })
}

export function retrieveGroup(id: number) {

    postRequest('/api/group/get', {
        token: getToken(),
        group: id
    }, (json: any) => {
        console.log(json)

        if(!json.success) return;

        currentGroup.set({
            name: json.name,
            description: json.description,
            memberCount: json.memberCount,
            id: id,
            member: json.member,
            creator: json.creator,
            members: json.members.sort(function(a,b){return b.id - a.id})
        })
    })
    
}