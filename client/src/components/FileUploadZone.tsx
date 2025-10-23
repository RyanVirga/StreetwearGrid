import { useState, useRef } from 'react';
import { Upload, X, FileImage, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

interface FileUploadZoneProps {
  onFilesChange?: (files: UploadedFile[]) => void;
}

export default function FileUploadZone({ onFilesChange }: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size,
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedFile.preview = e.target?.result as string;
          setFiles(prev => prev.map(f => 
            f.id === uploadedFile.id ? { ...f, preview: uploadedFile.preview } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    console.log('Files added:', newFiles.length);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    console.log('File removed:', id);
  };

  const isVector = (type: string) => {
    return type.includes('svg') || type.includes('ai') || type.includes('eps');
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.svg,.ai,.eps"
        onChange={handleFileInputChange}
        className="hidden"
        data-testid="input-file-hidden"
      />
      <div
        className={`border-2 border-dashed rounded-md p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="dropzone-upload"
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
        <p className="text-sm font-body text-muted-foreground mb-4">
          Supports JPG, PNG, PDF, SVG, AI, EPS
        </p>
        <Button onClick={handleChooseFiles} data-testid="button-upload">
          Choose Files
        </Button>
        <p className="text-xs font-body text-muted-foreground mt-4">
          Tip: Upload transparent PNGs or vector files for best results
        </p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="p-3 relative group" data-testid={`file-preview-${file.id}`}>
              <button
                onClick={() => removeFile(file.id)}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                data-testid={`button-remove-${file.id}`}
              >
                <X className="h-3 w-3" />
              </button>
              
              <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                ) : isVector(file.type) ? (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-body truncate">{file.name}</p>
                {isVector(file.type) && (
                  <Badge variant="secondary" className="text-xs">Vector</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
