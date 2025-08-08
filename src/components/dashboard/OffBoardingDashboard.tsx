import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { CheckCircle, Clock, Users, XCircle, FileText } from 'lucide-react';

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

export function OffboardingDashboard() {
  const [resignation, setResignation] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const recentRequests = resignation;

  // For the "Notice Period Tracker", get the first approved request with notice
  const inNotice = recentRequests.find(
    r => r.status === 'approved' && r.noticeTotal !== undefined
  );

  const getResignation = async () => {
    try {
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
    }
  };

  useEffect(() => {
    getResignation();
  }, []);

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
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
              <CardTitle>Recent Exit Requests</CardTitle>
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

          {/* Notice Period Tracker */}
          <Card className="shadow-md h-full">
            <CardHeader>
              <CardTitle>Notice Period Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              {inNotice ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {inNotice.employee_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {inNotice.noticeDays ?? 0}/{inNotice.noticeTotal} days
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded transition-all"
                      style={{
                        width: `${
                          inNotice.noticeTotal && inNotice.noticeTotal > 0
                            ? ((inNotice.noticeDays ?? 0) /
                                inNotice.noticeTotal) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2 mt-5">
                    <span className="font-medium">{inNotice.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {inNotice.noticeDays ?? 0}/{inNotice.noticeTotal} days
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded transition-all"
                      style={{
                        width: `${
                          inNotice.noticeTotal && inNotice.noticeTotal > 0
                            ? ((inNotice.noticeDays ?? 0) /
                                inNotice.noticeTotal) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2 mt-5">
                    <span className="font-medium">{inNotice.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {inNotice.noticeDays ?? 0}/{inNotice.noticeTotal} days
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className="h-2 bg-blue-500 rounded transition-all"
                      style={{
                        width: `${
                          inNotice.noticeTotal && inNotice.noticeTotal > 0
                            ? ((inNotice.noticeDays ?? 0) /
                                inNotice.noticeTotal) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  No employee in notice period.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
