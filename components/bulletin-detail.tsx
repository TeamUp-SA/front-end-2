"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Clock, UsersIcon, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Mock data
const bulletinData: Record<string, any> = {
  "1": {
    name: "Tech Conference 2025",
    description:
      "Join us for the annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing. Network with industry leaders, attend workshops, and discover cutting-edge technologies that will shape the future. This event brings together developers, entrepreneurs, and tech enthusiasts from around the world.",
    category: "Conference",
    categoryColor: "bg-purple-500",
    posterImage: "/tech-conference-poster-banner.jpg",
    date: "March 20, 2025",
    time: "9:00 AM - 6:00 PM",
    collabGroups: [
      { id: 1, name: "AI Hackathon 2025" },
      { id: 2, name: "Climate Change Research" },
    ],
    authorID: "current-user-id", // Mock current user ID
  },
}

export function BulletinDetail({ id }: { id: string }) {
  const bulletin = bulletinData[id] || bulletinData["1"]

  const currentUserID = "current-user-id" // Mock - should come from auth context
  const isAuthor = bulletin.authorID === currentUserID

  const handleDelete = () => {
    /* TODO: plug backend */
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link href="/bulletin">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Bulletins
          </Button>
        </Link>
        {isAuthor && (
          <div className="flex gap-2">
            <Link href={`/bulletin/edit/${id}`}>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Poster Image */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted">
        <Image src={bulletin.posterImage || "/placeholder.svg"} alt={bulletin.name} fill className="object-cover" />
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{bulletin.name}</h1>
            <Badge variant="secondary" className="text-sm">
              <div className={`h-2 w-2 rounded-full ${bulletin.categoryColor} mr-1.5`} />
              {bulletin.category}
            </Badge>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">{bulletin.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">{bulletin.time}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{bulletin.description}</p>
        </CardContent>
      </Card>

      {/* Related Collaboration Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Related Collaboration Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bulletin.collabGroups.map((group: any) => (
              <Link key={group.id} href={`/collab-group/${group.id}`}>
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer border border-border">
                  <div className="flex items-center gap-3">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{group.name}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Group
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
