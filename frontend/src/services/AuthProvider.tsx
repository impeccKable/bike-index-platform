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
import { useRecoilValue, useRecoilState } from 'recoil';
import { debugState, isAdmin } from '../services/Recoil';
import { useNavigate } from 'react-router-dom';
import { devState } from '../services/Recoil';

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

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const devMode = useRecoilValue(devState);
	const [loading, setLoading] = useState(true);
	const [isAd, setIsAdmin] = useRecoilState(isAdmin);

	if (useRecoilValue(debugState) == true) {
		console.log('AuthProvider');
	}

	const updateAxios = async (token: string) => {
		console.log(`token: ...${token.slice(-10)}`);
		httpClient.interceptors.request.use(
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
		);
	};

	const updateUser = (newUser: UserInfo | null) => {
		localStorage.setItem('user', JSON.stringify(newUser));
		setUser(newUser);
	};

	const handleLogout = () => {
		updateUser(null);
		localStorage.removeItem('user');
		signOut(auth);
	};

	const verifyUserToken = async (user: UserInfo) => {

		if (!user) {
			handleLogout();
			return;
		}

		await updateAxios(user.firebase.stsTokenManager.accessToken);
		httpClient.post('/token', {}).then((res: any) => {
			if (res.status !== 200) {
				handleLogout();
			}
		});

	};

	const retrieveUser = () => {
		let user = JSON.parse(localStorage.getItem('user') ?? 'null');
		verifyUserToken(user);
		return user;
	};


	//Login handler function, can throw an error if user is banned, not verified, or if the password is incorrect
	const handleLogin = async (email: string, password: string) => {
		let login;
		if (devMode) {
			login = await signInWithEmailAndPassword(auth, 'email@email.com', 'password');
		} else {
			login = await signInWithEmailAndPassword(auth, email, password);
		}
		const user = {
			firebase: login.user,
			bikeIndex: (await httpClient.post('/login', { uid: login.user.uid }))
				.data,
		};
		
		useEffect(() => {setIsAdmin(user.bikeIndex.role.toLowerCase() === 'admin')});
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

	const handleSignUp = async (email: string, password: string) => {
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
		}
		return '';
	};

	const handleDelete = async (user: User) => {
		try {
			const uid = user.uid;
			await deleteUser(user);
			console.log(`User ${uid} deleted`);
		} catch (err) {
			console.log(err);
		}
	};

	const handleVerificationRequest = async (email: string, password:string ) => {
		try{
			let login = await signInWithEmailAndPassword(auth, email, password);
			await sendEmailVerification(login.user);
			signOut(auth);
		} catch (err) {
			console.error(err);
		}
	};

	const handlePasswordReset = async (email: string) => {
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

export const useAuth = (): any => {
	return useContext(AuthContext);
};
