"use client"

import { MoreVertical, Users, Calendar, TrendingUp, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const groups = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design",
    status: "In Progress",
    statusColor: "bg-blue-500",
    members: [
      { name: "Alice Johnson", avatar: "/diverse-woman-portrait.png" },
      { name: "Bob Smith", avatar: "/man.jpg" },
      { name: "Carol White", avatar: "/diverse-woman-portrait.png" },
      { name: "David Brown", avatar: "/man.jpg" },
    ],
    dueDate: "Dec 15, 2025",
    progress: 65,
    comments: 24,
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native iOS and Android app for customer engagement",
    status: "In Progress",
    statusColor: "bg-blue-500",
    members: [
      { name: "Emma Davis", avatar: "/diverse-woman-portrait.png" },
      { name: "Frank Miller", avatar: "/man.jpg" },
      { name: "Grace Lee", avatar: "/diverse-woman-portrait.png" },
    ],
    dueDate: "Jan 20, 2026",
    progress: 42,
    comments: 18,
  },
  {
    id: 3,
    name: "Marketing Campaign Q1",
    description: "Launch new product line with integrated marketing strategy",
    status: "Planning",
    statusColor: "bg-yellow-500",
    members: [
      { name: "Henry Wilson", avatar: "/man.jpg" },
      { name: "Iris Taylor", avatar: "/diverse-woman-portrait.png" },
      { name: "Jack Anderson", avatar: "/man.jpg" },
      { name: "Kate Thomas", avatar: "/diverse-woman-portrait.png" },
      { name: "Liam Moore", avatar: "/man.jpg" },
    ],
    dueDate: "Feb 1, 2026",
    progress: 15,
    comments: 32,
  },
  {
    id: 4,
    name: "Data Analytics Platform",
    description: "Build internal dashboard for real-time business insights",
    status: "In Progress",
    statusColor: "bg-blue-500",
    members: [
      { name: "Maya Jackson", avatar: "/diverse-woman-portrait.png" },
      { name: "Noah Martin", avatar: "/man.jpg" },
    ],
    dueDate: "Dec 30, 2025",
    progress: 78,
    comments: 15,
  },
  {
    id: 5,
    name: "Customer Support Portal",
    description: "Self-service portal with AI-powered chatbot integration",
    status: "Review",
    statusColor: "bg-purple-500",
    members: [
      { name: "Olivia Garcia", avatar: "/diverse-woman-portrait.png" },
      { name: "Paul Rodriguez", avatar: "/man.jpg" },
      { name: "Quinn Martinez", avatar: "/diverse-woman-portrait.png" },
    ],
    dueDate: "Nov 28, 2025",
    progress: 92,
    comments: 41,
  },
  {
    id: 6,
    name: "Infrastructure Upgrade",
    description: "Migrate to cloud infrastructure with improved scalability",
    status: "Planning",
    statusColor: "bg-yellow-500",
    members: [
      { name: "Ryan Hernandez", avatar: "/man.jpg" },
      { name: "Sophia Lopez", avatar: "/diverse-woman-portrait.png" },
      { name: "Tyler Gonzalez", avatar: "/man.jpg" },
      { name: "Uma Wilson", avatar: "/diverse-woman-portrait.png" },
    ],
    dueDate: "Mar 15, 2026",
    progress: 8,
    comments: 12,
  },
]

export function GroupCards() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Collaboration Groups</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and track your team projects in one place</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create Group</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">Across all teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">On track for Q4</p>
          </CardContent>
        </Card>
      </div>

      {/* Group Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="flex flex-col hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="text-xs">
                  <div className={`h-2 w-2 rounded-full ${group.statusColor} mr-1.5`} />
                  {group.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{group.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${group.progress}%` }} />
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-card">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {group.members.length > 4 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-xs font-medium">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>{group.comments}</span>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due {group.dueDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
