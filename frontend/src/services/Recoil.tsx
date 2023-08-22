
import { atom } from 'recoil';

const dev = import.meta.env.VITE_MODE === 'dev' ? true : false;

export const devState = atom({
	key: 'dev',
	default: dev,
})

export const debugState = atom({
	key: 'debug',
	default: false,
});

export const userState = atom({
	key: 'user',
	default: null,
});

