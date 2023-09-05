/** @format */

import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	User,
	UserCredential,
	deleteUser,
	sendEmailVerification,
	sendPasswordResetEmail
} from 'firebase/auth';
import React, { useState, useContext, useEffect } from 'react';
import { httpClient } from './HttpClient';
import { useRecoilValue} from 'recoil';
import { debugState, isAdmin } from '../services/Recoil';
import { devState } from '../services/Recoil';
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext<AuthContextProps | null>(null);

const app = initializeApp({
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_PROJECTID,
	storageBucket: import.meta.env.VITE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_APPID,
});

export const auth = getAuth(app);

export type UserInfo = {
	firebase: User | null;
	bikeIndex: any | null; //create type for this later
};

export type AuthContextProps = {
	user: UserInfo | null;
	loading: boolean;
	handleLogin: (email: string, password: string) => Promise<void>;
	handleLogout: () => void;
	handleSignUp: (email: string, password: string) => Promise<string>;
	handleDelete: (user: User) => void;
	handleVerificationRequest: (email: string, password: string) => void;
	handlePasswordReset: (email: string) => void;
};

export function AuthProvider({ children }: any) {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);

	if (useRecoilValue(debugState) == true) {
		console.log('AuthProvider');
	}

	//Bailey, C. (2023, June 7th) Doggr source code (Version 1.0.0) [Source code].
	async function updateAxios(token: string) {
		console.log(`token: ...${token.slice(-10)}`);
		const interceptor = (httpClient.interceptors.request.use(
			async (config: any) => {
				// @ts-ignore
				config.headers = {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
				};

				return config;
			},
			(error: any) => {
				console.error('REJECTED TOKEN PROMISE');
				Promise.reject(error);
			}
		));
		httpClient.interceptors.request.eject(interceptor-1);
	};

	function updateUser(newUser: UserInfo | null) {
		localStorage.setItem('user', JSON.stringify(newUser));
		setUser(newUser);
	};

	function handleLogout() {
		updateUser(null);
		localStorage.removeItem('user');
		signOut(auth);
	};

	async function verifyUserToken (user: UserInfo) {

		if (!user) {
			handleLogout();
			return;
		}

		await updateAxios(user.firebase.stsTokenManager.accessToken);
		httpClient.post('/token', {})
			.then((res: any) => {
			}).catch((err: any) => {
				console.log(err);
				if (err.response.status !== 200) {
					handleLogout();
				}
		});
	};

	function retrieveUser() {
		let user = JSON.parse(localStorage.getItem('user') ?? 'null');
		verifyUserToken(user);
		return user;
	};


	//Login handler function, can throw an error if user is banned, not verified, or if the password is incorrect
	async function handleLogin(email: string, password: string) {
		const	login = await signInWithEmailAndPassword(auth, email, password);
		const user = {
			firebase: login.user,
			bikeIndex: (await httpClient.post('/login', { uid: login.user.uid }))
				.data,
		};

		if (user.bikeIndex.banned === true) {
			throw new Error('User is banned');
		} else if (user.bikeIndex.approved === false) {
			throw new Error('User is not approved');
		} else if(user.firebase.emailVerified === false) {
			throw new Error('User email is not verified');
		}
		await updateAxios(await user.firebase.getIdToken());
		updateUser(user);
	};

	async function handleSignUp (email: string, password: string) {
		try {
			let userData = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await sendEmailVerification(userData.user);
			return userData.user;
		} catch (err) {
			console.error(err);
			throw new Error(err);
		}
		return '';
	};

	async function handleDelete (user: User) {
		try {
			const uid = user.uid;
			await deleteUser(user);
			console.log(`User ${uid} deleted`);
		} catch (err) {
			console.log(err);
		}
	};

	async function handleVerificationRequest (email: string, password:string ) {
		try{
			let login = await signInWithEmailAndPassword(auth, email, password);
			await sendEmailVerification(login.user);
			signOut(auth);
		} catch (err) {
			console.error(err);
		}
	};

	async function handlePasswordReset (email: string) {
		try{
			await sendPasswordResetEmail(auth, email);
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		console.log('AuthProvider useEffect');
		const prevUser = retrieveUser();
		if (prevUser) {
			updateAxios(prevUser.firebase.stsTokenManager.accessToken);
		}
		setUser(prevUser);
		setLoading(false);
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				handleLogin,
				handleLogout,
				handleSignUp,
				handleDelete,
				handleVerificationRequest,
				handlePasswordReset
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export function useAuth(): any {
	return useContext(AuthContext);
};
