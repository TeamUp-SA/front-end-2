"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Clock, UsersIcon, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useEffect, useState } from "react";
import { Bulletin } from "@/types/bulletin";
import { useRouter } from "next/navigation";
import { getBulletinById, deleteBulletin } from "@/api/bulletin"
import { getTagColor, getTagName } from "@/utils/tagMap";
import { getGroupById } from "@/api/group"


export function BulletinDetail({ id }: { id: string }) {
  const [bulletin, setBulletin] = useState<Bulletin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  
  const router = useRouter();
  
  const fetchBulletin = async () => {
        try {
          setLoading(true);
          setError(null);

          const res = await getBulletinById(id);
          setBulletin(res.data); 
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to fetch bulletin");
          console.log(err);
        } finally {
          setLoading(false);
        }
  };
  
  const fetchGroups = async () => {
      if (!bulletin?.groupID) return;

      const groupData = await Promise.all(
        bulletin.groupID.map((id) => getGroupById(id))
      );
      setGroups(groupData);
  };

  useEffect(() => {
      fetchBulletin();
  }, [id]); 

  useEffect(()=> {
    fetchGroups();
  }, [bulletin?.groupID])
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const currentUserID = "507f1f77bcf86cd799439011" // TODO!! now is Mock - it should come from auth context
  const isAuthor = bulletin?.authorID === currentUserID

  const handleDelete = async () => {
  if (!bulletin) return;

  try {
    const confirmed = window.confirm("Are you sure you want to delete this bulletin?");
    if (!confirmed) return;

    await deleteBulletin(id);

    router.push("/bulletin");
  } catch (err: any) {
    console.error("Failed to delete bulletin:", err);
    alert(err.response?.data?.message || "Failed to delete bulletin");
  }
  };

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
        <Image src={bulletin?.image || "/placeholder.svg"} alt={bulletin?.title || "placeholder" } fill className="object-cover" />
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{bulletin?.title}</h1>
              <div className="flex items-center gap-2 pt-2">
                    {bulletin?.tags.map((tag)=>(
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <div className={`h-2 w-2 rounded-full ${getTagColor(tag)} mr-1.5`} />
                          {getTagName(tag)}
                      </Badge>
                    ))}
                </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">{bulletin?.date}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{bulletin?.description}</p>
        </CardContent>
      </Card>

      {/* Related Collaboration Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Related Collaboration Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {groups.map((group: any) => (
              <Link key={group.data.groupID} href={`/collab-group/${group.data.groupID}`}>
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer border border-border">
                  <div className="flex items-center gap-3">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{group.data.title}</span>
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
