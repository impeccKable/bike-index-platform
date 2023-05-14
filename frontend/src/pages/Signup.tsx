import { useState } from 'react'
import '../App.css'
import { Form, MultiField, FormInput, FormSelect, FormTextArea, FormButton } from '../components/Form'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleFormSubmit(e: any) {
    e.preventDefault()
    console.log(e.dataDict)
  }

  return (
    <>
      {/* Username <MultiField componentType={TextField} onChange={handleUsername} /> */}
      {/* <p>Entered: {username}</p> */}

      <div className="signup-page">
        <h1 className="title">Sign Up</h1>

        <Form onSubmit={handleFormSubmit}>
          <FormInput label="Username" name="username" type="text" />
          <FormInput label="Password" name="password" type="password" />
          <MultiField label="Names" name="names" component={FormInput}/>
          {/* <FormSelect label="Test dropdown" name="dropdownTest">
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </FormSelect> */}
          <FormButton className="btn-submit" type="submit" name="submit">Submit</FormButton>
        </Form>
        {/* <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button className="btn-submit" type="submit">
            Sign In
          </button>
        </form>
        <div className="links">
          <a href="#">Sign Up</a>
          <a href="#">Forgot Password</a>
        </div> */}
      </div>
    </>
  )
}

export default Signup

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
