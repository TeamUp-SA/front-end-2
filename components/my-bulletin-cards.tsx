"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import Image from "next/image"

// Mock data for bulletins created by the user
const myBulletins = [
  {
    id: 1,
    name: "Tech Conference 2025",
    description:
      "Annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.",
    category: "Conference",
    categoryColor: "bg-purple-500",
    posterImage: "/tech-2.webp",
    date: "March 20, 2025",
    time: "9:00 AM - 6:00 PM",
  },
  {
    id: 2,
    name: "Startup Pitch Night",
    description: "Present your startup ideas to investors and get valuable feedback from industry experts.",
    category: "Networking",
    categoryColor: "bg-blue-500",
    posterImage: "/startup-pitch-event-poster.jpg",
    date: "April 5, 2025",
    time: "6:00 PM - 9:00 PM",
  },
]

export function MyBulletinCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {myBulletins.map((bulletin) => (
        <Link key={bulletin.id} href={`/bulletin/${bulletin.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
            <div className="relative h-48 w-full bg-muted">
              <Image
                src={bulletin.posterImage || "/placeholder.svg"}
                alt={bulletin.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground line-clamp-1">{bulletin.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{bulletin.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <div className={`h-2 w-2 rounded-full ${bulletin.categoryColor} mr-1.5`} />
                  {bulletin.category}
                </Badge>
              </div>

              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{bulletin.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{bulletin.time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
