import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
	Form,
	MultiField,
	FormInput,
	FormButton,
	LinkButton,
} from '../components/Form';
import { FileUpload } from '../components/FileUplaod/FileUpload';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { httpClient } from '../services/HttpClient';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import LoadingIcon from '../components/LoadingIcon';
import DebugLogs from '../services/DebugLogs';
import TextWindow from '../components/TextWindow';


export default function ThiefEdit() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isLoadingInit, setIsLoadingInit] = useState(true);
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const [renderImageFiles, setRenderImageFiles] = useState<(File | string)[]>([]);
	const [newImages, setNewImages] = useState<(File | string)[]>([]);
	const [deletedImages, setDeletedImages] = useState<(File | string)[]>([]);
	const debug = useRecoilValue(debugState);
	const url = new URL(window.location.href);
	const pageName = "Thief Edit";
	const navigate = useNavigate();

	// thiefInfo at beginning
	const [thiefInfo, setThiefInfo] = useState({
		thiefId: '',
		name: [''],
		email: [''],
		url: [''],
		addr: [''],
		phone: [''],
		bikeSerial: [''],
		phrase: [''],
		note: [''],
	});

	function handleHisotryClick() {
		const thiefId = thiefInfo.thiefId;
		navigate(`/history?thiefId=${thiefId}`);
	}

	async function handleFormSubmit(e: any) {
		setIsLoadingSubmit(true);
		e.preventDefault();
		let results = CompareResults(e.dataDict);

		const formData = new FormData();
		formData.append('body', JSON.stringify(results));
		if (newImages.length !== 0) {
			newImages.forEach((image) => {
				formData.append(`newImages`, image);
			})
		}
		if (deletedImages.length !== 0) {
			formData.append('deletedImages', JSON.stringify(deletedImages));
		}

		const res = await httpClient.put('/thief', formData)
			.catch(err => {
				DebugLogs('Thief put error', err.message, debug);
			});

		if (res) {
			if (thiefInfo.thiefId === 'new') {
				setThiefInfo(prevThiefInfo => {
					return { ...prevThiefInfo, thiefId: res.data.thiefId }
				})
			}
			setDeletedImages([]);
			setNewImages([]);
		}

		url.searchParams.set('thiefId', res.data.thiefId);
		window.history.replaceState({ path: url.href }, '', url.href);

		setIsLoadingSubmit(false);
		setWasSubmitted(true);
		setTimeout(() => {
			setWasSubmitted(false);
		}, 3000);
	}

	function CompareResults(submitData: any) {
		let newThiefInfo = { ...thiefInfo };
		let results = { thiefId: url.searchParams.get('thiefId') };
		for (const [key, value] of Object.entries(submitData)) {
			if (key === 'thiefId') { continue; }
			let oldVals = [...thiefInfo[key]];
			let newVals = value.split(',');
			let delVals = [];
			let addVals = [];

			for (let i = 0; i < oldVals.length; i++) {
				if (!newVals.includes(oldVals[i])) {
					delVals.push(oldVals[i]);
				}
			}
			for (let i = 0; i < newVals.length; i++) {
				if (!oldVals.includes(newVals[i])) {
					addVals.push(newVals[i]);
				}
			}
			newThiefInfo[key] = [...newVals];
			results[key] = { addVals: addVals, delVals: delVals }
		}
		setThiefInfo(newThiefInfo);
		DebugLogs('Thief edit changes', results, debug)
		return results;
	};

	async function async_get(thiefId: string) {
		let res: any;
		try {
			res = await httpClient.get(`/thief?thiefId=${thiefId}`)
		} catch (err: any) {
			DebugLogs('Thief get error', err.message, debug);
			return;
		}
		Object.entries(res.data.thiefInfo[0]).map((atr) => {
			if (atr[0].localeCompare('thiefId') && atr[1].length === 0) {
				atr[1] = [''];
			}
			thiefInfo[atr[0]] = atr[1];
		})
		setIsLoadingInit(false);
		setIsLoadingSubmit(false);
		if (res.data.imageUrls.length !== 0 && renderImageFiles.length === 0) {
			setRenderImageFiles(res.data.imageUrls)
		}
		DebugLogs('Thief get response', res.data, debug);
	}

	useEffect(() => {
		DebugLogs('ThiefEdit Component', '', debug);
		let thiefId = url.searchParams.get('thiefId');
		if (thiefId === 'new') {
			setIsLoadingInit(false);
			thiefInfo.thiefId = 'new';
			setThiefInfo(thiefInfo);
			return;
		} else if (thiefId) {
			async_get(thiefId);
		}
	}, []);

	let isLoading = isLoadingInit || isLoadingSubmit;
	return (
		<div className="formal thiefedit-page">
			<Navbar />
			<main>
				<div className="title">
					<h1>{pageName}<LoadingIcon when={isLoadingInit} delay={1} /></h1>
					<button onClick={handleHisotryClick}>History</button>
				</div>

				<TextWindow pageName={pageName} />
				<Form onSubmit={handleFormSubmit}>
					<FormInput label="Thief ID" name="thiefId" value={thiefInfo.thiefId} disabled={true} />
					<MultiField label="Name" name="name" data={thiefInfo.name} disabled={isLoading} component={FormInput} />
					<MultiField label="Email" name="email" data={thiefInfo.email} disabled={isLoading} component={FormInput} />
					<MultiField label="Url" name="url" data={thiefInfo.url} disabled={isLoading} component={FormInput} />
					<MultiField label="Address" name="addr" data={thiefInfo.addr} disabled={isLoading} component={FormInput} />
					<MultiField label="Phone" name="phone" data={thiefInfo.phone} disabled={isLoading} component={FormInput} type="phone" />
					<MultiField label="Bike Serial" name="bikeSerial" data={thiefInfo.bikeSerial} disabled={isLoading} component={FormInput} />
					<MultiField label="Phrase" name="phrase" data={thiefInfo.phrase} disabled={isLoading} component={FormInput} type="textarea" />
					<MultiField label="Notes" name="note" data={thiefInfo.note} disabled={isLoading} component={FormInput} type="textarea" />
					<FileUpload
						label="Files"
						isLoading={isLoading}
						renderImageFiles={renderImageFiles}
						setRenderImageFiles={setRenderImageFiles}
						newImages={newImages}
						setNewImages={setNewImages}
						deletedImages={deletedImages}
						setDeletedImages={setDeletedImages}
					/>
					<div className="form-btns">
						<LinkButton type="button" to="back">Back</LinkButton>
						<FormButton type="submit" disabled={isLoading}>Submit</FormButton>
						<LoadingIcon when={isLoadingSubmit} style={{ margin: 0 }} />
					</div>
					{wasSubmitted && <div className="form-btns">Submitted!</div>}
				</Form>
			</main>
		</div>
	);
}
