import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ThiefList from "./pages/ThiefList";
import ThiefEdit from "./pages/ThiefEdit";
import UserList from "./pages/UserList";
// import UserEdit from "./pages/UserEdit";
import DataMgmt from "./pages/DataMgmt";
import About from "./pages/About";
import { AuthProtected } from "./components/AuthProtected";
import { Logout } from "./pages/Logout";
import { debugState, devState } from "./services/Recoil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect } from "react";

export default function App() {
	const [debug, setDebug] = useRecoilState(debugState);
	const [dev, setDev] = useRecoilState(devState);

	useEffect(() => {
		setDebug(true);
		// setDev(true);
		if (debug == true) { console.log("App"); }
		if (dev === false && window.location.protocol === 'http:') {
			window.location.href = window.location.href.replace('http', 'https');
		}
	})

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Login />}></Route>
				<Route path="/signup" element={<Signup />}></Route>
				<Route path="/thieves" element={<AuthProtected><ThiefList /></AuthProtected>}></Route>
				<Route path="/thief" element={<AuthProtected><ThiefEdit /></AuthProtected>}></Route>
				<Route path="/users" element={<AuthProtected><UserList /></AuthProtected>}></Route>
				{/* <Route path="/userEdit"  element={<UserEdit />}></Route> */}
				<Route path="/data" element={<AuthProtected><DataMgmt /></AuthProtected>}></Route>
				<Route path="/about" element={<AuthProtected><About /></AuthProtected>}></Route>
				<Route path="/logout" element={<AuthProtected><Logout /></AuthProtected>}></Route>
			</Routes>
		</div>
	);
}
