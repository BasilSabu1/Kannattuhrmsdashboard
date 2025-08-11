import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { Download, Filter, Search, Calendar as CalendarIcon, Users, FileText, Clock, CheckCircle, Eye, FolderOpen, Image, File, Loader2, AlertCircle, ZoomIn, ZoomOut, RotateCw, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { API_URLS } from "@/components/apiconfig/api_urls";
import axiosInstance from "@/components/apiconfig/axios";

interface ApplicationDocument {
  document_type: string;
  image: string;
  original_filename: string;
  file_size: number;
  uploaded_at: string;
}

import JSZip from 'jszip';


interface SellerDetails {
  id: number;
  address_line: string;
  village: string;
  post_office: string;
  panchayat: string;
  municipality: string;
  taluk: string;
  district: string;
  state: string;
  pin_code: string;
  place: string;
}

interface EducationEmployment {
  id: number;
  highest_qualification: string;
  aadhaar_number: string;
  pan_number: string;
  previous_employer: string;
  experience_years: string;
  joining_date: string;
  branch: string;
  designation: string;
}

interface DocumentUploads {
  title: string | null;
  created_at: string;
  updated_at: string;
  images: ApplicationDocument[];
}

interface OnboardingApplication {
  uuid: string;
  application_id: string;
  full_name: string;
  father_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  blood_group: string;
  mobile_number: string;
  email: string;
  emergency_contact_number: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  seller_details: SellerDetails[];
  education_employment: EducationEmployment | null;
  document_uploads: DocumentUploads | null;
}

interface ApiResponse {
  code: number;
  message: string;
  data: OnboardingApplication[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  status_summary: {
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
  };
}

export function OnboardingDashboard() {
  const [applications, setApplications] = useState<OnboardingApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [previewDocument, setPreviewDocument] = useState<ApplicationDocument | null>(null);
  const [imageTransform, setImageTransform] = useState({ zoom: 1, rotation: 0 });
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState(""); // For immediate UI updates
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [allBranches, setAllBranches] = useState<string[]>([]); // New state for all available branches

  // Fetch all branches for the dropdown (runs only once on mount)
  const fetchAllBranches = async () => {
    try {
      const response = await axiosInstance.get(`${API_URLS.USERS.GET_USERS}?limit=1000`);
      const allApplications = response.data.data;
      const branches = [...new Set(allApplications.map((app: OnboardingApplication) => app.education_employment?.branch).filter(Boolean))] as string[];
      setAllBranches(branches);
    } catch (err) {
      console.error('Error fetching all branches:', err);
      // Fallback to empty array if fetch fails
      setAllBranches([]);
    }
  };

  // Fetch all branches on component mount
  useEffect(() => {
    fetchAllBranches();
  }, []);

  // Build query parameters for API call
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Pagination
    params.append('page', currentPage.toString());
    params.append('limit', pageSize.toString());

    // Search - only support full_name parameter
    if (debouncedSearch.trim()) {
      params.append('full_name', debouncedSearch.trim());
    }

    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }

    if (departmentFilter !== 'all') {
      params.append('branch', departmentFilter);
    }

    // Fix date parameters to match your API
    if (dateFrom) {
      params.append('start_date', format(dateFrom, 'yyyy-MM-dd'));
    }

    if (dateTo) {
      params.append('end_date', format(dateTo, 'yyyy-MM-dd'));
    }

    return params.toString();
  };





  // Fetch applications from API with filters
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = buildQueryParams();
        const response = await axiosInstance.get(`${API_URLS.USERS.GET_USERS}?${queryParams}`);

        setApiResponse(response.data);
        setApplications(response.data.data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentPage, pageSize, debouncedSearch, statusFilter, departmentFilter, dateFrom, dateTo]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);


  const handleSearchInput = useCallback((value: string) => {
    setSearchInput(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // 5. Update the handleStatusFilter and handleDepartmentFilter with useCallback
  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleDepartmentFilter = useCallback((department: string) => {
    setDepartmentFilter(department);
    setCurrentPage(1);
  }, []);

  const handleDateFilter = useCallback((from?: Date, to?: Date) => {
    setDateFrom(from);
    setDateTo(to);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  }, []);

  const resetImageTransform = () => {
    setImageTransform({ zoom: 1, rotation: 0 });
  };

  const handleImageTransform = (action: 'zoomIn' | 'zoomOut' | 'rotate') => {
    setImageTransform(prev => {
      switch (action) {
        case 'zoomIn':
          return { ...prev, zoom: Math.min(prev.zoom + 0.2, 3) };
        case 'zoomOut':
          return { ...prev, zoom: Math.max(prev.zoom - 0.2, 0.5) };
        case 'rotate':
          return { ...prev, rotation: (prev.rotation + 90) % 360 };
        default:
          return prev;
      }
    });
  };




  const handleDownload = (downloadFormat: string) => {
    const dataToDownload = applications.map(app => ({
      'Application ID': app.application_id,
      'Employee Name': app.full_name,
      'Email': app.email,
      'Branch': app.education_employment?.branch || 'N/A',
      'Position': app.education_employment?.designation || 'N/A',
      'Status': app.status,
      'Submitted Date': format(new Date(app.created_at), "MM/dd/yyyy"),
      'Documents Count': app.document_uploads?.images.length || 0,
      'Blood Group': app.blood_group,
      'Mobile': `'${app.mobile_number}`, // Add single quote prefix to prevent scientific notation
    }));

    if (downloadFormat === 'excel') {
      downloadExcel(dataToDownload);
    }

    toast({
      title: `Download Started`,
      description: `Exporting ${applications.length} records in Excel format.`,
    });
  };

  const isPDFDocument = (doc: ApplicationDocument) => {
    return doc.original_filename.toLowerCase().endsWith('.pdf') ||
      doc.document_type.toLowerCase().includes('pdf');
  };

  const downloadExcel = (data: any[]) => {
    if (data.length === 0) return;

    // Create headers row
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');

    // Create data rows with proper CSV formatting
    const dataRows = data.map(row =>
      headers.map(header => {
        const value = row[header];

        // Handle null/undefined values
        if (value === null || value === undefined) {
          return '';
        }

        // Convert to string
        const stringValue = String(value);

        // For mobile numbers specifically, ensure they're treated as text
        if (header === 'Mobile' && stringValue.startsWith("'")) {
          // Already prefixed with quote, wrap in quotes and escape
          return `"${stringValue}"`;
        }

        // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      }).join(',')
    );

    // Combine headers and data
    const csvContent = [headerRow, ...dataRows].join('\n');

    // Add BOM for proper Excel UTF-8 support
    const BOM = '\uFEFF';

    // Create and download the file
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onboarding-applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadDocument = async (doc: ApplicationDocument) => {
    try {
      const response = await fetch(doc.image);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.original_filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Document Downloaded",
        description: `${doc.original_filename} has been downloaded.`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the document. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Add this import at the top of your file (you'll need to install jszip)

  // Replace the existing downloadAllDocuments function with this updated version
  const downloadAllDocuments = async (applicationId: string) => {
    const app = applications.find(a => a.application_id === applicationId);
    if (!app || !app.document_uploads || app.document_uploads.images.length === 0) return;

    try {
      // Show loading toast
      toast({
        title: "Preparing Download",
        description: `Preparing ${app.document_uploads.images.length} documents for download...`,
      });

      const zip = new JSZip();
      const folderName = `${app.full_name.replace(/[^a-zA-Z0-9]/g, '_')}_${applicationId}_Documents`;
      const folder = zip.folder(folderName);

      let successCount = 0;
      let failedFiles: string[] = [];

      // Download documents one by one with retry logic
      for (let index = 0; index < app.document_uploads.images.length; index++) {
        const doc = app.document_uploads.images[index];

        try {
          // Update progress
          toast({
            title: "Downloading...",
            description: `Processing ${index + 1} of ${app.document_uploads.images.length} documents...`,
          });

          // Retry logic for each file
          let blob: Blob | null = null;
          let attempts = 0;
          const maxAttempts = 3;

          while (attempts < maxAttempts && !blob) {
            try {
              const response = await fetch(doc.image, {
                method: 'GET',
                headers: {
                  'Accept': '*/*',
                },
                mode: 'cors',
              });

              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }

              blob = await response.blob();

              // Validate that we actually got content
              if (blob.size === 0) {
                throw new Error('Empty file received');
              }

            } catch (fetchError) {
              attempts++;
              console.warn(`Attempt ${attempts} failed for ${doc.original_filename}:`, fetchError);

              if (attempts < maxAttempts) {
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
              }
            }
          }

          if (blob) {
            // Create a safe filename
            let filename = doc.original_filename;
            if (!filename || filename.trim() === '') {
              const extension = doc.image.split('.').pop() || 'jpg';
              filename = `${formatDocumentType(doc.document_type)}_${index + 1}.${extension}`;
            }

            // Ensure filename is safe for zip and unique
            filename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

            // Check if filename already exists and make it unique
            let finalFilename = filename;
            let counter = 1;
            while (folder?.file(finalFilename)) {
              const lastDotIndex = filename.lastIndexOf('.');
              if (lastDotIndex > 0) {
                const name = filename.substring(0, lastDotIndex);
                const extension = filename.substring(lastDotIndex);
                finalFilename = `${name}_${counter}${extension}`;
              } else {
                finalFilename = `${filename}_${counter}`;
              }
              counter++;
            }

            folder?.file(finalFilename, blob);
            successCount++;

            console.log(`Successfully added to zip: ${finalFilename} (${blob.size} bytes)`);
          } else {
            failedFiles.push(doc.original_filename || `Document ${index + 1}`);
            console.error(`Failed to download after ${maxAttempts} attempts: ${doc.original_filename}`);
          }

        } catch (error) {
          failedFiles.push(doc.original_filename || `Document ${index + 1}`);
          console.error(`Failed to process document: ${doc.original_filename}`, error);
        }

        // Small delay between downloads to avoid overwhelming the server
        if (index < app.document_uploads.images.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      if (successCount === 0) {
        toast({
          title: "Download Failed",
          description: "No documents could be downloaded. Please check your internet connection and try again.",
          variant: "destructive"
        });
        return;
      }

      // Show final preparation message
      toast({
        title: "Finalizing ZIP",
        description: `Creating ZIP file with ${successCount} documents...`,
      });

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      });

      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show completion message
      let message = `Successfully downloaded ${successCount} of ${app.document_uploads.images.length} documents for ${app.full_name} as a ZIP file.`;
      if (failedFiles.length > 0) {
        message += ` ${failedFiles.length} files failed to download: ${failedFiles.join(', ')}`;
      }

      toast({
        title: "Download Complete",
        description: message,
        variant: failedFiles.length > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Bulk download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to create ZIP file. Please try downloading documents individually.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary", // Gray color for pending
      approved: "default", // Green color for approved (using default which is typically green)
      rejected: "destructive", // Red color for rejected
      "under_review": "outline" // Blue outline for under review
    } as const;

    // Custom styling for better color distinction
    const customStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      "under_review": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
    } as const;

    const statusKey = status as keyof typeof variants;

    return (
      <Badge
        variant={variants[statusKey] || "secondary"}
        className={customStyles[statusKey] || ""}
      >
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getDocumentIcon = (type: string, filename: string = '') => {
    const isPDF = filename.toLowerCase().endsWith('.pdf') || type.toLowerCase().includes('pdf');

    if (isPDF) {
      return <FileText className="h-4 w-4" />;
    }

    if (type.includes('image') || ['passport', 'aadhaar_front', 'aadhaar_back', 'voter_id', 'pan', 'cibil_report', 'police_clearance', 'experience', 'pg'].includes(type)) {
      return <Image className="h-4 w-4" />;
    }

    return <File className="h-4 w-4" />;
  };
  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isImageDocument = (doc: ApplicationDocument) => {
    return doc.document_type.includes('image') ||
      ['passport', 'aadhaar_front', 'aadhaar_back', 'voter_id', 'pan', 'cibil_report', 'police_clearance', 'experience', 'pg'].includes(doc.document_type) ||
      doc.original_filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);
  };

  const DocumentPreviewModal = () => {
    if (!previewDocument) return null;

    const isImage = previewDocument.document_type.includes('image') ||
      ['passport', 'aadhaar_front', 'aadhaar_back', 'voter_id', 'pan', 'cibil_report', 'police_clearance', 'experience', 'pg'].includes(previewDocument.document_type) ||
      previewDocument.original_filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);

    return (
      <Dialog open={!!previewDocument} onOpenChange={() => {
        setPreviewDocument(null);
        resetImageTransform();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {previewDocument.original_filename}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {formatDocumentType(previewDocument.document_type)} •
                  Uploaded: {format(new Date(previewDocument.uploaded_at), "MMM dd, yyyy")} •
                  Size: {(previewDocument.file_size / 1024).toFixed(1)} KB
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {isImage && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageTransform('zoomOut')}
                      disabled={imageTransform.zoom <= 0.5}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageTransform('zoomIn')}
                      disabled={imageTransform.zoom >= 3}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageTransform('rotate')}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument(previewDocument)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 p-6 pt-4 overflow-auto">
            <div className="flex items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
              {isImage ? (
                <div className="relative overflow-auto max-w-full max-h-[60vh] flex items-center justify-center">
                  <img
                    src={previewDocument.image}
                    alt={previewDocument.original_filename}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: `scale(${imageTransform.zoom}) rotate(${imageTransform.rotation}deg)`,
                      transformOrigin: 'center',
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    onError={(e) => {
                      console.error('Image failed to load:', previewDocument.image);
                      const target = e.target as HTMLImageElement;
                      const container = target.parentElement;
                      if (container) {
                        container.innerHTML = `
                          <div class="flex flex-col items-center justify-center p-8 text-muted-foreground">
                            <svg class="h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p class="text-lg font-medium">Image Preview Failed</p>
                            <p class="text-sm mb-4">Unable to load the image. Click download to view the document.</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <FileText className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Document Preview</p>
                  <p className="text-sm mb-4">Preview not available for this file type</p>
                  <Button
                    onClick={() => downloadDocument(previewDocument)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };



  const DocumentsDialog = ({ application }: { application: OnboardingApplication }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          View ({application.document_uploads?.images.length || 0})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Documents - {application.full_name}</DialogTitle>
          <DialogDescription>
            Application ID: {application.application_id} | Total Documents: {application.document_uploads?.images.length || 0}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {application.document_uploads && application.document_uploads.images.length > 0 && (
            <div className="flex justify-end">
              <Button onClick={() => downloadAllDocuments(application.application_id)} className="gap-2">
                <Download className="h-4 w-4" />
                Download All Documents
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {application.document_uploads?.images.map((doc, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.document_type, doc.original_filename)}
                    <span className="font-medium text-sm">{doc.original_filename}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadDocument(doc)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  <div>Uploaded: {format(new Date(doc.uploaded_at), "MMM dd, yyyy")}</div>
                  <div>Type: {formatDocumentType(doc.document_type)}</div>
                  <div>Size: {(doc.file_size / 1024).toFixed(1)} KB</div>
                </div>

                {/* Updated clickable download/preview */}
                <div
                  className="mt-2 p-2 bg-muted rounded border-dashed border-2 cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => {
                    if (isPDFDocument(doc)) {
                      // PDF files should be downloaded directly
                      downloadDocument(doc);
                    } else if (isImageDocument(doc)) {
                      // Image files should be previewed
                      setPreviewDocument(doc);
                    } else {
                      // Other files should be downloaded
                      downloadDocument(doc);
                    }
                  }}
                >
                  <div className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                    {getDocumentIcon(doc.document_type, doc.original_filename)}
                    <span>
                      {isPDFDocument(doc)
                        ? 'Click to download'
                        : isImageDocument(doc)
                          ? 'Click to preview'
                          : 'Click to download'
                      }
                    </span>
                    {isPDFDocument(doc)
                      ? <Download className="h-3 w-3" />
                      : isImageDocument(doc)
                        ? <Eye className="h-3 w-3" />
                        : <Download className="h-3 w-3" />
                    }
                  </div>
                </div>
              </Card>
            )) || (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No documents uploaded yet.
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const getStatusStats = () => {
    if (!apiResponse) {
      return [
        { label: "Total Applications", count: 0, icon: Users, color: "bg-blue-500" },
        { label: "Pending", count: 0, icon: Clock, color: "bg-yellow-500" },
        { label: "Under Review", count: 0, icon: FileText, color: "bg-orange-500" },
        { label: "Approved", count: 0, icon: CheckCircle, color: "bg-green-500" },
        { label: "Rejected", count: 0, icon: AlertCircle, color: "bg-red-500" }
      ];
    }

    return [
      { label: "Total Applications", count: apiResponse.pagination.total, icon: Users, color: "bg-blue-500" },
      { label: "Pending", count: apiResponse.status_summary.pending, icon: Clock, color: "bg-yellow-500" },
      { label: "Under Review", count: apiResponse.status_summary.under_review, icon: FileText, color: "bg-orange-500" },
      { label: "Approved", count: apiResponse.status_summary.approved, icon: CheckCircle, color: "bg-green-500" },
      { label: "Rejected", count: apiResponse.status_summary.rejected, icon: AlertCircle, color: "bg-red-500" }
    ];
  };

  // Use allBranches for the dropdown instead of filtering based on current applications

  // Pagination functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (!apiResponse) return [];

    const totalPages = apiResponse.pagination.totalPages;
    const current = apiResponse.pagination.page;
    const pages = [];

    // Always show first page
    pages.push(1);

    // Show pages around current page
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    if (start > 2) pages.push('...');

    for (let i = start; i <= end; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (end < totalPages - 1) pages.push('...');

    // Always show last page if there are more than 1 page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-lg font-medium">Loading applications...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-lg font-medium text-destructive">Error loading applications</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="space-y-6">
        {/* Header */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Employee Onboarding Dashboard
            </CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Manage and track employee onboarding applications
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {getStatusStats().map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.count}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Department Filter */}
              <Select value={departmentFilter} onValueChange={handleDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {allBranches.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range */}
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => handleDateFilter(date, dateTo)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "MMM dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => handleDateFilter(dateFrom, date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="p-2">
              <CardTitle>Applications ({applications.length})</CardTitle>
              <div className="mt-3">
                <CardDescription>Manage employee onboarding applications</CardDescription>
              </div>

            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDownload("excel")} variant="outline" size="sm" disabled={applications.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Excel ({applications.length} records)
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No applications found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.uuid}>
                      <TableCell className="font-mono">{app.application_id}</TableCell>
                      <TableCell className="font-medium">{app.full_name}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.education_employment?.branch || 'N/A'}</TableCell>
                      <TableCell>{app.education_employment?.designation || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{format(new Date(app.created_at), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{app.document_uploads?.images.length || 0}</span>
                          {app.document_uploads && app.document_uploads.images.length > 0 && (
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{app.mobile_number}</TableCell>
                      <TableCell>
                        <DocumentsDialog application={app} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>

          {/* Pagination */}
          {apiResponse && apiResponse.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((apiResponse.pagination.page - 1) * pageSize) + 1} to{" "}
                {Math.min(apiResponse.pagination.page * pageSize, apiResponse.pagination.total)} of{" "}
                {apiResponse.pagination.total} results
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(apiResponse.pagination.page - 1)}
                      className={apiResponse.pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2">...</span>
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          isActive={apiResponse.pagination.page === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(apiResponse.pagination.page + 1)}
                      className={apiResponse.pagination.page >= apiResponse.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>
      <DocumentPreviewModal />
    </div>
  );
}