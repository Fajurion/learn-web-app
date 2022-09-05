import { showNotification } from "$lib/components/notificationStore";
import { getToken, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export let searchQuery = writable('')

export let currentGroup = writable<any>({})
export let requesting = writable(false)
export let groupList = writable<any[]>([])
export let addForm = writable(false)

/**
 * Create a new group
 * @param name Name of the group
 */
export function createGroup(name: string) {

    // Send request to the server
    postRequest('/api/group/create', { // Body of the request
        token: getToken(),
        name: name
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) return;

        // Show notification if request was successful
        showNotification('Gruppe wurde erstellt!', 'green', 2000)
        searchQuery.set('')
        listGroups('')
        addForm.set(false)
    })

}

/**
 * Resets the group list
 */
export function reset() {
    groupList.set([])
}

/**
 * Lists groups with search filter
 * @param query Search query to search groups
 */
export function listGroups(query: string) {

    // Send a request to get the groups
    postRequest('/api/group/' + (query ? 'search' : 'list'), !query ? { // Body of the request
        token: getToken(),
        limit: 12,
        offset: 0
    } : {
        token: getToken(),
        limit: 12,
        offset: 0,
        name: '%' + query + '%'
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) return

        // Sort groups due to unsorting on the server
        json.groups.sort(function(a: any, b: any){return a.id - b.id})

        // Set group list
        groupList.set(json.groups)

    })
}

/**
 * Gets a group
 * @param id id of the group
 */
export function retrieveGroup(id: number) {

    // Send a request to the server
    postRequest('/api/group/get', { // Body of the request
        token: getToken(),
        group: id
    }, (json: any) => {

        // Return if request wasn't successful
        if(!json.success) return;

        // Set group
        currentGroup.set({
            name: json.name,
            description: json.description,
            memberCount: json.memberCount,
            id: id,
            member: json.member,
            creator: json.creator,
            members: json.members.sort(function(a: any,b: any){return b.id - a.id})
        })
    })
    
}