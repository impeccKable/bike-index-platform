import { useState } from 'react'
import '../App.css'
import Navbar from '../components/Navbar'
import { Form, MultiField, FormInput, FormButton, LinkButton } from '../components/Form'

function Thief() {
  function handleFormSubmit(e: any) {
    e.preventDefault()
    console.log(e.dataDict)
  }
  return <div className="thief-page">
    <Navbar />
    <h1 className="title">Edit Thief</h1>
    <Form onSubmit={handleFormSubmit}>
      <FormInput label="Username" name="username" type="text" />
      <FormInput label="Password" name="password" type="password" />
      <MultiField label="Names" name="names" component={FormInput}/>
      <FormButton type="submit">Submit</FormButton>
    </Form>
    <LinkButton to="..">Back</LinkButton>
  </div>
}

export default Thief
