import { LinkButton } from "./Form";

function Navbar() {
	return (
		<nav>
			<LinkButton to="/thieves">Thieves</LinkButton>
			<LinkButton to="/users">Users</LinkButton>
			<LinkButton to="/data">Data</LinkButton>
			<LinkButton to="/about">About</LinkButton>
			<LinkButton to="/logout">Logout</LinkButton>
		</nav>
	);
}

export default Navbar;
