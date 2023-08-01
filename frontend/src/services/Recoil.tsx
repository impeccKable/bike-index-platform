
import { atom } from 'recoil';


export const devState = atom({
	key: 'dev',
	default: false,
})

export const debugState = atom({
	key: 'debug',
	default: false,
});

export const userState = atom({
	key: 'user',
	default: null,
});

export const isAdmin = atom({
	key: "admin",
	default: false,
});


