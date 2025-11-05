"use client"

import Link from "next/link"
import { MoreVertical, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react";
import { getBulletins } from "@/api/bulletin"
import { Bulletin } from "@/types/bulletin";
import { getTagColor, getTagName } from "@/utils/tagMap";


export function BulletinCards() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBulletins = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getBulletins();
        setBulletins(res.data); 
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch bulletins");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchBulletins();
  }, []); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
          <Link key={bulletin.bulletinID} href={`/bulletin/${bulletin.bulletinID}`}>
            <Card className="flex flex-col h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer overflow-hidden">
              {/* Poster Image */}
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={bulletin.image || "/placeholder.svg"}
                  alt={bulletin.title}
                  fill
                  className="object-cover"
                />
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{bulletin.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{bulletin.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {bulletin.tags.map((tag)=>(
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <div className={`h-2 w-2 rounded-full ${getTagColor(tag)} mr-1.5`} />
                        {getTagName(tag)}
                     </Badge>
                  ))}
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
                  {bulletin.groupID.length} Collaboration Groups 
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
