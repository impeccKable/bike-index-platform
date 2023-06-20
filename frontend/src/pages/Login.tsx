import { useState } from "react";
import { useAuth } from "../services/AuthProvider";
import { Form, FormInput, FormButton } from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function Login() {
	const auth = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	//Login failure state, determines whether the login failure message is visible
	const [loginFailure, setLoginFailure] = useState(false);

	/*
  function handleSubmit = (e: any) => {
    const 
    const result = await auth?.handleLogin(email,password)
    if(result===false){
      //
    }
  }
*/
	const handleSubmit = (e: any) => {
		const f = useCallback(async () => {
			const success = await auth?.handleLogin(email, password);
			if (success) {
				navigate(-1);
			} else {
				setLoginFailure(true);
				//provide a message indicating authentication failure
			}
		}, [e]); //I don't know if this will work
		f();
	};

	return (
		<div className="login-page">
			<h1 className="title">Bike Index Platform</h1>
			<Form onSubmit={handleSubmit}>
				<FormInput
					label="Email"
					name="email"
					type="text"
					value={email}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setEmail(e.target.value)
					}
				/>
				<FormInput
					label="Password"
					name="password"
					type="password"
					value={password}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setPassword(e.target.value)
					}
				/>
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
