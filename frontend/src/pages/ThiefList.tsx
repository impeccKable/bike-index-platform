import { useState, useEffect, useRef } from 'react';
import ThiefTable from '../components/ThiefTable';
import Navbar from '../components/Navbar';
import { LinkButton } from '../components/Form';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import { httpClient } from '../services/HttpClient';
import '../styles/thiefList.css';
import { useAuth } from '../services/AuthProvider';

// @ts-ignore
export interface Thief extends React.HTMLInputElement {
	thiefId: number;
	name: string;
	phone: string;
	email: string;
	address: string;
}

export default function ThiefList() {
	if (useRecoilValue(debugState) == true) {
		console.log('ThiefList');
	}
	const [searchType, setSearchType] = useState('name');
	const [searchText, setSearchText] = useState('');
	const latestSearchText = useRef(searchText);
	const [thiefs, setThiefs] = useState<Thief[]>([]);

	// Set the search text and search type from the url
	useEffect(() => {
		const url = new URL(window.location.href);
		const searchType = url.searchParams.get('searchType');
		const searchText = url.searchParams.get('searchText');
		if (searchType) setSearchType(searchType);
		if (searchText) setSearchText(searchText);
	}, []);

	// Perform the search when the search text or search type changes
	useEffect(() => {
		// Set url to include search text (so back button will go back to the same search)
		const url = new URL(window.location.href);
		url.searchParams.set('searchType', searchType);
		url.searchParams.set('searchText', searchText);
		window.history.replaceState({ path: url.href }, '', url.href);

		const GetThiefs = async () => {
			latestSearchText.current = searchText;
			const response = await httpClient.get(
				`/search?searchType=${searchType}&searchText=${searchText}`
			);
			// Discard results if the search text has changed since the request was made
			if (latestSearchText.current !== searchText) return;
			setThiefs(response.data);
		};
		GetThiefs();
	}, [searchType, searchText]);

	return (
		<div className="formal thieflist-page">
			<Navbar />
			<main>
				<h1>Thief Listing</h1>

				<div className="searchbar">
					<label htmlFor="SearchType">Search Type</label>
					<select
						id="SearchType"
						name="SearchType"
						onChange={(event: any) => {
							setSearchType(event.target[event.target.selectedIndex].value);
						}}
					>
						<option value="name">Name</option>
						<option value="phone">Phone Number</option>
						<option value="email">Email</option>
					</select>
					<label htmlFor="ThiefSearch">Search</label>
					<input
						id="ThiefSearch"
						type={searchType}
						required
						value={searchText}
						onChange={(event: any) => {
							setSearchText(event.target.value);
						}}
					></input>
					<LinkButton className="AddThiefButton" to="/thiefEdit?thiefId=new">
						Add New
					</LinkButton>
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
