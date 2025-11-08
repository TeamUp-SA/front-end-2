"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Plus,
  Trash2,
  Github,
  Linkedin,
  Globe,
  Loader2,
} from "lucide-react";
import { getGoogleAuthUrl, register } from "@/api/auth";

type Education = {
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
};

type Experience = {
  title: string;
  company: string;
  description: string;
  startYear: number;
  endYear: number;
};

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    github: "",
    linkedin: "",
    website: "",
    bio: "",
  });

  const [educations, setEducations] = useState<Education[]>([
    {
      school: "",
      degree: "",
      field: "",
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
    },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      bio: formData.bio || undefined,
      github: formData.github || undefined,
      linkedin: formData.linkedin || undefined,
      website: formData.website || undefined,
      educations: educations
        .filter((edu) => edu.school.trim())
        .map((edu) => ({
          school: edu.school.trim(),
          degree: edu.degree.trim() || undefined,
          field: edu.field.trim() || undefined,
          startYear: Number.isFinite(edu.startYear) ? edu.startYear : undefined,
          endYear: Number.isFinite(edu.endYear) ? edu.endYear : undefined,
        })),
      experiences: experiences
        .filter((exp) => exp.title.trim() || exp.company.trim())
        .map((exp) => ({
          title: exp.title.trim(),
          company: exp.company.trim(),
          description: exp.description.trim() || undefined,
          startYear: Number.isFinite(exp.startYear) ? exp.startYear : undefined,
          endYear: Number.isFinite(exp.endYear) ? exp.endYear : undefined,
        })),
      skills: skills.length ? skills : undefined,
    };

    try {
      console.log(payload);
      await register(payload);
      setSuccess("Account created successfully. You can now sign in.");
      setFormData({
        name: "",
        email: "",
        password: "",
        github: "",
        linkedin: "",
        website: "",
        bio: "",
      });
      setEducations([
        {
          school: "",
          degree: "",
          field: "",
          startYear: new Date().getFullYear(),
          endYear: new Date().getFullYear(),
        },
      ]);
      setExperiences([]);
      setSkills([]);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Unable to create account. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
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
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <Card className="w-full max-w-3xl my-8">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription>
            Join our collaboration platform and start connecting
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <div className="space-y-2">
              <Label htmlFor="github">
                <Github className="h-4 w-4 inline mr-2" />
                GitHub
              </Label>
              <Input
                id="github"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">
                <Linkedin className="h-4 w-4 inline mr-2" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) =>
                  setFormData({ ...formData, linkedin: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="h-4 w-4 inline mr-2" />
                Personal Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Education *</h3>
              <Button
                type="button"
                onClick={addEducation}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {educations.map((edu, index) => (
              <Card key={index} className="p-4">
                {educations.length > 1 && (
                  <div className="flex justify-end mb-2">
                    <Button
                      type="button"
                      onClick={() => removeEducation(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
                <div className="space-y-3">
                  <Input
                    placeholder="School *"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(index, "school", e.target.value)
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Field"
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(index, "field", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Start Year"
                      value={edu.startYear}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          "startYear",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="End Year"
                      value={edu.endYear}
                      onChange={(e) =>
                        updateEducation(
                          index,
                          "endYear",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Experience (Optional)</h3>
              <Button
                type="button"
                onClick={addExperience}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {experiences.map((exp, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-end mb-2">
                  <Button
                    type="button"
                    onClick={() => removeExperience(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Title"
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(index, "title", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(index, "company", e.target.value)
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(index, "description", e.target.value)
                    }
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder="Start Year"
                      value={exp.startYear}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "startYear",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                    <Input
                      type="number"
                      placeholder="End Year"
                      value={exp.endYear}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "endYear",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                placeholder="Add a skill..."
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-600">{success}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        <div className="my-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => window.location.assign(getGoogleAuthUrl())}
            disabled={isSubmitting}
          >
            Continue with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
