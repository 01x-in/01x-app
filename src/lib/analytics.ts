// Lightweight analytics event tracker.
// Replace the console.log with your analytics provider (Segment, PostHog, etc.)
export function track(event: string, properties?: Record<string, unknown>) {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line no-console
    console.log("[analytics]", event, properties ?? {});
}

// Named events for type safety
export const events = {
    PROJECT_CREATE_STARTED: "project_create_started",
    PROJECT_CREATED: "project_created",
    PROJECT_PROMOTED_TO_ONE: "project_promoted_to_one",
    PROJECT_PROMOTED_TO_X: "project_promoted_to_x",
    PROJECT_PUBLISHED: "project_published",
    PROJECT_UNPUBLISHED: "project_unpublished",
    PROJECT_UPVOTED: "project_upvoted",
    PROJECT_COMMENT_ADDED: "project_comment_added",
    PROJECT_MENTOR_LINKED: "project_mentor_linked",
    PROJECT_COLLABORATOR_ADDED: "project_collaborator_added",
} as const;
