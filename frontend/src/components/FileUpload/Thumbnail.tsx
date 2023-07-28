import { useState, useEffect } from 'react';

interface ThumbnailProps {
  file: string | File;
  index: number;
}

export function Thumbnail(props: ThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>();

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

  return <img key={props.index} src={imageUrl} alt={`Image ${props.index}`} />
}