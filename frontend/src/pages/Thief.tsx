import { useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Form,
  MultiField,
  FormInput,
  FormButton,
  LinkButton,
} from '../components/Form';

function Thief() {
  function handleFormSubmit(e: any) {
    e.preventDefault()
    console.log(e)
  }
  // return <div className="thief-page">
  //   <Navbar />
  //   <h1 className="title">Edit Thief</h1>
  //   <Form onSubmit={handleFormSubmit}>
  //     <FormInput label="Username" name="username" type="text" />
  //     <FormInput label="Password" name="password" type="password" />
  //     <MultiField label="Names" name="names" component={FormInput}/>
  //     <FormButton type="submit">Submit</FormButton>
  //   </Form>
  //   <LinkButton to="..">Back</LinkButton>
  // </div>
  return <div className="thief-page">
    <Navbar />
    <main>
      <h1 className="title2">Thief Edit</h1>
      <Form onSubmit={handleFormSubmit}>
        <FormInput label="First name" name="first-name" required placeholder="John" />
        <FormInput label="Last name"  name="last-name"  required placeholder="Doe" />
        <FormInput label="Title"      name="title"      required placeholder="Mayor" />
        <FormInput label="Email"      name="email"      required placeholder="johnd@example.com" type="email" />
        <FormInput label="Password"   name="password"   required type="password" />
        <FormInput label="(again)"    name="verify"     required type="password" labelProps={{ style: { color: '#666' }}} />
        <FormInput label="Phone"      name="phone"      required placeholder="+1 222 333 4444" type="phone" />
        <MultiField label="Names" name="names" component={FormInput} />
        <div className="btn-group">
          <LinkButton to="..">Back</LinkButton>
          <FormButton type="submit">Submit</FormButton>
        </div>
        {/* {submitted && submitMessage} */}
      </Form>
    </main>
  </div>
}

{
  /* <div className="container">
    <nav class="sidebar">
      <button>Button 1</button>
      <button>Button 2</button>
      <button>Button 3</button>
    </nav>
    <main class="main-content">
      <h1>Page Title</h1>
      <form>
        <label for="input1">Input 1:</label>
        <input type="text" id="input1" name="input1"><br>
        <label for="input2">Input 2:</label>
        <input type="text" id="input2" name="input2"><br>
        <button type="submit">Submit</button>
      </form>
    </main>
  </div> */
}
export default Thief;
