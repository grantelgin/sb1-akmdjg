import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormData } from '../types';

interface Props {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function UploadImages({ formData, onComplete }: Props) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [receiptPreviews, setReceiptPreviews] = useState<string[]>([]);

  const onDropImages = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setImagePreviews((prev) => [...prev, ...newImages.map(file => file.preview)]);
  }, []);

  const onDropReceipts = useCallback((acceptedFiles: File[]) => {
    const newReceipts = acceptedFiles.map((file) => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setReceiptPreviews((prev) => [...prev, ...newReceipts.map(file => file.preview)]);
  }, []);

  const { getRootProps: getRootPropsImages, getInputProps: getInputPropsImages } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: onDropImages
  });

  const { getRootProps: getRootPropsReceipts, getInputProps: getInputPropsReceipts } = useDropzone({
    accept: { 'image/*': [], 'application/pdf': [] },
    onDrop: onDropReceipts
  });

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveReceipt = (index: number) => {
    setReceiptPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log('Submitting:', { images: imagePreviews, receipts: receiptPreviews });
    onComplete({ images: imagePreviews, receipts: receiptPreviews });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Upload Damage Images</h3>
        <div {...getRootPropsImages()} className="border-2 border-dashed border-gray-300 p-6 rounded-md cursor-pointer">
          <input {...getInputPropsImages()} />
          <p className="text-center text-gray-500">Drag 'n' drop some files here, or click to select files</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
              <button 
                onClick={() => handleRemoveImage(index)} 
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Upload Receipts</h3>
        <div {...getRootPropsReceipts()} className="border-2 border-dashed border-gray-300 p-6 rounded-md cursor-pointer">
          <input {...getInputPropsReceipts()} />
          <p className="text-center text-gray-500">Drag 'n' drop some files here, or click to select files</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {receiptPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-md" />
              <button 
                onClick={() => handleRemoveReceipt(index)} 
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}