import { writable } from "svelte/store";

export const selectionType = writable('')
export const selectionResult = writable<any>()