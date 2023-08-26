import { useState, useEffect } from 'react';
import { FileModal } from './FileModal';
import pdfIcon from '../../assets/pdf.png';
import docIcon from '../../assets/doc.png';
import txtIco from '../../assets/txt.png';
import xlsIcon from '../../assets/xls.png';
import { extractObjectKeyForS3Deletion } from './FileUpload';


interface ThumbnailProps {
	file: string | File;
	index: number;
	isNew?: boolean;
	isLoading: boolean;
	handleNext: () => void;
	handlePrev: () => void;
	handleDelete: () => void;
	currentViewing: string | File | null;
	setCurrentViewing: (file: string | File | null) => void;
}

const fileTypeIcons = {
	'application/pdf': pdfIcon,
	'pdf': pdfIcon,
	'text/plain': txtIco,
	'txt': txtIco,
	'application/msword': docIcon,
	'doc': docIcon,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': docIcon,
	'docx': docIcon,
	'application/vnd.ms-excel': xlsIcon,
	'xls': xlsIcon,
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': xlsIcon,
	'xlsx': xlsIcon,
};

function extractFileExtension(fileNameOrUrl: string): string | undefined {
	return new URL(fileNameOrUrl).pathname.slice(1).split('.').pop()?.toLowerCase();
}

function getIconForFileType(file: string | File): string | undefined {
	if (typeof file === 'string') {
		const extension = extractFileExtension(file);
		return fileTypeIcons[extension as keyof typeof fileTypeIcons];
	} else {
		return fileTypeIcons[file.type as keyof typeof fileTypeIcons];
	}
}

function extractFileName(fileName: string): string {
	const parts = fileName.split('/');
	let name = parts[parts.length - 1];
	const extension = name.split('.').pop();
	name = name.replace(/-[^-]*$/, '');
  return `${name}.${extension}`;
}

// this component is responsible for displaying a single thumbnail image
// and also takes care of displaying the ImageModal when a thumbnail is clicked
export function Thumbnail(props: ThumbnailProps) {
	const [imageUrl, setImageUrl] = useState('');
	const [icon, setIcon] = useState<string | undefined>(undefined);
	const [fileName, setFileName] = useState('');

	useEffect(() => {
		if (typeof props.file === 'string') {
			setImageUrl(props.file);
			setIcon(getIconForFileType(props.file))
			setFileName(extractFileName(extractObjectKeyForS3Deletion(props.file)));
		} else {
			setFileName(extractFileName(props.file.name));
			const createdUrl = URL.createObjectURL(props.file);
			setImageUrl(createdUrl);
			setIcon(getIconForFileType(props.file))

			return () => {
				URL.revokeObjectURL(createdUrl);
			};
		}
	}, [props.file]);

	// handler for clicking the thumbnail image
	function handleImageClick() {
		props.setCurrentViewing(props.file);
	}

	// handler for closing the ImageModal
	function handleCloseModal() {
		props.setCurrentViewing(null);
	}

	// returns a thumbnail image and an ImageModal if the current file is being viewed
	return (
		<div>
			<img
				className={`thumbnail ${props.isNew ? ' red-bordered' : ''}`}
				key={props.index}
				src={icon !== undefined ? icon : imageUrl}
				onClick={handleImageClick}
			/>
			{props.currentViewing === props.file && !props.isLoading && (
				<FileModal
					imageUrl={imageUrl}
					handleClose={handleCloseModal}
					handleNext={props.handleNext}
					handlePrev={props.handlePrev}
					handleDelete={props.handleDelete}
					icon={icon}
					fileName={fileName}
				/>
			)}
		</div>
	);
}
