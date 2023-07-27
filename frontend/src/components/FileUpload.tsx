import { useState } from 'react';

interface FileUploadProps {
	label: string;
}

export function FileUpload(props: FileUploadProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const maxSize = 1024 * 1024 * 25;
	const fileTypes = ['image/jpeg', 'image/jpg', 'image/png']

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		setUploadedFile(null);
		setErrorMessage(null);
		if (event.target.files) {
			const file = event.target.files[0];

			if (!fileTypes.includes(file.type)) {
				setErrorMessage("Invalid file type");
			} else if (!(file.size <= maxSize)) {
				setErrorMessage("File size is too large");
			} else {
				setUploadedFile(file);
			}
		}
	}

	return (
		<>
			<label>{props.label}</label>
			<button className="file-upload-btn" type="button" onClick={() => setIsModalOpen(true)}>
				＋
			</button>

			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="modal-btn close" onClick={() => setIsModalOpen(false)}>&#215;</span>
						<input type="file" className="file-name" onChange={handleFileChange} />
						<span className="error-message">{errorMessage}</span>
						<button className="confirm" disabled={!!errorMessage || !uploadedFile}>Upload</button>
					</div>
				</div>
			)}
		</>
	);
}
