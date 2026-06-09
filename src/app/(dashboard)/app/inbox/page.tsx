import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Inbox as InboxIcon } from "lucide-react"
import { InboxClient } from "./_components/inbox-client"

export default async function InboxPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    if (!user.inboxEmail) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
                <InboxIcon className="mb-3 size-8 text-muted-foreground" />
                <h3 className="font-semibold">No inbox yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    An 01X email address hasn&apos;t been provisioned for your account yet.
                    Reach out to the team if you think this is a mistake.
                </p>
            </div>
        )
    }

    return <InboxClient inboxEmail={user.inboxEmail} />
}
