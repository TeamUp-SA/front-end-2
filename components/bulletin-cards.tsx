"use client"

import Link from "next/link"
import { MoreVertical, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const bulletins = [
  {
    id: 1,
    name: "Tech Conference 2025",
    description: "Annual technology conference featuring the latest innovations",
    category: "Conference",
    categoryColor: "bg-purple-500",
    posterImage: "/tech-2.webp",
    date: "March 20, 2025",
    collabGroups: [1, 2],
  },
  {
    id: 2,
    name: "Design Workshop",
    description: "Learn modern design principles and tools",
    category: "Workshop",
    categoryColor: "bg-pink-500",
    posterImage: "/design-workshop-poster.jpg",
    date: "February 15, 2025",
    collabGroups: [3],
  },
  {
    id: 3,
    name: "Startup Pitch Night",
    description: "Present your startup idea to investors",
    category: "Event",
    categoryColor: "bg-indigo-500",
    posterImage: "/startup-pitch-event-poster.jpg",
    date: "January 30, 2025",
    collabGroups: [5],
  },
  {
    id: 4,
    name: "AI Research Symposium",
    description: "Showcase cutting-edge AI research and findings",
    category: "Conference",
    categoryColor: "bg-purple-500",
    posterImage: "/ai-research-symposium-poster.jpg",
    date: "April 10, 2025",
    collabGroups: [2, 4],
  },
  {
    id: 5,
    name: "Code Bootcamp",
    description: "Intensive coding bootcamp for beginners",
    category: "Workshop",
    categoryColor: "bg-pink-500",
    posterImage: "/coding-bootcamp-poster.jpg",
    date: "May 5, 2025",
    collabGroups: [3, 6],
  },
  {
    id: 6,
    name: "Innovation Summit",
    description: "Explore the future of technology and innovation",
    category: "Event",
    categoryColor: "bg-indigo-500",
    posterImage: "/innovation-summit-poster.jpg",
    date: "June 12, 2025",
    collabGroups: [1, 5, 6],
  },
]

export function BulletinCards() {
  const handleCreateBulletin = () => {
    /* TODO: plug backend */
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Bulletin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Discover upcoming events and opportunities</p>
        </div>
        <Button onClick={handleCreateBulletin} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Create Bulletin
        </Button>
      </div>

      {/* Bulletin Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bulletins.map((bulletin) => (
          <Link key={bulletin.id} href={`/bulletin/${bulletin.id}`}>
            <Card className="flex flex-col h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer overflow-hidden">
              {/* Poster Image */}
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={bulletin.posterImage || "/placeholder.svg"}
                  alt={bulletin.name}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{bulletin.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{bulletin.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary" className="text-xs">
                    <div className={`h-2 w-2 rounded-full ${bulletin.categoryColor} mr-1.5`} />
                    {bulletin.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{bulletin.date}</span>
                </div>

                {/* Collab Groups Count */}
                <div className="text-sm text-muted-foreground">
                  {bulletin.collabGroups.length} Collaboration {bulletin.collabGroups.length === 1 ? "Group" : "Groups"}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
