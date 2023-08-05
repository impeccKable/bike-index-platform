import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPass from "./pages/ForgotPass";
import ThiefList from "./pages/ThiefList";
import ThiefEdit from "./pages/ThiefEdit";
import UserList from "./pages/UserList";
// import UserEdit from "./pages/UserEdit";
import VerifyEmail from "./pages/VerifyEmail";
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
	})

	return (
		<div className="App">
			<Routes>
				<Route path="/"       element={<Login       />}></Route>
				<Route path="/signup" element={<Signup      />}></Route>
				<Route path="/verify" element={<VerifyEmail />}></Route>
				<Route path="/forgot" element={<ForgotPass  />}></Route>
				<Route path="/thiefs" element={<ThiefList   />}></Route>
				<Route path="/thief"  element={<ThiefEdit   />}></Route>
				<Route path="/users"  element={<UserList    />}></Route>
				{/* <Route path="/user"   element={<UserEdit    />}></Route> */}
				<Route path="/data"   element={<DataMgmt    />}></Route>
				<Route path="/about"  element={<AuthProtected><About /></AuthProtected>}></Route>
				<Route path="/logout" element={<Logout      />}></Route>
			</Routes>
		</div>
	);
}
