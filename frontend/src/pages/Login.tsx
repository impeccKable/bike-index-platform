import { useState } from "react";
import { useAuth } from "../services/AuthProvider";
import { Form, FormInput, FormButton } from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Login() {
	const auth = useAuth();
	const navigate = useNavigate();
	const [loginFailure, setLoginFailure] = useState(false);

	const handleSubmit = (e: any) => {
		console.log(e.dataDict);
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
		}; //I don't know if this will work
		f();
	};
	console.log("Component rendered");
	return (
		<div className="login-page">
			<h1 className="title">Bike Index Platform</h1>
			<Form onSubmit={handleSubmit}>
				<FormInput placedholder="Email" name="email" type="text" />
				<input placeholder="Password" name="password" type="password" />
				<FormButton className="btn-submit" type="submit">
					Sign In
				</FormButton>
				<div className="links">
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
//   return text.includes("@")
// }
// function isPhone(text: string) {
//   return text.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)
// }

// function handleSearchInput(e: any) {
//   let newSearchText = e.target.value
//   let newSearchTextType = ""
//   if (newSearchText.includes("@")) {
//     newSearchTextType = "email"
//   } else if (newSearchText.match(/^[0-9 +\-\.\(\)]*[0-9]+[0-9 +\-\.\(\)]*$/)) {
//     newSearchTextType = "phone"
//   } else {
//     newSearchTextType = ""
//   }
//   setSearchTextType(newSearchTextType)
//   setSearchText(newSearchText)
// }
