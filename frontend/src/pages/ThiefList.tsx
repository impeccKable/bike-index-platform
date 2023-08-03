import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { LinkButton } from '../components/Form';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import { httpClient } from '../services/HttpClient';
import LinkTable from '../components/LinkTable';
import DebugLogs from '../services/DebugLogs';
import TextWindow from '../components/TextWindow';

// @ts-ignore
export interface Thief extends React.HTMLInputElement {
	thiefId: number;
	name: string;
	phone: string;
	email: string;
	addr: string;
}

const header = {
	'ID':      { maxWidth: "2rem",  minWidth: "2rem" },
	'Name':    { maxWidth: "12rem", minWidth: "12rem"},
	'Phone':   { maxWidth: "6rem",  minWidth: "6rem" },
	'Email':   { maxWidth: "14rem", minWidth: "14rem"},
	'Address': { maxWidth: "22rem", minWidth: "22rem"},
};

export default function ThiefList() {
	const [searchType, setSearchType] = useState('name');
	const [searchText, setSearchText] = useState('');
	const latestSearchText = useRef(searchText);
	const [thiefs, setThiefs] = useState<Thief[]>([]);
	const debug = useRecoilValue(debugState)
	const url = new URL(window.location.href);
	const pageName = "Thief Listing";

	// Set the search text and search type from the url
	useEffect(() => {
		const searchType = url.searchParams.get('searchType');
		const searchText = url.searchParams.get('searchText');
		setSearchType(searchType ? searchType : 'name');
		setSearchText(searchText ? searchText : '');
		DebugLogs('ThiefList Component', '', debug)
	}, []);

	// Perform the search when the search text or search type changes
	useEffect(() => {
		// Set url to include search text (so back button will go back to the same search)
		url.searchParams.set('searchType', searchType);
		url.searchParams.set('searchText', searchText);
		window.history.replaceState({ path: url.href }, '', url.href);

		const GetThiefs = async () => {
			latestSearchText.current = searchText;
			const response = await httpClient.get(
				`/search?searchType=${searchType}&searchText=${searchText}`
			).catch((err: any) => {
				DebugLogs('ThiefList get error', err, debug)
			});
			// Strip out the desired fields
			const thiefs: Array<Thief> = response.data.map((thief: Thief) => {
				return {
					thiefId: thief.thiefId,
					name:    thief.name,
					phone:   thief.phone,
					email:   thief.email,
					addr:    thief.addr,
				};
			});
			// Discard results if the search text has changed since the request was made
			if (latestSearchText.current !== searchText) return;
			setThiefs(thiefs);
			DebugLogs('Thief search get response', response.data, debug)
		};
		GetThiefs();
	}, [searchType, searchText]);

	return (
		<div className="formal thieflist-page">
			<Navbar />
			<main>
				<h1>{pageName}</h1>
				<TextWindow pageName={pageName} />
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
				<LinkTable header={header} data={thiefs} linkBase='/thiefEdit?thiefId=' />
			</main>
		</div>
	);
}
