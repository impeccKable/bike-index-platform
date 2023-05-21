import { useState } from 'react';
import { Form, FormInput, FormButton, LinkButton } from '../components/Form';

export default function Signup() {
  const [submitted, setSubmitted] = useState(false);
  function handleFormSubmit(e: any) {
    if (submitted) { return }
    e.preventDefault();
    console.log(e.dataDict);
    setSubmitted(true);
  }
  let submitMessage = (
    <div className="submit-message">
      <p>Your request to sign up has been submitted!</p>
      <p>We will review your application and get back to you.</p>
    </div>
  );
  return (
    <div className="signup-page">
      <h1 className="title">Sign Up</h1>
      <Form onSubmit={handleFormSubmit}>
        <FormInput label="First name" name="first-name" required placeholder="John" />
        <FormInput label="Last name"  name="last-name"  required placeholder="Doe" />
        <FormInput label="Title"      name="title"      required placeholder="Mayor" />
        <FormInput label="Email"      name="email"      required placeholder="email@example.com" type="email" />
        <FormInput label="Password"   name="password"   required type="password" />
        <FormInput label="(again)"    name="verify"     required type="password" labelProps={{ style: { color: '#666' }}} />
        <FormInput label="Phone"      name="phone"      required placeholder="+1 222 333 4444" type="phone" />
        <div className="links">
          <LinkButton to="..">Back</LinkButton>
          <FormButton type="submit">Submit</FormButton>
        </div>
        {submitted && submitMessage}
      </Form>
    </div>
  );
}
