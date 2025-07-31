import { useState } from "react";
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
import { Download, Filter, Search, Calendar as CalendarIcon, Users, FileText, Clock, CheckCircle, Eye, FolderOpen, Image, File } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApplicationDocument {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  url: string;
  uploadedDate: Date;
}

interface OnboardingApplication {
  id: string;
  employeeName: string;
  email: string;
  department: string;
  position: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  submittedDate: Date;
  reviewedBy?: string;
  documents: ApplicationDocument[];
  totalDocuments: number;
}

// Mock data for demonstration
const mockApplications: OnboardingApplication[] = [
  {
    id: "ONB001",
    employeeName: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Software Developer",
    status: "approved",
    submittedDate: new Date("2024-01-15"),
    reviewedBy: "HR Manager",
    totalDocuments: 8,
    documents: [
      { id: "doc1", name: "Resume.pdf", type: "pdf", url: "/mock/resume.pdf", uploadedDate: new Date("2024-01-15") },
      { id: "doc2", name: "Passport.jpg", type: "image", url: "/mock/passport.jpg", uploadedDate: new Date("2024-01-15") },
      { id: "doc3", name: "Educational_Certificate.pdf", type: "pdf", url: "/mock/education.pdf", uploadedDate: new Date("2024-01-15") },
      { id: "doc4", name: "Experience_Letter.pdf", type: "document", url: "/mock/experience.pdf", uploadedDate: new Date("2024-01-15") },
      { id: "doc5", name: "Aadhar_Card.jpg", type: "image", url: "/mock/aadhar.jpg", uploadedDate: new Date("2024-01-15") },
      { id: "doc6", name: "PAN_Card.jpg", type: "image", url: "/mock/pan.jpg", uploadedDate: new Date("2024-01-15") },
      { id: "doc7", name: "Police_Clearance.pdf", type: "pdf", url: "/mock/police.pdf", uploadedDate: new Date("2024-01-15") },
      { id: "doc8", name: "CIBIL_Report.pdf", type: "pdf", url: "/mock/cibil.pdf", uploadedDate: new Date("2024-01-15") }
    ]
  },
  {
    id: "ONB002",
    employeeName: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Marketing",
    position: "Marketing Specialist",
    status: "pending",
    submittedDate: new Date("2024-01-20"),
    totalDocuments: 7,
    documents: [
      { id: "doc9", name: "Resume.pdf", type: "pdf", url: "/mock/resume2.pdf", uploadedDate: new Date("2024-01-20") },
      { id: "doc10", name: "Passport.jpg", type: "image", url: "/mock/passport2.jpg", uploadedDate: new Date("2024-01-20") },
      { id: "doc11", name: "Educational_Certificate.pdf", type: "pdf", url: "/mock/education2.pdf", uploadedDate: new Date("2024-01-20") },
      { id: "doc12", name: "Experience_Letter.pdf", type: "document", url: "/mock/experience2.pdf", uploadedDate: new Date("2024-01-20") },
      { id: "doc13", name: "Aadhar_Card.jpg", type: "image", url: "/mock/aadhar2.jpg", uploadedDate: new Date("2024-01-20") },
      { id: "doc14", name: "PAN_Card.jpg", type: "image", url: "/mock/pan2.jpg", uploadedDate: new Date("2024-01-20") },
      { id: "doc15", name: "Police_Clearance.pdf", type: "pdf", url: "/mock/police2.pdf", uploadedDate: new Date("2024-01-20") }
    ]
  },
  {
    id: "ONB003",
    employeeName: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "Finance",
    position: "Financial Analyst",
    status: "under-review",
    submittedDate: new Date("2024-01-18"),
    reviewedBy: "Finance Head",
    totalDocuments: 8,
    documents: [
      { id: "doc16", name: "Resume.pdf", type: "pdf", url: "/mock/resume3.pdf", uploadedDate: new Date("2024-01-18") },
      { id: "doc17", name: "Passport.jpg", type: "image", url: "/mock/passport3.jpg", uploadedDate: new Date("2024-01-18") },
      { id: "doc18", name: "Educational_Certificate.pdf", type: "pdf", url: "/mock/education3.pdf", uploadedDate: new Date("2024-01-18") },
      { id: "doc19", name: "Experience_Letter.pdf", type: "document", url: "/mock/experience3.pdf", uploadedDate: new Date("2024-01-18") },
      { id: "doc20", name: "Aadhar_Card.jpg", type: "image", url: "/mock/aadhar3.jpg", uploadedDate: new Date("2024-01-18") },
      { id: "doc21", name: "PAN_Card.jpg", type: "image", url: "/mock/pan3.jpg", uploadedDate: new Date("2024-01-18") },
      { id: "doc22", name: "Police_Clearance.pdf", type: "pdf", url: "/mock/police3.pdf", uploadedDate: new Date("2024-01-18") },
      { id: "doc23", name: "CIBIL_Report.pdf", type: "pdf", url: "/mock/cibil3.pdf", uploadedDate: new Date("2024-01-18") }
    ]
  },
  {
    id: "ONB004",
    employeeName: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    department: "HR",
    position: "HR Coordinator",
    status: "rejected",
    submittedDate: new Date("2024-01-12"),
    reviewedBy: "HR Director",
    totalDocuments: 6,
    documents: [
      { id: "doc24", name: "Resume.pdf", type: "pdf", url: "/mock/resume4.pdf", uploadedDate: new Date("2024-01-12") },
      { id: "doc25", name: "Passport.jpg", type: "image", url: "/mock/passport4.jpg", uploadedDate: new Date("2024-01-12") },
      { id: "doc26", name: "Educational_Certificate.pdf", type: "pdf", url: "/mock/education4.pdf", uploadedDate: new Date("2024-01-12") },
      { id: "doc27", name: "Experience_Letter.pdf", type: "document", url: "/mock/experience4.pdf", uploadedDate: new Date("2024-01-12") },
      { id: "doc28", name: "Aadhar_Card.jpg", type: "image", url: "/mock/aadhar4.jpg", uploadedDate: new Date("2024-01-12") },
      { id: "doc29", name: "PAN_Card.jpg", type: "image", url: "/mock/pan4.jpg", uploadedDate: new Date("2024-01-12") }
    ]
  }
];

export function OnboardingDashboard() {
  const [applications, setApplications] = useState<OnboardingApplication[]>(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState<OnboardingApplication[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const { toast } = useToast();

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
        app.employeeName.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase()) ||
        app.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      filtered = filtered.filter(app => app.status === status);
    }

    if (department !== "all") {
      filtered = filtered.filter(app => app.department === department);
    }

    if (from && to) {
      filtered = filtered.filter(app => 
        app.submittedDate >= from && app.submittedDate <= to
      );
    }

    setFilteredApplications(filtered);
  };

  const handleDownload = (downloadFormat: string) => {
    // Create downloadable data with current filters applied
    const dataToDownload = filteredApplications.map(app => ({
      'Application ID': app.id,
      'Employee Name': app.employeeName,
      'Email': app.email,
      'Department': app.department,
      'Position': app.position,
      'Status': app.status,
      'Submitted Date': format(app.submittedDate, "yyyy-MM-dd"),
      'Documents Count': `${app.documents.length}/${app.totalDocuments}`,
      'Reviewed By': app.reviewedBy || 'Not Assigned'
    }));

    if (downloadFormat === 'csv') {
      downloadCSV(dataToDownload);
    } else if (downloadFormat === 'excel') {
      downloadExcel(dataToDownload);
    } else if (downloadFormat === 'pdf') {
      downloadPDF(dataToDownload);
    }

    toast({
      title: `Download Started`,
      description: `Exporting ${filteredApplications.length} records in ${downloadFormat.toUpperCase()} format.`,
    });
  };

  const downloadCSV = (data: any[]) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onboarding-applications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = (data: any[]) => {
    // Simulate Excel download - in real app, use a library like xlsx
    const csvContent = data.map(row => Object.values(row).join('\t')).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onboarding-applications-${format(new Date(), 'yyyy-MM-dd')}.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = (data: any[]) => {
    // Simulate PDF download - in real app, use a library like jsPDF
    const content = data.map(row => Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')).join('\n\n');
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `onboarding-applications-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadDocument = (doc: ApplicationDocument) => {
    // Simulate document download
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.click();
    
    toast({
      title: "Document Downloaded",
      description: `${doc.name} has been downloaded.`,
    });
  };

  const downloadAllDocuments = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    // Simulate bulk download - in real app, create a zip file
    app.documents.forEach((doc, index) => {
      setTimeout(() => downloadDocument(doc), index * 500); // Stagger downloads
    });

    toast({
      title: "Bulk Download Started",
      description: `Downloading all ${app.documents.length} documents for ${app.employeeName}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      "under-review": "outline"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const DocumentsDialog = ({ application }: { application: OnboardingApplication }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Eye className="h-4 w-4" />
          View ({application.documents.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Documents - {application.employeeName}</DialogTitle>
          <DialogDescription>
            Application ID: {application.id} | Total Documents: {application.documents.length}/{application.totalDocuments}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => downloadAllDocuments(application.id)} className="gap-2">
              <Download className="h-4 w-4" />
              Download All Documents
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {application.documents.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.type)}
                    <span className="font-medium text-sm">{doc.name}</span>
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
                  Uploaded: {format(doc.uploadedDate, "MMM dd, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  Type: {doc.type}
                </div>
                {doc.type === 'image' && (
                  <div className="mt-2 p-2 bg-muted rounded border-dashed border-2">
                    <div className="text-xs text-center text-muted-foreground">
                      Image Preview Available
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          {application.documents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents uploaded yet.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const getStatusStats = () => {
    const stats = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: "Total Applications", count: applications.length, icon: Users, color: "bg-blue-500" },
      { label: "Pending", count: stats.pending || 0, icon: Clock, color: "bg-yellow-500" },
      { label: "Under Review", count: stats["under-review"] || 0, icon: FileText, color: "bg-orange-500" },
      { label: "Approved", count: stats.approved || 0, icon: CheckCircle, color: "bg-green-500" }
    ];
  };

  const departments = [...new Set(applications.map(app => app.department))];

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              {/* Department Filter */}
              <Select value={departmentFilter} onValueChange={handleDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
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
              <Button onClick={() => handleDownload("csv")} variant="outline" size="sm" disabled={filteredApplications.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                CSV ({filteredApplications.length} records)
              </Button>
              <Button onClick={() => handleDownload("excel")} variant="outline" size="sm" disabled={filteredApplications.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Excel ({filteredApplications.length} records)
              </Button>
              <Button onClick={() => handleDownload("pdf")} variant="outline" size="sm" disabled={filteredApplications.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                PDF ({filteredApplications.length} records)
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
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Reviewed By</TableHead>
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
                    <TableRow key={app.id}>
                      <TableCell className="font-mono">{app.id}</TableCell>
                      <TableCell className="font-medium">{app.employeeName}</TableCell>
                      <TableCell>{app.email}</TableCell>
                      <TableCell>{app.department}</TableCell>
                      <TableCell>{app.position}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{format(app.submittedDate, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{app.documents.length}/{app.totalDocuments}</span>
                          {app.documents.length > 0 && (
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{app.reviewedBy || "-"}</TableCell>
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