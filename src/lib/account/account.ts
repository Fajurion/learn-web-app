import { getToken, permissions, postRequest } from "$lib/configuration";
import { writable } from "svelte/store";

export const accountData = writable<any>({})
export const groupList = writable<any[]>([])
export const examList = writable<any[]>([])

export let settingType = writable<string>('')

export function refreshAccount() {
    postRequest('/api/start', {
        token: getToken()
    }, (json: any) => {
        if(!json.success) return

        accountData.set(json.account)

        json.groups.sort((a: any, b: any) => {return a.id - b.id})
        groupList.set(json.groups)
        permissions.set(json.permissions)
        examList.set(json.tests)
    })
}

export function logOut() {
    postRequest('/api/account/logout', {
        token: getToken()
    }, () => {})
}