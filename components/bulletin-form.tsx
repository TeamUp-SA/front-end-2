"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

// Mock data for edit mode
const mockBulletinData: Record<string, any> = {
  "1": {
    title: "Tech Conference 2025",
    description:
      "Join us for the annual technology conference featuring the latest innovations in AI, blockchain, and cloud computing.",
    date: "2025-03-20",
    image: "/tech-conference-poster-banner.jpg",
    tags: ["Conference", "Technology", "AI"],
    groupIDs: ["1", "2"],
  },
}

interface BulletinFormProps {
  mode: "create" | "edit"
  bulletinId?: string
}

export function BulletinForm({ mode, bulletinId }: BulletinFormProps) {
  const router = useRouter()
  const existingData = mode === "edit" && bulletinId ? mockBulletinData[bulletinId] : null

  const [title, setTitle] = useState(existingData?.title || "")
  const [description, setDescription] = useState(existingData?.description || "")
  const [date, setDate] = useState(existingData?.date || "")
  const [image, setImage] = useState(existingData?.image || "")
  const [tags, setTags] = useState<string[]>(existingData?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [groupIDs, setGroupIDs] = useState<string[]>(existingData?.groupIDs || [])
  const [groupIDInput, setGroupIDInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddGroupID = () => {
    if (groupIDInput.trim() && !groupIDs.includes(groupIDInput.trim())) {
      setGroupIDs([...groupIDs, groupIDInput.trim()])
      setGroupIDInput("")
    }
  }

  const handleRemoveGroupID = (idToRemove: string) => {
    setGroupIDs(groupIDs.filter((id) => id !== idToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    /* TODO: plug backend */
    // Submit form data: { title, description, date, image, tags, groupIDs }
    router.push("/bulletin")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/bulletin">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Bulletins
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create New Bulletin" : "Edit Bulletin"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter bulletin title"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter bulletin description"
                rows={5}
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Poster Image URL *</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter image URL or upload"
                  required
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {image && (
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img src={image || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Group IDs */}
            <div className="space-y-2">
              <Label htmlFor="groupIDs">Related Collaboration Groups (IDs)</Label>
              <div className="flex gap-2">
                <Input
                  id="groupIDs"
                  value={groupIDInput}
                  onChange={(e) => setGroupIDInput(e.target.value)}
                  placeholder="Add group ID"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddGroupID())}
                />
                <Button type="button" onClick={handleAddGroupID} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {groupIDs.map((id) => (
                  <Badge key={id} variant="outline" className="gap-1">
                    Group {id}
                    <button
                      type="button"
                      onClick={() => handleRemoveGroupID(id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {mode === "create" ? "Create Bulletin" : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
