# Projects System Documentation

## Overview

The Projects system is the core feature of 01X that enables members to build, showcase, and progress their projects from idea (Zero) to MVP (One) to Scale (X).

## Philosophy

**Members build inside 01X, and their projects live here permanently — even after their cohort ends.**

This is not a launch board. It is a build-and-ship ecosystem for serious builders.

## Stage Progression

Projects move through 3 structured stages:

### Stage 0 — Idea (Zero)
- **Purpose**: Brainstorming and internal collaboration
- **Visibility**: Private by default
- **Can be shared**: Only with specific collaborators
- **NOT eligible**: For homepage or public listings
- **Used as**: A workspace for early-stage development

### Stage 1 — MVP (One)
- **Purpose**: Working version exists
- **Eligible**: For publishing and public visibility
- **Visible**: In public Projects page if user toggles "Publish"
- **Homepage**: Eligible for featuring
- **Community**: Can receive feedback, upvotes, comments

### Stage X — Scale
- **Purpose**: Live product with traction
- **Visibility**: Same as MVP but highlighted differently
- **Displays**: Metrics and growth signals
- **Homepage**: Priority tier for featuring

## Database Schema

### Core Tables

#### `members`
Unified table for all platform members (students, mentors, etc.)

#### `cohorts`
Cohorts that organize members and projects

#### `projects`
Main projects table with all project data

#### `project_collaborators`
Many-to-many relationship for project collaborators

#### `project_mentors`
Many-to-many relationship linking projects to mentors

#### `project_upvotes`
Track which members upvoted which projects

#### `project_comments`
Comments on projects (supports nested replies)

### Key Constraints

1. **Stage Zero** cannot be `public` or `published`
2. Only **Stage One** and **Stage X** can be `published`
3. Homepage only displays **published** projects from **Stage One** or **Stage X**
4. Projects can only transition: `zero → one → x`

## API Endpoints

### Projects

#### `GET /api/v1/projects`
List projects with filters and pagination

**Query Parameters:**
- `stage`: Filter by stage ('zero', 'one', 'x' - comma-separated)
- `visibility`: Filter by visibility
- `published`: Filter by published status ('1' or '0')
- `cohortId`: Filter by cohort
- `creatorId`: Filter by creator
- `lookingForCollaborators`: Filter projects looking for help
- `isFeatured`: Filter featured projects
- `sortBy`: Sort order ('newest', 'oldest', 'most_upvoted', 'most_commented', 'featured')
- `limit`: Number of results (default 20)
- `offset`: Pagination offset (default 0)
- `memberId`: For checking upvote status

**Response:**
```json
{
  "projects": [...],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

#### `POST /api/v1/projects`
Create a new project

**Body:**
```json
{
  "id": "uuid",
  "title": "My Project",
  "tagline": "One-line description",
  "description": "Detailed description",
  "creatorId": "member-uuid",
  "stage": "zero",
  "visibility": "private",
  "published": false,
  ...
}
```

#### `GET /api/v1/projects/[id]`
Get a single project with all relations

**Query Parameters:**
- `memberId`: For authorization and upvote status

#### `PATCH /api/v1/projects/[id]`
Update a project

**Query Parameters:**
- `memberId`: Required for authorization (must be creator)

**Body:** Partial project update

#### `DELETE /api/v1/projects/[id]`
Delete a project

**Query Parameters:**
- `memberId`: Required for authorization (must be creator)

### Featured Projects

#### `GET /api/v1/projects/featured`
Get featured projects for homepage

**Query Parameters:**
- `limit`: Number of projects (default 9)
- `memberId`: For checking upvote status

**Response:**
```json
{
  "projects": [...]
}
```

### Upvotes

#### `POST /api/v1/projects/[id]/upvote`
Toggle upvote on a project

**Body:**
```json
{
  "memberId": "member-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "upvoted": true,
  "upvotesCount": 42
}
```

### Comments

#### `GET /api/v1/projects/[id]/comments`
Get all comments for a project (nested structure)

**Response:**
```json
{
  "comments": [
    {
      "id": "comment-uuid",
      "content": "Great project!",
      "member": {...},
      "replies": [...]
    }
  ],
  "total": 5
}
```

#### `POST /api/v1/projects/[id]/comments`
Create a comment on a project

**Body:**
```json
{
  "id": "uuid",
  "memberId": "member-uuid",
  "content": "Comment text",
  "parentCommentId": "optional-for-replies"
}
```

### Collaborators

#### `GET /api/v1/projects/[id]/collaborators`
Get all collaborators for a project

#### `POST /api/v1/projects/[id]/collaborators`
Add a collaborator to a project

**Body:**
```json
{
  "memberId": "member-uuid",
  "role": "collaborator",
  "requesterId": "creator-uuid"
}
```

#### `DELETE /api/v1/projects/[id]/collaborators`
Remove a collaborator from a project

**Query Parameters:**
- `memberId`: Member to remove
- `requesterId`: Must be project creator

### Members

#### `GET /api/v1/members`
List all active members or get a specific member

**Query Parameters:**
- `id`: Get member by ID
- `email`: Get member by email

#### `POST /api/v1/members`
Create a new member

**Body:**
```json
{
  "id": "uuid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "memberType": "student",
  ...
}
```

## Visibility & Publishing Rules

### Visibility Options
- **private**: Only creator can view
- **collaborators**: Creator and collaborators can view
- **public**: Anyone can view (only if published)

### Publishing Rules

1. Stage Zero projects:
   - CANNOT be published
   - CANNOT have public visibility
   - Can be private or shared with collaborators

2. Stage One and Stage X projects:
   - CAN be published
   - CAN have public visibility
   - Eligible for homepage featuring

3. Homepage display:
   - Only published projects from Stage One or Stage X
   - Only projects with public visibility
   - Sorted by: featured → most upvoted → most recent

## Community Features

### Upvotes
- One upvote per member per project
- Counter automatically updated via database triggers
- Can be toggled (upvote/remove upvote)

### Comments
- Support for nested replies
- Soft delete (is_deleted flag)
- Counter automatically updated via database triggers

### Feedback Requests
- Projects can flag "Request Feedback"
- Notifies associated mentors and cohort mentors

### Collaborator Requests
- Projects can flag "Looking for Collaborators"
- Visible badge on project cards

## Value Proposition

This system reinforces that:
- Projects built inside 01X remain hosted and showcased
- Even after a cohort ends, members retain:
  - Their profile
  - Their project history
  - Their public showcase

This is a **long-term builder identity system**, not a temporary course artifact.

## Migration

To apply the database migration:

```bash
# Local development
npm run db:migrate

# Production
npm run db:migrate:prod
```

## TypeScript Types

All types are defined in `/src/types/projects.ts`:
- `Project`, `ProjectInput`, `ProjectUpdate`
- `Member`, `MemberInput`
- `Cohort`, `CohortInput`
- `ProjectComment`, `ProjectCommentWithMember`
- `ProjectFilters`, `ProjectQueryParams`
- And more...

## Database Helpers

Helper functions in `/src/lib/projects-db.ts`:
- `parseProjectRow()` - Parse D1 row to Project object
- `parseMemberRow()` - Parse D1 row to Member object
- `validateProjectVisibility()` - Validate visibility rules
- `validateProjectPublished()` - Validate publishing rules
- `validateStageTransition()` - Validate stage transitions
- `buildProjectsListQuery()` - Build filtered query
- `canViewProject()` - Check viewing permissions

## Edge Cases

1. **Deleting a member**: Requires confirmation, does not auto-delete projects
2. **Removing a mentor**: Project remains but unlinks mentor
3. **Archiving a cohort**: Projects remain visible
4. **Stage zero privacy**: Never accidentally indexed publicly (enforced by DB constraints)

## Next Steps

### Frontend Implementation
1. Create project creation/edit forms
2. Build project listing page with filters
3. Build individual project view page
4. Integrate upvote/comment UI components
5. Add homepage featured projects section
6. Create member profiles with project tabs

### Additional Features
1. Project search functionality
2. Tag/tech stack filtering
3. Project analytics for creators
4. Email notifications for feedback requests
5. Project collaboration invitations
6. Export project data
