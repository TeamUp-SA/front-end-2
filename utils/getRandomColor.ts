// utils/getRandomColor.ts
export function getRandomColor(): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-red-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
