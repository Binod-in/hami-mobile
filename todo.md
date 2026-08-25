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
- [x] Create checkpoint for authentication-first upgrade and deliver the updated project version

# Realtime and Production Backend Upgrade

- [x] Audit the existing server, auth scaffold, Drizzle schema, storage helper, and connector configuration
- [ ] Add PostgreSQL-backed user profiles with secure ownership checks and cross-device profile synchronization
- [ ] Add PostgreSQL conversations and message records with private authorization boundaries
- [x] Add image message metadata and a secure upload/storage boundary
- [x] Add realtime chat updates with reconnection and query invalidation behavior
- [x] Add mobile image selection and image-message composer flow
- [ ] Integrate real email authentication and provider-backed Google/Facebook login where credentials are configured
- [x] Add clear missing-configuration states for providers that cannot be activated in this environment
- [x] Create and validate a reusable HAMI implementation skill using the skill-creator workflow
- [x] Run end-to-end checks, save a new checkpoint, and deliver the upgraded app and reusable skill

# Firebase Provider Decision

- [ ] Configure Firebase project settings for web, iOS, and Android clients
- [ ] Add Firebase web configuration and server verification secrets through secure project settings
- [ ] Enable Firebase email/password, Google, and Facebook providers with redirect/deep-link configuration
- [ ] Keep PostgreSQL as the source of truth for HAMI profiles, connections, conversations, and messages keyed by verified Firebase identity
- [ ] Add a reusable Firebase + PostgreSQL implementation skill and validate its package

# Approved Backend Fallback

- [x] Use the existing HAMI secure login and server session boundary instead of blocking on Firebase credentials
- [x] Keep Firebase integration documented as a future provider adapter rather than activating it now
- [x] Add managed relational profile, private conversation, message, and attachment tables through the existing Drizzle database boundary
- [x] Add protected tRPC profile and chat procedures with identity-based authorization
- [x] Add near-realtime cross-device message refresh through React Query invalidation and polling
- [x] Add clean account state and private-tab guards so legacy seeded content cannot rehydrate
- [x] Create and validate the reusable HAMI production-sync skill package

# Simplified Authentication UX

- [x] Make username/name plus password the primary HAMI login flow
- [x] Make username/name plus password the primary account-creation flow
- [x] Move Google, Facebook, and phone-number sign-in into a clearly labeled Coming Soon surface
- [x] Validate the simplified auth flow and save an updated checkpoint

# Account Experience Upgrade

- [x] Add profile settings page with avatar picker, bio editor, and display-name update
- [x] Add Remember Me behavior for the name/password login session
- [x] Add dedicated Forgot Password screen with email reset-link request state
- [x] Update and validate the reusable HAMI skill with these account-flow patterns
- [x] Validate account flows and save a new HAMI checkpoint

# Connection-Gated Relationship Upgrade

- [x] Keep every newly logged-in user in an independent private profile until a partner is explicitly added
- [x] Add partner profile fields for name, avatar, bio/details, and relationship start date
- [x] Add explicit partner invite/setup flow from the solo Home or More surface
- [x] Show neutral solo Home state with no couple names, connected badge, or love-story duration before setup
- [x] Show connected avatars, partner details, and years/months/days together only after relationship setup
- [x] Add deterministic duration formatting for years, months, and days
- [x] Validate solo login state, partner setup, connected Home state, and duration display
- [x] Save a new checkpoint for the connection-gated relationship upgrade
