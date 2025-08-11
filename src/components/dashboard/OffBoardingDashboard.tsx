import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';

import {
  CheckCircle,
  Clock,
  Users,
  XCircle,
  FileText,
  Loader2,
  AlertCircle,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import axiosInstance from '@/components/apiconfig/axios';
import { API_URLS } from '@/components/apiconfig/api_urls';
import { useEffect, useState } from 'react';

interface ExitRequest {
  name: string;
  department: string;
  position: string;
  status: 'pending' | 'approved' | 'rejected';
  noticeDays?: number;
  noticeTotal?: number;
}

interface OffboardingDashboardProps {
  onViewMoreClick?: () => void;
}

export function OffboardingDashboard({
  onViewMoreClick,
}: OffboardingDashboardProps) {
  const [resignation, setResignation] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  // Pagination states for Notice Period Tracker
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [approvedResignations, setApprovedResignations] = useState([]);

  const recentRequests = resignation
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime(); // Latest first (descending order)
    })
    .slice(0, 5);

  // Fetch approved resignations with pagination
  const getApprovedResignations = async () => {
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());
      params.append('status', 'approved');

      const res = await axiosInstance.get(
        `${API_URLS.RESIGNATION.GET_RESIGNATIONS}?${params.toString()}`
      );

      setApprovedResignations(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalItems(res.data.pagination?.total || 0);
    } catch (error) {
      console.error('Error fetching approved resignations:', error);
      setApprovedResignations([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Debug: Log the data to check field names
  console.log('Approved resignations:', approvedResignations);
  console.log('Pagination info:', { currentPage, totalPages, totalItems, pageSize });

  // Helper function to calculate notice period progress
  const calculateNoticeProgress = (resignationDate, lastWorkingDate) => {
    // Handle missing dates
    if (!resignationDate || !lastWorkingDate) {
      return {
        totalDays: 30, // Default 30 days
        elapsedDays: 15, // Default halfway
        remainingDays: 15,
        progressPercentage: 50,
        isCompleted: false,
        isOverdue: false
      };
    }

    const currentDate = new Date();
    const startDate = new Date(resignationDate);
    const endDate = new Date(lastWorkingDate);
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    
    const progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    
    return {
      totalDays: Math.max(1, totalDays), // Ensure at least 1 day
      elapsedDays: Math.max(0, elapsedDays),
      remainingDays,
      progressPercentage,
      isCompleted: currentDate >= endDate,
      isOverdue: currentDate > endDate
    };
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getResignation = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get(
        API_URLS.RESIGNATION.GET_RESIGNATIONS
      );
      setResignation(res.data.data || []);
      setStatusCounts({
        pending: res.data.status_counts.pending || 0,
        approved: res.data.status_counts.approved || 0,
        rejected: res.data.status_counts.rejected || 0,
      });
    } catch (error) {
      console.error('Error fetching resignation', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResignation();
  }, []); 

  // Fetch approved resignations when page changes
  useEffect(() => {
    getApprovedResignations();
  }, [currentPage]);


  console.log(resignation);
  

  const totalRequests = resignation.length;

  const EXIT_STATS = [
    {
      label: 'Total Requests',
      value: totalRequests,
      note: 'All employee exit requests',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Pending',
      value: statusCounts.pending,
      note: 'Requires attention',
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Approved',
      value: statusCounts.approved,
      note: 'In notice period',
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Rejected',
      value: statusCounts.rejected,
      note: 'This month',
      icon: XCircle,
      color: 'bg-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-lg font-medium">Loading exit requests...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-lg font-medium text-destructive">
                  Error loading exit requests
                </p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={getResignation}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6 ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg">
          <CardHeader className="bg-orange-500">
            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
              <FileText className="h-6 w-6" />
              Exit Process Dashboard
            </CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Manage employee resignations and notice periods
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {EXIT_STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      {stat.note && (
                        <p className="text-xs text-muted-foreground mt-2"></p>
                      )}
                      {stat.note && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {stat.note}
                        </p>
                      )}
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

        {/* Requests and Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Exit Requests */}
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Exit Requests</CardTitle>
                <p
                  onClick={() => {
                    if (onViewMoreClick) onViewMoreClick();
                  }}
                  className="underline text-blue-500 cursor-pointer hover:text-blue-700 transition-all duration-300 "
                >
                  View more
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {recentRequests.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    No recent exit requests found.
                  </div>
                ) : (
                  recentRequests.map((req, idx) => (
                    <div
                      key={req.uuid || idx}
                      className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0"
                    >
                      <div>
                        <div className="font-semibold">{req.employee_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {req.department} &middot; {req.designation}
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant={
                            req.status === 'approved'
                              ? 'default'
                              : req.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className={
                            req.status === 'approved'
                              ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                              : req.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                              : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                          }
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          {/* Optionally you can add additional info here or remove */}
                          {/* e.g., Completed */}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Notice Period Tracker */}
          <Card className="shadow-md h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Notice Period Tracker
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {approvedResignations.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {approvedResignations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm font-medium">
                    No employees in notice period
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Approved resignations will appear here
                  </p>
                </div>
              ) : (
                approvedResignations.map((employee, idx) => {
                  const progress = calculateNoticeProgress(
                    employee.resignation_date, 
                    employee.last_working_date
                  );
                  
                  return (
                    <div key={employee.uuid || idx} className="space-y-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200 bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                      {/* Employee Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {employee.employee_name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {employee.department}
                            </span>
                            <span className="text-xs text-gray-600">
                              {employee.designation}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`ml-2 ${
                            progress.isCompleted
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : progress.isOverdue
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {progress.isCompleted 
                            ? 'Completed' 
                            : progress.isOverdue 
                            ? 'Overdue' 
                            : 'Active'}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">
                            Day {progress.elapsedDays} of {progress.totalDays}
                          </span>
                          <span className={`font-medium ${
                            progress.isCompleted 
                              ? 'text-green-600' 
                              : progress.remainingDays <= 3 
                              ? 'text-red-600' 
                              : 'text-blue-600'
                          }`}>
                            {progress.isCompleted 
                              ? '100%' 
                              : `${Math.round(progress.progressPercentage)}%`}
                          </span>
                        </div>
                        
                        <div className="relative">
                          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ease-out ${
                                progress.isCompleted
                                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                                  : progress.isOverdue
                                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                                  : progress.remainingDays <= 3
                                  ? 'bg-gradient-to-r from-orange-400 to-red-400'
                                  : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                              } rounded-full`}
                              style={{
                                width: `${Math.min(100, progress.progressPercentage)}%`,
                              }}
                            />
                          </div>
                          {/* Progress indicator dot */}
                          <div 
                            className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white shadow-sm ${
                              progress.isCompleted
                                ? 'bg-green-500'
                                : progress.isOverdue
                                ? 'bg-red-500'
                                : progress.remainingDays <= 3
                                ? 'bg-orange-500'
                                : 'bg-blue-500'
                            }`}
                            style={{
                              left: `calc(${Math.min(100, progress.progressPercentage)}% - 4px)`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Date Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Started</p>
                            <p className="text-xs font-medium text-gray-700">
                              {formatDate(employee.resignation_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Last Day</p>
                            <p className="text-xs font-medium text-gray-700">
                              {formatDate(employee.last_working_date)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remaining Days Highlight */}
                      {!progress.isCompleted && (
                        <div className={`text-center py-2 px-3 rounded-md ${
                          progress.remainingDays <= 3
                            ? 'bg-red-50 text-red-700'
                            : progress.remainingDays <= 7
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          <p className="text-xs font-medium">
                            {progress.remainingDays > 0 
                              ? `${progress.remainingDays} ${progress.remainingDays === 1 ? 'day' : 'days'} remaining`
                              : 'Notice period ended'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 px-6 pb-4">
                <div className="text-xs text-gray-500">
                  Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} employees
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-8 w-8 p-0 text-xs"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}