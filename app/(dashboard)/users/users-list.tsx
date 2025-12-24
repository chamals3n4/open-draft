"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { UserSheet } from "./user-sheet";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface User {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  last_seen_at: string | null;
  created_at: string;
}

interface UsersListProps {
  users: User[];
}

export function UsersList({ users }: UsersListProps) {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default" as const;
      case "editor":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default" as const;
      case "suspended":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles.</p>
        </div>
        <UserSheet
          trigger={
            <Button>
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Add User
            </Button>
          }
        />
      </div>

      <div className="bg-card border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.avatar_url || ""}
                          alt={user.display_name}
                        />
                        <AvatarFallback>
                          {getInitials(user.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.display_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.bio || "No bio"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(user.status)}
                      className="capitalize"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.last_seen_at
                      ? formatDistanceToNow(new Date(user.last_seen_at), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <p className="text-muted-foreground">No users found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your first user to get started.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserSheet user={editUser} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
