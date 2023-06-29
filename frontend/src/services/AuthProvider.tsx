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
import { httpClient } from "./HttpClient";
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";

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

export type UserInfo = {
	firebase: User | null;
	bikeIndex: any | null; //create type for this later
};

export type AuthContextProps = {
	user: UserInfo | null;
	handleLogin: (email: string, password: string) => Promise<Boolean>;
	handleLogout: () => void;
	handleSignUp: (email: string, password: string) => Promise<string>;
};

export const AuthProvider = ({ children }: any) => {
	if (useRecoilValue(debugState) == true) {
		console.log("AuthProvider");
	}

	const retrieveUser = () => {
		return JSON.parse(localStorage.getItem("user") ?? "null");
	}
	const [user, setUser] = useState<UserInfo | null>(retrieveUser());

	const handleLogin = async (email: string, password: string) => {
		try {
			const login = await signInWithEmailAndPassword(
				auth,
				email,
				password
				);
			const user = {
				firebase: login.user,
				bikeIndex: (await httpClient.post("/login", { uid: login.user.uid })).data,
			}
			if(user.bikeIndex.banned === true) {
				throw new Error("User is banned");
			}
			else if(user.bikeIndex.approved === false) {
				throw new Error("User is not verified");
			}
			await updateAxios(await user.firebase.getIdToken());
			updateUser(user);
			return true;
		} catch (err) {
			console.error(err);
		}
		return false;
	};

	const handleLogout = () => {
		updateUser(null);
		signOut(auth);
	};

	const handleSignUp = async (email: string, password: string) => {
		try {
			let userData = await createUserWithEmailAndPassword(auth, email, password);
			return userData.user.uid;
		} catch (err) {
			console.error(err);
		}
		return '';
	};
	const updateAxios = async (token: string) => {
		console.log(`token: ...${token.slice(-10)}`);
		httpClient.interceptors.request.use(
			async (config) => {
				// @ts-ignore
				config.headers = {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				};

				return config;
			},
			(error) => {
				console.error("REJECTED TOKEN PROMISE");
				Promise.reject(error);
			}
		);
	};

	const updateUser = (newUser: UserInfo | null) => {
		localStorage.setItem("user", JSON.stringify(newUser));
		setUser(newUser);
	}
	useEffect(() => {
		const prevUser = retrieveUser();
		if (prevUser) {
			updateAxios(prevUser.firebase.stsTokenManager.accessToken);
		}
		setUser(prevUser);
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

