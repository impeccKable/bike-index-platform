
// Components
import Navbar from "../components/Navbar";
import LinkTable from "../components/LinkTable";
import { LinkButton } from "../components/Form";
import { httpClient } from "../services/HttpClient";

// react
import {useState, useEffect, useRef} from 'react';


const tableHeaders = {
    'Name':   { maxWidth: "12rem", minWidth: "12rem"},
    'Email':   { maxWidth: "14rem", minWidth: "14rem"},
    'Phone':  { maxWidth: "6rem", minWidth: "6rem"},
    'Title':  { maxWidth: "7rem", minWidth: "7rem"},
    'Role':  { maxWidth: "5rem", minWidth: "5rem"},
    'Organization':  { maxWidth: "13rem", minWidth: "13rem"},
    'Approved':  { maxWidth: "5rem", minWidth: "5rem"},
    'Banned':  { maxWidth: "5rem", minWidth: "5rem"},
    'ID': { maxWidth: "20rem",  minWidth: "20rem" }
}

export interface User extends React.HTMLInputElement {
	userid: number;
	email: string;
	first: string;
	last: string;
	title: string;
	org: string;
	phone: string;
	role: string;
	approved: string;
	banned: string;
}

export default function UserList() {
    const [searchType, setSearchType] = useState('name');
    const [searchText, setSearchText] = useState("");
    const [userData, setUserData] = useState<User[]>([]);
    const preSearchText = useRef(searchText);

    useEffect(() => {
        const GetUsers = async () => {
            preSearchText.current = searchText;
            let key = searchText === "" ? "All" : searchText;

            const response = await httpClient.get(`/userList?searchKey=${key}&searchType=${searchType}`);
            if (response.status === 200) {
                console.log("Success 200 ");
            }
            else {
                console.log(`Failure Status ${response.status}`);
            }

            setUserData(response.data);
        }
        GetUsers();
    }, [searchText]);

    return (
        <div className="formal">
            <Navbar/>
            <main>
            <h1>User Listing</h1>
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
                    <option value="title">Title</option>
                    <option value="org">Organization</option>
                </select>
                <label htmlFor="UserSearch">Search</label>
                <input
                    id="UserSearch"
                    type={searchType}
                    required
                    value={searchText}
                    onChange={(event: any) => {
                        setSearchText(event.target.value);
                    }}
                    >
                </input>
                <LinkButton className="AddThiefButton" to="">Add New</LinkButton>
            </div>
            {<LinkTable header={tableHeaders} data={userData} linkBase="/userEdit/"></LinkTable>}
            </main>
        </div>
    );
}