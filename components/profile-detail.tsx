"use client"
import { ArrowLeft, GraduationCap, Mail, MapPin, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data
const profileData: Record<string, any> = {
  "1": {
    name: "Alice Johnson",
    avatar: "/diverse-woman-portrait.png",
    education: "MIT - Computer Science",
    email: "alice.johnson@example.com",
    location: "San Francisco, CA",
    bio: "Passionate software engineer with expertise in AI and machine learning. Love building innovative solutions that make a difference.",
    experience: "Senior Software Engineer at Tech Corp",
    skills: ["Python", "TensorFlow", "React", "Node.js", "AWS"],
  },
}

export function ProfileDetail({ id }: { id: string }) {
  const profile = profileData[id] || profileData["1"]

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
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {profile.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>{profile.education}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              </div>

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Connect</Button>
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
          <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{profile.experience}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
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
