
import { atom } from 'recoil';

export const debugState = atom({
	key: 'debug',
	default: false,
});

export const userState = atom({
	key: 'user',
	default: null,
});


