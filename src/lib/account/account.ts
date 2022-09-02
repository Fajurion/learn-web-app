import { getToken, permissions, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export const accountData = writable({})
export const groupList = writable([])
export const testList = writable([])

export function refreshAccount() {
    postRequest('/api/start', {
        token: getToken()
    }, (json: any) => {
        if(!json.success) return

        accountData.set(json.account)

        json.groups.sort(function(a,b){return a.id - b.id})
        groupList.set(json.groups)
        permissions.set(json.permissions)
    })
}

export function logOut() {
    postRequest('/api/account/logout', {
        token: getToken()
    }, () => {})
}