import { useState, useEffect } from "react";
import ThiefTable from "../components/ThiefTable";
import Navbar from "../components/Navbar";
import { LinkButton } from "../components/Form";
import Modal from "../components/Modal";
import axios from "axios";

import "../styles/thieflist.css";

// @ts-ignore
export interface Person extends React.HTMLInputElement {
	id: number;
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
	const empty: Person[] = [];
	const [searchEnabled, setSearchEnabled] = useState(true);
	const [searchType, setSearchType] = useState(FilterType.All);
	const [searchText, setSearchText] = useState("");
	const [searchTip, setTip] = useState("Select Search Type First");
	const [persons, setPersons] = useState(empty);

	useEffect(() => {
		const GetThiefs = async (filter: string, type: FilterType) => {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const url = `http://localhost:3000/search?searchType=${FilterType[type]}&search=${filter}`;
			const response = await axios.get(url, config);

			const result = await response.data;
			const returnVal: Person[] = [];

			result.forEach((person: Person) => {
				let newPerson = {
					id: person.id,
					name: person.name,
					phone: person.phone,
					email: person.email,
					address: person.address,
				};
				returnVal.push(newPerson);
			});

			console.log(returnVal);

			setPersons(returnVal);
		};

		GetThiefs(searchText, searchType);
	}, [searchText]);

	const EnableSearch = (event: any) => {
		let selectedVal = event.target[event.target.selectedIndex].value;

		if (selectedVal !== "None") {
			setSearchText("");
			setTip(`Enter Search Value...`);
			setSearchEnabled(false);
			if (selectedVal === "None") setSearchType(FilterType.All);
			if (selectedVal === "text") setSearchType(FilterType.name);
			if (selectedVal === "tel") setSearchType(FilterType.phone);
			if (selectedVal === "email") setSearchType(FilterType.email);
		} else {
			setTip("Select Search Type First");
			setSearchText("");
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
