import { writable } from "svelte/store";

export let showAlert = writable(false)
export let alertMessage = writable('')
export let alertColor = writable('')
export let alertLength = writable(2000)

let timeout: any;

/**
 * Shows a notification
 * @param message Message of the notification
 * @param color Color of the notification
 * @param length Length of the notification
 */
export function showNotification(message: string, color: string, length: number) {

    // Update notification properties
    alertMessage.set(message)
    alertColor.set(color)
    alertLength.set(length)

    // Delete previous notifications (if exists)
    if(timeout) {
        clearTimeout(timeout)
    }

    // Show notification
    showAlert.set(true)

    // Hide notification after a certain period of time
    timeout = setTimeout(() => showAlert.set(false), length);
}