import { writable } from "svelte/store";

// Store if menu is open or not
export let menuOpen = writable(false)

// Store if sidebar is open or not
export let sidebarOpen = writable(false)