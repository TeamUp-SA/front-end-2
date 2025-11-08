// hooks/useCurrentUser.ts
import { Member } from "@/types/member"

/*
TODODODODODO:
 implement auth context here i guess. to retrieve curr user
*/
export const useCurrentUser = (): Member => {
  return {
    memberID: "68ee328fa32e8622ad6693b3",
    username: "ntcha_updated",
    firstName: "Natcha",
    lastName: "H.",
    email: "ntcha_updated@example.com",
    phoneNumber: "+66812345678",
    bio: "Aspiring software engineer and traveler.",
    skills: ["Go", "React", "MongoDB"],
    linkedIn: "https://linkedin.com/in/ntcha",
    github: "https://github.com/Ntchah",
    website: "https://ntcha.dev",
    profileImage: "/madison.jpg",
    experience: [
      {
        title: "Backend Intern",
        company: "TechCorp",
        startYear: 2023,
        endYear: 2024,
      },
    ],
    education: [
      {
        school: "ABC University",
        degree: "B.Eng",
        field: "Computer Engineering",
        startYear: 2021,
        endYear: 2025,
      },
    ],
  }
}