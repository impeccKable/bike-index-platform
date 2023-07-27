import { useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormButton } from "../components/Form";
import { httpClient } from "../services/HttpClient";
import loading from '../assets/loading.gif';

export default function DataImport() {
	const [newDataCnts, setNewDataCnts]: any = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	async function handleFormSubmit(e: any) {
		setIsLoading(true);
		e.preventDefault();
		const formData = new FormData();
		// @ts-ignore
		formData.append("file", document.getElementsByName("csvfile")[0].files[0]);
		const config = { headers: { "content-type": "multipart/form-data" } };
		const response = await httpClient.post("/dataImport", formData, config);
		setNewDataCnts(response.data);
		setIsLoading(false);
	}

	return (
		<div className="formal data-import-page">
			<Navbar />
			<main>
				<h1>Data Import</h1>
				<Form onSubmit={handleFormSubmit}>
					<input name="csvfile" type="file" accept=".csv"/>
					<div className="form-btns">
						<FormButton type="submit">Submit</FormButton>
						{isLoading && (
							<img src={loading} alt="loading" width="30px" height="30px" />
						)}
					</div>
				</Form>
				{newDataCnts && (
					<div>
						<h3>New unique data:</h3>
						<table>
							<tbody>
								<tr><td>Thiefs   </td><td>{newDataCnts.thief      }</td></tr>
								<tr><td>Names    </td><td>{newDataCnts.name       }</td></tr>
								<tr><td>Emails   </td><td>{newDataCnts.email      }</td></tr>
								<tr><td>URLs     </td><td>{newDataCnts.url        }</td></tr>
								<tr><td>Addresses</td><td>{newDataCnts.addr       }</td></tr>
								<tr><td>Phones   </td><td>{newDataCnts.phone      }</td></tr>
								<tr><td>Serials  </td><td>{newDataCnts.bike_serial}</td></tr>
								<tr><td>Phrases  </td><td>{newDataCnts.phrase     }</td></tr>
								<tr><td>Notes    </td><td>{newDataCnts.note       }</td></tr>
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
}
