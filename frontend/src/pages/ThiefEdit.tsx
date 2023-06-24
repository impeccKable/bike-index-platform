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
  const [theifInfo, setTheifInfo] = useState({
    thiefId: 0,
    name: [''],
    email: [''],
    url: [''],
    addr: [''],
    phone: [''],
    bikeSerial: [''],
    phrase: [''],
    note: [''],
  });
  //const [nameData, setNameData] = useState<FormInputProps>({name:""});
  //const [test, setTest] = useState<JSX.Element>();

  // get id
  let theifID = searchParams.get('thiefId');

  // get request for thief info
  useEffect(() => {
    axios
      .get(`http://localhost:3000/thiefEdit?thiefId=${theifID}`)
      .then((res: any) => {
        console.log('Theif search response', res.data);

        let tempData = {
          thiefId: 0,
          name: [''],
          email: [''],
          url: [''],
          addr: [''],
          phone: [''],
          bikeSerial: [''],
          phrase: [''],
          note: [''],
        };
        Object.entries(res.data[0]).map((atr) => {
          // atr[0] = key;
          // atr[1] = value;
          let t1 = atr;
          console.log(t1);
          if (atr[0].localeCompare('thiefId') && atr[1].length === 0) {
            atr[1] = [''];
            tempData[`${atr[0]}`] = atr[1];
          } else {
            tempData[`${atr[0]}`] = atr[1];
          }
        });
        console.log('tempData = ', tempData);

        setTheifInfo(tempData);

        //let newObject: FormInputProps = {
        //  name: 'Thief Name',
        //  label: 'Thief Name',
        //  key: [tempData.name],
        //};

        //setNameData(newObject);
        //let test = FormInput(newObject);
        //setTest(test);
      });
  }, []);

  return theifInfo.thiefId !== 0 ? (
    <div className="thiefedit-page">
      <Navbar />
      <main>
        <h1 className="title2">Thief Edit</h1>
        <Form onSubmit={handleFormSubmit}>
          <MultiField
            label="Name"
            name="name"
            data={theifInfo.name}
            component={FormInput}
          />
          <MultiField
            label="Email"
            name="email"
            data={theifInfo.email}
            component={FormInput}
          />
          <MultiField
            label="Url"
            name="url"
            data={theifInfo.url}
            component={FormInput}
          />
          <MultiField
            label="Address"
            name="addr"
            data={theifInfo.addr}
            component={FormInput}
          />
          <MultiField
            label="Phone"
            name="phone"
            data={theifInfo.phone}
            component={FormInput}
            type="phone"
          />
          <MultiField
            label="Bike Serial"
            name="bikeSerial"
            data={theifInfo.bikeSerial}
            component={FormInput}
          />
          <MultiField
            label="Phrase"
            name="phrase"
            data={theifInfo.phrase}
            component={FormInput}
            type="textarea"
          />
          <MultiField
            label="Notes"
            name="notes"
            data={theifInfo.note}
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
  ) : (
    <h2>Loading</h2>
  );
}
