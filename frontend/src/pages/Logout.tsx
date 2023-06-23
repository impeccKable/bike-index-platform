//import { useAuth } from "@/Services/Auth.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";

export function Logout() {
	if (useRecoilValue(debugState) == true) { console.log("Logout"); }
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		auth?.handleLogout;
		navigate("/");
	}, []);

	return <></>;
}
