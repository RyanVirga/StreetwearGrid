import { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import FileUploadZone from "@/components/FileUploadZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";
import type { MerchRequest } from "@shared/schema";

export default function UploadFiles() {
  const [, params] = useRoute("/upload-files/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const requestId = params?.id;
  const [newFiles, setNewFiles] = useState<Array<{ id: string; name: string; type: string; size: number; preview?: string }>>([]);

  useEffect(() => {
    if (!requestId) {
      setLocation("/");
    }
  }, [requestId, setLocation]);
  
  const { data: request, isLoading } = useQuery<MerchRequest>({
    queryKey: [`/api/requests/${requestId}`],
    enabled: !!requestId,
  });

  const addFilesMutation = useMutation({
    mutationFn: async (files: Array<{ id: string; name: string; type: string; size: number; preview?: string }>) => {
      const response = await apiRequest("POST", `/api/requests/${requestId}/files`, files);
      const data = await response.json();
      return data as MerchRequest;
    },
    onSuccess: () => {
      toast({
        title: "Files Added!",
        description: "Your files have been successfully added to the request.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/requests/${requestId}`] });
      setNewFiles([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add files. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (newFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }
    addFilesMutation.mutate(newFiles);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-center text-muted-foreground">Loading request...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find a request with ID: {requestId}
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href={`/thank-you?id=${requestId}`} data-testid="link-back">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Request
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Add More Files</h1>
          <p className="text-lg font-body text-muted-foreground mb-4">
            Upload additional artwork or reference files to your request
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-body text-muted-foreground">Request ID:</span>
            <Badge variant="secondary" data-testid="badge-request-id">{requestId}</Badge>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Current Files</h3>
          {request.files && request.files.length > 0 ? (
            <div className="space-y-2">
              {request.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-body">{file.name}</span>
                  <Badge variant="secondary" className="text-xs ml-auto">
                    {Math.round(file.size / 1024)} KB
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No files uploaded yet</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Upload New Files</h3>
          <FileUploadZone onFilesChange={setNewFiles} />
          
          <div className="flex justify-end gap-3 mt-6">
            <Link href={`/thank-you?id=${requestId}`}>
              <Button variant="outline" data-testid="button-cancel">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={addFilesMutation.isPending || newFiles.length === 0}
              data-testid="button-submit"
            >
              {addFilesMutation.isPending ? 'Uploading...' : `Add ${newFiles.length} File${newFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
