import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, AlertCircle, Loader2, Search } from 'lucide-react';

import axiosInstance from '@/components/apiconfig/axios';
import { API_URLS } from '@/components/apiconfig/api_urls';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ExitRequestProps {
  role: 'hr' | 'admin';
}

const statusColor = {
  pending:
    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
};

const statusText = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

interface Resignation {
  uuid: string;
  employee_name: string;
  employee_id: string;
  email: String;
  department: string;
  designation: string;
  branch: string;
  resignation_date: string;
  last_working_date: string;
  notice_period: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApiResponse {
  data: Resignation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function ExitRequest({ role }: ExitRequestProps) {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for debounced search
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [resignation, setResignation] = useState<Resignation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  // Debounced search effect with better handling for deletions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== searchQuery) {
        setSearchQuery(search);
        setCurrentPage(1);
      }
    }, 500); // Increased debounce time to 500ms for better UX

    return () => clearTimeout(timer);
  }, [search, searchQuery]);

  const getResignation = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());

      // Add search parameter if search query exists
      if (searchQuery.trim()) {
        params.append('employee_name', searchQuery.trim());
      }

      // Add status filter parameter if not 'all'
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      console.log(
        'API Call URL:',
        `${API_URLS.RESIGNATION.GET_RESIGNATIONS}?${params.toString()}`
      );

      const res = await axiosInstance.get<ApiResponse>(
        `${API_URLS.RESIGNATION.GET_RESIGNATIONS}?${params.toString()}`
      );

      // ✅ Sort by resignation_date (latest first)
      const sortedData = (res.data.data || [])
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setResignation(sortedData);
      setTotalPages(res.data.pagination.totalPages || 1);
      setTotalItems(res.data.pagination.total || 0);
    } catch (error) {
      console.error('Error fetching resignation:', error);
      setError('Failed to load exit requests');
      setResignation([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
      // Keep focus on search input
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  useEffect(() => {
    getResignation();
  }, [currentPage, searchQuery, statusFilter, pageSize]);

  const handleDeleteResignation = async (uuid: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this resignation request?'
      )
    ) {
      return;
    }
    try {
      await axiosInstance.delete(
        API_URLS.RESIGNATION.DELETE_RESIGNATION_BY_UUID(uuid)
      );

      // If current page ends up empty after deletion, go to previous page if possible
      if (resignation.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        getResignation();
      }
      alert('Resignation deleted successfully');
    } catch (error) {
      console.error('Deleting resignation error', error);
      alert('Failed to delete resignation');
    }
  };

  const updateresignationStatus = async (
    uuid: string,
    newStatus: 'pending' | 'approved' | 'rejected',
    prevStatus: 'pending' | 'approved' | 'rejected'
  ) => {
    setStatusUpdating(uuid);
    setResignation(prev =>
      prev.map(item =>
        item.uuid === uuid ? { ...item, status: newStatus } : item
      )
    );

    try {
      await axiosInstance.patch(
        API_URLS.RESIGNATION.RESIGNATION_STATUS_UPDATE_BY_UUID(uuid),
        { status: newStatus }
      );
      setTimeout(() => {
        setStatusUpdating(null);
      }, 250);

      // await refreshResignationSilently();
      // alert('Successfully updated status');
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
      setResignation(prev =>
        prev.map(item =>
          item.uuid === uuid ? { ...item, status: prevStatus } : item
        )
      );
      setStatusUpdating(null);
    }
  };

  const refreshResignationSilently = async () => {
    try {
      const res = await axiosInstance.get<ApiResponse>(
        `${API_URLS.RESIGNATION.GET_RESIGNATIONS}?page=${currentPage}&limit=${pageSize}`
      );
      setResignation(res.data.data || []);
    } catch (e) {
      console.error('Silent refresh failed', e);
    }
  };

  // const params = new URLSearchParams();
  // params.append('page', currentPage.toString());
  // params.append('limit', pageSize.toString());
  // if (searchQuery.trim()) {
  //   params.append('search', searchQuery.trim());
  // }
  // if (statusFilter !== 'all') {
  //   params.append('status', statusFilter);
  // }

  // const filteredRequests = resignation.filter(req => {
  //   const matchesSearch =
  //     req.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     req.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     (req.department?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  //   const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
  //   return matchesSearch && matchesStatus;
  // });

  const getPageNumbers = () => {
    const pages = [];
    const total = totalPages;
    const current = currentPage;

    pages.push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) {
      if (i > 1 && i < total) pages.push(i);
    }
    if (end < total - 1) pages.push('...');

    if (total > 1) pages.push(total);

    return pages;
  };

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
    <>
      <div className="p-6">
        <div className="  space-y-6">
          {/* Page Heading */}
          <div>
            <h2 className="text-2xl font-bold">Exit Requests</h2>
            <p className="text-muted-foreground">
              Manage all employee resignation requests
            </p>
          </div>

          {/* Search + Filter Card */}
          <Card>
            <CardContent className="py-4 flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search by name..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={e => {
                    // Prevent form submission on Enter
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="pl-10"
                  autoComplete="off"
                />
              </div>
              <div className="w-full md:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={value => {
                    setStatusFilter(value as any);
                    setCurrentPage(1); // Reset page on filter change
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table Card */}
          <Card>
            <CardHeader>
              <CardTitle>Exit Requests ({totalItems})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="overflow-scroll">
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee Id</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Resignation Date</TableHead>
                    <TableHead>Last Working Date</TableHead>
                    <TableHead>Notice Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resignation.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground"
                      >
                        No exit requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    resignation.map(req => (
                      <TableRow key={req.uuid}>
                        <TableCell>
                          <div className="font-medium">{req.employee_id}</div>
                        </TableCell>
                        <TableCell>{req.employee_name}</TableCell>
                        <TableCell>{req.email}</TableCell>
                        <TableCell>{req.department}</TableCell>
                        <TableCell>{req.designation}</TableCell>
                        <TableCell>{req.branch}</TableCell>
                        <TableCell>
                          {req.resignation_date && (
                            <span>
                              {new Date(
                                req.resignation_date
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {req.last_working_date && (
                            <span>
                              {new Date(
                                req.last_working_date
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {req.notice_period} days
                          </span>
                        </TableCell>
                        <TableCell>
                          {statusUpdating === req.uuid ? (
                            <div className="flex justify-center">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : role === 'hr' ? (
                            <Select
                              value={req.status}
                              onValueChange={value =>
                                updateresignationStatus(
                                  req.uuid,
                                  value as 'pending' | 'approved' | 'rejected',
                                  req.status
                                )
                              }
                            >
                              <SelectTrigger
                                className={`w-28 cursor-pointer rounded-md border px-2 py-1 text-center font-semibold ${
                                  statusColor[req.status]
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">
                                  Approved
                                </SelectItem>
                                <SelectItem value="rejected">
                                  Rejected
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span
                              className={`w-28 inline-block rounded-md border px-2 py-1 text-center font-semibold ${
                                statusColor[req.status]
                              }`}
                            >
                              {statusText[req.status]}
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Button
                            onClick={() => handleDeleteResignation(req.uuid)}
                            variant="delete"
                            size="sm"
                            className="gap-2 "
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{' '}
                  results
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={
                          currentPage <= 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) =>
                      page === '...' ? (
                        <PaginationItem key={index}>
                          <span className="px-3 py-2">...</span>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page as number)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(p => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage >= totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default ExitRequest;
