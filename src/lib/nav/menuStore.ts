import { writable } from "svelte/store";

// Store if menu is open or not
export let menuOpen = writable(false)

// Store if sidebar is open or not
export let sidebarOpen = writable(false)

// Store if the account menu is open or not
export let accountOpen = writable(false)

// Store if the settings in the account menu are open or not
export let settingsOpen = writable(false)