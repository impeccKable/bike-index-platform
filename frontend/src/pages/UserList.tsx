
// Components
import Navbar from "../components/Navbar";
import LinkTable from "../components/LinkTable";
import { FormInput, LinkButton, FormInputProps } from "../components/Form";
import { httpClient } from "../services/HttpClient";
import TextWindow from "../components/TextWindow";
import { useAuth } from "../services/AuthProvider";

// react
import {useState, useEffect, useRef} from 'react';
import { useNavigate } from "react-router-dom";


const tableHeaders = {
	'ID': { maxWidth: "20rem", minWidth: "20rem", display: "none" },
	'Name': { maxWidth: "12rem", minWidth: "12rem" },
	'Email': { maxWidth: "14rem", minWidth: "14rem" },
	'Phone': { maxWidth: "6rem", minWidth: "6rem" },
	'Role': { maxWidth: "5rem", minWidth: "5rem" },
	'Title': { maxWidth: "7rem", minWidth: "7rem" },
	'Organization': { maxWidth: "13rem", minWidth: "13rem" },
	'Approved': { maxWidth: "5rem", minWidth: "5rem" },
	'Banned': { maxWidth: "5rem", minWidth: "5rem" },
}

export interface User extends React.HTMLInputElement {
	title: string;
	email: string;
	userid: number;
	first: string;
	last: string;
	org: string;
	phone: string;
	role: string;
	approved: string;
	banned: string;
}

const SearchTypeProps: FormInputProps = {
	id: "SearchType",
	name: "SearchType",
	type: "select",
	label: "Search Type",
	labelProps: {
		htmlFor: "SearchType"
	}
}

const SearchInputProps: FormInputProps = {
	id: "UserSearch",
	type: "name",
	label: "Search",
	value: "",
	name: "UserSearch",
	labelProps: {
		htmlFor: "UserSearch"
	}
}

export default function UserList() {
	const [searchType, setSearchType] = useState('name');
	const [searchText, setSearchText] = useState('');
	const [userData, setUserData] = useState<User[]>([]);
	const [page, setpage] = useState(1);
	const [pagemeta, setpagemeta] = useState({ totalRows: 0, totalPages: 0 });
    const { user } = useAuth();
    const navigate = useNavigate();
	const preSearchText = useRef(searchText);
	const url = new URL(window.location.href);
	const pageName = "User List";
	SearchInputProps.type = searchType;
	SearchInputProps.value = searchText;

    useEffect(() => {
        if(!user) return;
        if(user?.bikeIndex.role !== "admin") {
            navigate("/user/?userId=" + user.firebase.uid);            
        }
        const type = url.searchParams.get("searchType");
        const text = url.searchParams.get("searchText");
        setSearchType(type ? type : "name");
        setSearchText(text ? text : "");
    },[user]);

	useEffect(() => {
		url.searchParams.set('searchType', searchType);
		url.searchParams.set('searchText', searchText);
		window.history.replaceState({ path: url.href }, "", url.href);
		const GetUsers = async () => {
			preSearchText.current = searchText;
			let key = searchText === "" ? "All" : searchText;

			const response = await httpClient.get(`/users?searchKey=${key}&searchType=${searchType}&page=${page}`);
			if (response.status === 200) {
				console.log("Success 200 ");
			}
			else {
				console.log(`Failure Status ${response.status}`);
			}

			if (preSearchText.current !== searchText) return;
			setUserData(response.data.data);
			setpagemeta(response.data.meta)
		}
		GetUsers();
	}, [searchText, searchType, page]);

	return (
		<div className="formal">
			<Navbar />
			<main>
				<h1>{pageName}</h1>
				<TextWindow pageName={pageName} />
				<div className="searchbar">
					<FormInput {...SearchTypeProps} value={searchType} onChange={(event: any) => { setSearchType(event.target[event.target.selectedIndex].value); }}>
						<option value="name">Name</option>
						<option value="phone">Phone Number</option>
						<option value="email">Email</option>
						<option value="title">Title</option>
						<option value="org">Organization</option>
					</FormInput>
					<FormInput {...SearchInputProps} onChange={(event: any) => { setSearchText(event.target.value); }} />
				</div>
				{<LinkTable header={tableHeaders} data={userData} pagemeta={pagemeta} page={page} setpage={setpage} linkBase="/user?userId="></LinkTable>}
			</main>
		</div>
	);
}