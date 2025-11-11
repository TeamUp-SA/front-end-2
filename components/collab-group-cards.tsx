"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Calendar, UsersIcon, Check, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Group } from "@/types/group";
import { getGroups, updateGroup } from "@/api/group";
import { getTagColor, getTagName } from "@/utils/tagMap";
import { GroupSearchFilters } from "./group-search-filter";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export function CollabGroupCards() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const currentUserID = currentUser?.memberID;

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useState<GroupSearchParams>({
    title: "",
    tags: [],
    date: "",
    includeClosed: false,
  });

  const debouncedTitle = useDebounce(searchParams.title ?? "", 500);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getGroups(searchParams);
      setGroups(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [
    debouncedTitle,
    searchParams.tags,
    searchParams.date,
    searchParams.includeClosed,
  ]);

  const handleCreateGroup = () => router.push("/collab-group/create");

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
    return group?.members.includes(currentUserID ?? "") ?? false;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const availableTags = Array.from(new Set(groups.flatMap((g) => g.tags)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Collab Group
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join collaboration groups and work together on exciting projects
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchParams.title}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, title: e.target.value }))
            }
            className="pl-3 w-full sm:w-64"
          />
          <Button
            onClick={handleCreateGroup}
            className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
          >
            Create Group
          </Button>
        </div>
      </div>

      {/* Filters */}
      <GroupSearchFilters
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        availableTags={availableTags}
      />

      {/* Group Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!groups.length ? (
          <div className="text-muted-foreground py-10">
            {debouncedTitle
              ? `No groups found for "${debouncedTitle}"`
              : "No collaboration groups"}
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
                          className={`h-2 w-2 rounded-full ${getTagColor(tag)} mr-1.5`}
                        />
                        {getTagName(tag)}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <UsersIcon className="h-4 w-4 inline mr-1.5" />
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
