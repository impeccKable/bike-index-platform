import { useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormButton } from "../components/Form";
import axios from "axios";

export default function DataImport() {
	const [selectedFile, setSelectedFile] = useState();

	// @ts-ignore
	const onFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	function handleFormSubmit(e: any) {
		const formData = new FormData();

		// @ts-ignore
		formData.append("file", selectedFile);
		// @ts-ignore
		formData.append("fileName", selectedFile.name);

		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		axios
			.post("localhost:3000/fileUpload", formData, config)
			.then((response) => {
				console.log(response.status);
			});

		e.preventDefault();
		console.log(e);
	}

	return (
		<div className="data-import-page">
			<Navbar />
			<main>
				<h1 className="title2">Data Import</h1>
				<Form onSubmit={handleFormSubmit}>
					<p>File select will go here</p>
					<input
						type="file"
						accept=".csv, .tsv"
						onChange={onFileChange}
					/>
					<div className="btn-group">
						<FormButton type="submit">Submit</FormButton>
					</div>
				</Form>
			</main>
		</div>
	);
}
