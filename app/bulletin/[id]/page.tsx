import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { BulletinDetail } from "@/components/bulletin-detail"

export default async function BulletinDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <BulletinDetail id={id} />
      </main>
    </div>
  )
}
