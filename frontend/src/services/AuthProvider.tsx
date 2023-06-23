import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	UserCredential,
	User,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import React, { useState, useContext, useEffect } from "react";

const AuthContext = React.createContext<AuthContextProps | null>(null);

const app = initializeApp({
	apiKey:            import.meta.env.VITE_APIKEY,
	authDomain:        import.meta.env.VITE_AUTHDOMAIN,
	projectId:         import.meta.env.VITE_PROJECTID,
	storageBucket:     import.meta.env.VITE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
	appId:             import.meta.env.VITE_APPID,
});
export const auth = getAuth(app);

export type AuthContextProps = {
	user: User | null;
	handleLogin: (email: string, password: string) => Promise<Boolean>;
	handleLogout: () => void;
	handleSignUp: (email: string, password: string) => Promise<Boolean>;
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
			setUser(login.user);
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

	const handleSignUp = async (email: string, password: string) => {
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			return true;
		} catch (err) {
			console.error(err);
		}
		return false;
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
				handleSignUp,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): any => {
	return useContext(AuthContext);
};
