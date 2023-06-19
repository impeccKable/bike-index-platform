import { useAuth } from "../services/AuthProvider";
import { Navigate } from "react-router-dom";

export const AuthProtected = ({ children }: any) => {
	const { user }: any = useAuth();

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return children;
};
