import { useState } from 'react';
import { Form, FormInput, FormButton } from '../components/Form';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  function handleSubmit(e: any) {
    e.preventDefault()
    console.log(e)
    console.log(e.dataDict)
    navigate('/thieflist')
  }
  return (
    <div className="login-page">
      <h1 className="title">Bike Index Platform</h1>
      <Form onSubmit={handleSubmit}>
        <FormInput label="Email"    name="email"    type="text" />
        <FormInput label="Password" name="password" type="password" />
        <FormButton className="btn-submit" type="submit">Sign In</FormButton>
        <div className="links">
          <a href="/signup">Sign Up</a>
          <a href="/forgot">Forgot Password?</a>
        </div>
      </Form>
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
