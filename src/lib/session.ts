import { writable, type Writable } from 'svelte/store';

export const isLoggedIn: Writable<boolean> = writable(false);
export const role: Writable<string> = writable('');
export const user: Writable<any> = writable({});
