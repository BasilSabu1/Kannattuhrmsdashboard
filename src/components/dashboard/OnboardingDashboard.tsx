import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Download, Filter, Search, Calendar as CalendarIcon, Users, FileText, Clock, CheckCircle, Eye, FolderOpen, Image, File, Loader2, AlertCircle } from "lucide-react";
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
  const [filteredApplications, setFilteredApplications] = useState<OnboardingApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const { toast } = useToast();

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(API_URLS.USERS.GET_USERS);
        
        setApiResponse(response.data);
        setApplications(response.data.data);
        setFilteredApplications(response.data.data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch applications');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);


  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    applyFilters(term, statusFilter, departmentFilter, dateFrom, dateTo);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    applyFilters(searchTerm, status, departmentFilter, dateFrom, dateTo);
  };

  const handleDepartmentFilter = (department: string) => {
    setDepartmentFilter(department);
    applyFilters(searchTerm, statusFilter, department, dateFrom, dateTo);
  };

  const handleDateFilter = (from?: Date, to?: Date) => {
    setDateFrom(from);
    setDateTo(to);
    applyFilters(searchTerm, statusFilter, departmentFilter, from, to);
  };

  const applyFilters = (search: string, status: string, department: string, from?: Date, to?: Date) => {
    let filtered = applications;

    if (search) {
      filtered = filtered.filter(app => 
        app.full_name.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase()) ||
        app.application_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(app => app.status === status);
    }

    // Filter by department using education_employment branch
    if (department !== "all") {
      filtered = filtered.filter(app => 
        app.education_employment?.branch === department
      );
    }

    if (from && to) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.created_at);
        return appDate >= from && appDate <= to;
      });
    }

    setFilteredApplications(filtered);
  };

  const handleDownload = (downloadFormat: string) => {
    const dataToDownload = filteredApplications.map(app => ({
      'Application ID': app.application_id,
      'Employee Name': app.full_name,
      'Email': app.email,
      'Department': app.education_employment?.branch || 'N/A',
      'Position': app.education_employment?.designation || 'N/A',
      'Status': app.status,
      'Submitted Date': format(new Date(app.created_at), "MM/dd/yyyy"),
      'Documents Count': app.document_uploads?.images.length || 0,
      'Blood Group': app.blood_group,
      'Mobile': app.mobile_number,
      'Emergency Contact': app.emergency_contact_number
    }));

    if (downloadFormat === 'excel') {
      downloadExcel(dataToDownload);
    }

    toast({
      title: `Download Started`,
      description: `Exporting ${filteredApplications.length} records in Excel format.`,
    });
  };

  const downloadExcel = (data: any[]) => {
    if (data.length === 0) return;
    
    // Create headers row
    const headers = Object.keys(data[0]);
    const headerRow = headers.join('\t');
    
    // Create data rows with proper formatting
    const dataRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Format dates and numbers properly for Excel
        if (header === 'Submitted Date' && value !== 'N/A') {
          return value; // Already formatted as MM/dd/yyyy
        }
        if (header === 'Documents Count') {
          return value.toString();
        }
        if (header === 'Mobile' || header === 'Emergency Contact') {
          // Format phone numbers as text to preserve leading zeros
          return `"${value}"`;
        }
        return value;
      }).join('\t')
    );
    
    // Combine headers and data
    const excelContent = [headerRow, ...dataRows].join('\n');
    
    // Create and download the file
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onboarding-applications-${format(new Date(), 'yyyy-MM-dd')}.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadDocument = (doc: ApplicationDocument) => {
    const link = document.createElement('a');
    link.href = doc.image;
    link.download = doc.original_filename;
    link.target = '_blank';
    link.click();
    
    toast({
      title: "Document Downloaded",
      description: `${doc.original_filename} has been downloaded.`,
    });
  };

  const downloadAllDocuments = (applicationId: string) => {
    const app = applications.find(a => a.application_id === applicationId);
    if (!app || !app.document_uploads) return;

    app.document_uploads.images.forEach((doc, index) => {
      setTimeout(() => downloadDocument(doc), index * 500);
    });

    toast({
      title: "Bulk Download Started",
      description: `Downloading all ${app.document_uploads.images.length} documents for ${app.full_name}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      "under_review": "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getDocumentIcon = (type: string) => {
    if (type.includes('image') || ['passport', 'aadhaar_front', 'aadhaar_back', 'voter_id', 'pan'].includes(type)) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
                    {getDocumentIcon(doc.document_type)}
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
                <div className="text-xs text-muted-foreground">
                  Uploaded: {format(new Date(doc.uploaded_at), "MMM dd, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  Type: {formatDocumentType(doc.document_type)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Size: {(doc.file_size / 1024).toFixed(1)} KB
                </div>
                <div className="mt-2 p-2 bg-muted rounded border-dashed border-2">
                  <div className="text-xs text-center text-muted-foreground">
                    {getDocumentIcon(doc.document_type).type === Image ? 'Image Preview Available' : 'Document Available'}
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

  const departments = [...new Set(applications.map(app => app.education_employment?.branch).filter(Boolean))];

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
      <div className="max-w-7xl mx-auto space-y-6">
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
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
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
                  {departments.map(dept => (
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
            <div>
              <CardTitle>Applications ({filteredApplications.length})</CardTitle>
              <CardDescription>Manage employee onboarding applications</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleDownload("excel")} variant="outline" size="sm" disabled={filteredApplications.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Excel ({filteredApplications.length} records)
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
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No applications found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
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
        </Card>
      </div>
    </div>
  );
}