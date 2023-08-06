import { useState, useEffect } from 'react';
import { ImageModal } from './FileModal';
import pdfIcon from '../../assets/pdf.png';
import docIcon from '../../assets/doc.png';
import txtIco from '../../assets/txt.png';
import xlsIcon from '../../assets/xls.png';


interface ThumbnailProps {
	file: string | File;
	index: number;
	isLoading: boolean;
	handleNext: () => void;
	handlePrev: () => void;
	handleDelete: () => void;
	currentViewing: string | File | null;
	setCurrentViewing: (file: string | File | null) => void;
}

const fileTypeIcons = {
	'application/pdf': pdfIcon,
	'text/plain': txtIco,
	'application/msword': docIcon,
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': docIcon,
	'application/vnd.ms-excel': xlsIcon,
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': xlsIcon,
};


// this component is responsible for displaying a single thumbnail image
// and also takes care of displaying the ImageModal when a thumbnail is clicked
export function Thumbnail(props: ThumbnailProps) {
	const [imageUrl, setImageUrl] = useState('');
	const [icon, setIcon] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (typeof props.file === 'string') {
			setImageUrl(props.file);
		} else {
			const fileType = fileTypeIcons[props.file.type as keyof typeof fileTypeIcons];
			if (fileType) {
				setIcon(fileType);
			}
			const createdUrl = URL.createObjectURL(props.file);
			setImageUrl(createdUrl);

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
				className="thumbnail"
				key={props.index}
				src={icon !== undefined ? icon : imageUrl}
				onClick={handleImageClick}
			/>
			{props.currentViewing === props.file && !props.isLoading && (
				<ImageModal
					imageUrl={imageUrl}
					handleClose={handleCloseModal}
					handleNext={props.handleNext}
					handlePrev={props.handlePrev}
					handleDelete={props.handleDelete}
					icon={icon}
				/>
			)}
		</div>
	);
}
