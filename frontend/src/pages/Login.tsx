import { useState } from 'react';
import { Form, FormInput, FormButton } from '../components/Form';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  function handleSubmit(e: any) {
    e.preventDefault()
    console.log(e)
    console.log(e.dataDict)
    navigate('/thiefs')
  }
  return (
    <div className="login-page">
      <h1 className="title">Bike Index Platform</h1>
      <Form onSubmit={handleSubmit}>
        <FormInput label="Email" name="email" type="text" />
        <FormInput label="Password" name="password" type="password" />
        <FormButton className="btn-submit" type="submit">
          Sign In
        </FormButton>
        <div className="links">
          <a href="/signup">Sign Up</a>
          <a href="/">Forgot Password</a>
        </div>
      </Form>
    </div>
  );
}

export default Login;

// {/* <h1>Login Page</h1>
// Username <MultiField componentType={TextField} onChange={handleUsername} />
// <p>Entered: {username}</p> */}

// const [searchText, setSearchText] = useState("")
// const [searchTextType, setSearchTextType] = useState("")

// function isEmail(text: string) {
//   return text.includes("@")
// }
// function isPhone(text: string) {
//   return text.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)
// }

// function handleSearchInput(e: any) {
//   let newSearchText = e.target.value
//   let newSearchTextType = ""
//   if (newSearchText.includes("@")) {
//     newSearchTextType = "email"
//   } else if (newSearchText.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)) {
//     newSearchTextType = "phone"
//   } else {
//     newSearchTextType = ""
//   }
//   setSearchTextType(newSearchTextType)
//   setSearchText(newSearchText)
// }

// const [username, setUsername] = useState("")
// function handleUsername(data: any) {
//   setUsername(data)
// }

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
