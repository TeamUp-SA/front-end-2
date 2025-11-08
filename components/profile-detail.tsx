"use client"
import { ArrowLeft, GraduationCap, Mail, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Member } from "@/types/member"
import { getMemberById } from "@/api/member"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Plus, Trash2, Github, Linkedin, Globe } from "lucide-react"


export function ProfileDetail({ id }: { id: string }) {
  const [profile, setProfile] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    
  const router = useRouter();
    
  const fetchBulletin = async () => {
          try {
            setLoading(true);
            setError(null);
  
            const res = await getMemberById(id);
            setProfile(res.data); 
          } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch member");
            console.log(err);
          } finally {
            setLoading(false);
          }
    };
  
 useEffect(() => {
      fetchBulletin();
  }, [id]); 

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" className="gap-2" onClick={() => window.history.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-32 w-32">
               <AvatarImage
                    src={profile?.profileImage || "/user-placeholder.svg"}
                    alt={profile?.username}
               />
               <AvatarFallback>
                 {`${profile?.firstName?.[0] ?? ""}${profile?.lastName?.[0] ?? ""}`}
               </AvatarFallback>
            </Avatar>
  

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile?.firstName} {profile?.lastName}</h1>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{profile?.bio}</p>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="github">
              <Github className="h-4 w-4 inline mr-2" />
              GitHub
            </Label>
              <p className="text-foreground">{profile?.github}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">
              <Linkedin className="h-4 w-4 inline mr-2" />
              LinkedIn
            </Label>
              <p className="text-foreground">{profile?.linkedIn}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">
              <Globe className="h-4 w-4 inline mr-2" />
              Personal Website
            </Label>
              <p className="text-foreground">{profile?.website}</p>
          </div>
        </div>
        </CardContent>
      </Card>

       {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.experience?.map((exp, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                    <p className="text-foreground font-medium">{exp.title}</p>
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                    <p className="text-foreground">{exp.company}</p>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                    <p className="text-foreground text-sm">{exp.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Year</Label>
                      <p className="text-foreground">{exp.startYear}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                      <p className="text-foreground">{exp.endYear}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

       {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.education?.map((edu, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>School</Label>
                    <p className="text-foreground">{edu.school}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                      <p className="text-foreground">{edu.degree}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Field</Label>
                      <p className="text-foreground">{edu.field}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Year</Label>
                      <p className="text-foreground">{edu.startYear}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                      <p className="text-foreground">{edu.endYear}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill: string) => (
              <span
                key={skill}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
