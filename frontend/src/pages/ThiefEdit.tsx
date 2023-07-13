import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Form, MultiField, FormInput, FormButton, LinkButton } from '../components/Form';
import { useSearchParams } from 'react-router-dom';
import { httpClient } from '../services/HttpClient';
import { useRecoilValue } from "recoil";
import { debugState } from "../services/Recoil";
import loading from "../assets/loading.gif";

export default function ThiefEdit() {
	if (useRecoilValue(debugState) == true) {
		console.log("ThiefEdit");
	}
	const [searchParams, setSearchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState(true);
	const [showLoadGif, setShowLoadGif] = useState(false);
	const [wasSubmitted, setWasSubmitted] = useState(false);
	const urlThiefId = searchParams.get('thiefId');

	setTimeout(() => {
		setShowLoadGif(true);
	}, 1000);

	// thiefInfo at beginning
	const [thiefInfo, setThiefInfo] = useState({
		thiefId:    0,
		name:       [''],
		email:      [''],
		url:        [''],
		addr:       [''],
		phone:      [''],
		bikeSerial: [''],
		phrase:     [''],
		note:       [''],
	});

	function handleFormSubmit(e: any) {
		e.preventDefault();
		let results = CompareResults(e.dataDict);
		httpClient.put('/thiefEdit', results)
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

		// need to split this one
		Object.entries(submitData).map((field) => {
			// field[0] is key, field[1] is value

			if (field[0] !== 'thiefId') {
				let newValues = field[1].split(',');
				let oldValues = thiefInfo[`${field[0]}`];

				let test = Math.max(newValues.length, oldValues.length);

				for (let i = 0; i < test; i++) {
					let oldVal = oldValues[i] ? oldValues[i] : '0';
					let newVal = newValues[i] ? newValues[i] : '0';

					if (oldVal !== newVal) {
						let keyValue = field[0];

						results[keyValue] !== undefined
							? results[keyValue].push([oldVal, newVal])
							: (results[keyValue] = [[oldVal, newVal]]);
					}
				}
			}
		});

		return results;
	};

	useEffect(() => {
		if (urlThiefId === 'new') {
			setIsLoading(false);
			return;
		}
		httpClient.get(`/thiefEdit?thiefId=${urlThiefId}`)
			.then((res: any) => {
				console.log('Thief search response:', res.data);

				let tempData = {
					thiefId: 0,
					name:       [''],
					email:      [''],
					url:        [''],
					addr:       [''],
					phone:      [''],
					bikeSerial: [''],
					phrase:     [''],
					note:       [''],
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
			});
	}, []);

	return (
		<div className="formal thiefedit-page">
			<Navbar/>
			<main>
				<h1>Thief Edit {isLoading && showLoadGif && <img src={loading} alt="loading" width="30px" />}</h1>
				<Form onSubmit={handleFormSubmit}>
					{console.log('thiefInfo', thiefInfo)}
					<FormInput  label="Thief ID"    name="thiefId"    data={thiefInfo.thiefId}                                          disabled={isLoading} />
					<MultiField label="Name"        name="name"       data={thiefInfo.name}       component={FormInput}                 disabled={isLoading} />
					<MultiField label="Email"       name="email"      data={thiefInfo.email}      component={FormInput}                 disabled={isLoading} />
					<MultiField label="Url"         name="url"        data={thiefInfo.url}        component={FormInput}                 disabled={isLoading} />
					<MultiField label="Address"     name="addr"       data={thiefInfo.addr}       component={FormInput}                 disabled={isLoading} />
					<MultiField label="Phone"       name="phone"      data={thiefInfo.phone}      component={FormInput} type="phone"    disabled={isLoading} />
					<MultiField label="Bike Serial" name="bikeSerial" data={thiefInfo.bikeSerial} component={FormInput}                 disabled={isLoading} />
					<MultiField label="Phrase"      name="phrase"     data={thiefInfo.phrase}     component={FormInput} type="textarea" disabled={isLoading} />
					<MultiField label="Notes"       name="notes"      data={thiefInfo.note}       component={FormInput} type="textarea" disabled={isLoading} />
					<div className="form-btns">
						<LinkButton type="button" to="back">Back</LinkButton>
						<FormButton type="submit">Submit</FormButton>
					</div>
					{wasSubmitted && <div className='form-btns'>Submitted!</div>}
				</Form>
			</main>
		</div>
	);
}
