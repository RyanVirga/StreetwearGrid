import FileUploadZone from '../FileUploadZone';

export default function FileUploadZoneExample() {
  return (
    <div className="p-8 max-w-2xl">
      <FileUploadZone onFilesChange={(files) => console.log('Files changed:', files)} />
    </div>
  );
}
