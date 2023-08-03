import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
	Form,
	MultiField,
	FormInput,
	FormButton,
	LinkButton,
} from '../components/Form';
import { ImageUpload } from '../components/ImageUplaod/ImageUpload';
import { useSearchParams } from 'react-router-dom';
import { httpClient } from '../services/HttpClient';
import { useRecoilValue } from 'recoil';
import { debugState } from '../services/Recoil';
import loading from '../assets/loading.gif';
import DebugLogs from '../services/DebugLogs';


export default function ThiefEdit() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState(true);
	const [showLoadGif, setShowLoadGif] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const fakeIamges = ["https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQkrjYxSfSHeCEA7hkPy8e2JphDsfFHZVKqx-3t37E4XKr-AT7DML8IwtwY0TnZsUcQ", "https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg?crop=0.88847xw:1xh;center,top&resize=1200:*", "https://programmerhumor.io/wp-content/uploads/2021/06/programmerhumor-io-python-memes-backend-memes-41e437ca7369eb4.jpg"]
	const [renderImageFiles, setRenderImageFiles] = useState<(File | string)[]>([]);
	const [newImages, setNewImages] = useState<(File | string)[]>([]);
	const [deletedImages, setDeletedImages] = useState<(File | string)[]>([]);
	const debug = useRecoilValue(debugState);
	const url = new URL(window.location.href);

	setTimeout(() => {
		setShowLoadGif(true);
	}, 1000);

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

	async function handleFormSubmit(e: any) {
		setIsLoading(true);
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

		const res = await httpClient.put('/thiefEdit', formData)
			.catch(err => {
				DebugLogs('ThiefEdit post error', err.message, debug);
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

		setIsLoading(false);
		setWasSubmitted(true);
		setTimeout(() => {
			setWasSubmitted(false);
		}, 3000);
	}

	const CompareResults = (submitData: any) => {
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

	async function get() {
		const res = await httpClient
												.get(`/thiefEdit?thiefId=${url.searchParams.get('thiefId')}`)
												.catch((err) => {
													DebugLogs('ThiefEdit get error', err.message, debug);
												});
			Object.entries(res.data.thiefInfo[0]).map((atr) => {
				if (atr[0].localeCompare('thiefId') && atr[1].length === 0) {
					atr[1] = [''];
				}
				thiefInfo[atr[0]] = atr[1];
			}) 
			setIsLoading(false);
			if (res.data.imageUrls.length !== 0 && renderImageFiles.length === 0) {
				setRenderImageFiles(res.data.imageUrls)
			}
			DebugLogs('ThiefEdit get response', res.data, debug);
}

	useEffect(() => {
		DebugLogs('ThiefEdit Component', '', debug);
		if (url.searchParams.get('thiefId') === 'new') {
			setIsLoading(false);
			thiefInfo.thiefId = 'new';
			setThiefInfo(thiefInfo);
			return;
		}
		get();
	}, []);

	return (
		<div className="formal thiefedit-page">
			<Navbar />
			<main>
				<h1>
					Thief Edit {isLoading && showLoadGif && (
						<img src={loading} alt="loading" width="30px" height="30px"/>
					)}
				</h1>
				<Form onSubmit={handleFormSubmit}>
					<FormInput  label="Thief ID"    name="thiefId"    value={thiefInfo.thiefId}   disabled={true}/>
					<MultiField label="Name"        name="name"       data={thiefInfo.name}       disabled={isLoading} component={FormInput}/>
					<MultiField label="Email"       name="email"      data={thiefInfo.email}      disabled={isLoading} component={FormInput}/>
					<MultiField label="Url"         name="url"        data={thiefInfo.url}        disabled={isLoading} component={FormInput}/>
					<MultiField label="Address"     name="addr"       data={thiefInfo.addr}       disabled={isLoading} component={FormInput}/>
					<MultiField label="Phone"       name="phone"      data={thiefInfo.phone}      disabled={isLoading} component={FormInput} type="phone"/>
					<MultiField label="Bike Serial" name="bikeSerial" data={thiefInfo.bikeSerial} disabled={isLoading} component={FormInput}/>
					<MultiField label="Phrase"      name="phrase"     data={thiefInfo.phrase}     disabled={isLoading} component={FormInput} type="textarea"/>
					<MultiField label="Notes"       name="note"       data={thiefInfo.note}       disabled={isLoading} component={FormInput} type="textarea"/>
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
						<FormButton type="submit" disabled={isLoading}>Submit</FormButton>
					</div>
					{wasSubmitted && <div className="form-btns">Submitted!</div>}
				</Form>
			</main>
		</div>
	);
}
