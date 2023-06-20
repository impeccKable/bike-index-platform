//import { useAuth } from "@/Services/Auth.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

export function Logout() {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		auth?.handleLogout;
		navigate("/");
	}, []);

	return <></>;
}
