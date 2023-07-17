import { useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormButton } from "../components/Form";
import axios from "axios";
import { httpClient } from "../services/HttpClient";

export default function DataImport() {
	// const [selectedFile, setSelectedFile] = useState();

	// // @ts-ignore
	// const onFileChange = (e) => {
	// 	console.log(e)
	// 	console.log(e.target)
	// 	console.log(e.target.files)
	// 	console.log(e.target.files[0])
	// 	setSelectedFile(e.target.files[0]);
	// };

	function handleFormSubmit(e: any) {
		e.preventDefault();
		const formData = new FormData();
		// @ts-ignore
		formData.append("file", document.getElementsByName("csvfile")[0].files[0]);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};
		httpClient.post("/dataImport", formData, config)
			.then((response: any) => {
				console.log(response.status);
			});
	}

						// onChange={onFileChange}
	return (
		<div className="data-import-page">
			<Navbar />
			<main>
				<h1>Data Import</h1>
				<Form onSubmit={handleFormSubmit}>
					<p>File select will go here</p>
					<input
						name="csvfile"
						type="file"
						accept=".csv"
					/>
					<div className="form-btns">
						<FormButton type="submit">Submit</FormButton>
					</div>
				</Form>
			</main>
		</div>
	);
}
