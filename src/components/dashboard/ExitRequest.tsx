// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Button } from '../ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Edit, Trash2 } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';

// import { Search } from 'lucide-react';
// import axiosInstance from '@/components/apiconfig/axios';
// import { API_URLS } from '@/components/apiconfig/api_urls';
// // import { error } from 'console';

// // import { ToastContainer, toast } from 'react-toastify';

// interface ExitRequestProps {
//   role: 'hr' | 'admin';
// }

// interface Resignation {
//   uuid: string;
//   employee_name: string;
//   employee_id: string;
//   department: string;
//   designation: string;
//   resignation_date: string;
//   last_working_date: string;
//   notice_period: number;
//   status: 'pending' | 'approved' | 'rejected';
// }

// interface EditFormData extends Resignation {}

// const statusColor = {
//   pending:
//     'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
//   approved: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
//   rejected: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
// };

// // const statusText = {
// //   pending: 'Pending',
// //   approved: 'Approved',
// //   rejected: 'Rejected',
// // };

// const ExitRequest: React.FC<ExitRequestProps> = ({ role }) => {
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState<
//     'all' | 'pending' | 'approved' | 'rejected'
//   >('all');
//   const [resignation, setResignation] = useState<Resignation[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editForm, setEditForm] = useState<EditFormData | null>(null);

//   const getResignation = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(
//         API_URLS.RESIGNATION.GET_RESIGNATIONS
//       );
//       setResignation(res.data.data || []);
//     } catch (error) {
//       console.error('Error fetching resignation');
//       setResignation([]);
//     }
//     setLoading(true);
//   };

//   useEffect(() => {
//     getResignation();
//   }, []);

//   const handleDeleteResignation = async (uuid: String) => {
//     if (
//       !window.confirm(
//         'Are you sure you want to delete this resignation request?'
//       )
//     ) {
//       return;
//     }
//     try {
//       const res = await axiosInstance.delete(
//         API_URLS.RESIGNATION.DELETE_RESIGNATION_BY_UUID(uuid)
//       );
//       alert('Resignation deleted successfully');
//       getResignation();
//     } catch (error) {
//       console.error('Deleting resignatin error', error);
//       alert('Failed to delete resignation');
//     }
//   };

//   const updateresignationStatus = async (
//     uuid: String,
//     newStatus: 'pending' | 'approved' | 'rejected',
//     prevStatus: 'pending' | 'approved' | 'rejected'
//   ) => {
//     setResignation(prev =>
//       prev.map(item =>
//         item.uuid === uuid ? { ...item, status: newStatus } : item
//       )
//     );
//     try {
//       await axiosInstance.patch(
//         API_URLS.RESIGNATION.RESIGNATION_STATUS_UPDATE_BY_UUID(uuid),
//         { status: newStatus }
//       );
//       await getResignation();
//       alert('Succesfully status updated');
//     } catch (error) {
//       console.error('Failing update status', error);
//       alert('Failed to update status');
//       setResignation(prev =>
//         prev.map(item =>
//           item.uuid === uuid ? { ...item, status: prevStatus } : item
//         )
//       );
//     }
//   };

//   const filteredRequests = resignation.filter(req => {
//     const matchesSearch =
//       req.employee_name.toLowerCase().includes(search.toLowerCase()) ||
//       req.employee_id.toLowerCase().includes(search.toLowerCase()) ||
//       (req.department?.toLowerCase() || '').includes(search.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const onEditClick = async (req: Resignation) => {
//     try {
//       const res = await axiosInstance.get(
//         API_URLS.RESIGNATION.GET_RESIGNATIONS_BY_UUID(req.uuid)
//       );
//       const data = res.data.data || res.data; // handle both response formats
//       setEditForm({
//         ...data,
//         resignation_date: data.resignation_date?.split('T')[0] || '',
//         last_working_date: data.last_working_date?.split('T')[0] || '',
//       });
//       setIsEditModalOpen(true);
//     } catch (error) {
//       console.error('Error fetching resignation details', error);
//       alert('Failed to load resignation details');
//     }
//   };

//   const submitEdit = async () => {
//     if (!editForm) return;
//     try {
//       await axiosInstance.patch(
//         API_URLS.RESIGNATION.GET_RESIGNATIONS_BY_UUID(editForm.uuid),
//         editForm
//       );
//       alert('Resignation updated successfully');
//       setIsEditModalOpen(false);
//       getResignation();
//     } catch (error) {
//       console.error('Failed to update resignation', error);
//       alert('Failed to update resignation');
//     }
//   };
//   return (
//     <>
//       <div className="p-6">
//         <div className="  space-y-6">
//           {/* Page Heading */}
//           <div>
//             <h2 className="text-2xl font-bold">Exit Requests</h2>
//             <p className="text-muted-foreground">
//               Manage all employee resignation requests
//             </p>
//           </div>

//           {/* Search + Filter Card */}
//           <Card>
//             <CardContent className="py-4 flex flex-col md:flex-row md:items-center gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search by name, ID, or department..."
//                   value={search}
//                   onChange={e => setSearch(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <div className="w-full md:w-48">
//                 <Select
//                   value={statusFilter}
//                   onValueChange={value => setStatusFilter(value as any)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Requests Table Card */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Exit Requests ({filteredRequests.length})</CardTitle>
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="rounded-md border border-border overflow-x-auto">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Employee</TableHead>
//                       <TableHead>Department</TableHead>
//                       <TableHead>Resignation Date</TableHead>
//                       <TableHead>Last Working Date</TableHead>
//                       <TableHead>Notice Period</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredRequests.length === 0 ? (
//                       <TableRow>
//                         <TableCell
//                           colSpan={7}
//                           className="text-center text-muted-foreground"
//                         >
//                           No exit requests found.
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredRequests.map(req => (
//                         <TableRow key={req.uuid}>
//                           <TableCell>
//                             <div className="font-medium">
//                               {req.employee_name}
//                             </div>
//                             <div className="text-xs text-muted-foreground">
//                               {req.employee_id} • {req.designation}
//                             </div>
//                           </TableCell>
//                           <TableCell>{req.department}</TableCell>
//                           <TableCell>
//                             {req.resignation_date && (
//                               <span>
//                                 {new Date(
//                                   req.resignation_date
//                                 ).toLocaleDateString()}
//                               </span>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {req.last_working_date && (
//                               <span>
//                                 {new Date(
//                                   req.last_working_date
//                                 ).toLocaleDateString()}
//                               </span>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <span className="font-semibold">
//                               {req.notice_period} days
//                             </span>
//                           </TableCell>
//                           <TableCell>
//                             <Select
//                               value={req.status}
//                               onValueChange={value =>
//                                 updateresignationStatus(
//                                   req.uuid,
//                                   value as 'pending' | 'approved' | 'rejected',
//                                   req.status
//                                 )
//                               }
//                             >
//                               <SelectTrigger
//                                 className={`w-28 cursor-pointer rounded-md border px-2 py-1 text-center font-semibold ${
//                                   statusColor[req.status]
//                                 }`}
//                               >
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="approved">
//                                   Approved
//                                 </SelectItem>
//                                 <SelectItem value="rejected">
//                                   Rejected
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </TableCell>

//                           <TableCell>
//                             {role === 'hr' && (
//                               <Button
//                                 onClick={() => onEditClick(req)}
//                                 variant="ghost"
//                                 size="sm"
//                                 className="mr-2"
//                               >
//                                 <Edit className="h-4 w-4" />
//                               </Button>
//                             )}
//                             <Button
//                               onClick={() => handleDeleteResignation(req.uuid)}
//                               variant="delete"
//                               size="sm"
//                               className="gap-2 "
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       {/* Edit Modal */}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Edit Resignation Details</DialogTitle>
//           </DialogHeader>

//           {editForm && (
//             <div className="space-y-4">
//               <Input
//                 value={editForm.employee_name}
//                 onChange={e =>
//                   setEditForm({ ...editForm, employee_name: e.target.value })
//                 }
//                 placeholder="Employee Name"
//               />
//               <Input
//                 value={editForm.employee_id}
//                 onChange={e =>
//                   setEditForm({ ...editForm, employee_id: e.target.value })
//                 }
//                 placeholder="Employee ID"
//               />
//               <Input
//                 value={editForm.department}
//                 onChange={e =>
//                   setEditForm({ ...editForm, department: e.target.value })
//                 }
//                 placeholder="Department"
//               />
//               <Input
//                 value={editForm.designation}
//                 onChange={e =>
//                   setEditForm({ ...editForm, designation: e.target.value })
//                 }
//                 placeholder="Designation"
//               />
//               <Input
//                 type="date"
//                 value={editForm.resignation_date || ''}
//                 onChange={e =>
//                   setEditForm({ ...editForm, resignation_date: e.target.value })
//                 }
//               />
//               <Input
//                 type="date"
//                 value={editForm.last_working_date || ''}
//                 onChange={e =>
//                   setEditForm({
//                     ...editForm,
//                     last_working_date: e.target.value,
//                   })
//                 }
//               />
//               <Input
//                 type="number"
//                 value={editForm.notice_period}
//                 onChange={e =>
//                   setEditForm({
//                     ...editForm,
//                     notice_period: Number(e.target.value),
//                   })
//                 }
//                 placeholder="Notice Period (days)"
//               />
//               <Select
//                 value={editForm.status}
//                 onValueChange={value =>
//                   setEditForm({
//                     ...editForm,
//                     status: value as 'pending' | 'approved' | 'rejected',
//                   })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="approved">Approved</SelectItem>
//                   <SelectItem value="rejected">Rejected</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <DialogFooter className="flex justify-end gap-2">
//             <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={submitEdit}>Save</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default ExitRequest;

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, Trash2 } from 'lucide-react';

import { Search } from 'lucide-react';
import axiosInstance from '@/components/apiconfig/axios';
import { API_URLS } from '@/components/apiconfig/api_urls';
// import { error } from 'console';

// import { ToastContainer, toast } from 'react-toastify';

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

function ExitRequest({ role }: ExitRequestProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resignation, setResignation] = useState([]);
  const [loading, setLoading] = useState(false);

  const getResignation = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        API_URLS.RESIGNATION.GET_RESIGNATIONS
      );
      setResignation(res.data.data || []);
    } catch (error) {
      console.error('Error fetching resignation');
      setResignation([]);
    }
    setLoading(true);
  };

  useEffect(() => {
    getResignation();
  }, []);

  const handleDeleteResignation = async (uuid: String) => {
    try {
      const res = await axiosInstance.delete(
        API_URLS.RESIGNATION.DELETE_RESIGNATION_BY_UUID(uuid)
      );
      alert('Resignation deleted successfully');
      getResignation();
    } catch (error) {
      console.error('Deleting resignatin error', error);
    }
  };

  const updateresignationStatus = async (
    uuid: String,
    newStatus: String,
    prevStatus: String
  ) => {
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
      await getResignation();
      alert('Succesfully status updated');
    } catch (error) {
      console.error('Failing update status', error);
      alert('Failed to update status');
      setResignation(prev =>
        prev.map(item =>
          item.uuid === uuid ? { ...item, status: prevStatus } : item
        )
      );
    }
  };

  const filteredRequests = resignation.filter(req => {
    const matchesSearch =
      req.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      req.employee_id.toLowerCase().includes(search.toLowerCase()) ||
      (req.department?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                  placeholder="Search by name, ID, or department..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <CardTitle>Exit Requests ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border border-border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Resignation Date</TableHead>
                      <TableHead>Last Working Date</TableHead>
                      <TableHead>Notice Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-muted-foreground"
                        >
                          No exit requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map(req => (
                        <TableRow key={req.uuid}>
                          <TableCell>
                            <div className="font-medium">
                              {req.employee_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {req.employee_id} • {req.designation}
                            </div>
                          </TableCell>
                          <TableCell>{req.department}</TableCell>
                          <TableCell>
                            {req.resignation_date && (
                              <span>
                                {new Date(
                                  req.resignation_date
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {req.last_working_date && (
                              <span>
                                {new Date(
                                  req.last_working_date
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {req.notice_period} days
                            </span>
                          </TableCell>
                          <TableCell>
                            {role === 'hr' ? (
                              // HR sees dropdown for updating status
                              <Select
                                value={req.status}
                                onValueChange={value =>
                                  updateresignationStatus(
                                    req.uuid,
                                    value,
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
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="approved">
                                    Approved
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              // Admin just sees text badge
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ExitRequest;
