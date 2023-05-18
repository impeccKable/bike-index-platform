import { useState } from 'react';
import ThiefTable from '../components/ThiefTable';
import Navbar from '../components/Navbar';
import { LinkButton } from '../components/Form';
import Modal from '../components/Modal';

import '../styles/thieflist.css';

export default function ThiefList() {
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [searchType, setSearchType] = useState('text');
  const [searchText, setSearchText] = useState('');
  const [searchTip, setTip] = useState('Select Search Type First');

  const EnableSearch = (event: any) => {
    let selectedVal = event.target[event.target.selectedIndex].value;

    if (selectedVal !== 'None') {
      setSearchText('');
      setTip(`Enter Search Value...`);
      setSearchEnabled(false);
      setSearchType(selectedVal);
    } else {
      setTip('Select Search Type First');
      setSearchText('');
      setSearchEnabled(true);
    }
  };

  const SetUserInput = (event: any) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="thief-page">
      <Navbar />
      <main>
        <h1 className="title2">Adversary Listing</h1>
        <div className="container-fluid thief-searchbar">
          <label htmlFor="ThiefSearch">Search</label>
          <input
            id="ThiefSearch"
            type={searchType}
            required
            disabled={searchEnabled}
            placeholder={searchTip}
            value={searchText}
            onChange={SetUserInput}
          ></input>

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

          <button className="NewThiefButton">New Submission</button>
          <LinkButton to="/users">Users</LinkButton>
        </div>
        <div className="add-new">
          <h2 className="results-label">Results:</h2>
          <button className="AddThiefButton">Add New</button>
          <Modal />
        </div>
        <ThiefTable filter={searchText} type={searchType} />
      </main>
    </div>
  );
}
