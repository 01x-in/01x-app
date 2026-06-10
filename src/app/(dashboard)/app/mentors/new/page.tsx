import { requireAdmin } from "@/lib/auth"
import { PageHeader } from "../../../_components/page-header"
import { AddMentorForm } from "../_components/add-mentor-form"

export default async function NewMentorPage() {
    await requireAdmin()

    return (
        <div className="space-y-4">
            <PageHeader
                title="Add mentor"
                description="Create a mentor account directly — bypasses the public application journey"
            />
            <AddMentorForm />
        </div>
    )
}
