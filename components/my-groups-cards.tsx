"use client"

import Link from "next/link"
import { Calendar, Clock, UsersIcon } from "lucide-react"
import { Card, CardContent,CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { Group } from "@/types/group"
import { getGroups } from "@/api/group"
import { MoreVertical, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTagColor, getTagName } from "@/utils/tagMap"



export function MyGroupsCards() {
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([]); // my groups only
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // current user
  const currentUser = useCurrentUser();
  const currentUserID = currentUser?.memberID;
 
 const fetchGroups = async () => {
        try {
          setLoading(true);
          setError(null);
  
          const res = await getGroups();
          
          const myGroups = res.data.filter(
            (group: Group) => group.members?.includes(currentUserID)
          );
          console.log("MY groups",myGroups)
          setGroups(myGroups); 

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


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {!groups || groups.length === 0 ? (
        <div className="text-muted-foreground py-10">
          No collaboration groups
        </div>
      ) : (
        groups.map((group) => (
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
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <div className={`h-2 w-2 rounded-full ${getTagColor(tag)} mr-1.5`} />
                      {getTagName(tag)}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <div className="text-sm text-muted-foreground">
                  {group.members.length} Members
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Event Date {group.date}</span>
                </div>

                  <Button
                    variant="secondary"
                    className="w-full bg-muted text-muted-foreground hover:bg-muted/80 cursor-default"
                    disabled
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Joined
                  </Button>
               
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  )
}
