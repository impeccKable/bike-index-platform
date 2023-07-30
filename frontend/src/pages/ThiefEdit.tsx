import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
	Form,
	MultiField,
	FormInput,
	FormButton,
	LinkButton,
} from '../components/Form';
import { FileUpload } from '../components/FileUpload/FileUpload';
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
	const [initialImageFiles, setInitialImageFiles] = useState<(File | string)[]>(fakeIamges);
	const [newImages, setNewImages] = useState<(File | string)[]>([]);
	const [deletedImages, setDeletedImages] = useState<(File | string)[]>([]);
	const urlThiefId = searchParams.get('thiefId');
	const debug = useRecoilValue(debugState);

	setTimeout(() => {
		setShowLoadGif(true);
	}, 1000);

	// thiefInfo at beginning
	const [thiefInfo, setThiefInfo] = useState({
		thiefId: 0,
		name: [''],
		email: [''],
		url: [''],
		addr: [''],
		phone: [''],
		bikeSerial: [''],
		phrase: [''],
		note: [''],
	});

	function handleFormSubmit(e: any) {
		e.preventDefault();
		let results = CompareResults(e.dataDict);

		const formData = new FormData();
		formData.append('body', JSON.stringify(results));
		newImages.forEach((image) => {
			formData.append(`newImages`, image);
		})
		formData.append('deletedImages', JSON.stringify(deletedImages));


		httpClient.put('/thiefEdit', formData)
			.catch(err => {
				DebugLogs('ThiefEdit post error', err, debug);
			});
		setWasSubmitted(true);
		setTimeout(() => {
			setWasSubmitted(false);
		}, 3000);
	}

	const CompareResults = (submitData: any) => {
		//Ex: newValues.name[0].push('Something'), 0 = old values
		let results = {
			thiefId: urlThiefId,
		};
		const consoleMessages: any = [];

		// need to split this one
		Object.entries(submitData).map((field) => {
			// field[0] is key, field[1] is value
			let keyValue = field[0];

			if (keyValue !== 'thiefId') {
				let newValues = field[1].split(',');
				let oldValues = thiefInfo[`${field[0]}`];
				results[keyValue] = [];
				oldValues.forEach(oldVal => {
					if (!newValues.includes(oldVal)) {
						results[keyValue].push([oldVal, '']);
					}
				});
				newValues.forEach(newVal => {
					if (!oldValues.includes(newVal)) {
						results[keyValue].push(['', newVal]);
					}
				});


				// let test = Math.max(newValues.length, oldValues.length);
				// for (let i = 0; i < test; i++) {
				// 	let oldVal = oldValues[i] ? oldValues[i] : '0';
				// 	let newVal = newValues[i] ? newValues[i] : '0';

				// 	if (oldVal !== newVal) {

				// 		if (results[keyValue] === undefined) {
				// 			results[keyValue] = [];
				// 		}
				// 		results[keyValue].push([oldVal, newVal])
				// 	}
				// }
				// Object.entries(results).map((thiefProperty) => {
				// 	//[0, string] add
				// 	//[string, 0] delete
				// 	// [string, string] update
				// 	//result = result.property.map

				// 	if (thiefProperty[0] !== 'thiefId') {
				// 		thiefProperty[1].map((propertyArray) => {
				// 			if (propertyArray[0] === '0') {
				// 				consoleMessages.push(`Adding: ${propertyArray[1]}`);
				// 			} else if (propertyArray[1] === '0') {
				// 				consoleMessages.push(`Deleting: ${propertyArray[0]}`);
				// 			} else {
				// 				consoleMessages.push(
				// 					`Updating '${propertyArray[0]}' to '${propertyArray[1]}'`
				// 				);
				// 			}
				// 		});
				// 	} else {
				// 		consoleMessages.push(`Thief ID: ${thiefProperty[1]}`);
				// 	}
				// });
			}
			DebugLogs('Submit Changes', consoleMessages, debug);
		});
		return results;
	};


	useEffect(() => {
		DebugLogs('ThiefEdit Component', '', debug);
		if (urlThiefId === 'new') {
			setIsLoading(false);
			return;
		}
		httpClient
			.get(`/thiefEdit?thiefId=${urlThiefId}`)
			.then((res: any) => {
				let tempData = {
					thiefId: 0,
					name: [''],
					email: [''],
					url: [''],
					addr: [''],
					phone: [''],
					bikeSerial: [''],
					phrase: [''],
					note: [''],
				};

				Object.entries(res.data[0]).map((atr) => {
					if (atr[0].localeCompare('thiefId') && atr[1].length === 0) {
						atr[1] = [''];
						tempData[`${atr[0]}`] = atr[1];
					} else {
						tempData[`${atr[0]}`] = atr[1];
					}
				});
				setIsLoading(false);
				setThiefInfo(tempData);
				DebugLogs('ThiefEdit get response', res.data, debug);
			})
			.catch((err) => {
				DebugLogs('ThiefEdit get error', err, debug);
			});
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
					<FileUpload
						label="Images"
						imageFiles={[...initialImageFiles, ...newImages]}
						newImages={newImages}
						setNewImages={setNewImages}
						deletedImages={deletedImages}
						setDeletedImages={setDeletedImages}
					/>
					<div className="form-btns">
						<LinkButton type="button" to="back">Back</LinkButton>
						<FormButton type="submit">Submit</FormButton>
					</div>
					{wasSubmitted && <div className="form-btns">Submitted!</div>}
				</Form>
			</main>
		</div>
	);
}
