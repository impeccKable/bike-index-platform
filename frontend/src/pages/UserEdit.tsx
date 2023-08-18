import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Form, MultiField, FormInput, FormButton, LinkButton } from '../components/Form';
import { useSearchParams } from 'react-router-dom';
import { httpClient } from '../services/HttpClient';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import LoadingIcon from '../components/LoadingIcon';
import DebugLogs from '../services/DebugLogs';
import TextWindow from '../components/TextWindow';

//Add dynamically displayed password field to form to re-authenticate for email changes
//Add admin view and regular view
//Add success and failure dialogs
//Add null checks for response data
//Sign-up page should require all fields or submit ""
//Change line 106 to handle null fields returned


export default function UserEdit() {
	const [isLoadingInit, setIsLoadingInit] = useState(true);
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const [selectedRole, setSelectedRole] = useState('readWrite');
	const [selectedApproved, setSelectedApproved] = useState('true');
	const [selectedBanned, setSelectedBanned] = useState('false');
	const debug = useRecoilValue(debugState);
	const url = new URL(window.location.href);
	const pageName = "User Edit";

	// Admins can view other users but users can only view their own page
	const [userInfo, setUserInfo] = useState({
		userid: '', //Only visible to admins,
		email: '',
		first_name: '',
		last_name: '',
		title: '',
		org: '',
		phone: '',
		role: '',
		approved: false, //Only visible to admins
		banned: false, //Only visible to admins
	});

	async function handleFormSubmit(e: any) {
		setIsLoadingSubmit(true);
		e.preventDefault();
		let results = CompareResults(e.dataDict);
		console.log(results);

        const res = await httpClient.put('/user', results)
			.catch(err => {
				DebugLogs('User put error', err.message, debug);
			});

		setIsLoadingSubmit(false);
		setWasSubmitted(true);
		setTimeout(() => {
			setWasSubmitted(false);
		}, 3000);
	}

	function CompareResults(submitData: any) {
		//Ex: newValues.name[0].push('Something'), 0 = old values
		let results = {
			userid: url.searchParams.get('userId'),
		};
		const consoleMessages: any = [];
		const newUserInfo = {...userInfo};

		// need to split this one
		Object.entries(submitData).map((field) => {
			// field[0] is key, field[1] is value
			let keyValue = field[0];

			if (keyValue !== 'userId') {
				let newValue = field[1];
				let oldValue = userInfo[`${field[0]}`];
				newUserInfo[keyValue] = oldValue.slice();

				results[keyValue] = [];
				if (newValue===oldValue) {
					results[keyValue] = oldValue;
				}
				if (!(oldValue===newValue)) {
					results[keyValue] = newValue;
					if (!(newUserInfo[keyValue] === newValue)) {
						newUserInfo[keyValue] = newValue;
					}
				}
			}
			DebugLogs('Submit Changes', consoleMessages, debug);
		});
		setUserInfo(newUserInfo);
		return results;
	};

	async function async_get(userId: string) {
		let res: any;
		try {
			res = await httpClient.get(`/user?userId=${userId}`)
		} catch (err: any) {
			DebugLogs('User get error', err.message, debug);
			return;
		}
		Object.entries(res.data[0]).map((atr) => {
			if (atr[0].localeCompare('userId') && atr[1].length === 0) {
				atr[1] = [''];
			}
			userInfo[atr[0]] = atr[1];
		})
		setSelectedRole(userInfo.role);
		setSelectedApproved(userInfo.approved.toString());
		setSelectedBanned(userInfo.banned.toString());
		setIsLoadingInit(false);
		setIsLoadingSubmit(false);
		DebugLogs('User get response', res.data, debug);
	}
	useEffect(() => {
		DebugLogs('UserEdit Component', '', debug);
		let userId = url.searchParams.get('userId');
		if (userId === 'new') {
			setIsLoadingInit(false);
			userInfo.userId = 'new';
			setUserInfo(userInfo);
			return;
		} else if (userId) {
			async_get(userId);
		}
	}, []);

	let isLoading = isLoadingInit || isLoadingSubmit;
	return (
		<div className="formal thiefedit-page">
			<Navbar />
			<main>
				<h1>{pageName}<LoadingIcon when={isLoadingInit} delay={1}/></h1>
				<TextWindow pageName={pageName}/>
				<Form onSubmit={handleFormSubmit}>
					<FormInput  label="User UID"       name="userid"     value={userInfo.userid}     			disabled={true}/>
					<FormInput  label="Email"          name="email"      value={userInfo.email}      			disabled={true}      />
					<FormInput  label="First Name"     name="first_name" defaultValue={userInfo.first_name} 			disabled={isLoading} />
					<FormInput  label="Last Name"      name="last_name"  defaultValue={userInfo.last_name}  			disabled={isLoading} />
					<FormInput  label="Title"          name="title"      defaultValue={userInfo.title}      			disabled={isLoading} />
					<FormInput  label="Organization"   name="org"        defaultValue={userInfo.org}        			disabled={isLoading} />
					<FormInput  label="Phone"          name="phone"      defaultValue={userInfo.phone}      			disabled={isLoading} type="phone"/>
					<FormInput  label="Role"           name="role"       value={selectedRole}       disabled={isLoading} type="select" onChange={(event: any) => {
							userInfo.role = event.target[event.target.selectedIndex].value;
							setSelectedRole(event.target[event.target.selectedIndex].value);
						}}>
                    	<option value="admin">     Admin      </option>
                    	<option value="readWrite"> readWrite  </option>
                    	<option value="readOnly">  readOnly   </option>
                	</FormInput>
					<FormInput  label="Approved"       name="approved"   value={selectedApproved}   disabled={isLoading} type="select" onChange={(event: any) => {
							event.target[event.target.selectedIndex].value === "true" ?
							userInfo.approved = true:
							userInfo.approved = false;
							setSelectedApproved(event.target[event.target.selectedIndex].value);
						}}>
                    	<option value="true">      Approved   </option>
                    	<option value="false">     Unapproved </option>
                	</FormInput>
					<FormInput  label="Banned"         name="banned"     value={selectedBanned}     disabled={isLoading} type="select" onChange={(event: any) => {
							event.target[event.target.selectedIndex].value === "true" ?
							userInfo.banned = true :
							userInfo.banned = false;
							setSelectedBanned(event.target[event.target.selectedIndex].value);
						}}>
                    	<option value="true">      Banned   </option>
                    	<option value="false">     Unbanned </option>
                	</FormInput>
    				<div className="form-btns">
						<LinkButton type="button" to="back">Back</LinkButton>
						<FormButton type="submit" disabled={isLoading}>Submit</FormButton>
						<LoadingIcon when={isLoadingSubmit} style={{margin: 0}}/>
					</div>
					{wasSubmitted && <div className="form-btns">Submitted!</div>}
				</Form>
			</main>
		</div>
	);
}
