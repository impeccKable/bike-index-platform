import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPass from "./pages/ForgotPass";
import ThiefList from "./pages/ThiefList";
import ThiefEdit from "./pages/ThiefEdit";
import UserList from "./pages/UserList";
// import UserEdit from "./pages/UserEdit";
import RequestVerification from "./pages/RequestVerification";
import DataImport from "./pages/Data";
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
		if (window.location.protocol === 'http:') {
			window.location.href = window.location.href.replace('http', 'https');
		}
	})

	return (
		<div className="App">
			<Routes>
				<Route path="/"          element={<Login />}></Route>
				<Route path="/signup"    element={<Signup />}></Route>
				<Route path="/forgot"    element={<ForgotPass />}></Route>
				<Route path="/thiefList" element={<ThiefList />}></Route>
				<Route path="/thiefEdit" element={<ThiefEdit />}></Route>
				<Route path="/userList"  element={<UserList />}></Route>
				{/* <Route path="/userEdit"  element={<UserEdit />}></Route> */}
				<Route path="/import"    element={<DataImport />}></Route>
				<Route path="/about"     element={<AuthProtected><About /></AuthProtected>}></Route>
				<Route path="/logout"    element={<Logout />}></Route>
				<Route path="/requestverification" element={<RequestVerification />}></Route>
			</Routes>
		</div>
	);
}
