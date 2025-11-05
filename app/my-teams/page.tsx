import { CollaborationSidebar } from "@/components/collaboration-sidebar"
import { MyTeamsCards } from "@/components/my-teams-cards"

export default function MyTeamsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <CollaborationSidebar />
      <main className="flex-1 p-8 lg:ml-0">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Teams</h1>
            <p className="text-muted-foreground mt-2">Collaboration groups you've joined</p>
          </div>
          <MyTeamsCards />
        </div>
      </main>
    </div>
  )
}
