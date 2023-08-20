import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { LinkButton } from '../components/Form';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import { httpClient } from '../services/HttpClient';
import LinkTable from '../components/LinkTable';
import DebugLogs from '../services/DebugLogs';
import LoadingIcon from '../components/LoadingIcon';
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
	'ID': { maxWidth: "2rem", minWidth: "2rem" },
	'Name': { maxWidth: "12rem", minWidth: "12rem" },
	'Phone': { maxWidth: "6rem", minWidth: "6rem" },
	'Email': { maxWidth: "14rem", minWidth: "14rem" },
	'Address': { maxWidth: "22rem", minWidth: "22rem" },
};

export default function ThiefList() {
	const [searchType, setSearchType] = useState('all');
	const [searchText, setSearchText] = useState('');
	const latestSearchText = useRef(searchText);
	const [thieves, setThieves] = useState<Thief[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const debug = useRecoilValue(debugState)
	const url = new URL(window.location.href);
	const pageName = "Thief Listing";
	const [page, setpage] = useState(1);
	const [pagemeta, setpagemeta] = useState({ totalRows: 0, totalPages: 0 });

	// Set the search text and search type from the url
	useEffect(() => {
		const searchType = url.searchParams.get('searchType');
		const searchText = url.searchParams.get('searchText');
		setSearchType(searchType ? searchType : 'all');
		setSearchText(searchText ? searchText : '');
		DebugLogs('ThiefList Component', '', debug)
	}, []);

	// Perform the search when the search text or search type changes
	useEffect(() => {
		// Set url to include search text (so back button will go back to the same search)
		url.searchParams.set('searchType', searchType);
		url.searchParams.set('searchText', searchText);
		window.history.replaceState({ path: url.href }, '', url.href);

		async function getThieves() {
			latestSearchText.current = searchText;
			const response = await httpClient.get(
				`/search?searchType=${searchType}&searchText=${searchText}&page=${page}`
			).catch((err: any) => {
				DebugLogs('ThiefList get error', err, debug)
			});
			// Strip out the desired fields
			const thieves: Array<Thief> = response.data.data.map((thief: Thief) => {
				return {
					thiefId: thief.thiefId,
					name: thief.name,
					phone: thief.phone,
					email: thief.email,
					addr: thief.addr,
				};
			});

			setpagemeta(response.data.meta);
			console.log("page", page)

			// console.log('response.meta', response.data.mata)
			// Discard results if the search text has changed since the request was made
			if (latestSearchText.current !== searchText) return;
			setThieves(thieves);
			setIsLoading(false);
			DebugLogs('Thief search get response', response.data, debug)
		};
		getThieves();
	}, [searchType, searchText, page]);

	useEffect(() => {
		setpage(1);
	}, [searchText]);

	return (
		<div className="formal thieflist-page">
			<Navbar />
			<main>
				<h1>{pageName}<LoadingIcon when={isLoading} delay={1} /></h1>
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
						<option value="all">All</option>
						<option value="name">Name</option>
						<option value="phone">Phone Number</option>
						<option value="email">Email</option>
						<option value="url">Url</option>
						<option value="addr">Address</option>
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
					<LinkButton className="AddThiefButton" to="/thief?thiefId=new">
						Add New
					</LinkButton>
				</div>
				<LinkTable header={header} data={thieves} pagemeta={pagemeta} page={page} setpage={setpage} linkBase='/thief?thiefId=' />
			</main>
		</div>
	);
}
