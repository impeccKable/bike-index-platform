import { useState } from "react";
import { Form, FormInput, FormButton, LinkButton } from "../components/Form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthProvider";

export default function ForgotPass() {
	const [submitted, setSubmitted] = useState(false);
	const navigate = useNavigate();
	const auth = useAuth();

	function handleFormSubmit(e: any) {
		if (submitted) {
			return;
		}
		e.preventDefault();
		console.log(e.dataDict);
		auth.handlePasswordReset(e.dataDict.email);
		setSubmitted(true);
	}
	let submitMessage = (
		<div className="submit-message">
			<p>Check your email for a password reset</p>
		</div>
	);
	return (
		<div className="notecard forgot-pass-page">
			<h1>Password Reset</h1>
			<div className="card">
				<Form onSubmit={handleFormSubmit}>
					<FormInput
						label="Email"
						name="email"
						required
						placeholder="email@example.com"
						type="email"
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
