import { httpClient } from '../services/HttpClient';
import { useState, useEffect } from 'react';
import LoadingIcon from './LoadingIcon';

export default function TextWindow(props: any) {
	const [adminStatus, setAdminStatus] = useState(JSON.parse(localStorage.getItem("user")??"")?.bikeIndex?.role?.toLowerCase() === 'admin' ?? false);
	const [preview, setPreview] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState("");
	const [isHidden, setIsHidden] = useState(false);
	const [verbiage, setVerbiage] = useState("");

	useEffect(() => {
		async function getTextContent() {
			// grabs this pages content or inserts new then fetches
			const response = await httpClient.get(`/textContent?pageName=${props.pageName}`);
			if (response.status === 200) {
				setVerbiage(response.data.body);
				// setLabel(response.data.label);
				if (response.data.ishidden) {
					setIsHidden(true);
				}
			}
			setIsLoading(false);
		};
		getTextContent();
	}, []);

	async function updateData(data: any) {
		data['pageName'] = props.pageName;
		console.log(data);
		const response = await httpClient.put("/textContent", data);
		if (response.status === 200) {
			setMessage("Updated!");
		} else {
			setMessage("An error occured...");
		}
		// TODO: This is buggy :(
		setTimeout(() => {
			setMessage("");
		}, 4000);
	}

	// Show the verbiage
	if (!adminStatus || preview) {
		if (isHidden) { return; }
		// make multiple lines into <p> tags
		let text = verbiage.split('\n').map((item: string, key: number) => {
			return <p key={key}>{item}</p>
		});
		return <>
			<div>{text}</div>
			{ preview && <button onClick={() => {setPreview(false);}}>Done</button> }
		</>
	}
	// Show the edit window
	return (
		<>
		<div className="text-window">
			{isHidden ? <>
				<div className='edit'>
					<LoadingIcon when={isLoading} />
					<button
						onClick={() => {updateData({ishidden: false}); setIsHidden(false)}}
					>Enable Verbiage</button>
					<LoadingIcon when={false} /> {/* Just to center the button XD */}
				</div>
			</> : <>
				<div className='edit'>
					<LoadingIcon when={isLoading} />
					<textarea
					defaultValue={verbiage}
					onChange={(event: any) => {setVerbiage(event.target.value)}}
					/>
					<button
						title='Save Text Changes'
						className="fancy-button"
						onClick={() => {updateData({body: verbiage})}}
					>✔</button>
					<button
						title='Preview'
						className="fancy-button"
						onClick={() => {setPreview(true);}}
					>👁</button>
					<button
						title='Disable Verbiage'
						className="fancy-button fancy-button-end"
						onClick={() => {updateData({ishidden: true}); setIsHidden(true)}}
					>⊠</button>
				</div>
			</>}
			<div className='message'>{message}</div>
		</div>
		</>
	)
}