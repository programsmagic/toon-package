import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export interface FileDropZoneProps {
  onFileLoad: (content: string, filename: string) => void;
  acceptedFormats?: string[];
  children?: React.ReactNode;
}

/**
 * File drop zone component
 */
export function FileDropZone({
  onFileLoad,
  acceptedFormats = ['.json', '.toon', '.csv', '.yaml', '.yml'],
  children,
}: FileDropZoneProps): JSX.Element {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const content = await file.text();
        onFileLoad(content, file.name);
      }
    },
    [onFileLoad]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, ext) => {
      acc[ext] = [];
      return acc;
    }, {} as Record<string, string[]>),
  });

  return (
    <div
      {...getRootProps()}
      className={`toon-file-dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="toon-file-dropzone-content">
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag & drop a file here, or click to select</p>
          )}
        </div>
      )}
    </div>
  );
}

