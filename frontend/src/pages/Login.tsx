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
			try{
				await auth?.handleLogin(email, password);
			} catch (error) {
				if(error.message === 'User email is not verified'){
					loginFailureAlert("email-not-verified");
				} else if(error.message === 'User is not verified'){
					loginFailureAlert("user-not-verified");
				} else if(error.message.includes('wrong-password')){
					loginFailureAlert("wrong-password");
				} else {
					loginFailureAlert("unknown-error");
					console.log(error);
				};
			};
		};
		f();
	};

	const loginFailureAlert = (alertType:string) => {
		const alert = document.getElementById("login-alert");
		switch(alertType){
			case "email-not-verified":
				alert!.innerHTML = "Email not verified. Please check your email for a verification link. ";
				alert!.innerHTML += "To request another verification email visit ";
				alert!.innerHTML += "<a href='/requestverification'>here</a>.";
				break;
			case "user-not-verified":
				alert!.innerHTML = "User not verified. Please contact an administrator.";
				break;
			case "wrong-password":
				alert!.innerHTML = "Wrong password. Please try again or reset your password ";
				alert!.innerHTML += "<a href='/forgot'>here</a>.";
				break;
			default:
				alert!.innerHTML = "Login error. Please try again.";
				break;	
			};
	};

	return (
		<div className="notecard login-page">
			<h1>Bike Index Platform</h1>
			<div className="card">
				<Form onSubmit={handleSubmit}>
					<FormInput placeholder="Email" name="email" type="text" />
					<FormInput placeholder="Password" name="password" type="password" />
					<FormButton type="submit">Sign In</FormButton>
					<div className="notecard-links">
						<a href="/signup">Sign Up</a>
						<a href="/forgot">Forgot Password?</a>
					</div>
				</Form>
				<div id="login-alert"/>
			</div>
		</div>
	);
}
