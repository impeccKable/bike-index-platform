import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Thief from './pages/Thief';
import ThiefList from './pages/ThiefList';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/thiefs" element={<Thief />}></Route>
        <Route path="/thieflist" element={<ThiefList />}></Route>
      </Routes>
    </div>
  );
}

export default App;
