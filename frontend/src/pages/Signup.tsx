import { useState } from 'react';
import { Form, FormInput, FormButton, LinkButton } from '../components/Form';
import { useAuth } from '../services/AuthProvider';
import { httpClient } from '../services/HttpClient';
import DebugLogs from '../services/DebugLogs';
import { debugState } from '../services/Recoil';
import { useRecoilValue } from 'recoil';

export default function Signup() {
	const [submitted, setSubmitted] = useState(false);
	const [passwordMismatch, setPasswordMismatch] = useState(false);
	const auth = useAuth();
	const debug = useRecoilValue(debugState)

	function handleFormSubmit(e: any) {
		e.preventDefault();
		if (submitted) {
			return;
		}
		setSubmitted(false);
		setPasswordMismatch(false);
		if (e.dataDict.password !== e.dataDict.verify) {
			setPasswordMismatch(true);
			document.getElementById("sign-up-alert").innerHTML = "Passwords did not match, please re-enter passwords";
			return;
		}

		async function f() {
			try{
			const user = await auth?.handleSignUp(
				e.dataDict.email,
				e.dataDict.password
			);
			console.log(user);
			if (user.uid) {
				e.dataDict.uid = user.uid;
				delete e.dataDict.password;
				delete e.dataDict.verify;
				DebugLogs('Form submitted', e.dataDict, debug)
				await httpClient
					.post('/signup', e.dataDict)
					.then((res: any) => {
						DebugLogs('Sign up post response', res, debug)
					})
					.catch((err: any) => {
						DebugLogs('Sign up post error', err, debug)
						auth?.handleDelete(user);
						throw new Error(err);
					});
			}
			setSubmitted(true);
			document.getElementById("sign-up-alert").innerHTML = 
				`Your request to sign up has been submitted!
				Please check your inbox for a verification email.
				We will review your application and get back to you.`;
			} catch (error:any) {
				errorHandler(error);
			}
		};
		f();		
		return false;
	}

	function handleEnterKey(e){
		if (e.key === "Enter"){
			e.preventDefault();
			document.getElementById("sign-up-submit").click();
			return(false);
		}
	}

	function errorHandler(err:any) {
		console.log(err.message);
		if (err.message.includes("email-already-in-use")) {
			document.getElementById("sign-up-alert").innerHTML = "Email already in use, please use a different email";
		} else if (err.message.includes("weak-password")) {
			document.getElementById("sign-up-alert").innerHTML = "Password is too weak, please use a stronger password";
		} 
	}

	return (
		<div className="notecard signup-page">
			<h1>Sign Up</h1>
			<div className="card">
				<Form onSubmit={handleFormSubmit}>
					<FormInput label="First name"      name="first"    required placeholder="John"  onKeyPress={handleEnterKey}/>
					<FormInput label="Last name"       name="last"     required placeholder="Doe"   onKeyPress={handleEnterKey}/>
					<FormInput label="Title"           name="title"             placeholder="Mayor" onKeyPress={handleEnterKey}/>
					<FormInput label="Organization"    name="org"                                   onKeyPress={handleEnterKey}/>
					<FormInput label="Phone"           name="phone"             placeholder="+1 (222) 333-4444"   type="phone" onKeyPress={handleEnterKey}/>
					<FormInput label="Email"           name="email"    required placeholder="email@example.com" type="email" onKeyPress={handleEnterKey}/>
					<FormInput label="Password"        name="password" required type="password"     onKeyPress={handleEnterKey}/>
					<FormInput label="Verify password" name="verify"   required type="password"     onKeyPress={handleEnterKey}/>
					<div className="form-btns">
						<LinkButton to="..">Back</LinkButton>
						<FormButton type="submit" id="sign-up-submit">Submit</FormButton>
					</div>
				</Form>
				<div id="sign-up-alert"/>
			</div>
		</div>
	);
}
