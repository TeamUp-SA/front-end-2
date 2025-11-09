"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Plus, Trash2, Github, Linkedin, Globe } from "lucide-react";
import {
  Member,
  Education,
  Experience,
  MemberUpdateRequest,
} from "@/types/member";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getMemberById, updateMember } from "@/api/member";

export function MyProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Member>();
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // current user
  const currentUser = useCurrentUser();
  const currentUserID = currentUser?.memberID;

  const router = useRouter();

  const fetchBulletin = async () => {
    if (!currentUserID) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await getMemberById(currentUserID);

      console.log("my profile res data", res.data);
      setProfile(res.data);
      setEducations(res.data.education ?? []);
      setExperiences(res.data.experience ?? []);
      setImagePreview(res.data.profileImage ?? "");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch member");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBulletin();
  }, [currentUserID]);

  const [skillInput, setSkillInput] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserID || !profile) return;

    const payload: MemberUpdateRequest = {
      username: profile?.username,
      password: profile?.password,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
      phoneNumber: profile?.phoneNumber,
      bio: profile?.bio,
      skills: profile?.skills ?? [],
      linkedIn: profile?.linkedIn,
      github: profile?.github,
      website: profile?.website,
      profileImage: profile?.profileImage,
      experience: experiences,
      education: educations,
    };

    if (selectedImageFile) {
      delete (payload as Partial<MemberUpdateRequest>).profileImage;
    }

    console.log("save editing profile payload", payload);

    try {
      const res = await updateMember(
        currentUserID,
        payload,
        selectedImageFile ?? undefined
      );
      const updated = res?.data;
      if (updated) {
        setProfile(updated);
        setEducations(updated.education ?? []);
        setExperiences(updated.experience ?? []);
        setImagePreview(updated.profileImage ?? "");
      } else {
        await fetchBulletin();
      }
      setSelectedImageFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update my profile");
      console.log(err);
    } finally {
      setIsEditing(false);
    }
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        school: "",
        degree: "",
        field: "",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear(),
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string | number
  ) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        company: "",
        description: "",
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear(),
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | number
  ) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const addSkill = () => {
    if (!profile) return;

    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !(profile.skills || []).includes(trimmedSkill)) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), trimmedSkill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile?.skills?.filter((s) => s !== skill),
    });
  };

  const updateProfile = (updates: Partial<Member>) => {
    if (!profile) return;
    setProfile({ ...profile, ...updates });
  };

  const handleTriggerImageDialog = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelEdit = () => {
    setSelectedImageFile(null);
    setImagePreview(profile?.profileImage ?? "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Information</CardTitle>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  imagePreview ||
                  profile?.profileImage ||
                  "/user-placeholder.svg"
                }
                alt={profile?.username}
              />
              <AvatarFallback>
                {`${profile?.firstName?.[0] ?? ""}${
                  profile?.lastName?.[0] ?? ""
                }`}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={handleTriggerImageDialog}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </>
            )}
          </div>
          {isEditing && (
            <div className="text-sm text-muted-foreground">
              <p>Click the camera icon to change your profile picture</p>
              {selectedImageFile && (
                <p className="text-xs">{selectedImageFile.name}</p>
              )}
            </div>
          )}
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          {isEditing ? (
            <Input
              id="firstName"
              value={profile?.firstName || ""}
              onChange={(e) => updateProfile({ firstName: e.target.value })}
            />
          ) : (
            <p className="text-foreground">{profile?.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          {isEditing ? (
            <Input
              id="lastName"
              value={profile?.lastName || ""}
              onChange={(e) => updateProfile({ lastName: e.target.value })}
            />
          ) : (
            <p className="text-foreground">{profile?.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              onChange={(e) => updateProfile({ email: e.target.value })}
            />
          ) : (
            <p className="text-foreground">{profile?.email}</p>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <Textarea
              id="bio"
              value={profile?.bio || ""}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          ) : (
            <p className="text-foreground">{profile?.bio}</p>
          )}
        </div>

        {/* GitHub */}
        <div className="space-y-2">
          <Label htmlFor="github">
            <Github className="h-4 w-4 inline mr-2" />
            GitHub
          </Label>
          {isEditing ? (
            <Input
              id="github"
              value={profile?.github || ""}
              onChange={(e) => updateProfile({ github: e.target.value })}
              placeholder="https://github.com/username"
            />
          ) : (
            <p className="text-foreground">{profile?.github}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">
            <Linkedin className="h-4 w-4 inline mr-2" />
            LinkedIn
          </Label>
          {isEditing ? (
            <Input
              id="linkedin"
              value={profile?.linkedIn || ""}
              onChange={(e) => updateProfile({ linkedIn: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          ) : (
            <p className="text-foreground">{profile?.linkedIn}</p>
          )}
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">
            <Globe className="h-4 w-4 inline mr-2" />
            Personal Website
          </Label>
          {isEditing ? (
            <Input
              id="website"
              value={profile?.website || ""}
              onChange={(e) => updateProfile({ website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          ) : (
            <p className="text-foreground">{profile?.website}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Education</h3>
            {isEditing && (
              <Button onClick={addEducation} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Education
              </Button>
            )}
          </div>

          {educations.map((edu, index) => (
            <Card key={index} className="p-4">
              {isEditing && (
                <div className="flex justify-end mb-2">
                  <Button
                    onClick={() => removeEducation(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>School</Label>
                  {isEditing ? (
                    <Input
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(index, "school", e.target.value)
                      }
                      placeholder="e.g., MIT"
                    />
                  ) : (
                    <p className="text-foreground">{edu.school}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    {isEditing ? (
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                        placeholder="e.g., Bachelor of Science"
                      />
                    ) : (
                      <p className="text-foreground">{edu.degree}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Field</Label>
                    {isEditing ? (
                      <Input
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(index, "field", e.target.value)
                        }
                        placeholder="e.g., Computer Science"
                      />
                    ) : (
                      <p className="text-foreground">{edu.field}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Year</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={edu.startYear}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "startYear",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <p className="text-foreground">{edu.startYear}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={edu.endYear}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "endYear",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <p className="text-foreground">{edu.endYear}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Experience</h3>
            {isEditing && (
              <Button onClick={addExperience} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Experience
              </Button>
            )}
          </div>

          {experiences.map((exp, index) => (
            <Card key={index} className="p-4">
              {isEditing && (
                <div className="flex justify-end mb-2">
                  <Button
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Title</Label>
                  {isEditing ? (
                    <Input
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(index, "title", e.target.value)
                      }
                      placeholder="e.g., Frontend Developer"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{exp.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  {isEditing ? (
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(index, "company", e.target.value)
                      }
                      placeholder="e.g., Tech Corp"
                    />
                  ) : (
                    <p className="text-foreground">{exp.company}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      placeholder="Describe your role and achievements..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-foreground text-sm">{exp.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Start Year</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={exp.startYear}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "startYear",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <p className="text-foreground">{exp.startYear}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={exp.endYear}
                        onChange={(e) =>
                          updateExperience(
                            index,
                            "endYear",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    ) : (
                      <p className="text-foreground">{exp.endYear}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add a skill..."
              />
              <Button onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
