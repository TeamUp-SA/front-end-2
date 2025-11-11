"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "./ui/checkbox";

export interface GroupSearchParams {
  title?: string;
  tags?: string[];
  date?: string;
  includeClosed?: boolean;
}

interface Props {
  searchParams: GroupSearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<GroupSearchParams>>;
  availableTags: string[];
}

export const GroupSearchFilters: React.FC<Props> = ({
  searchParams,
  setSearchParams,
  availableTags,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <label key={tag} className="flex items-center gap-1">
            <Checkbox
              checked={searchParams.tags?.includes(tag) ?? false}
              onCheckedChange={(checked) => {
                setSearchParams((prev) => {
                  const tags = prev.tags ?? [];
                  if (checked) {
                    return { ...prev, tags: [...tags, tag] };
                  } else {
                    return { ...prev, tags: tags.filter((t) => t !== tag) };
                  }
                });
              }}
            />
            {tag}
          </label>
        ))}
      </div>

      {/* Date Filter */}
      <Input
        type="date"
        value={searchParams.date ?? ""}
        onChange={(e) =>
          setSearchParams((prev) => ({ ...prev, date: e.target.value }))
        }
        className="w-40"
      />

      {/* Include Closed */}
      <div className="flex items-center gap-2">
        <Checkbox
          checked={searchParams.includeClosed ?? false}
          onCheckedChange={(checked) =>
            setSearchParams((prev) => ({ ...prev, includeClosed: !!checked }))
          }
        />
        <span>Include Closed</span>
      </div>
    </div>
  );
};
