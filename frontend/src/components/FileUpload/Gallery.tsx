import { useEffect, useRef } from 'react';

interface GalleryProps {
  files: (string | File)[];
}

export function Gallery({ files }: GalleryProps) {
  const createdUrlsRef = useRef<(string | null)[]>([]);

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [files]);

  return (
    <div className="gallery">
      {files.map((item, index) => {
        if (typeof item === 'string') {
          return <img key={index} src={item} alt={`Image ${index}`} />;
        } else {
          const createdUrl = URL.createObjectURL(item);
          createdUrlsRef.current[index] = createdUrl;
          return <img key={index} src={createdUrl} alt={`Uploaded ${item.name}`} />;
        }
      })}
    </div>
  );
}