import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { ProfileDetail } from "@/components/profile-detail"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <ProfileDetail id={id} />
      </main>
    </div>
  )
}
