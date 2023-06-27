import { useAuth } from "../services/AuthProvider";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";

export const AuthProtected = ({ children }: any) => {
	const { user }: any = useAuth();
	// const nav = useNavigate();
	// nav("/");

	// make this component dependent on user
	useEffect(() => {
		console.log(user);
	}, [user]);

	// console.log(user);

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return children;
};
