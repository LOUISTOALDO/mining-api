"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Users, Shield, Eye, Settings, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "operator" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@elysium.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
    permissions: ["read", "write", "delete", "admin"]
  },
  {
    id: "2",
    name: "Sarah Martinez",
    email: "sarah.martinez@elysium.com",
    role: "operator",
    status: "active",
    lastLogin: "2024-01-15T09:15:00Z",
    permissions: ["read", "write"]
  },
  {
    id: "3",
    name: "David Kim",
    email: "david.kim@elysium.com",
    role: "viewer",
    status: "active",
    lastLogin: "2024-01-14T16:45:00Z",
    permissions: ["read"]
  },
  {
    id: "4",
    name: "Emma Thompson",
    email: "emma.thompson@elysium.com",
    role: "operator",
    status: "inactive",
    lastLogin: "2024-01-10T14:20:00Z",
    permissions: ["read", "write"]
  }
]

const rolePermissions = {
  admin: ["read", "write", "delete", "admin"],
  operator: ["read", "write"],
  viewer: ["read"]
}

const roleColors = {
  admin: "bg-red-100 text-red-800 border-red-200",
  operator: "bg-blue-100 text-blue-800 border-blue-200",
  viewer: "bg-green-100 text-green-800 border-green-200"
}

export function UserRoles() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />
      case "operator":
        return <Settings className="w-4 h-4" />
      case "viewer":
        return <Eye className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const formatLastLogin = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  const handleRoleChange = (userId: string, newRole: "admin" | "operator" | "viewer") => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole, permissions: rolePermissions[newRole] }
        : user
    ))
  }

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user roles and permissions for Elysium Systems</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(rolePermissions).map(([role, permissions]) => (
          <Card key={role} className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                {getRoleIcon(role)}
                <span className="capitalize">{role}s</span>
                <Badge className={cn("ml-auto", roleColors[role as keyof typeof roleColors])}>
                  {users.filter(u => u.role === role).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {permissions.map(permission => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Permissions</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={cn("inline-flex items-center space-x-1", roleColors[user.role])}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        className={cn(
                          "cursor-pointer",
                          user.status === "active" 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        )}
                        onClick={() => handleStatusToggle(user.id)}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
