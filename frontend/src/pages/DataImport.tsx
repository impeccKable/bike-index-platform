import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Form, FormButton } from '../components/Form';

export default function DataImport() {
  function handleFormSubmit(e: any) {
    e.preventDefault()
    console.log(e)
  }
  return <div className="data-import-page">
    <Navbar />
    <main>
      <h1 className="title2">Data Import</h1>
      <Form onSubmit={handleFormSubmit}>
        <p>File select will go here</p>
        <div className="btn-group">
          <FormButton type="submit">Submit</FormButton>
        </div>
      </Form>
    </main>
  </div>
}
