import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, Link as LinkIcon, Star } from 'lucide-react';
import { compressMultipleImages } from '../../utils/imageOptimizer';

export const ImageUploader = ({ images = [], onChange, maxImages = 6 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setErrorMsg('');
    setIsProcessing(true);

    try {
      const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (validFiles.length === 0) {
        setErrorMsg('Please select valid image files (JPG, PNG, WebP).');
        setIsProcessing(false);
        return;
      }

      const availableSlots = maxImages - images.length;
      if (availableSlots <= 0) {
        setErrorMsg(`Maximum of ${maxImages} images reached.`);
        setIsProcessing(false);
        return;
      }

      const filesToProcess = validFiles.slice(0, availableSlots);
      const base64Images = await compressMultipleImages(filesToProcess, 800, 800, 0.82);

      onChange([...images, ...base64Images]);
    } catch (err) {
      console.error("Error processing images:", err);
      setErrorMsg('Failed to process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    const target = images[indexToPrimary];
    const filtered = images.filter((_, idx) => idx !== indexToPrimary);
    onChange([target, ...filtered]);
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setErrorMsg(`Maximum of ${maxImages} images reached.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Upload Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-terracotta-500 bg-terracotta-50/50 scale-[0.99]'
            : 'border-cream-300 hover:border-terracotta-400 bg-cream-50/40 hover:bg-cream-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-soft border border-cream-200 flex items-center justify-center text-terracotta-500">
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-walnut-800">
              {isProcessing ? 'Optimizing & Compressing Images...' : 'Click to upload or drag & drop craft photography'}
            </p>
            <p className="text-xs text-walnut-500">
              Auto-compressed to Base64 for instant localStorage storage (JPG, PNG, WebP up to 10MB)
            </p>
          </div>

          <div className="pt-1">
            <span className="text-xs font-medium text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200">
              {images.length} / {maxImages} images uploaded
            </span>
          </div>
        </div>
      </div>

      {/* Alternative URL button */}
      <div className="flex items-center justify-between text-xs text-walnut-500">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-terracotta-600 hover:underline flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL input' : 'Or enter image web URL'}</span>
        </button>
        <span>First image will be the primary cover</span>
      </div>

      {/* URL input field if toggled */}
      {showUrlInput && (
        <div className="flex gap-2 animate-fade-in">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-4 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:border-terracotta-500"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-walnut-800 hover:bg-walnut-900 text-white rounded-xl text-xs font-semibold"
          >
            Add URL
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Image Previews Thumbnails Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-walnut-700 uppercase tracking-wider">
            Image Gallery Previews ({images.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="relative aspect-square rounded-2xl overflow-hidden border border-cream-300 bg-white shadow-xs group"
              >
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {idx === 0 && (
                  <span className="absolute top-2 left-2 bg-terracotta-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-white" /> Primary
                  </span>
                )}

                <div className="absolute inset-0 bg-walnut-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="p-1.5 bg-white/90 hover:bg-white text-walnut-800 rounded-full text-xs"
                      title="Make primary cover"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs shadow-xs"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
