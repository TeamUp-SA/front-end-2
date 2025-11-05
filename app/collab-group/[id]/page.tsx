import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { CollabGroupDetail } from "@/components/collab-group-detail"

export default async function CollabGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <CollabGroupDetail id={id} />
      </main>
    </div>
  )
}
