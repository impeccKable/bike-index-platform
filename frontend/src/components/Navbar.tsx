import { LinkButton } from "./Form";

function Navbar() {
	return (
		<nav>
			<LinkButton className="btn-home" to="/">Home</LinkButton>
			<LinkButton to="/thiefList">Thiefs</LinkButton>
			<LinkButton to=".">Users</LinkButton>
			<LinkButton to="/import">Data</LinkButton>
			<LinkButton to="/stats">Stats</LinkButton>
			<LinkButton to="/about">About</LinkButton>
			<LinkButton to="/logout">Logout</LinkButton>
		</nav>
	);
}

export default Navbar;
