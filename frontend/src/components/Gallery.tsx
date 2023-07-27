interface GalleryProps {
  files: (string | File)[];
}

export function Gallery({ files }: GalleryProps) {
  return (
    <div className="gallery">
      {files.map((item, index) => {
        if (typeof item === 'string') {
          return <img key={index} src={item} alt={`Image ${index}`} />;
        } else {
          const createdUrl = URL.createObjectURL(item);
          return <img key={index} src={createdUrl} alt={`Uploaded ${item.name}`} />;
        }
      })}
    </div>
  );
}