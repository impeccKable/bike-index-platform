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
  const [searchParams, setSearchParams] = useSearchParams();

  // get id
  const thiefID = searchParams.get('thiefId');

  // theifInfo has latest data
  //const [theifInfoCurrent, setCurrentTheifInfo] = useState({
  //  thiefId: 0,
  //  name: [''],
  //  email: [''],
  //  url: [''],
  //  addr: [''],
  //  phone: [''],
  //  bikeSerial: [''],
  //  phrase: [''],
  //  note: [''],
  //});

  // theifInfo at beginning
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

  function handleFormSubmit(e: any) {
    e.preventDefault();
    console.log(e);

    let results = CompareResults(e.dataDict);

    let status = axios.put(
      `http://${import.meta.env.VITE_BACKEND_HOST}/thiefEdit`,
      results
    );

    console.log(status);
  }

  const CompareResults = (submitData: any) => {
    //Ex: newValues.name[0].push('Something'), 0 = old values
    let results = {};
    results.thiefId = thiefID;

    // need to split this one
    Object.entries(submitData).map((field) => {
      // field[0] is key, field[1] is value

      if (field[0] !== 'theifId') {
        let newValues = field[1].split(',');
        let oldValues = theifInfo[`${field[0]}`];

        let test = Math.max(newValues.length, oldValues.length);

        for (let i = 0; i < test; i++) {
          let oldVal = oldValues[i] ? oldValues[i] : '0';
          let newVal = newValues[i] ? newValues[i] : '0';

          if (oldVal !== newVal) {
            let keyValue = field[0];

            results[keyValue] !== undefined
              ? results[keyValue].push([oldVal, newVal])
              : (results[keyValue] = [[oldVal, newVal]]);
          }
        }
      }
    });

    return results;
  };

  // get request for thief info
  useEffect(() => {
    if (thiefID === 'new') {
      return;
    }
    axios
      .get(`http://localhost:3000/thiefEdit?thiefId=${thiefID}`)
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
        console.log('theifInfo (2) = ', theifInfo);
      });
  }, []);

  return theifInfo.thiefId !== 0 || thiefID === 'new' ? (
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
    <h2>Loading...</h2>
  );
}
