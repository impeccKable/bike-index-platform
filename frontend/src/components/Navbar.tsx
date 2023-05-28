import { LinkButton } from './Form';

function Navbar() {
  return (
    <nav>
      <LinkButton to="/thieflist">Thief List</LinkButton>
      <LinkButton to="."         >User List</LinkButton>
      <LinkButton to="/import"   >Data Import</LinkButton>
      <LinkButton to="/stats"    >Stats</LinkButton>
      <LinkButton to="/about"    >About</LinkButton>
      <LinkButton to="/"         >Logout</LinkButton>
    </nav>
  );
}

export default Navbar;
