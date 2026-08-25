# HAMI Project TODO

- [x] Document product architecture, MVP boundary, data model, API boundaries, security model, and technical risks
- [x] Create HAMI branded app icon assets and update app.config.ts branding
- [x] Replace starter theme tokens with the HAMI warm keepsake palette
- [x] Add HAMI onboarding and entry experience
- [x] Build Home relationship dashboard with seeded local relationship data
- [x] Build Today daily update timeline and add-update interaction
- [x] Build private Chat list and conversation interaction
- [x] Build Memories timeline, On This Day highlight, and memory detail flow
- [x] Build Connect flow with KURA code presentation and request states
- [x] Build Important Dates and countdown cards
- [x] Build Letters inbox and compose/schedule interaction
- [x] Build free Virtual Gifts grid and send interaction
- [x] Build More, Profile, Settings, and privacy surfaces
- [x] Add English translation dictionary structure with Nepali and Japanese extension points
- [x] Add deterministic tests for core local state transitions and date calculations
- [x] Validate TypeScript, lint, tests, and mobile preview rendering
- [x] Create final checkpoint and deliver the project version to the user

## Future / Explicit Extension Points

- [ ] Production email/password and OAuth authentication with verification and recovery
- [ ] PostgreSQL schema and authorization policies for users, connections, relationships, groups, messages, media, memories, dates, letters, gifts, goals, and notifications
- [ ] Realtime private messaging and typing/read-state transport
- [ ] S3-compatible media storage with upload validation and signed access
- [ ] Push notifications and scheduled delivery workers
- [ ] Private groups, shared calendar, challenges, bucket lists, and goals
- [ ] Optional, time-limited location sharing with explicit audience controls
- [ ] Admin moderation and abuse-reporting dashboard
- [ ] Data export, account deletion, audit logging, and backup/restore runbooks
- [ ] AI-assisted message and memory features behind explicit user consent
- [ ] Premium architecture without forcing monetization into the initial experience

- [x] Fix iOS Code Scanner connectivity failure: Expo development server returns HTTP 502 / upstream_connect_failed on port 8081

# Authentication-First Upgrade

- [x] Replace the seeded Binod–Indreni first-open experience with authentication-first entry
- [x] Add login options for email/password, Google, Facebook, phone number, and extensible provider slots
- [x] Add registration, password creation, password reset, verification, and session-state screens
- [x] Add user-owned profile setup so display name and relationship data are entered by each user
- [x] Add account settings for password change, logout, profile editing, and privacy controls
- [x] Add account deletion with confirmation and a reversible restore window in the local product flow
- [x] Add an extensible feature roadmap surface for future groups, realtime chat, media, notifications, AI, and premium modules
- [x] Validate authentication-first navigation and ensure no personal demo names appear before user setup
- [ ] Create checkpoint for authentication-first upgrade and deliver the updated project version
