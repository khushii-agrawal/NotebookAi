import { useRef, useState } from "react";
import { X } from "lucide-react";

type Props = {
  onFilesSelected: (files: File[]) => void;
};

const FileUpload = ({ onFilesSelected }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const openFileManager = () => {
    inputRef.current?.click();
  };

  const addFiles = (newFiles: FileList) => {
    const fileArray = Array.from(newFiles);
    setFiles((prev) => [...prev, ...fileArray]);
    onFilesSelected(fileArray);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border border-dashed border-gray-300 dark:border-gray-600
                 rounded-xl p-8 bg-gray-50 dark:bg-gray-900 transition"
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            addFiles(e.target.files);
          }
        }}
      />

      {/* Upload UI */}
      <div className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900
                        flex items-center justify-center text-purple-600 text-xl">
          ⬆️
        </div>

        <h3 className="font-medium text-gray-800 dark:text-gray-100">
          Upload sources
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Drag & drop or{" "}
          <button
            onClick={openFileManager}
            className="text-purple-600 font-medium hover:underline"
          >
            choose file
          </button>
        </p>

        <p className="text-xs text-gray-400 mt-3">
          PDF, DOCX, TXT, Images (OCR supported)
        </p>
      </div>

      {/* ✅ Selected Files List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         rounded-lg px-3 py-2 text-sm"
            >
              <div className="truncate">
                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
