import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import axiosInstance from "@/components/apiconfig/axios";
import { API_URLS } from "@/components/apiconfig/api_urls";
import { useToast } from "@/hooks/use-toast";

interface HRData {
  id: number;
  account: number;
  name: string;
  email: string;
  contact: string;
  address: string;
  role: number;
  status: "active" | "inactive";
  created_date: string;
  created_by: string;
  password_display: string;
}

interface RoleData {
  id: number;
  name: string;
  description?: string;
}

interface APIResponse {
  code: number;
  message: string;
  data: HRData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface RolesAPIResponse {
  code: number;
  message: string;
  data: RoleData[];
}

interface CreateHRData {
  name: string;
  email: string;
  contact: string;
  address: string;
  role: number;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
  role?: string;
  password?: string;
}

// Note: Axios interceptors are now handled centrally in axios.js

const HRManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hrData, setHrData] = useState<HRData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHR, setEditingHR] = useState<HRData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<CreateHRData>({
    name: "",
    email: "",
    contact: "",
    address: "",
    role: 1,
    password: ""
  });
  const { toast } = useToast();

  // Fetch HR data on component mount
  useEffect(() => {
    fetchHRData();
    fetchRoles();
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Contact validation
    const contactRegex = /^[0-9]{10,15}$/;
    if (!formData.contact.trim()) {
      errors.contact = "Contact number is required";
    } else if (!contactRegex.test(formData.contact.replace(/\s+/g, ''))) {
      errors.contact = "Please enter a valid contact number (10-15 digits)";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Please select a role";
    }

    // Password validation (only for new HR)
    if (!editingHR) {
      if (!formData.password.trim()) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchHRData = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_URLS.HR.GET_HR);
      const apiResponse: APIResponse = response.data;
      
      // Ensure data is an array
      if (apiResponse && Array.isArray(apiResponse.data)) {
        setHrData(apiResponse.data);
      } else {
        setHrData([]);
        console.warn("HR data is not in expected format:", apiResponse);
      }
    } catch (error) {
      console.error("Error fetching HR data:", error);
      setHrData([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch HR data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      // Create a separate axios instance without authorization for roles API
      const axios = require('axios');
      const response = await axios.get(API_URLS.ROLES.GET_ROLES);
      const apiResponse: RolesAPIResponse = response.data;
      
      console.log("Roles API Response:", response); // Debug log
      
      // Handle the response structure based on your screenshot
      if (apiResponse && Array.isArray(apiResponse.data)) {
        setRoles(apiResponse.data);
      } else if (apiResponse && apiResponse.code === 200 && Array.isArray(apiResponse.data)) {
        setRoles(apiResponse.data);
      } else {
        setRoles([]);
        console.warn("Roles data is not in expected format:", apiResponse);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    }
  };

  const handleCreateHR = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post(API_URLS.HR.POST_HR, formData);
      toast({
        title: "Success",
        description: "HR personnel created successfully",
      });
      setIsModalOpen(false);
      resetForm();
      fetchHRData();
      
    } catch (error: any) {
      console.error("Error creating HR:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to create HR personnel";
      toast({
        title: "Error",
        description: typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHR = async () => {
    if (!editingHR) return;

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { password, ...updateData } = formData;
      await axiosInstance.patch(API_URLS.HR.PATCH_HR(editingHR.id), updateData);
      toast({
        title: "Success",
        description: "HR personnel updated successfully",
      });
      setIsModalOpen(false);
      setEditingHR(null);
      resetForm();
      fetchHRData();
    } catch (error: any) {
      console.error("Error updating HR:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Failed to update HR personnel";
      toast({
        title: "Error",
        description: typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHR = async (id: number) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_URLS.HR.DELETE_HR(id));
      toast({
        title: "Success",
        description: "HR personnel deleted successfully",
      });
      fetchHRData();
    } catch (error) {
      console.error("Error deleting HR:", error);
      toast({
        title: "Error",
        description: "Failed to delete HR personnel",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      contact: "",
      address: "",
      role: 1,
      password: ""
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const handleEdit = (hr: HRData) => {
    setEditingHR(hr);
    setFormData({
      name: hr.name,
      email: hr.email,
      contact: hr.contact,
      address: hr.address,
      role: hr.role,
      password: ""
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingHR(null);
    resetForm();
    setIsModalOpen(true);
  };

  const getRoleName = (roleId: number) => {
    // Safely check if roles array exists and find the role
    if (!Array.isArray(roles) || roles.length === 0) {
      return `Role ${roleId}`;
    }
    
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : `Role ${roleId}`;
  };

  const handleInputChange = (field: keyof CreateHRData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  // Safely filter HR data with proper checks
  const filteredHRData = Array.isArray(hrData) ? hrData.filter(hr => {
    if (!hr) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = hr.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = hr.email?.toLowerCase().includes(searchLower) || false;
    const roleMatch = getRoleName(hr.role).toLowerCase().includes(searchLower);
    
    return nameMatch || emailMatch || roleMatch;
  }) : [];

  // Safe roles filtering for the select dropdown
  const availableRoles = Array.isArray(roles) ? roles.filter(role => 
    role && role.name && role.name.toLowerCase() !== 'admin'
  ) : [];

  console.log(availableRoles);
  
  console.log(roles);
  

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">HR Management</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New HR
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>HR Personnel</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search HR personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredHRData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No HR personnel found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHRData.map((hr) => (
                    <TableRow key={hr.id}>
                      <TableCell className="font-medium">{hr.name || 'N/A'}</TableCell>
                      <TableCell>{hr.email || 'N/A'}</TableCell>
                      <TableCell>{hr.contact || 'N/A'}</TableCell>
                      <TableCell>{getRoleName(hr.role)}</TableCell>
                      <TableCell>
                        <Badge variant={hr.status === "active" ? "default" : "secondary"}>
                          {hr.status || 'inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {hr.created_date ? new Date(hr.created_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(hr)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the HR personnel.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteHR(hr.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit HR Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingHR ? "Edit HR Personnel" : "Add New HR Personnel"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                placeholder="Enter contact number"
                className={formErrors.contact ? "border-red-500" : ""}
              />
              {formErrors.contact && (
                <p className="text-sm text-red-500">{formErrors.contact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter address"
                rows={3}
                className={formErrors.address ? "border-red-500" : ""}
              />
              {formErrors.address && (
                <p className="text-sm text-red-500">{formErrors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={formData.role.toString()} 
                onValueChange={(value) => handleInputChange('role', parseInt(value))}
              >
                <SelectTrigger className={formErrors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map(role => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.role && (
                <p className="text-sm text-red-500">{formErrors.role}</p>
              )}
            </div>

            {!editingHR && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    className={formErrors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formErrors.password && (
                  <p className="text-sm text-red-500">{formErrors.password}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingHR(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingHR ? handleUpdateHR : handleCreateHR}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editingHR ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRManagement;