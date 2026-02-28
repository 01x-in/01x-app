import { getCurrentUser } from "@/lib/auth"
import { getDB } from "@/lib/db"
import { redirect } from "next/navigation"
import { PageHeader } from "../../_components/page-header"

export default async function ProfilePage() {
    const user = await getCurrentUser()
    if (!user) redirect("/")

    const db = getDB()
    let member = null

    if (user.memberId) {
        member = await db
            .prepare("SELECT * FROM members WHERE id = ?1")
            .bind(user.memberId)
            .first()
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                description="View and manage your profile information"
            />

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Info Card */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                            <p className="text-sm">{user.fullName}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Email</label>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Location</label>
                            <p className="text-sm">{(member?.location as string) || "Not set"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Bio</label>
                            <p className="text-sm">{(member?.bio as string) || "Not set"}</p>
                        </div>
                    </div>
                </div>

                {/* Links Card */}
                <div className="rounded-xl border bg-card p-6 space-y-4">
                    <h3 className="font-semibold">Links & Socials</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">LinkedIn</label>
                            <p className="text-sm">{(member?.linkedin_url as string) || "Not set"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">GitHub</label>
                            <p className="text-sm">{(member?.github_url as string) || "Not set"}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Website</label>
                            <p className="text-sm">{(member?.website_url as string) || "Not set"}</p>
                        </div>
                    </div>
                </div>

                {/* Tech Stack Card */}
                <div className="rounded-xl border bg-card p-6 space-y-4 md:col-span-2">
                    <h3 className="font-semibold">Tech Stack & Interests</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Tech Stack</label>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {member?.tech_stack ? (
                                    JSON.parse(member.tech_stack as string).map((tech: string) => (
                                        <span key={tech} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {tech}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No tech stack added</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground">Areas of Interest</label>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                                {member?.areas_of_interest ? (
                                    JSON.parse(member.areas_of_interest as string).map((area: string) => (
                                        <span key={area} className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {area}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No interests added</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
