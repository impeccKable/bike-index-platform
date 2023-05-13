import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css'

function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}
      <Routes>
        <Route path='/'       element={<Login  />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
      </Routes>
    </div>
  );
}

export default App
