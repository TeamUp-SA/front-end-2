
export const tagNameMap: Record<string, string> = {
  "0": "Study",
  "1": "Project",
  "2": "Research",
  "3": "Hackathon",
  "4": "Case Competition",
};

export const tagColorMap: Record<string, string> = {
  "0": "bg-blue-500",
  "1": "bg-purple-500",
  "2": "bg-green-500",
  "3": "bg-pink-500",
  "4": "bg-amber-500",
};

export function getTagName(tagId: number) {
  return tagNameMap[tagId] || "Unknown";
}

export function getTagColor(tagId: number) {
  return tagColorMap[tagId] || "bg-gray-500";
}
