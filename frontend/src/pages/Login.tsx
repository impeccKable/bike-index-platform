import { useAuth } from "../services/AuthProvider";
import { Form, FormInput, FormButton } from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";

export default function Login() {
	if (useRecoilValue(debugState) == true) { console.log("Login"); }
	const auth = useAuth();
	const navigate = useNavigate();

	const handleSubmit = (e: any) => {
		const email = e.dataDict.email;
		const password = e.dataDict.password;

		const f = async () => {
			try{
				await auth?.handleLogin(email, password);
				navigate("/thiefList");
			} catch (error:any) {
				loginFailureAlert(error, email, password);
			};
		};
		f();
	};

	const loginFailureAlert = (error:Error, email:String, password:String) => {
		const alert = document.getElementById("login-alert");
		const link = document.getElementById("alert-link");
		if(error.message === 'User email is not verified'){
			verificationAlert(alert!, link!, email, password);
		} else if(error.message === 'User is not approved'){
			alert!.innerHTML = "User application not approved. Please contact an administrator.";
		} else if(error.message.includes('wrong-password')){
			passwordFailureAlert(alert!, link!, email);
		} else if(error.message.includes('user-not-found')){
			alert!.innerHTML = "The email entered does not match any user. Please try again or register for a new account.";
		} else if(error.message.includes('too-many-requests')){
			alert!.innerHTML = "Too many requests. Please wait and try again later.";
			console.log(error);
			link!.innerHTML = "";
		} else {
			alert!.innerHTML = "Login error. Please try again.";
			console.log(error);
		};
	};

	const verificationAlert = (alert:HTMLElement, link:HTMLElement, email:String, password:String) => {
		alert.innerHTML = "Email not verified. Please check your email for a verification link. ";
		link.innerHTML = "Click here to resend verification email";
		link.onclick = () => { 
			try{
				auth.handleVerificationRequest(email, password); 
			} catch (error:any) {
				if(error.message.includes("too-many-requests")){
					alert.innerHTML = "Too many requests. Please wait and try again later.";
				} else {
					alert.innerHTML = "Unknown error. Please try again.";
				}
			}
			alert.innerHTML = "Verification email sent. Please check your email for a verification link. ";
			link.innerHTML = "";
		};
	};

	const passwordFailureAlert = (alert:HTMLElement, link:HTMLElement, email:String) => {
		alert.innerHTML = "Wrong password. Please try again or ";
		link.innerHTML = "click here to send a password reset email";
		link.onclick = () => {	
			try{
				auth.handlePasswordReset(email);
			} catch (error:any) {
				if(error.message.includes("too-many-requests")){
					alert.innerHTML = "Too many requests. Please wait and try again later.";
				} else {
					alert.innerHTML = "Unknown error. Please try again.";
				}
			}
			alert.innerHTML = "Password reset email sent. Please check your email for a password reset link. ";
			link.innerHTML = "";
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
					</div>
				</Form>
				<div id="login-alert"/>
				<a id="alert-link"/>
			</div>
		</div>
	);
}
