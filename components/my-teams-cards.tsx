"use client"

import Link from "next/link"
import { Calendar, Clock, UsersIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - groups the user has joined
const joinedGroups = [
  {
    id: "1",
    name: "AI Hackathon 2025",
    description: "Build innovative AI solutions for real-world problems.",
    category: "Hackathon",
    categoryColor: "bg-orange-500",
    date: "Dec 15, 2025",
    time: "9:00 AM",
    members: [
      { name: "Alice Johnson", avatar: "/diverse-woman-portrait.png" },
      { name: "Bob Smith", avatar: "/man.jpg" },
      { name: "Carol White", avatar: "/diverse-woman-portrait.png" },
    ],
    memberCount: 12,
  },
  {
    id: "2",
    name: "Climate Research Initiative",
    description: "Collaborative research on climate change solutions.",
    category: "Research",
    categoryColor: "bg-green-500",
    date: "Jan 10, 2026",
    time: "2:00 PM",
    members: [
      { name: "David Brown", avatar: "/man.jpg" },
      { name: "Emma Davis", avatar: "/diverse-woman-portrait.png" },
    ],
    memberCount: 8,
  },
  {
    id: "3",
    name: "Mobile App Development",
    description: "Building a cross-platform mobile application.",
    category: "Project",
    categoryColor: "bg-blue-500",
    date: "Ongoing",
    time: "Flexible",
    members: [
      { name: "Frank Wilson", avatar: "/man.jpg" },
      { name: "Grace Lee", avatar: "/diverse-woman-portrait.png" },
      { name: "Henry Chen", avatar: "/man.jpg" },
    ],
    memberCount: 15,
  },
]

export function MyTeamsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {joinedGroups.map((group) => (
        <Link key={group.id} href={`/collab-group/${group.id}`}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  <div className={`h-2 w-2 rounded-full ${group.categoryColor} mr-1.5`} />
                  {group.category}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-2">{group.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{group.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{group.time}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {group.members.slice(0, 3).map((member, i) => (
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
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <UsersIcon className="h-4 w-4" />
                <span>{group.memberCount}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
