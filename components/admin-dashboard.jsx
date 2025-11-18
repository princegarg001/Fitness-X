"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api-client"
import { Activity, Edit2, Shield, Trash2, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, members: 0, trainers: 0, admins: 0 })
  const [selectedUser, setSelectedUser] = useState(null)
  const [newRole, setNewRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAssignTrainerDialog, setShowAssignTrainerDialog] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        const response = await api.users.listUsers(token)
        setUsers(response.users || [])

        // Calculate stats
        const memberCount = response.users.filter((u) => u.role === "member").length
        const trainerCount = response.users.filter((u) => u.role === "trainer").length
        const adminCount = response.users.filter((u) => u.role === "admin").length

        setStats({
          totalUsers: response.users.length,
          members: memberCount,
          trainers: trainerCount,
          admins: adminCount,
        })
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token])

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return

    try {
      await api.users.assignRole(selectedUser._id, newRole, token)

      setUsers(users.map((u) => (u._id === selectedUser._id ? { ...u, role: newRole } : u)))

      const updatedUsers = users.map((u) => (u._id === selectedUser._id ? { ...u, role: newRole } : u))
      const memberCount = updatedUsers.filter((u) => u.role === "member").length
      const trainerCount = updatedUsers.filter((u) => u.role === "trainer").length
      const adminCount = updatedUsers.filter((u) => u.role === "admin").length

      setStats({
        totalUsers: updatedUsers.length,
        members: memberCount,
        trainers: trainerCount,
        admins: adminCount,
      })

      setSelectedUser(null)
      setNewRole("")
    } catch (error) {
      console.error("Error updating role:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      await api.users.deleteUser(userId, token)
      setUsers(users.filter((u) => u._id !== userId))

      const updatedUsers = users.filter((u) => u._id !== userId)
      const memberCount = updatedUsers.filter((u) => u.role === "member").length
      const trainerCount = updatedUsers.filter((u) => u.role === "trainer").length
      const adminCount = updatedUsers.filter((u) => u.role === "admin").length

      setStats({
        totalUsers: updatedUsers.length,
        members: memberCount,
        trainers: trainerCount,
        admins: adminCount,
      })
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleAssignTrainer = async () => {
    if (!selectedUser || !selectedTrainer) return

    try {
      await api.users.assignTrainerToMember(selectedUser._id, selectedTrainer, token)

      setUsers(
        users.map((u) =>
          u._id === selectedUser._id ? { ...u, assignedTrainer: users.find((t) => t._id === selectedTrainer) } : u,
        ),
      )

      setShowAssignTrainerDialog(false)
      setSelectedUser(null)
      setSelectedTrainer("")
    } catch (error) {
      console.error("Error assigning trainer:", error)
    }
  }

  const handleRemoveTrainer = async (memberId) => {
    if (!window.confirm("Remove trainer from this member?")) return

    try {
      await api.users.removeTrainerFromMember(memberId, token)

      setUsers(users.map((u) => (u._id === memberId ? { ...u, assignedTrainer: null } : u)))
    } catch (error) {
      console.error("Error removing trainer:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading admin dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage users and system settings</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Users
              <Users className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Members
              <Activity className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.members}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Trainers
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.trainers}</div>
            <p className="text-xs text-muted-foreground">Training staff</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Admins
              <Shield className="w-4 h-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">Admin users</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.displayName || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "destructive" : user.role === "trainer" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change User Role</DialogTitle>
                              <DialogDescription>Update role for {user.displayName}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="text-sm font-medium">Current Role: {user.role}</label>
                              </div>
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">Member</SelectItem>
                                  <SelectItem value="trainer">Trainer</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button onClick={handleRoleChange} className="w-full">
                                Update Role
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {user.role === "member" && (
                          <Dialog
                            open={showAssignTrainerDialog && selectedUser?._id === user._id}
                            onOpenChange={(open) => {
                              setShowAssignTrainerDialog(open)
                              if (!open) setSelectedUser(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowAssignTrainerDialog(true)
                                }}
                              >
                                Assign Trainer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Trainer to Member</DialogTitle>
                                <DialogDescription>Select a trainer for {user.displayName}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Current Trainer: {user.assignedTrainer?.displayName || "None"}
                                  </label>
                                </div>
                                <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a trainer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {users
                                      .filter((u) => u.role === "trainer")
                                      .map((trainer) => (
                                        <SelectItem key={trainer._id} value={trainer._id}>
                                          {trainer.displayName}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex gap-2">
                                  <Button onClick={handleAssignTrainer} className="flex-1">
                                    Assign Trainer
                                  </Button>
                                  {user.assignedTrainer && (
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleRemoveTrainer(user._id)}
                                      className="flex-1"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user._id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
