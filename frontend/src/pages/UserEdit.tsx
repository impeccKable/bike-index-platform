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


export default function UserEdit() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isLoadingInit, setIsLoadingInit] = useState(true);
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const debug = useRecoilValue(debugState);
	const url = new URL(window.location.href);
	const pageName = "User Edit";

	// Admins can view other users but users can only view their own page
	const [userInfo, setUserInfo] = useState({
		userId: '', //Only visible to admins,
		email: [''],
		firstName: [''],
		lastName: [''],
		title: [''],
		org: [''],
		phone: [''],
		role: [''],
		approved: [''], //Only visible to admins
		banned: [''], //Only visible to admins
	});

	async function handleFormSubmit(e: any) {
		setIsLoadingSubmit(true);
		e.preventDefault();
		let results = CompareResults(e.dataDict);

		const formData = new FormData();
		formData.append('body', JSON.stringify(results));

        const res = await httpClient.put('/user', formData)
			.catch(err => {
				DebugLogs('User put error', err.message, debug);
			});

		url.searchParams.set('userId', res.data.userId);
		window.history.replaceState({ path: url.href }, '', url.href);

		setIsLoadingSubmit(false);
		setWasSubmitted(true);
		setTimeout(() => {
			setWasSubmitted(false);
		}, 3000);
	}

	function CompareResults(submitData: any) {
		//Ex: newValues.name[0].push('Something'), 0 = old values
		let results = {
			userId: url.searchParams.get('userId'),
		};
		const consoleMessages: any = [];
		const newUserInfo = {...userInfo};

		// need to split this one
		Object.entries(submitData).map((field) => {
			// field[0] is key, field[1] is value
			let keyValue = field[0];

			if (keyValue !== 'userId') {
				let newValues = field[1].split(',');
				let oldValues = userInfo[`${field[0]}`];
				newUserInfo[keyValue] = oldValues.slice();

				results[keyValue] = [];
				oldValues.forEach(oldVal => {
					if (!newValues.includes(oldVal)) {
						results[keyValue].push([oldVal, '']);
						newUserInfo[keyValue] = newUserInfo[keyValue].filter(value => value !== oldVal);
					}
				});
				newValues.forEach(newVal => {
					if (!oldValues.includes(newVal)) {
						results[keyValue].push(['', newVal]);
						if (!newUserInfo[keyValue].includes(newVal)) {
							newUserInfo[keyValue].push(newVal);
						}
					}
				});
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
		Object.entries(res.data.userInfo[0]).map((atr) => {
			if (atr[0].localeCompare('userId') && atr[1].length === 0) {
				atr[1] = [''];
			}
			userInfo[atr[0]] = atr[1];
		})
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
					<FormInput  label="User UID"       name="userId"     value={userInfo.userId}    disabled={true}/>
					<MultiField label="Email"          name="email"      data={userInfo.email}      disabled={isLoading} component={FormInput}/>
					<MultiField label="First Name"     name="first_name" data={userInfo.firstName}  disabled={isLoading} component={FormInput}/>
					<MultiField label="Last Name"      name="last_name"  data={userInfo.lastName}   disabled={isLoading} component={FormInput}/>
					<MultiField label="Title"          name="title"      data={userInfo.phone}      disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField label="Organization"   name="org"        data={userInfo.org}        disabled={isLoading} component={FormInput} type="org"/>
					<MultiField label="Phone"          name="phone"      data={userInfo.phone}      disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField label="Role"           name="role"       data={userInfo.role}       disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField label="Approved"       name="approved"   data={userInfo.approved}   disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField label="Banned"         name="banned"     data={userInfo.banned}     disabled={isLoading} component={FormInput} type="phone"/>
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
