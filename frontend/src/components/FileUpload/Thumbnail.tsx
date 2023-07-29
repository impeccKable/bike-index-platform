import { useState, useEffect } from 'react';
import { ImageModal } from './ImageModal';

interface ThumbnailProps {
  file: string | File;
  index: number;
}

export function Thumbnail(props: ThumbnailProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="thumbnail">
      <img key={props.index} src={imageUrl} alt={`Thumbnail ${props.index}`} onClick={handleImageClick} />
      {isModalOpen && <ImageModal imageUrl={imageUrl} handleClose={handleCloseModal} />}
    </div>
  )
}