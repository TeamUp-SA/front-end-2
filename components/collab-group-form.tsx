"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Group } from "@/types/group";
import { getGroupById } from "@/api/group";
import { useEffect } from "react";
import { createGroup, updateGroup } from "@/api/group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tagNameMap } from "@/utils/tagMap";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface CollabGroupFormProps {
  mode: "create" | "edit";
  groupId?: string;
}

export function CollabGroupForm({ mode, groupId }: CollabGroupFormProps) {
  const router = useRouter();
  // current user
  const currentUser = useCurrentUser();
  const currentUserID = currentUser?.memberID;
  // group by id
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // existing data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [tags, setTags] = useState<number[]>([]);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getGroupById(groupId as string);
      setGroup(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch group");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && groupId) {
      fetchGroup();
    }
  }, [groupId]);

  // set existing data (placrholder)
  useEffect(() => {
    if (group && mode === "edit") {
      setTitle(group.title);
      setDescription(group.description);
      setDate(group.date);
      setMembers(group.members);
      setTags(group.tags);
    }
  }, [group, mode]);

  const handleAddTag = (selectedTag: number) => {
    if (!tags.includes(selectedTag)) {
      setTags((prev) => [...prev, selectedTag]);
    }
  };

  // Remove tag by clicking the X
  const handleRemoveTag = (tagToRemove: number) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserID) {
      console.error("Missing current user, cannot submit group.");
      return;
    }

    const sanitizedMembers = (members ?? []).filter(
      (memberID): memberID is string => Boolean(memberID)
    );

    const payload = {
      title,
      description,
      members: sanitizedMembers,
      date,
      tags,
      closed: false,
    };

    try {
      let response;

      console.log("payload", payload);

      switch (mode) {
        case "create":
          response = await createGroup(
            { ...payload, ownerID: currentUserID },
            currentUserID
          );
          break;

        case "edit":
          if (!groupId) throw new Error("No group ID for edit mode");
          response = await updateGroup(groupId, payload, currentUserID);
          break;

        default:
          throw new Error("Invalid mode");
      }

      console.log("Submission successful:", response);
      router.push("/");
    } catch (err: any) {
      console.error(
        "Failed to submit group:",
        err.response?.data || err.message
      );
    }
  };

  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Collab Groups
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "create"
              ? "Create New Collab Group"
              : "Edit Collab Group"}
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
                placeholder="Enter group title"
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
                placeholder="Enter group description"
                rows={5}
                required
              />
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
                {tags.map((tag) => (
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
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {mode === "create" ? "Create Group" : "Save Changes"}
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
