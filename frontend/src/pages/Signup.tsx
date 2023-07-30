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
		if (e.dataDict.password !== e.dataDict.verify) {
			setPasswordMismatch(true);
			return;
		}

		const f = async () => {
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
					});
			}
		};
		f();

		setSubmitted(true);
	}
	let submitMessage = (
		<div className="submit-message">
			<p>Your request to sign up has been submitted!</p>
			<p>We will review your application and get back to you.</p>
		</div>
	);
	return (
		<div className="notecard signup-page">
			<h1>Sign Up</h1>
			<div className="card">
				<Form onSubmit={handleFormSubmit}>
					<FormInput label="First name"      name="first"    placeholder="John" />
					<FormInput label="Last name"       name="last"     placeholder="Doe" />
					<FormInput label="Title"           name="title"    placeholder="Mayor" />
					<FormInput label="Organization"    name="org" />
					<FormInput label="Phone"           name="phone"    placeholder="+1 222 333 4444"   type="phone" />
					<FormInput label="Email"           name="email"    placeholder="email@example.com" type="email" />
					<FormInput label="Password"        name="password" type="password" />
					<FormInput label="Verify password" name="verify"   type="password" />
					{/*
					TODO: change this back to required
					<FormInput label="First name" name="first-name" required placeholder="John" />
					<FormInput label="Last name"  name="last-name"  required placeholder="Doe" />
					<FormInput label="Title"      name="title"      required placeholder="Mayor" />
					<FormInput label="Email"      name="email"      required placeholder="email@example.com" type="email" />
					<FormInput label="Password"   name="password"   required type="password" />
					<FormInput label="(again)"    name="verify"     required type="password" labelProps={{ style: { color: '#666' }}} />
					<FormInput label="Phone"      name="phone"      required placeholder="+1 222 333 4444" type="phone" /> */}
					<div className="form-btns">
						<LinkButton to="..">Back</LinkButton>
						<FormButton type="submit">Submit</FormButton>
					</div>
				</Form>
				{submitted && submitMessage}
				{passwordMismatch && (
					<div>
						<p>Passwords did not match, please try again</p>
					</div>
				)}
			</div>
		</div>
	);
}
