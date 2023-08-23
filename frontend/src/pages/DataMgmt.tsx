import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Form, FormButton } from "../components/Form";
import { httpClient } from "../services/HttpClient";
import LoadingIcon from '../components/LoadingIcon';
import { useAuth } from "../services/AuthProvider";

export default function DataMgmt() {
	const [newDataCnts, setNewDataCnts]: any = useState(null);
	const [isFileSelected, setIsFileSelected] = useState(false);
	const [isLoadingImport, setIsLoadingImport] = useState(false);
	const [isLoadingExport, setIsLoadingExport] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if(!user) return;
		if (user?.bikeIndex.role !== "admin") {
			navigate("/thieves");
		}
	}, [user]);

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
			const date = new Date();
			const filename = `Thief data ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.csv`;
			download(filename, response.data);
			setIsLoadingExport(false);
		} catch (error) {
			setIsLoadingExport(false);
			throw error;
		}
	}

	function download(filename: string, text: string) {
		var blob = new Blob([text], { type: "text/plain" });
		var a = document.createElement("a");
		a.href = window.URL.createObjectURL(blob);
		a.download = filename;
		a.click();
	}

	function handleSelectFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		setNewDataCnts(null);
		setIsFileSelected(!event.target || !event.target.files || event.target.files.length === 0 ? false : true);
	}

	return (
		<div className="formal data-page">
			<Navbar />
			<main>
				<h1>Data Management</h1>
				<h3>Import data from .csv</h3>
				<Form onSubmit={handleImport}>
					<input name="csvfile" type="file" accept=".csv" onChange={handleSelectFileChange} />
					<div className="form-btns">
						<FormButton type="submit" disabled={!isFileSelected}>Upload</FormButton>
						<LoadingIcon when={isLoadingImport} />
					</div>
				</Form>
				{newDataCnts && (<>
					<br />
					<div>
						<h3>Received:</h3>
						<table>
							<tbody>
								<tr><td>Rows   </td><td>{newDataCnts.rowCnt  }</td></tr>
								<tr><td>Items  </td><td>{newDataCnts.dataCnt }</td></tr>
								<tr><td>Thieves</td><td>{newDataCnts.thiefCnt}</td></tr>
							</tbody>
						</table>
						<h3>New unique data:</h3>
						<table>
							<tbody>
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
				</>)}
				<br />
				<br />
				<h3>Export all thief data to .csv</h3>
				<Form onSubmit={handleExport}>
					<div className="form-btns">
						<FormButton type="submit">Download</FormButton>
						<LoadingIcon when={isLoadingExport}/>
					</div>
				</Form>
			</main>
		</div>
	);
}
