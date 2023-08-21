import { useState, useEffect } from 'react';
import { ImageModal } from './ImageModal';

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

// this component is responsible for displaying a single thumbnail image
// and also takes care of displaying the ImageModal when a thumbnail is clicked
export function Thumbnail(props: ThumbnailProps) {
	const [imageUrl, setImageUrl] = useState('');

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
				className={`thumbnail${props.isNew?' red-bordered':''}`}
				key={props.index}
				src={imageUrl}
				onClick={handleImageClick}
			/>
			{props.currentViewing === props.file && !props.isLoading && (
				<ImageModal
					imageUrl={imageUrl}
					handleClose={handleCloseModal}
					handleNext={props.handleNext}
					handlePrev={props.handlePrev}
					handleDelete={props.handleDelete}
				/>
			)}
		</div>
	);
}
