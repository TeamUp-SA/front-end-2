"use client"

import type React from "react"

import Link from "next/link"
import { MoreVertical, Calendar, UsersIcon, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Group } from "@/types/group"
import { useState, useEffect } from "react"
import { getGroups } from "@/api/group"
import { getTagColor, getTagName } from "@/utils/tagMap"

// const groups = [
//   {
//     id: 1,
//     name: "AI Hackathon 2025",
//     description: "Build innovative AI solutions for real-world problems",
//     category: "Hackathon",
//     categoryColor: "bg-orange-500",
//     members: [
//       { name: "Alice Johnson", avatar: "/diverse-woman-portrait.png" },
//       { name: "Bob Smith", avatar: "/man.jpg" },
//       { name: "Carol White", avatar: "/diverse-woman-portrait.png" },
//     ],
//     dueDate: "Dec 15, 2025",
//     memberCount: 24,
//     isJoined: true, // Added isJoined flag
//   },
//   {
//     id: 2,
//     name: "Climate Change Research",
//     description: "Analyzing environmental data to predict climate patterns",
//     category: "Research",
//     categoryColor: "bg-green-500",
//     members: [
//       { name: "Emma Davis", avatar: "/diverse-woman-portrait.png" },
//       { name: "Frank Miller", avatar: "/man.jpg" },
//       { name: "Grace Lee", avatar: "/diverse-woman-portrait.png" },
//     ],
//     dueDate: "Jan 20, 2026",
//     memberCount: 12,
//     isJoined: false,
//   },
//   {
//     id: 3,
//     name: "Mobile App Development",
//     description: "Creating a cross-platform mobile application",
//     category: "Project",
//     categoryColor: "bg-blue-500",
//     members: [
//       { name: "Henry Wilson", avatar: "/man.jpg" },
//       { name: "Iris Taylor", avatar: "/diverse-woman-portrait.png" },
//       { name: "Jack Anderson", avatar: "/man.jpg" },
//     ],
//     dueDate: "Feb 1, 2026",
//     memberCount: 18,
//     isJoined: true,
//   },
//   {
//     id: 4,
//     name: "Quantum Computing Study",
//     description: "Exploring quantum algorithms and their applications",
//     category: "Research",
//     categoryColor: "bg-green-500",
//     members: [
//       { name: "Maya Jackson", avatar: "/diverse-woman-portrait.png" },
//       { name: "Noah Martin", avatar: "/man.jpg" },
//     ],
//     dueDate: "Dec 30, 2025",
//     memberCount: 8,
//     isJoined: false,
//   },
//   {
//     id: 5,
//     name: "Startup Weekend",
//     description: "48-hour event to launch your startup idea",
//     category: "Hackathon",
//     categoryColor: "bg-orange-500",
//     members: [
//       { name: "Olivia Garcia", avatar: "/diverse-woman-portrait.png" },
//       { name: "Paul Rodriguez", avatar: "/man.jpg" },
//       { name: "Quinn Martinez", avatar: "/diverse-woman-portrait.png" },
//     ],
//     dueDate: "Nov 28, 2025",
//     memberCount: 45,
//     isJoined: false,
//   },
//   {
//     id: 6,
//     name: "Web3 Development",
//     description: "Building decentralized applications on blockchain",
//     category: "Project",
//     categoryColor: "bg-blue-500",
//     members: [
//       { name: "Ryan Hernandez", avatar: "/man.jpg" },
//       { name: "Sophia Lopez", avatar: "/diverse-woman-portrait.png" },
//       { name: "Tyler Gonzalez", avatar: "/man.jpg" },
//     ],
//     dueDate: "Mar 15, 2026",
//     memberCount: 15,
//     isJoined: true,
//   },
// ]

export function CollabGroupCards() {
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getGroups();
        // console.log("groups",res)
        setGroups(res.data); 
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch groups");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchGroups();
  }, []); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const handleCreateGroup = () => {
    /* TODO: plug backend */
    router.push("/collab-group/create")
  }

  const handleJoinGroup = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault() // Prevent navigation when clicking join button
    /* TODO: plug backend */
  }

  /*mock user_id TODO: getfrom auth context */
  const currentUserID = "507f1f77bcf86cd799439013" // TODO!! now is Mock - it should come from auth context
  const isJoined = (groupID: string) => {
    const group = groups.find(g => g.groupID === groupID)
    if (!group) return false
    return group.members.includes(currentUserID);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Collab Group</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join collaboration groups and work together on exciting projects
          </p>
        </div>
        <Button onClick={handleCreateGroup} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Create Group
        </Button>
      </div>

      {/* Group Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.groupID} href={`/collab-group/${group.groupID}`}>
            <Card className="flex flex-col h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    {group.tags.map((tag)=>(
                            <Badge key={tag} variant="secondary" className="text-xs">
                                  <div className={`h-2 w-2 rounded-full ${getTagColor(tag)} mr-1.5`} />
                                      {getTagName(tag)}
                              </Badge>
                                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {/* Members */}
                {/* Collab Groups Count */}
                <div className="text-sm text-muted-foreground">
                  {group.members.length} Members
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Event Date {group.date}</span>
                </div>

                {isJoined(group.groupID) ? (
                  <Button
                    variant="secondary"
                    className="w-full bg-muted text-muted-foreground hover:bg-muted/80 cursor-default"
                    disabled
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Joined
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => handleJoinGroup(e, group.groupID)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Join Group
                  </Button>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
