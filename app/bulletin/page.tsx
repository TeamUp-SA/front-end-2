import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { BulletinCards } from "@/components/bulletin-cards"

export default function BulletinPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <BulletinCards />
      </main>
    </div>
  )
}
