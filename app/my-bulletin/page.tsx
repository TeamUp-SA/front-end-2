import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { MyBulletinCards } from "@/components/my-bulletin-cards"

export default function MyBulletinPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Bulletin</h1>
            <p className="text-muted-foreground mt-2">Bulletins you've created</p>
          </div>
          <MyBulletinCards />
        </div>
      </main>
    </div>
  )
}
