import { LinkButton } from './Form'

function Navbar() {
  return <nav>
    <LinkButton to="/about">About</LinkButton>
    <LinkButton to="/thiefs">Thief List</LinkButton>
    <LinkButton to="/users">User List</LinkButton>
    <LinkButton to="/">Logout</LinkButton>
  </nav>
}

export default Navbar
