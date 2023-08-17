import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Form, MultiField, FormInput, FormButton, LinkButton } from '../components/Form';
import { ImageUpload } from '../components/ImageUplaod/ImageUpload';
import { useSearchParams } from 'react-router-dom';
import { httpClient } from '../services/HttpClient';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import LoadingIcon from '../components/LoadingIcon';
import DebugLogs from '../services/DebugLogs';
import TextWindow from '../components/TextWindow';


export default function ThiefEdit() {
	const [notChanged, setNotChanged] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams();
	const [isLoadingInit, setIsLoadingInit] = useState(true);
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const fakeIamges = ["https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQkrjYxSfSHeCEA7hkPy8e2JphDsfFHZVKqx-3t37E4XKr-AT7DML8IwtwY0TnZsUcQ", "https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg?crop=0.88847xw:1xh;center,top&resize=1200:*", "https://programmerhumor.io/wp-content/uploads/2021/06/programmerhumor-io-python-memes-backend-memes-41e437ca7369eb4.jpg"]
	const [renderImageFiles, setRenderImageFiles] = useState<(File | string)[]>([]);
	const [newImages, setNewImages] = useState<(File | string)[]>([]);
	const [deletedImages, setDeletedImages] = useState<(File | string)[]>([]);
	const debug = useRecoilValue(debugState);
	const [showModal, setShowModal] = useState(false);
	const url = new URL(window.location.href);
	const pageName = "Thief Edit";

	const [clearByParts, setClearByParts] = useState({
		master: false,
		name: false,
		email: false,
		url: false,
		addr: false,
		phone: false,
		bikeSerial: false,
		phrase: false,
		note: false,
	});

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

	

	async function handleFormSubmit(e: any, clearAll: boolean) {
		setIsLoadingSubmit(true);
		e.preventDefault();

		if (clearAll) {
			e.dataDict = {name: '',email: '',url: '',addr: '',phone: '',bikeSerial: '',phrase: '',note: ''}
		}
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
		setClearByParts({master: false,name: false,email: false,url: false,addr: false,phone: false,bikeSerial: false,phrase: false,note: false});
		setTimeout(() => {
			setWasSubmitted(false);
		}, 3000);

		window.location.reload();
	}

	function CompareResults(submitData: any) {
		//Ex: newValues.name[0].push('Something'), 0 = old values
		let results = {
			thiefId: url.searchParams.get('thiefId'),
		};
		const consoleMessages: any = [];
		const newThiefInfo = {...thiefInfo};

		// need to split this one
		Object.entries(submitData).map((field) => {
			// field[0] is key, field[1] is value
			let keyValue = field[0];

			if (keyValue !== 'thiefId') {
				let newValues = field[1].split(',');
				let oldValues = thiefInfo[`${field[0]}`];
				newThiefInfo[keyValue] = oldValues.slice();

				results[keyValue] = [];
				oldValues.forEach(oldVal => {
					if (!newValues.includes(oldVal)) {
						results[keyValue].push([oldVal, '']);
						newThiefInfo[keyValue] = newThiefInfo[keyValue].filter(value => value !== oldVal);
					}
				});
				newValues.forEach(newVal => {
					if (!oldValues.includes(newVal)) {
						results[keyValue].push(['', newVal]);
						if (!newThiefInfo[keyValue].includes(newVal)) {
							newThiefInfo[keyValue].push(newVal);
						}
					}
				});
			}
			DebugLogs('Submit Changes', consoleMessages, debug);
		});
		setThiefInfo(newThiefInfo);
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

	function ClearAllFields(state: boolean) {
		let clearStates = {...clearByParts};
		let timeOffset = 0;
		setShowModal(false);
		clearStates["master"] = true;

		Object.entries(clearStates).forEach((fieldType)=> {
			//@ts-ignore
			clearStates[fieldType[0]] = state;
			setClearByParts(clearStates);			
		});
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
				<span className={notChanged ? '' : 'unsaved-changes'}>
					<h1>{pageName}<LoadingIcon when={isLoadingInit} delay={1}/></h1>
					<h3>{notChanged ? '' : "* Unsaved Changes"}</h3>
				</span>
				<TextWindow pageName={pageName}/>
				<button type="button" onClick={()=>{setShowModal(!showModal);}}>Clear All</button>
				<Form onSubmit={(e)=> {handleFormSubmit(e, clearByParts.master)}}>
					<FormInput  label="Thief ID"    name="thiefId"    value={thiefInfo.thiefId}   disabled={true}/>
					<MultiField clearAll={clearByParts.name} disableSubmit={setNotChanged} label="Name"        name="name"       data={thiefInfo.name}       disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.email} disableSubmit={setNotChanged} label="Email"       name="email"      data={thiefInfo.email}      disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.url} disableSubmit={setNotChanged} label="Url"         name="url"        data={thiefInfo.url}        disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.addr} disableSubmit={setNotChanged} label="Address"     name="addr"       data={thiefInfo.addr}       disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.phone} disableSubmit={setNotChanged} label="Phone"       name="phone"      data={thiefInfo.phone}      disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField clearAll={clearByParts.bikeSerial} disableSubmit={setNotChanged} label="Bike Serial" name="bikeSerial" data={thiefInfo.bikeSerial} disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.phrase} disableSubmit={setNotChanged} label="Phrase"      name="phrase"     data={thiefInfo.phrase}     disabled={isLoading} component={FormInput} type="textarea"/>
					<MultiField clearAll={clearByParts.note} disableSubmit={setNotChanged} label="Notes"       name="note"       data={thiefInfo.note}       disabled={isLoading} component={FormInput} type="textarea"/>
					<ImageUpload
						label="Images"
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
						<FormButton type="submit" disabled={isLoading || notChanged}>Submit</FormButton>
						<LoadingIcon when={isLoadingSubmit} style={{margin: 0}}/>
					</div>
					{wasSubmitted && <div className="form-btns">Submitted!</div>}
				</Form>
			</main>
			{showModal && 
			<div id="ModalDiv" className="modal">
				<div className="modal-content">
					<span className="close" onClick={()=>{setShowModal(false)}}>&times;</span>
					<div>
						<h1>Are you sure you want to clear all fields?</h1>
					</div>
					<div>
						<button type="button" onClick={()=>{ClearAllFields(true)}}>Yes, Clear All</button>
					</div>
				</div>
			</div>}
		</div>
	);
}
