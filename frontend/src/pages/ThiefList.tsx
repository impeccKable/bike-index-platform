import { useState, useEffect, useRef } from 'react';
import ThiefTable from '../components/ThiefTable';
import Navbar from '../components/Navbar';
import { LinkButton } from '../components/Form';
import Modal from '../components/Modal';
import axios from 'axios';

import '../styles/thiefList.css';

// @ts-ignore
export interface Thief extends React.HTMLInputElement {
  thiefId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

enum FilterType {
  All,
  name,
  email,
  phone,
}

export default function ThiefList() {
  const empty: Thief[] = [];
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [searchType, setSearchType] = useState(FilterType.All);
  const [searchText, setSearchText] = useState('');
  const latestSearchText = useRef(searchText);
  const [searchTip, setTip] = useState('Select Search Type First');
  const [thiefs, setThiefs] = useState(empty);

  useEffect(() => {
    const GetThiefs = async () => {
      latestSearchText.current = searchText;
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      // debugger;
      const url = `http://${
        import.meta.env.VITE_BACKEND_HOST
      }/search?searchType=${FilterType[searchType]}&search=${searchText}`;
      const response = await axios.get(url, config);

      const result = await response.data;
      const returnVal: Thief[] = [];

      result.forEach((thief: Thief) => {
        let newThief = {
          thiefId: thief.thiefId,
          name: thief.name,
          phone: thief.phone,
          email: thief.email,
          address: thief.address,
        };
        returnVal.push(newThief);
      });

      // Discard results if the search text has changed since the request was made
      if (latestSearchText.current !== searchText) return;

      setThiefs(returnVal);
    };

    GetThiefs();
  }, [searchText]);

  const EnableSearch = (event: any) => {
    let selectedVal = event.target[event.target.selectedIndex].value;

    if (selectedVal !== 'None') {
      setSearchText('');
      setTip(`Enter Search Value...`);
      setSearchEnabled(false);
      if (selectedVal === 'None') setSearchType(FilterType.All);
      if (selectedVal === 'text') setSearchType(FilterType.name);
      if (selectedVal === 'tel') setSearchType(FilterType.phone);
      if (selectedVal === 'email') setSearchType(FilterType.email);
    } else {
      setTip('Select Search Type First');
      setSearchText('');
      setSearchEnabled(true);
      setSearchType(FilterType.All);
    }
  };

  const SetUserInput = (event: any) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="thieflist-page">
      <Navbar />
      <main>
        <h1 className="title2">Thief Listing</h1>

        <div className="container-fluid thief-searchbar">
          <div className="thief-dropdown">
            <label htmlFor="SearchType">Search Type</label>
            <select
              id="SearchType"
              name="SearchType"
              className="DropDown"
              onChange={EnableSearch}
            >
              <option value="None">Select Type</option>
              <option value="text">Name</option>
              <option value="tel">Phone Number</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="mobile">
            <label htmlFor="ThiefSearch">Search</label>
            <input
              id="ThiefSearch"
              type={searchType.toString()}
              required
              disabled={searchEnabled}
              placeholder={searchTip}
              value={searchText}
              onChange={SetUserInput}
            ></input>
          </div>
          <LinkButton className="AddThiefButton" to="/thiefEdit?id=new">
            Add New
          </LinkButton>
        </div>
        <div className="add-new">
          <h2 className="results-label">Results: {}</h2>
        </div>
        {thiefs ? (
          <ThiefTable thiefs={thiefs} />
        ) : (
          <i className="bi bi-arrow-clockwise"></i>
        )}
      </main>
    </div>
  );
}
