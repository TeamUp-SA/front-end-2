"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Clock, UsersIcon, GraduationCap, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - in real app, fetch based on id
const groupData: Record<string, any> = {
  "1": {
    name: "AI Hackathon 2025",
    description:
      "Build innovative AI solutions for real-world problems. This hackathon focuses on creating practical AI applications that can solve everyday challenges. Participants will work in teams to develop prototypes and present their solutions to a panel of judges.",
    category: "Hackathon",
    categoryColor: "bg-orange-500",
    date: "December 15, 2025",
    time: "9:00 AM - 6:00 PM",
    ownerID: "current-user-id", // Mock owner ID
    members: [
      { id: 1, name: "Alice Johnson", avatar: "/diverse-woman-portrait.png", education: "MIT - Computer Science" },
      { id: 2, name: "Bob Smith", avatar: "/man.jpg", education: "Stanford - AI Research" },
      { id: 3, name: "Carol White", avatar: "/diverse-woman-portrait.png", education: "Berkeley - Data Science" },
      { id: 4, name: "David Brown", avatar: "/man.jpg", education: "CMU - Machine Learning" },
      { id: 5, name: "Emma Davis", avatar: "/diverse-woman-portrait.png", education: "Harvard - Computer Science" },
    ],
  },
}

export function CollabGroupDetail({ id }: { id: string }) {
  const group = groupData[id] || groupData["1"]

  const isJoined = ["1", "2", "3"].includes(id)

  const currentUserID = "current-user-id" // Mock - should come from auth context
  const isOwner = group.ownerID === currentUserID

  const handleLeaveGroup = () => {
    /* TODO: plug backend */
  }

  const handleJoinGroup = () => {
    /* TODO: plug backend */
  }

  const handleDelete = () => {
    /* TODO: plug backend */
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Collab Groups
        </Button>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{group.name}</h1>
            <Badge variant="secondary" className="text-sm">
              <div className={`h-2 w-2 rounded-full ${group.categoryColor} mr-1.5`} />
              {group.category}
            </Badge>
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <>
                <Link href={`/collab-group/edit/${id}`}>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleDelete} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            {!isOwner && (
              <>
                {isJoined ? (
                  <Button size="lg" variant="destructive" onClick={handleLeaveGroup}>
                    Leave Group
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleJoinGroup}
                  >
                    Join Group
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">{group.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">{group.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{group.members.length} Members</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{group.description}</p>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {group.members.map((member: any) => (
              <Link key={member.id} href={`/profile/${member.id}`}>
                <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{member.education}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
