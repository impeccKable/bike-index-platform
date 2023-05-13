import { useState } from 'react'
import '../App.css'

function Login() {
  const [searchText, setSearchText] = useState("")
  const [searchTextType, setSearchTextType] = useState("")

  // function isEmail(text: string) {
  //   return text.includes("@")
  // }
  // function isPhone(text: string) {
  //   return text.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)
  // }

  function handleSearchInput(e: any) {
    let newSearchText = e.target.value
    let newSearchTextType = ""
    if (newSearchText.includes("@")) {
      newSearchTextType = "email"
    } else if (newSearchText.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)) {
      newSearchTextType = "phone"
    } else {
      newSearchTextType = ""
    }
    setSearchTextType(newSearchTextType)
    setSearchText(newSearchText)
  }

  return (
    <>
      <h1>Login Page</h1>
      Username <input type="text" value={searchText} onChange={handleSearchInput}/>
      <br></br>
      {searchTextType}
    </>
  )
}

export default Login

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
