import { useState, useEffect } from "react";
import ThiefTable from "../components/ThiefTable";
import Navbar from "../components/Navbar";
import { LinkButton } from "../components/Form";
import Modal from "../components/Modal";
import axios from "axios";

import "../styles/thieflist.css";

// @ts-ignore
interface Person extends React.HTMLInputElement {
	id: number | string;
	name: string;
	phone: string;
	email: string;
	approved: boolean | string;
}
enum FilterType {
	All,
	Name,
	Email,
	Phone,
}

let testPersons = [
	{
		id: 263,
		name: "Test Name 263",
		phone: "+526 123-456-7890",
		email: "email789@email.com",
		approved: true,
	},
	{
		id: 58,
		name: "Test Name 58",
		phone: "+116 123-456-7890",
		email: "email174@email.com",
		approved: false,
	},
	{
		id: 203,
		name: "Test Name 203",
		phone: "+406 123-456-7890",
		email: "email609@email.com",
		approved: false,
	},
	{
		id: 70,
		name: "Test Name 70",
		phone: "+140 123-456-7890",
		email: "email210@email.com",
		approved: false,
	},
	{
		id: 59,
		name: "Test Name 59",
		phone: "+118 123-456-7890",
		email: "email177@email.com",
		approved: true,
	},
	{
		id: 143,
		name: "Test Name 143",
		phone: "+286 123-456-7890",
		email: "email429@email.com",
		approved: true,
	},
	{
		id: 220,
		name: "Test Name 220",
		phone: "+440 123-456-7890",
		email: "email660@email.com",
		approved: true,
	},
	{
		id: 222,
		name: "Test Name 222",
		phone: "+444 123-456-7890",
		email: "email666@email.com",
		approved: true,
	},
	{
		id: 146,
		name: "Test Name 146",
		phone: "+292 123-456-7890",
		email: "email438@email.com",
		approved: false,
	},
	{
		id: 98,
		name: "Test Name 98",
		phone: "+196 123-456-7890",
		email: "email294@email.com",
		approved: false,
	},
	{
		id: 53,
		name: "Test Name 53",
		phone: "+106 123-456-7890",
		email: "email159@email.com",
		approved: true,
	},
	{
		id: 29,
		name: "Test Name 29",
		phone: "+58 123-456-7890",
		email: "email87@email.com",
		approved: false,
	},
	{
		id: 80,
		name: "Test Name 80",
		phone: "+160 123-456-7890",
		email: "email240@email.com",
		approved: true,
	},
	{
		id: 102,
		name: "Test Name 102",
		phone: "+204 123-456-7890",
		email: "email306@email.com",
		approved: true,
	},
	{
		id: 81,
		name: "Test Name 81",
		phone: "+162 123-456-7890",
		email: "email243@email.com",
		approved: false,
	},
	{
		id: 240,
		name: "Test Name 240",
		phone: "+480 123-456-7890",
		email: "email720@email.com",
		approved: false,
	},
	{
		id: 25,
		name: "Test Name 25",
		phone: "+50 123-456-7890",
		email: "email75@email.com",
		approved: false,
	},
	{
		id: 237,
		name: "Test Name 237",
		phone: "+474 123-456-7890",
		email: "email711@email.com",
		approved: true,
	},
	{
		id: 193,
		name: "Test Name 193",
		phone: "+386 123-456-7890",
		email: "email579@email.com",
		approved: false,
	},
	{
		id: 116,
		name: "Test Name 116",
		phone: "+232 123-456-7890",
		email: "email348@email.com",
		approved: true,
	},
];

export default function ThiefList() {
	/// Method: GetThiefs
	/// Purpose: Gets all thiefs matching filter and filter type criteria
	/// Params:
	///   - "filter": string or value to search for in the filter type
	///   - "type": type of filter matching (name, email, phone, etc..)
	/// Returns: Array of objects of all matches
	const GetThiefs = (filter: string, type: FilterType) => {
		let result;

		const config = {
			headers: {
				"Content-type": "application/json",
			},
		};

		axios
			.get(
				`localhost:3000/search?search_type=${type}&search=${filter}`,
				config
			)
			.then((response) => {
				console.log(response.status);
				result = response.data.json();
			});

		/*
    Older method of retreiving data from mocked up json array

    const result: Person[] = [];
    testPersons.map((person) => {
      if (type === FilterType.All) {
        //debugger;
        result.push(person);
      } else {
        if (type === FilterType.Name && person.name.includes(filter))
          result.push(person);
        if (type === FilterType.Email && person.email.includes(filter))
          result.push(person);
        if (type === FilterType.Phone && person.phone.includes(filter))
          result.push(person);
      }
    });
    */
		return result;
	};

	const [searchEnabled, setSearchEnabled] = useState(true);
	const [searchType, setSearchType] = useState(FilterType.All);
	const [searchText, setSearchText] = useState("");
	const [searchTip, setTip] = useState("Select Search Type First");
	const [persons, setPersons] = useState(GetThiefs("", searchType));

	const EnableSearch = (event: any) => {
		let selectedVal = event.target[event.target.selectedIndex].value;

		if (selectedVal !== "None") {
			setSearchText("");
			setTip(`Enter Search Value...`);
			setSearchEnabled(false);
			if (selectedVal === "None") setSearchType(FilterType.All);
			if (selectedVal === "text") setSearchType(FilterType.Name);
			if (selectedVal === "tel") setSearchType(FilterType.Phone);
			if (selectedVal === "email") setSearchType(FilterType.Email);
		} else {
			setTip("Select Search Type First");
			setSearchText("");
			setSearchEnabled(true);
			setSearchType(FilterType.All);
		}
	};

	const SetUserInput = (event: any) => {
		setSearchText(event.target.value);
		setPersons(GetThiefs(event.target.value, searchType));
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
					<button className="AddThiefButton">Add New</button>
				</div>
				<div className="add-new">
					<h2 className="results-label">Results: {}</h2>
				</div>
				<ThiefTable people={persons} />
			</main>
		</div>
	);
}
