import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { MyProfileForm } from "@/components/my-profile-form"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-8 lg:ml-0">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your personal information</p>
          </div>
          <MyProfileForm />
        </div>
      </main>
    </div>
  )
}
