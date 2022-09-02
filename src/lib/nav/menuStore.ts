import { writable } from "svelte/store";

// Store if menu is open or not
export let menuOpen = writable(false)

// Store if sidebar is open or not
export let sidebarOpen = writable(false)

// Store if the account menu is open or not
export let accountOpen = writable(false)

// Store if the chat is open or not
export let chatOpen = writable(false)