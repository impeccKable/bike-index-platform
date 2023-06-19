import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	UserCredential,
	User,
} from "firebase/auth";
import React, { useState, useContext, useEffect } from "react";

const AuthContext = React.createContext<AuthContextProps | null>(null);

const app = initializeApp({
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTHDOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
});

export const auth = getAuth(app);

export type AuthContextProps = {
	user: User | null;
	handleLogin: (email: string, password: string) => Promise<Boolean>;
	handleLogout: () => void;
};

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState<User | null>(null);

	const handleLogin = async (email: string, password: string) => {
		try {
			const login = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const theUser = login.user;
			setUser(theUser);
			return true;
		} catch (err) {
			console.error(err);
		}
		return false;
	};

	const handleLogout = () => {
		setUser(null);
		signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(setUser);
		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				handleLogin,
				handleLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
