import { LinkButton } from "./Form";
import { useAuth } from "../services/AuthProvider";
import { useEffect, useState } from "react";

function Navbar() {
	const { user } = useAuth();
	const [admin, setAdmin] = useState(user?.bikeIndex.role === "admin");
	useEffect(() => {
		setAdmin(user?.bikeIndex.role === "admin");
	}, [user]);
	return (
		<nav>
			<LinkButton to="/thieves">Thieves</LinkButton>
			<LinkButton to="/users">Users</LinkButton>
			{admin&&<LinkButton to="/history">History</LinkButton>}
			{admin&&<LinkButton to="/data">Data</LinkButton>}
			<LinkButton to="/about">About</LinkButton>
			<LinkButton to="/logout">Logout</LinkButton>
		</nav>
	);
}

export default Navbar;
