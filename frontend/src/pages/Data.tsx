import { useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormButton } from "../components/Form";
import { httpClient } from "../services/HttpClient";
import loading from '../assets/loading.gif';

export default function DataImport() {
	const [newDataCnts, setNewDataCnts]: any = useState(null);
	const [isLoadingImport, setIsLoadingImport] = useState(false);
	const [isLoadingExport, setIsLoadingExport] = useState(false);

	async function handleImport(e: any) {
		try {
			setIsLoadingImport(true);
			setNewDataCnts(null);
			e.preventDefault();
			const formData = new FormData();
			// @ts-ignore
			formData.append("file", document.getElementsByName("csvfile")[0].files[0]);
			const config = { headers: { "content-type": "multipart/form-data" } };
			const response = await httpClient.post("/thiefDataImport", formData, config);
			console.log(response.data);
			setNewDataCnts(response.data);
			setIsLoadingImport(false);
		} catch (error) {
			setIsLoadingImport(false);
			throw error;
		}
	}

	async function handleExport() {
		try {
			setIsLoadingExport(true);
			const response = await httpClient.get("/thiefDataExport");
			download('Thief data.csv', response.data);
			setIsLoadingExport(false);
		} catch (error) {
			setIsLoadingExport(false);
			throw error;
		}
	}

	function download(filename: string, text: string) {
		var blob = new Blob([text], { type: "text/plain" });
		var url = window.URL.createObjectURL(blob);
		var a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
	}

	return (
		<div className="formal data-page">
			<Navbar />
			<main>
				<h1>Data Management</h1>
				<h3>Import data from .csv</h3>
				<Form onSubmit={handleImport}>
					<input name="csvfile" type="file" accept=".csv"/>
					<div className="form-btns">
						<FormButton type="submit">Upload</FormButton>
						{isLoadingImport && (<img src={loading} alt="loading" width="30px" height="30px" />)}
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
				<br></br>
				<br></br>
				<h3>Export all thief data to .csv</h3>
				<Form onSubmit={handleExport}>
					<div className="form-btns">
						<FormButton type="submit">Download</FormButton>
						{isLoadingExport && (<img src={loading} alt="loading" width="30px" height="30px" />)}
					</div>
				</Form>
			</main>
		</div>
	);
}
