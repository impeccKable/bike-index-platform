import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPass from "./pages/ForgotPass";
import ThiefList from "./pages/ThiefList";
import ThiefEdit from "./pages/ThiefEdit";
// import UserList from "./pages/UserList";
// import UserEdit from "./pages/UserEdit";
import DataImport from "./pages/DataImport";
import About from "./pages/About";
import Stats from "./pages/Stats";
import { AuthProtected } from "./components/AuthProtected";
import { Logout } from "./pages/Logout";
import { debugState } from "./services/Recoil";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

export default function App() {
	const [debug, setDebug] = useRecoilState(debugState);
	useEffect(() => {
		setDebug(true);
		if (debug == true) { console.log("App"); }
	})

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Login />}></Route>
				<Route path="/signup"    element={<Signup />}></Route>
				<Route path="/forgot"    element={<ForgotPass />}></Route>
				<Route path="/thiefList" element={<ThiefList />}></Route>
				<Route path="/thiefEdit" element={<ThiefEdit />}></Route>
				{/* <Route path="/userList"  element={<UserList />}></Route> */}
				{/* <Route path="/userEdit"  element={<UserEdit />}></Route> */}
				<Route path="/import"    element={<DataImport />}></Route>
				<Route path="/about"     element={<AuthProtected><About /></AuthProtected>}></Route>
				<Route path="/stats"     element={<Stats />}></Route>
				<Route path="/logout"    element={<Logout />}></Route>
			</Routes>
		</div>
	);
}
