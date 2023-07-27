import { useState } from 'react';
import { Gallery } from './Gallery';

interface FileUploadProps {
	label: string;
}

export function FileUpload(props: FileUploadProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<(File | string)[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const maxSize = 1024 * 1024 * 25;
	const fileTypes = ['image/jpeg', 'image/jpg', 'image/png']

	function handleAddButton() {
		setIsModalOpen(true);
		setErrorMessage(null);
		setSelectedFile(null);
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		setErrorMessage(null);
		if (event.target.files) {
			const file = event.target.files[0];

			if (!fileTypes.includes(file.type)) {
				setErrorMessage("Invalid file type");
			} else if (!(file.size <= maxSize)) {
				setErrorMessage("File size is too large");
			} else {
				setSelectedFile(file);
			}
		}
	}

	function handleUpload() {
		if (selectedFile) {
			setUploadedFiles(prevFiles => [...prevFiles, selectedFile]);
			setIsModalOpen(false);
		}
	}

	return (
		<>
			<label>{props.label}</label>
			<Gallery files={uploadedFiles} />
			<button className="file-upload-btn" type="button" onClick={handleAddButton}>
				＋
			</button>

			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="modal-btn close" onClick={() => setIsModalOpen(false)}>&#215;</span>
						<input type="file" className="file-name" onChange={handleFileChange} />
						<span className="error-message">{errorMessage}</span>
						<button className="confirm" disabled={!!errorMessage || !selectedFile} onClick={handleUpload}>Upload</button>
					</div>
				</div>
			)}
		</>
	);
}
