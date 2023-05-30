import { useState } from "react";
import { Form, FormInput, FormButton, LinkButton } from "../components/Form";
import { useNavigate } from "react-router-dom";

export default function ForgotPass() {
	const [submitted, setSubmitted] = useState(false);
	const navigate = useNavigate();

	function handleFormSubmit(e: any) {
		if (submitted) {
			return;
		}
		e.preventDefault();
		console.log(e.dataDict);
		setSubmitted(true);
	}
	let submitMessage = (
		<div className="submit-message">
			<p>Check your email for a password reset</p>
		</div>
	);
	return (
		<div className="forgot-pass-page">
			<h1 className="title">Password Reset</h1>
			<Form onSubmit={handleFormSubmit}>
				<FormInput
					label="Email"
					name="email"
					required
					placeholder="email@example.com"
					type="email"
				/>
				<div className="links">
					<LinkButton to="..">Back</LinkButton>
					<FormButton type="submit">Submit</FormButton>
				</div>
				{submitted && submitMessage}
			</Form>
		</div>
	);
}