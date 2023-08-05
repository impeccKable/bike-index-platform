import { useState } from "react";
import { Form, FormInput, FormButton, LinkButton } from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

export default function VerifyEmail() {
	const [submitted, setSubmitted] = useState(false);
	const auth = useAuth();
	const navigate = useNavigate();

	function handleFormSubmit(e: any) {
		const email = e.dataDict.email;
		const password = e.dataDict.password;

		const f = async () => {
			await auth.handleVerificationRequest(email, password);
		};

		e.preventDefault();
		f();
		setSubmitted(true);
	}
	let submitMessage = (
		<div className="submit-message">
			<p>Check your email for a verification email</p>
		</div>
	);
	return (
		<div className="notecard">
			<h1>Request Verification Email</h1>
			<div className="card">
				<Form onSubmit={handleFormSubmit}>
					<FormInput
						label="Email"
						name="email"
						required
						placeholder="email@example.com"
						type="email"
					/>
					<FormInput
						label="Password"
						name="password"
						required
						placeholder="password"
						type="password"
					/>
					<div className="form-btns">
						<LinkButton to="..">Back</LinkButton>
						<FormButton type="submit">Submit</FormButton>
					</div>

				</Form>
				{submitted && submitMessage}
			</div>
		</div>
	);
}
