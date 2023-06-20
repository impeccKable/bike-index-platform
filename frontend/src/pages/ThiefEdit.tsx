import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Form,
  MultiField,
  FormInput,
  FormButton,
  LinkButton,
  FormInputProps,
} from '../components/Form';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ThiefEdit() {
  function handleFormSubmit(e: any) {
    e.preventDefault();
    console.log(e);
  }

  const [searchParams, setSearchParams] = useSearchParams();
  //const [theifInfo, setTheifInfo] = useState();
  //const [nameData, setNameData] = useState<FormInputProps>({name:""});
  //const [test, setTest] = useState<JSX.Element>();

  // get id
  let theifID = searchParams.get('thiefId');

  // get request for thief info
  //useEffect(() => {
  //axios
  //.get(`http://localhost:3000/thiefEdit?thiefId=${theifID}`)
  //.then((res: any) => {
  //console.log('Theif search response', res.data);

  //let tempData = res.data[0];

  //setTheifInfo(tempData);

  //let newObject: FormInputProps = {
  //  name: 'Thief Name',
  //  label: 'Thief Name',
  //  key: [tempData.name],
  //};

  //setNameData(newObject);
  //let test = FormInput(newObject);
  //setTest(test);
  //});
  //}, []);

  return (
    <div className="thiefedit-page">
      <Navbar />
      <main>
        <h1 className="title2">Thief Edit</h1>
        <Form onSubmit={handleFormSubmit}>
          <MultiField label="Name" name="name" component={FormInput} />
          <MultiField label="Email" name="email" component={FormInput} />
          <MultiField label="Url" name="url" component={FormInput} />
          <MultiField label="Address" name="addr" component={FormInput} />
          <MultiField
            label="Phone"
            name="phone"
            component={FormInput}
            type="phone"
          />
          <MultiField
            label="Bike Serial"
            name="bikeSerial"
            component={FormInput}
          />
          <MultiField
            label="Phrase"
            name="phrase"
            component={FormInput}
            type="textarea"
          />
          <MultiField
            label="Notes"
            name="notes"
            component={FormInput}
            type="textarea"
          />
          <div className="btn-group">
            <LinkButton to="/thiefList">Back</LinkButton>
            <FormButton type="submit">Submit</FormButton>
          </div>
          {/* {submitted && submitMessage} */}
        </Form>
      </main>
    </div>
  );
}
