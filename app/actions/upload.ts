'use server';

import cloudinary from '@/lib/cloudinary';

export async function uploadImage(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file uploaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Starting Cloudinary upload...");
    return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'mie_ayam_pak_min' }, // Optional folder
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(new Error(error.message || 'Upload failed'));
                    return;
                }
                console.log("Cloudinary Upload Success:", result?.secure_url);
                resolve(result?.secure_url || '');
            }
        );
        uploadStream.end(buffer);
    });
}
