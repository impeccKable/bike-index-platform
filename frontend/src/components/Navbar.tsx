import { LinkButton } from './Form'

function Navbar() {
  return <nav>
    <LinkButton to="/about">About</LinkButton>
    <LinkButton to="/thiefs">Thiefs</LinkButton>
    <LinkButton to="/users">Users</LinkButton>
    <LinkButton to="/">Logout</LinkButton>
  </nav>
}

export default Navbar
