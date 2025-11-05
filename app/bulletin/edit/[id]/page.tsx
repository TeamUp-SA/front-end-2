import { BulletinForm } from "@/components/bulletin-form"

export default function EditBulletinPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <BulletinForm mode="edit" bulletinId={params.id} />
    </div>
  )
}
