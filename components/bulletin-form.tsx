"use client";

import type React from "react";

import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bulletin,
  BulletinCreateRequest,
  BulletinUpdateRequest,
} from "@/types/bulletin";
import {
  getBulletinById,
  updateBulletin,
  createBulletin,
} from "@/api/bulletin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tagNameMap } from "@/utils/tagMap";
import { Group } from "@/types/group";
import { getGroups } from "@/api/group";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface BulletinFormProps {
  mode: "create" | "edit";
  bulletinId?: string;
}

export function BulletinForm({ mode, bulletinId }: BulletinFormProps) {
  const router = useRouter();

  // current user
  const currentUser = useCurrentUser();
  const currentUserID = currentUser?.memberID;

  // bulletin by id
  const [bulletin, setBulletin] = useState<Bulletin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // all collab gropus (for dropdown select)
  const [groups, setGroups] = useState<Group[]>([]);

  // existing data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]);
  const [groupIDs, setGroupIDs] = useState<string[]>([]); // existing groupIDs bind to this bulletin
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBulletin = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getBulletinById(bulletinId as string);
      setBulletin(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch bulletin");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getGroups();
      setGroups(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch collab groups");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && bulletinId) {
      fetchBulletin();
    }
    fetchGroups();
  }, [bulletinId]);

  // set existing data
  useEffect(() => {
    if (bulletin && mode === "edit") {
      setTitle(bulletin.title);
      setDescription(bulletin.description);
      setDate(bulletin.date);
      setImage(bulletin.image);
      setTags(bulletin.tags);
      setGroupIDs(bulletin.groupID);
      setImagePreview(bulletin.image ?? "");
      setImageFile(null);
    }
  }, [bulletin, mode]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(image);
    }
  }, [image, imageFile]);

  // Add tag by dropdown selection
  const handleAddTag = (selectedTag: number) => {
    if (!tags.includes(selectedTag)) {
      setTags((prev) => [...prev, selectedTag]);
    }
  };

  // Remove tag by clicking the X
  const handleRemoveTag = (tagToRemove: number) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleAddGroup = (selectedGroup: string) => {
    if (!selectedGroup) return;

    setGroupIDs((prev) => {
      const current = prev || [];
      if (current.includes(selectedGroup)) return current;
      return [...current, selectedGroup];
    });
  };

  // Remove tag by clicking the X
  const handleRemoveGroup = (groupToRemove: string) => {
    setGroupIDs((prev) => prev.filter((group) => group !== groupToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image && !imageFile) {
      setFormError("Please provide an image URL or upload a file.");
      return;
    }

    setFormError(null);

    const basePayload = {
      title,
      description,
      groupID: groupIDs,
      date,
      tags,
    };

    try {
      let response;

      switch (mode) {
        case "create": {
          if (!currentUserID) {
            setFormError("Current user information is missing.");
            return;
          }
          const createPayload: BulletinCreateRequest = {
            ...basePayload,
            authorID: currentUserID,
          };

          if (!imageFile && image) {
            createPayload.image = image;
          }

          response = await createBulletin(
            createPayload,
            imageFile ?? undefined,
            currentUserID
          );
          break;
        }

        case "edit": {
          if (!bulletinId) throw new Error("No bulletin ID for edit mode");
          const updatePayload: BulletinUpdateRequest = {
            ...basePayload,
          };

          if (!imageFile && image) {
            updatePayload.image = image;
          }

          response = await updateBulletin(
            bulletinId,
            updatePayload,
            imageFile ?? undefined
          );
          break;
        }

        default:
          throw new Error("Invalid mode");
      }

      console.log("Submission successful:", response);
      router.push("/bulletin");
      setImageFile(null);
    } catch (err: any) {
      console.error(
        "Failed to submit bulletin:",
        err.response?.data || err.message
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
          <CardTitle>
            {mode === "create" ? "Create New Bulletin" : "Edit Bulletin"}
          </CardTitle>
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
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Poster Image *</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => {
                    const value = e.target.value;
                    setImage(value);
                    setFormError(null);
                    if (imageFile) {
                      setImageFile(null);
                    }
                    setImagePreview(value);
                  }}
                  placeholder="Enter image URL or upload"
                  required={!imageFile}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setImageFile(file);
                    setFormError(null);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const result = reader.result as string;
                      setImagePreview(result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              {(imagePreview || image) && (
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={imagePreview || image || "/placeholder.svg"}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              {imageFile && (
                <p className="text-xs text-muted-foreground">
                  {imageFile.name}
                </p>
              )}
              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => handleAddTag(Number(value))}>
                  <SelectTrigger className="w-[200px]" id="tags">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tagNameMap).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {tags ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tagNameMap[tag] ?? tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No tags added
                  </span>
                )}
              </div>
            </div>

            {/* Group IDs */}
            <div className="space-y-2">
              <Label htmlFor="tags">Collaboration group attached</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => handleAddGroup(value)}>
                  <SelectTrigger className="w-[200px]" id="tags">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups?.map((group) => (
                      <SelectItem key={group.groupID} value={group.groupID}>
                        {group.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {groupIDs ? (
                  groupIDs.map((id) => {
                    const group = groups.find((g) => g.groupID === id); // find matching group object
                    return (
                      <Badge key={id} variant="secondary" className="gap-1">
                        {group ? group.title : "Unknown Group"}
                        <button
                          type="button"
                          onClick={() => handleRemoveGroup(id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No collaboration groups added
                  </span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {mode === "create" ? "Create Bulletin" : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
