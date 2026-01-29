'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface CloudinaryUploadProps {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  onSuccess: (result: any) => void;
  onError?: (error: any) => void;
  buttonText?: string;
  accept?: string;
}

export function CloudinaryUpload({
  folder = 'qraft-academy',
  resourceType = 'auto',
  onSuccess,
  onError,
  buttonText = 'Upload File',
  accept,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <CldUploadWidget
      uploadPreset="qraft_academy" // You'll need to create this in Cloudinary dashboard
      options={{
        folder,
        resourceType,
        maxFileSize: resourceType === 'video' ? 100000000 : 10000000, // 100MB for video, 10MB for others
        clientAllowedFormats: accept ? accept.split(',') : undefined,
      }}
      onUpload={(result: any) => {
        setUploading(false);
        if (result.event === 'success') {
          onSuccess(result.info);
        }
      }}
      onError={(error: any) => {
        setUploading(false);
        onError?.(error);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => {
            setUploading(true);
            open();
          }}
          disabled={uploading}
          className="btn btn-outline flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : buttonText}</span>
        </button>
      )}
    </CldUploadWidget>
  );
}
