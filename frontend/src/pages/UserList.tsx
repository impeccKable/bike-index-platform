
// Components
import Navbar from "../components/Navbar";
import LinkTable from "../components/LinkTable";
import { FormInput, LinkButton, FormInputProps } from "../components/Form";
import { httpClient } from "../services/HttpClient";

// react
import {useState, useEffect, useRef} from 'react';


const tableHeaders = {
    'ID':           { maxWidth: "20rem", minWidth: "20rem", display: "none" },
    'Name':         { maxWidth: "12rem", minWidth: "12rem" },
    'Email':        { maxWidth: "14rem", minWidth: "14rem" },
    'Phone':        { maxWidth: "6rem",  minWidth: "6rem"  },
    'Role':         { maxWidth: "5rem",  minWidth: "5rem"  },
    'Title':        { maxWidth: "7rem",  minWidth: "7rem"  },
    'Organization': { maxWidth: "13rem", minWidth: "13rem" },
    'Approved':     { maxWidth: "5rem",  minWidth: "5rem"  },
    'Banned':       { maxWidth: "5rem",  minWidth: "5rem"  },
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
    id:"SearchType",
    name:"SearchType",
    type:"select",
    label:"Search Type",
    labelProps: {
        htmlFor:"SearchType"
    }
}

export default function UserList() {
    const [searchType, setSearchType] = useState('name');
    const [searchText, setSearchText] = useState("");
    const [userData, setUserData] = useState<User[]>([]);
    const preSearchText = useRef(searchText);
    const url = new URL(window.location.href);

    useEffect(() => {
        url.searchParams.set('searchType', searchType);
        url.searchParams.set('searchText', searchText);
        window.history.replaceState({path: url.href}, "", url.href);
        const GetUsers = async () => {
            preSearchText.current = searchText;
            let key = searchText === "" ? "All" : searchText;

            const response = await httpClient.get(`/users?searchKey=${key}&searchType=${searchType}`);
            if (response.status === 200) {
                console.log("Success 200 ");
            }
            else {
                console.log(`Failure Status ${response.status}`);
            }

            setUserData(response.data);
        }
        GetUsers();
    }, [searchText, searchType]);

    return (
        <div className="formal">
            <Navbar/>
            <main>
            <h1>User Listing</h1>
            <div className="searchbar">
                <FormInput {...SearchTypeProps} onChange={(event: any) => {setSearchType(event.target[event.target.selectedIndex].value);}}>
                    <option value="name">Name</option>
                    <option value="phone">Phone Number</option>
                    <option value="email">Email</option>
                    <option value="title">Title</option>
                    <option value="org">Organization</option>
                </FormInput>
                <FormInput id="UserSearch" type={searchType} label={"Search"} value={searchText} name="UserSearch" labelProps={{htmlFor:"UserSearch"}} onChange={(event: any) => {setSearchText(event.target.value);}}/>
                <LinkButton className="AddThiefButton" to="/user?userId=new">Add New</LinkButton>
            </div>
            {<LinkTable header={tableHeaders} data={userData} linkBase="/user?userId="></LinkTable>}
            </main>
        </div>
    );
}