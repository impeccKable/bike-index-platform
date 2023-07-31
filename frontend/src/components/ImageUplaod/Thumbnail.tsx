import { useState, useEffect } from 'react';
import { ImageModal } from './ImageModal';

interface ThumbnailProps {
	file: string | File;
	index: number;
	handleNext: () => void;
	handlePrev: () => void;
	handleDelete: () => void;
	currentViewing: string | File | null;
	setCurrentViewing: (file: string | File | null) => void;
}

export function Thumbnail(props: ThumbnailProps) {
	const [imageUrl, setImageUrl] = useState('');
	// const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (typeof props.file === 'string') {
			setImageUrl(props.file);
		} else {
			const createdUrl = URL.createObjectURL(props.file);
			setImageUrl(createdUrl);

			return () => {
				URL.revokeObjectURL(createdUrl);
			};
		}
	}, [props.file]);

	function handleImageClick() {
		// setIsModalOpen(true);
		props.setCurrentViewing(props.file);
	}

	function handleCloseModal() {
		// setIsModalOpen(false);
		props.setCurrentViewing(null);
	}

	return (
		<div className="thumbnail">
			<img
				key={props.index}
				src={imageUrl}
				alt={`Image ${props.index}`}
				onClick={handleImageClick}
			/>
			{props.currentViewing === props.file && (
				<ImageModal
					imageUrl={imageUrl}
					index={props.index}
					handleClose={handleCloseModal}
					handleNext={props.handleNext}
					handlePrev={props.handlePrev}
					handleDelete={props.handleDelete}
				/>
			)}
		</div>
	);
}