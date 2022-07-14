import { writable } from "svelte/store";

export let showAlert = writable(false)
export let alertMessage = writable('')
export let alertColor = writable('')
export let alertLength = writable(2000)

let timeout: any;

export function showNotification(message: string, color: string, length: number) {

    alertMessage.set(message)
    alertColor.set(color)
    alertLength.set(length)

    if(timeout) {
        clearTimeout(timeout)
    }

    showAlert.set(true)
    timeout = setTimeout(() => showAlert.set(false), length);
}