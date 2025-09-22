"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const data = [
  {
    id: 1,
    name: "Haul Truck #001",
    email: "Truck-001@elysium.com",
    status: "active",
    lastUpdated: "2024-01-15",
    role: "CAT 797F"
  },
  {
    id: 2,
    name: "Excavator #045",
    email: "Excavator-045@elysium.com",
    status: "maintenance",
    lastUpdated: "2024-01-14",
    role: "CAT 6020B"
  },
  {
    id: 3,
    name: "Haul Truck #012",
    email: "Truck-012@elysium.com",
    status: "active",
    lastUpdated: "2024-01-13",
    role: "CAT 797F"
  },
  {
    id: 4,
    name: "Drill Rig #008",
    email: "Drill-008@elysium.com",
    status: "active",
    lastUpdated: "2024-01-12",
    role: "Sandvik DP1500"
  },
  {
    id: 5,
    name: "Haul Truck #023",
    email: "Truck-023@elysium.com",
    status: "active",
    lastUpdated: "2024-01-11",
    role: "CAT 797F"
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "maintenance":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "inactive":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export function DataTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="card-hover glow-effect-hover border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
                        <CardTitle className="text-lg font-semibold">Mining Fleet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Equipment</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Updated</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-border/20 hover:bg-accent/20 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium">{user.name}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{user.role}</td>
                    <td className="py-3 px-4 text-muted-foreground">{user.lastUpdated}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-400 focus:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
