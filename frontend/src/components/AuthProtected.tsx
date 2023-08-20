import { useAuth } from "../services/AuthProvider";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "../../node_modules/react-router-dom/dist/index";

export function AuthProtected({ children }: any) {
	const { user, loading }: any = useAuth();

	useEffect(() => {
		console.log('user', user);
	}, [loading]);

	if (!loading&&!user) {
		return <Navigate to="/" replace />;
	} else if (loading) {
		return <div>Loading...</div>;
	}

	return children;
};
