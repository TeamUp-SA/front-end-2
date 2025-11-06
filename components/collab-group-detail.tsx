"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, Clock, UsersIcon, GraduationCap, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { Group } from "@/types/group"
import { Member } from "@/types/member"
import { useRouter } from "next/navigation"
import { getMemberById } from "@/api/member"
import { getGroupById, updateGroup, deleteGroup} from "@/api/group"
import { getTagColor, getTagName } from "@/utils/tagMap"
import { getRandomColor } from "@/utils/getRandomColor"

// Mock data - in real app, fetch based on id
// const groupData: Record<string, any> = {
//   "1": {
//     name: "AI Hackathon 2025",
//     description:
//       "Build innovative AI solutions for real-world problems. This hackathon focuses on creating practical AI applications that can solve everyday challenges. Participants will work in teams to develop prototypes and present their solutions to a panel of judges.",
//     category: "Hackathon",
//     categoryColor: "bg-orange-500",
//     date: "December 15, 2025",
//     time: "9:00 AM - 6:00 PM",
//     ownerID: "current-user-id", // Mock owner ID
//     members: [
//       { id: 1, name: "Alice Johnson", avatar: "/diverse-woman-portrait.png", education: "MIT - Computer Science" },
//       { id: 2, name: "Bob Smith", avatar: "/man.jpg", education: "Stanford - AI Research" },
//       { id: 3, name: "Carol White", avatar: "/diverse-woman-portrait.png", education: "Berkeley - Data Science" },
//       { id: 4, name: "David Brown", avatar: "/man.jpg", education: "CMU - Machine Learning" },
//       { id: 5, name: "Emma Davis", avatar: "/diverse-woman-portrait.png", education: "Harvard - Computer Science" },
//     ],
//   },
// }
const currentUserID = "68ee328fa32e8622ad6693b3" // TODO!! now is Mock - it should come from auth context

export function CollabGroupDetail({ id }: { id: string }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  
  const router = useRouter();
  
  const fetchGroup = async () => {
        try {
          setLoading(true);
          setError(null);

          const res = await getGroupById(id);
          setGroup(res.data); 
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to fetch group");
          console.log(err);
        } finally {
          setLoading(false);
        }
  };
  
  const fetchMembers = async () => {
      if (!group?.members) return;

      const memberData = await Promise.all(
        group.members.map((id) => getMemberById(id))
      );
      console.log("memberData",memberData);
      setMembers(memberData);
  };

  useEffect(() => {
      fetchGroup();
  }, [id]); 

  useEffect(()=> {
    fetchMembers();
  }, [group?.members])
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const isOwner = group?.ownerID === currentUserID

  const isJoined = group?.members.includes(currentUserID)


  const handleLeaveGroup = async (e: React.MouseEvent) => {
        e.preventDefault() 
        const payload = {
              members: group?.members?.filter(id => id !== currentUserID) ?? []
        };
        console.log("leave group payload", payload, id)
        console.log("id:", id, "length:", id.length, [...id]);
        try {
          const confirmed = window.confirm("Are you sure you want to leave this group?");
          if (!confirmed) return;

          const res = await updateGroup(id as string,payload);
          console.log("leave group successful")
          alert(`Successfully leave group ${group?.title}`);

          router.push("/");
        } catch (err: any) {
          setError(err.response?.data?.message || "Failed to leave group");
          console.log(err);
          alert(`Failed to leave group ${group?.title}`);
        }
      
      }

  const handleJoinGroup = async (e: React.MouseEvent) => {
      e.preventDefault() // Prevent navigation when clicking join button
      /* TODO: plug backend */
      const payload = {
            members: [...(group?.members ?? []), currentUserID]
       };
      try {
        const res = await updateGroup(id,payload);
        console.log("add member successful")
        alert(`Successfully join group ${group?.title}`);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch bulletins");
        console.log(err);
        alert(`Failed to join group ${group?.title}`);
      }
    
    }

  const handleDelete = async () => {
    if (!group) return;
  
    try {
      const confirmed = window.confirm("Are you sure you want to delete this group?");
      if (!confirmed) return;
  
      await deleteGroup(id);
  
      router.push("/");
    } catch (err: any) {
      console.error("Failed to delete group:", err);
      alert(err.response?.data?.message || "Failed to delete group");
    }
    };

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
            <h1 className="text-4xl font-bold tracking-tight text-foreground">{group?.title}</h1>
            <div className="flex items-center gap-2 pt-2">
                {group?.tags.map((tag)=>(
                   <Badge key={tag} variant="secondary" className="text-xs">
                       <div className={`h-2 w-2 rounded-full ${getTagColor(tag)} mr-1.5`} />
                          {getTagName(tag)}
                   </Badge>
                ))}
            </div>
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
            {/* {!isOwner && (
              <> */}
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
              {/* </>
            )} */}
          </div>
        </div>

        {/* Date and Time */}
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">{group?.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{group?.members.length} Members</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{group?.description}</p>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {members && members.length > 0 ? (
                members.map((member: any) => (
                  <Link key={member.data.memberID} href={`/profile/${member.data.memberID}`}>
                    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={member.data.profileImage || "/user-placeholder.svg"}
                          alt={member.data.username}
                        />
                        <AvatarFallback>
                          {`${member.data.firstName?.[0] ?? ""}${member.data.lastName?.[0] ?? ""}`}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {member.data.firstName} {member.data.lastName}
                        </h3>

                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          {/* Education row */}
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-foreground/70" />
                            <span className="truncate">
                              {member.data.education && member.data.education.length > 0 ? (
                                (() => {
                                  const latestEdu = [...member.data.education].sort(
                                    (a, b) => (b.endYear ?? 0) - (a.endYear ?? 0)
                                  )[0];
                                  return (
                                    <>
                                      <span className="text-foreground">
                                        {latestEdu.degree ?? ""} {latestEdu.field ?? ""}
                                      </span>{" "}
                                      <span className="text-muted-foreground/70">@ {latestEdu.school}</span>
                                    </>
                                  );
                                })()
                              ) : (
                                <span>No education info</span>
                              )}
                            </span>
                          </div>

                          {/* Skills badges */}
                          {member.data.skills && member.data.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {member.data.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="flex items-center text-xs px-2 py-1"
                                >
                                  <div
                                    className={`h-2 w-2 rounded-full ${getRandomColor()} mr-1.5`}
                                  />
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No members have joined yet.
                </div>
              )}
            </div>
          </CardContent>

      </Card>
    </div>
  )
}
