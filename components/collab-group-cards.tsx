"use client";

import type React from "react";

import Link from "next/link";
import { MoreVertical, Calendar, UsersIcon, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Group } from "@/types/group";
import { useState, useEffect } from "react";
import { getGroups, updateGroup } from "@/api/group";
import { getTagColor, getTagName } from "@/utils/tagMap";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function CollabGroupCards() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
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
      // console.log("groups",res)
      setGroups(res.data);
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

  const handleCreateGroup = () => {
    /* TODO: plug backend */
    router.push("/collab-group/create");
  };

  const handleJoinGroup = async (e: React.MouseEvent, groupID: string) => {
    e.preventDefault(); // Prevent navigation when clicking join button
    if (!currentUserID) {
      alert("Unable to verify your account. Please sign in again.");
      return;
    }

    const group = groups.find((g) => g.groupID === groupID);
    const payload = {
      members: [...(group?.members ?? []), currentUserID],
    };

    try {
      const res = await updateGroup(groupID, payload, currentUserID);
      console.log("add member successful");
      await fetchGroups();
      alert(`Successfully join group ${group?.title}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch groups");
      console.log(err);
      alert(`Failed to join group ${group?.title}`);
    }
  };

  const isJoined = (groupID: string) => {
    const group = groups.find((g) => g.groupID === groupID);
    if (!group) return false;
    return group.members.includes(currentUserID);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Collab Group
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join collaboration groups and work together on exciting projects
          </p>
        </div>
        <Button
          onClick={handleCreateGroup}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Create Group
        </Button>
      </div>

      {/* Group Cards Grid */}
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
                      <CardDescription className="line-clamp-2">
                        {group.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mt-1 -mr-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <div
                          className={`h-2 w-2 rounded-full ${getTagColor(
                            tag
                          )} mr-1.5`}
                        />
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

                  {isJoined(group.groupID) ? (
                    <Button
                      variant="secondary"
                      className="w-full bg-muted text-muted-foreground hover:bg-muted/80 cursor-default"
                      disabled
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Joined
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => handleJoinGroup(e, group.groupID)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Join Group
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
