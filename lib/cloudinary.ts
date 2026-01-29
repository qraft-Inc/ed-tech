import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  duration?: number;
  width?: number;
  height?: number;
  bytes: number;
}

export interface VideoQuality {
  quality: string;
  url: string;
  bandwidth: number;
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  options: {
    folder?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    transformation?: any;
    publicId?: string;
  } = {}
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'qraft-academy',
      resource_type: options.resourceType || 'auto',
      transformation: options.transformation,
      public_id: options.publicId,
    });

    return {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      resourceType: result.resource_type,
      duration: result.duration,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Upload video with multiple quality variants for low-bandwidth support
 */
export async function uploadVideoWithQualities(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<{
  primary: UploadResult;
  qualities: VideoQuality[];
  thumbnail: string;
}> {
  try {
    // Upload the original video
    const primary = await uploadToCloudinary(file, {
      folder: options.folder || 'qraft-academy/videos',
      resourceType: 'video',
      publicId: options.publicId,
    });

    // Generate different quality URLs
    const qualities: VideoQuality[] = [
      {
        quality: '720p',
        url: cloudinary.url(primary.publicId, {
          resource_type: 'video',
          transformation: [
            { width: 1280, height: 720, crop: 'limit' },
            { quality: 'auto:good', fetch_format: 'auto' },
          ],
        }),
        bandwidth: 2500, // kbps
      },
      {
        quality: '480p',
        url: cloudinary.url(primary.publicId, {
          resource_type: 'video',
          transformation: [
            { width: 854, height: 480, crop: 'limit' },
            { quality: 'auto:good', fetch_format: 'auto' },
          ],
        }),
        bandwidth: 1000,
      },
      {
        quality: '360p',
        url: cloudinary.url(primary.publicId, {
          resource_type: 'video',
          transformation: [
            { width: 640, height: 360, crop: 'limit' },
            { quality: 'auto:low', fetch_format: 'auto' },
          ],
        }),
        bandwidth: 500,
      },
      {
        quality: '240p',
        url: cloudinary.url(primary.publicId, {
          resource_type: 'video',
          transformation: [
            { width: 426, height: 240, crop: 'limit' },
            { quality: 'auto:low', fetch_format: 'auto' },
          ],
        }),
        bandwidth: 250,
      },
    ];

    // Generate thumbnail
    const thumbnail = cloudinary.url(primary.publicId, {
      resource_type: 'video',
      transformation: [
        { width: 640, height: 360, crop: 'fill', gravity: 'auto' },
        { quality: 'auto:best', fetch_format: 'jpg' },
      ],
      format: 'jpg',
    });

    return {
      primary,
      qualities,
      thumbnail,
    };
  } catch (error) {
    console.error('Video upload error:', error);
    throw new Error('Failed to upload video with qualities');
  }
}

/**
 * Upload PDF document
 */
export async function uploadPDF(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<UploadResult> {
  return uploadToCloudinary(file, {
    folder: options.folder || 'qraft-academy/documents',
    resourceType: 'raw',
    publicId: options.publicId,
  });
}

/**
 * Upload audio file
 */
export async function uploadAudio(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<UploadResult> {
  return uploadToCloudinary(file, {
    folder: options.folder || 'qraft-academy/audio',
    resourceType: 'video', // Cloudinary treats audio as video
    publicId: options.publicId,
  });
}

/**
 * Upload image with responsive variants
 */
export async function uploadImage(
  file: string | Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<UploadResult> {
  return uploadToCloudinary(file, {
    folder: options.folder || 'qraft-academy/images',
    resourceType: 'image',
    publicId: options.publicId,
    transformation: [
      { width: 1920, height: 1080, crop: 'limit' },
      { quality: 'auto:best', fetch_format: 'auto' },
    ],
  });
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

/**
 * Generate signed upload URL for client-side uploads
 */
export function generateUploadSignature(
  folder: string,
  resourceType: 'image' | 'video' | 'raw' = 'auto'
): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  resourceType: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder,
    resource_type: resourceType,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    resourceType,
  };
}

export default cloudinary;
