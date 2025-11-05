import { CollabGroupForm } from "@/components/collab-group-form"

export default function EditCollabGroupPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <CollabGroupForm mode="edit" groupId={params.id} />
    </div>
  )
}
