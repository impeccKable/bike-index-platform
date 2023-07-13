import { useState } from "react";
import { useAuth } from "../services/AuthProvider";
import { Form, FormInput, FormButton } from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";

export default function Login() {
	if (useRecoilValue(debugState) == true) { console.log("Login"); }
	const auth = useAuth();
	const navigate = useNavigate();
	const [loginFailure, setLoginFailure] = useState(false);

	const handleSubmit = (e: any) => {
		const email = e.dataDict.email;
		const password = e.dataDict.password;

		const f = async () => {
			const success = await auth?.handleLogin(email, password);
			if (success) {
				navigate("/thieflist");
			} else {
				setLoginFailure(true);
				//provide a message indicating authentication failure
			}
		};
		f();
	};
	return (
		<div className="notecard login-page">
			<h1>Bike Index Platform</h1>
			<Form onSubmit={handleSubmit}>
				<FormInput placeholder="Email"    name="email"    type="text" />
				<FormInput placeholder="Password" name="password" type="password" />
				<FormButton type="submit">Sign In</FormButton>
				<div className="notecard-links">
					<a href="/signup">Sign Up</a>
					<a href="/forgot">Forgot Password?</a>
				</div>
			</Form>
			{loginFailure && (
				<div>
					<p>Login failed</p>
				</div>
			)}
		</div>
	);
}

// function isEmail(text: string) {
// 	return text.includes("@")
// }
// function isPhone(text: string) {
// 	return text.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)
// }

// function handleSearchInput(e: any) {
// 	let newSearchText = e.target.value
// 	let newSearchTextType = ""
// 	if (newSearchText.includes("@")) {
// 		newSearchTextType = "email"
// 	} else if (newSearchText.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)) {
// 		newSearchTextType = "phone"
// 	} else {
// 		newSearchTextType = ""
// 	}
// 	setSearchTextType(newSearchTextType)
// 	setSearchText(newSearchText)
// }
