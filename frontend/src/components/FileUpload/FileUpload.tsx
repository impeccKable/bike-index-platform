import { useState } from 'react';
import { Thumbnail } from './Thumbnail';

interface FileUploadProps {
	label: string;
	handleImageFilesChanged: (file: (File | string)[])	 => void;
}

export function FileUpload(props: FileUploadProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<(File | string)[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [currentViewing, setCurrentViewing] = useState<File | string | null>(null); 
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

	function handleNext(index: number) {
		const next = (index + 1) % uploadedFiles.length;
		setCurrentViewing(uploadedFiles[next]);
	}

	function handlePrev(index: number) {
		const prev = (index - 1 + uploadedFiles.length) % uploadedFiles.length;
		setCurrentViewing(uploadedFiles[prev]);
	}

	function handleUpload() {
		if (selectedFile) {
			setUploadedFiles(prevFiles => {
				const newFileList = [...prevFiles, selectedFile];
				props.handleImageFilesChanged(newFileList);
				return newFileList;
			});
			setIsModalOpen(false);
		}
	}

	function handleDelete(index: number) {
		setUploadedFiles(prevFiles => {
			const newFileList = [...prevFiles];
			newFileList.splice(index, 1);
			props.handleImageFilesChanged(newFileList);
			return newFileList;
		});
		setCurrentViewing(null);
	}

	return (
		<>
			<label>{props.label}</label>
			<div className="upload-file-field">
				{uploadedFiles.map((item, index) => ( <Thumbnail key={index} file={item} index={index} handleNext={() => handleNext(index)}
					handlePrev={() => handlePrev(index)} handleDelete={() => handleDelete(index)} currentViewing={currentViewing} setCurrentViewing={setCurrentViewing} /> ))}
				<button className={`file-upload-btn ${uploadedFiles.length > 0 ? 'expanded' : ''}`} type="button" onClick={handleAddButton}>
					＋
				</button>
			</div>

			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<span className="modal-btn close" onClick={() => setIsModalOpen(false)}>&#215;</span>
						<input type="file" className="file-name" onChange={handleFileChange} />
						<span className="error-message">{errorMessage}</span>
						<button type="button" className="confirm" disabled={!!errorMessage || !selectedFile} onClick={handleUpload}>Upload</button>
					</div>
				</div>
			)}
		</>
	);
}
