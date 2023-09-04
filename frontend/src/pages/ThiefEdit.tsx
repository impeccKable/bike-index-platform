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
import { useAuth } from '../services/AuthProvider';
import Modal from '../components/Modal';
import { AxiosError } from 'axios';


export default function ThiefEdit() {
	const [notChanged, setNotChanged] = useState(true);
	const [isLoadingInit, setIsLoadingInit] = useState(true);
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const [renderImageFiles, setRenderImageFiles] = useState<(File | string)[]>([]);
	const [newImages, setNewImages] = useState<(File | string)[]>([]);
	const [deletedImages, setDeletedImages] = useState<(File | string)[]>([]);
	const {user} = useAuth();
	const [admin, setAdmin] = useState(user?.bikeIndex.role === 'admin');
	const debug = useRecoilValue(debugState);
	const [showClearModal, setShowClearModal] = useState(false);
	const [showMergeModal, setShowMergeModal] = useState(false);
	const [isAdmin, setIsAdmin] = useState(JSON.parse(localStorage.getItem("user")??"")?.bikeIndex?.role?.toString() === 'admin' ?? false);
	const [thiefId, setThiefId] = useState('');
	const [mergeDisabled, setMergeDisabled] = useState(true);
	const [submissionFailed, setSubmissionFailed] = useState(false);
	const url = new URL(window.location.href);
	const pageName = "Thief Edit";
	const navigate = useNavigate();

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
		file: false,
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

	function handleHisotryClick() {
		const thiefId = thiefInfo.thiefId;
		navigate(`/history?thiefId=${thiefId}`);
	}

	

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

		await httpClient.put('/thief', formData)
			.then((res) => {
				console.log('theif put', res)

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
				setClearByParts({master: false,name: false,email: false,url: false,addr: false,phone: false,bikeSerial: false,phrase: false,note: false, file: false});
				setTimeout(() => {
					setWasSubmitted(false);
				}, 3000);
		
				if (clearAll) {
					navigate('/thieves?searchType=all&searchText=');
				}
				else {
					window.location.reload();
				}
			})
			.catch((err: AxiosError) => {
				if (err.response) {
					DebugLogs('Thief put error: Server Response', err.response.data, debug);
				} else if (err.request) {
					DebugLogs('Thief put error: No Response', err.request, debug);
				} else {
					DebugLogs('Thief put error: Request Setup Error', err.message, debug);
				}
				setIsLoadingInit(false);
				setIsLoadingSubmit(false);
				setSubmissionFailed(true);
			});
	}

	function CompareResults(submitData: any) {
		let results = { thiefId: url.searchParams.get('thiefId') };

		for (const [key, value] of Object.entries(submitData)) {
			if (key === 'thiefId') {
				if(isAdmin && results.thiefId !== value && !mergeDisabled) {
					results.thiefIdMap = [results.thiefId, value];
					results.thiefId = "merge";
				}
			}
			else {
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

				results[key] = { addVals: addVals, delVals: delVals }
			}
		}
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
		setThiefId(thiefInfo.thiefId);
		setIsLoadingInit(false);
		setIsLoadingSubmit(false);
		if (res.data.imageUrls.length !== 0 && renderImageFiles.length === 0) {
			setRenderImageFiles(res.data.imageUrls)
		}
		DebugLogs('Thief get response', res.data, debug);
	}

	function ClearAllFields(state: boolean) {
		let clearStates = {...clearByParts};
		setShowClearModal(false);
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
	
	useEffect(() => {
		console.log(user?.bikeIndex.role);
		setAdmin(user?.bikeIndex.role === 'admin');
	}, [user]);

	let isLoading = isLoadingInit || isLoadingSubmit;
	return (
		<div className="formal thiefedit-page">
			<Navbar />
			<main>
				<div className="title">
					<h1>{pageName}<LoadingIcon when={isLoadingInit} delay={1}/></h1>
					{admin&&<button onClick={handleHisotryClick}>History</button>}
				</div>
				<TextWindow pageName={pageName}/>
				<div>
					<button type="button" onClick={()=>{setShowClearModal(!showClearModal);}}>Clear All</button>
					{isAdmin && <button type="button" className="btn-danger" onClick={()=>{mergeDisabled ? setShowMergeModal(true) : setMergeDisabled(true); setThiefId(thiefInfo.thiefId);}}>{mergeDisabled ? 'Edit ID' : 'Undo Edit ID' }</button>}
				</div>				
				<span className={notChanged ? '' : 'unsaved-changes'}>
						<h3>{notChanged ? '' : "* Unsaved Changes"}</h3>
					</span>
				<Form onSubmit={(e)=> {handleFormSubmit(e, clearByParts.master)}}>
					<FormInput  label="Thief ID" type="number" name="thiefId" value={thiefId} disabled={(!isAdmin || mergeDisabled)} onChange={(event: any) => {setThiefId(event.target.value);setNotChanged(false);}}/>
					<MultiField clearAll={clearByParts.name} 		disableSubmit={setNotChanged} label="Name"        name="name"       data={thiefInfo.name}       disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.email}		disableSubmit={setNotChanged} label="Email"       name="email"      data={thiefInfo.email}      disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.url} 		disableSubmit={setNotChanged} label="Url"         name="url"        data={thiefInfo.url}        disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.addr} 		disableSubmit={setNotChanged} label="Address"     name="addr"       data={thiefInfo.addr}       disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.phone} 		disableSubmit={setNotChanged} label="Phone"       name="phone"      data={thiefInfo.phone}      disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField clearAll={clearByParts.bikeSerial} 	disableSubmit={setNotChanged} label="Bike Serial" name="bikeSerial" data={thiefInfo.bikeSerial} disabled={isLoading} component={FormInput}/>
					<MultiField clearAll={clearByParts.phrase} 		disableSubmit={setNotChanged} label="Phrase"      name="phrase"     data={thiefInfo.phrase}     disabled={isLoading} component={FormInput} type="textarea"/>
					<MultiField clearAll={clearByParts.note} 		disableSubmit={setNotChanged} label="Notes"       name="note"       data={thiefInfo.note}       disabled={isLoading} component={FormInput} type="textarea"/>
					<FileUpload
						label="Files"
						isLoading={isLoading}
						renderImageFiles={renderImageFiles}
						setRenderImageFiles={setRenderImageFiles}
						newImages={newImages}
						setNewImages={setNewImages}
						deletedImages={deletedImages}
						setDeletedImages={setDeletedImages}
						setNotChanged={setNotChanged}
						clearAll={clearByParts.file}
					/>
					<div className="form-btns">
						<LinkButton type="button" to="back">Back</LinkButton>
						<FormButton type="submit" disabled={isLoading || notChanged}>Submit</FormButton>
						<LoadingIcon when={isLoadingSubmit} style={{ margin: 0 }} />
					</div>
					{/* {wasSubmitted && <div className="form-btns">Submitted!</div>} */}
					{submissionFailed && <div className="form-btns" style={{ color: 'red' }}>Something went wrong. Please try again.</div>}
				</Form>
			</main>
			{showClearModal && <Modal 
									showModal={setShowClearModal}
									submitEvent={()=>{ClearAllFields(true); setShowClearModal(false);}}
									classNames={"warning-modal"} header="Clear All" 
									bodyText='To delete a thief clear all then submit. Are you sure you want to clear all fields?'
									btnLabel='Yes, Clear All' 
								/>
			}
			{showMergeModal && <Modal 
									showModal={setShowMergeModal}
									submitEvent={()=> {setMergeDisabled(false); setShowMergeModal(false);}}
									classNames={'warning-modal'}
									header='Merge Thieves'
									bodyText={`Changing the Thief ID will merge all information associated to thief '${thiefId}' into the entered thief ID and delete '${thiefId}'. Are you sure you want to continue?` }
									btnLabel='Yes, Continue'
									/>
			}
		</div>
	);
}
