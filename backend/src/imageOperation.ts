import multer from 'multer';

export const imageUpload = (uploadedFiles?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }) => {
	if (uploadedFiles) {
		for (const file of [uploadedFiles]) {
			console.log("Uploaded file", file);
		}
	}
}

export const imageDelete = (deletedFile: string[]) => {
	for (const file of deletedFile) {
		console.log("Deleted file", file);
	}
}