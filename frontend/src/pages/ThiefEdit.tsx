import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Form, MultiField, FormInput, FormButton, LinkButton } from '../components/Form';

export default function ThiefEdit() {
  function handleFormSubmit(e: any) {
    e.preventDefault()
    console.log(e)
  }
  return <div className="thiefedit-page">
    <Navbar />
    <main>
      <h1 className="title2">Thief Edit</h1>
      <Form onSubmit={handleFormSubmit}>
        <MultiField label="Name"        name="name"       component={FormInput} />
        <MultiField label="Email"       name="email"      component={FormInput} />
        <MultiField label="Url"         name="url"        component={FormInput} />
        <MultiField label="Address"     name="addr"       component={FormInput} />
        <MultiField label="Phone"       name="phone"      component={FormInput} type="phone" />
        <MultiField label="Bike Serial" name="bikeSerial" component={FormInput} />
        <MultiField label="Phrase"      name="phrase"     component={FormInput} type="textarea" />
        <MultiField label="Notes"       name="notes"      component={FormInput} type="textarea" />
        <div className="btn-group">
          <LinkButton to="/thiefList">Back</LinkButton>
          <FormButton type="submit">Submit</FormButton>
        </div>
        {/* {submitted && submitMessage} */}
      </Form>
    </main>
  </div>
}
