'use server';

import cloudinary from '@/lib/cloudinary';

type UploadResult =
    | { success: true; url: string }
    | { success: false; error: string };

export async function uploadImage(formData: FormData): Promise<UploadResult> {
    const file = formData.get('file') as File;

    if (!file) {
        return { success: false, error: 'No file uploaded' };
    }

    // Check configuration
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
        console.error("Cloudinary config missing");
        return {
            success: false,
            error: 'Server Misconfiguration: Cloudinary keys are missing in .env.local'
        };
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Starting Cloudinary upload...");
        return new Promise<UploadResult>((resolve) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'mie_ayam_pak_min' }, // Optional folder
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        resolve({
                            success: false,
                            error: error.message || 'Upload failed at Cloudinary'
                        });
                        return;
                    }
                    console.log("Cloudinary Upload Success:", result?.secure_url);
                    resolve({
                        success: true,
                        url: result?.secure_url || ''
                    });
                }
            );
            uploadStream.end(buffer);
        });
    } catch (err) {
        console.error("Server Upload Error:", err);
        return {
            success: false,
            error: (err as Error).message || 'Internal Server Error during upload'
        };
    }
}
