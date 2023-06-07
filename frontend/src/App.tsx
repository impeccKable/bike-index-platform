import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPass from './pages/ForgotPass';
import ThiefEdit from './pages/ThiefEdit';
import ThiefList from './pages/ThiefList';
import DataImport from './pages/DataImport';
import About from './pages/About';
import Stats from './pages/Stats';

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/"          element={<Login      />}></Route>
        <Route path="/signup"    element={<Signup     />}></Route>
        <Route path="/forgot"    element={<ForgotPass />}></Route>
        <Route path="/thiefEdit" element={<ThiefEdit  />}></Route>
        <Route path="/thiefList" element={<ThiefList  />}></Route>
        <Route path="/import"    element={<DataImport />}></Route>
        <Route path="/about"     element={<About      />}></Route>
        <Route path="/stats"     element={<Stats      />}></Route>
      </Routes>
    </div>
  );
}
