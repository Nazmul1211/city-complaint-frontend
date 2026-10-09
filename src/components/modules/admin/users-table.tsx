"use client";

import {
  Ban,
  CheckCircle2,
  Mail,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useAdminDeleteUser, useDebounce, useGetUsers } from "@/hooks";
import type { User, UserRole, UserStatus } from "@/types";

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const {
    data: usersResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useGetUsers({
    role: selectedRole !== "ALL" ? selectedRole : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
    searchTerm: debouncedSearch || undefined,
    limit: 100,
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } =
    useAdminDeleteUser();

  const users: User[] = useMemo(() => {
    return usersResponse?.data || [];
  }, [usersResponse]);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch.trim()) return users;
    const q = debouncedSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        Boolean(u.phone?.toLowerCase().includes(q)),
    );
  }, [users, debouncedSearch]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleDelete = async (user: User) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate account for "${user.name}" (${user.email})?`,
      )
    ) {
      return;
    }

    try {
      await deleteUser(user.id);
    } catch {
      // toast is already handled in mutation hook
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <Badge variant="destructive" className="font-mono text-[10px] gap-1">
            <ShieldAlert className="size-3" />
            SUPER ADMIN
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="warning" className="font-mono text-[10px] gap-1">
            <Shield className="size-3" />
            ADMIN
          </Badge>
        );
      case "STAFF":
        return (
          <Badge variant="info" className="font-mono text-[10px] gap-1">
            <UserCheck className="size-3" />
            STAFF
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-mono text-[10px]">
            CITIZEN
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge variant="success" className="text-[10px] gap-1">
            <CheckCircle2 className="size-2.5" />
            ACTIVE
          </Badge>
        );
      case "BLOCKED":
        return (
          <Badge variant="destructive" className="text-[10px] gap-1">
            <Ban className="size-2.5" />
            BLOCKED
          </Badge>
        );
      case "DELETED":
        return (
          <Badge
            variant="outline"
            className="text-[10px] text-muted-foreground gap-1"
          >
            <UserX className="size-2.5" />
            DELETED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card className="shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 text-xs h-9"
              />
            </div>

            <div className="w-full sm:w-40">
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by role"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Roles</option>
                <option value="CITIZEN">Citizens</option>
                <option value="STAFF">Staff / Techs</option>
                <option value="ADMIN">Administrators</option>
                <option value="SUPER_ADMIN">Super Admins</option>
              </select>
            </div>

            <div className="w-full sm:w-36">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by account status"
                className="w-full h-9 rounded-md border border-input bg-background px-2.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="DELETED">DELETED</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="gap-1.5 h-9"
            >
              <RefreshCw
                className={`size-3.5 ${isRefetching ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Data Table */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="p-4 pb-2 border-b">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>Municipal Users & Authorities</span>
              <span className="text-xs font-normal text-muted-foreground">
                ({filteredUsers.length} total)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[240px] text-xs">
                    User Profile
                  </TableHead>
                  <TableHead className="text-xs">Contact Details</TableHead>
                  <TableHead className="w-[130px] text-xs">Role</TableHead>
                  <TableHead className="w-[110px] text-xs">
                    Account Status
                  </TableHead>
                  <TableHead className="w-[120px] text-xs">
                    Registered
                  </TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  ["sk-u1", "sk-u2", "sk-u3", "sk-u4", "sk-u5"].map(
                    (rowKey) => (
                      <TableRow key={rowKey}>
                        <TableCell>
                          <Skeleton className="h-4 w-36 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-20 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16 rounded-md" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-7 w-8 ml-auto rounded-md" />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Users className="size-8 stroke-1 text-muted-foreground/60" />
                        <p className="text-sm font-medium">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-muted/40 text-xs"
                    >
                      {/* Name & Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate">
                              {user.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate font-mono">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Details */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-foreground truncate">
                            <Mail className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell>{getRoleBadge(user.role)}</TableCell>

                      {/* Account Status */}
                      <TableCell>{getStatusBadge(user.status)}</TableCell>

                      {/* Registered Date */}
                      <TableCell className="text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        {user.role !== "SUPER_ADMIN" &&
                          user.status !== "DELETED" && (
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => handleDelete(user)}
                              disabled={isDeleting}
                              title="Deactivate user account"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-3 border-t bg-muted/20">
            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
