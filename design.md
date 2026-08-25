# HAMI Mobile Interface Design

## Product Direction

HAMI is a private digital home for people who matter: a calm, premium space for couples, families, friends, and small private groups to share everyday life and preserve memories. The product specification contains occasional references to “KURA”; this implementation uses **HAMI** consistently because it is the declared primary app name.

The first build will prioritize a coherent couple-mode experience that can expand into private groups without overloading the interface. It will use portrait-first layouts, one-handed reachability, strong visual hierarchy, and iOS-native interaction patterns.

## Screen List

| Screen | Primary content and functionality |
|---|---|
| Welcome / Onboarding | HAMI mark, “Far apart. Still together.”, three concise value propositions, progress dots, and actions to continue, create an account, or log in. |
| Home | Greeting, partner avatar and presence, relationship duration, next important date, today’s mood/update, recent memory, quick actions for sharing, chat, letters, and gifts. |
| Today | Chronological private daily timeline with time, activity, text, mood, optional location, photos, and a prominent add-update composer. |
| Chat | Private conversation list and a focused conversation view with messages, composer, reactions, read state, and attachment affordances. |
| Memories | Chronological memory timeline, “On this day” highlight, albums, and an add-memory action. |
| Memory Detail | Full memory title, date, location, description, media, mood, participants, and privacy label. |
| Connect | KURA connection code presentation, code entry, QR/invite options, pending requests, and accept/decline states. |
| Important Dates | Relationship start date, birthdays, anniversaries, countdown cards, and add-custom-date flow. |
| Letters | Inbox of received letters, drafts, scheduled/future letters, and a compose flow with delivery date. |
| Gifts | Free virtual gift grid, gift preview, personal message, and send confirmation. |
| More / Private Home | Bucket list, shared goals, challenges, shared calendar, group spaces, location-sharing controls, notifications, privacy, profile, and settings. |
| Profile | Private profile photo, display name, bio, username/KURA code, joined date, and visibility controls. |
| Settings & Privacy | Notification preferences, profile visibility, location-sharing status, blocked/report controls, data export, account deletion, and language selection. |

## Navigation Model

The primary tab bar contains **Home**, **Today**, **Chat**, **Memories**, and **More**. The tab bar remains visually quiet and uses SF Symbols / Material fallbacks. The Home tab is the emotional anchor, while More acts as a private utility drawer rather than a dense sixth tab.

Each screen uses `ScreenContainer` and keeps key controls within thumb reach. Creation flows use native-feeling sheets or pushed detail screens, with a clear cancel/back affordance and a single primary action.

## Key User Flows

### First-time setup

1. User advances through onboarding.
2. User chooses Create account or Log in.
3. User completes a minimal profile with display name, username, and optional profile photo.
4. User chooses a connection intent: Partner, Family, Friends, or Group.
5. User lands on Home with an actionable Connect card.

### Connect with a person

1. User opens Connect from Home.
2. User copies or shares their KURA code, or enters another person’s code.
3. The app shows a pending request without exposing private relationship data.
4. The recipient accepts or declines.
5. On acceptance, the user chooses the relationship mode and configures the relationship start date.

### Share a daily update

1. User taps Add update on Home or Today.
2. User selects a mood and optional activity, writes a short note, and optionally attaches media or location.
3. User chooses visibility: Only me, Partner, Selected connections, or Group.
4. User saves the update and sees it appear in the Today timeline.

### Preserve a memory

1. User opens Memories and taps Add memory.
2. User enters title, date, optional location, description, mood, and media.
3. User saves the memory.
4. The memory appears in chronological order and can later be opened in Memory Detail.

### Send a letter or gift

1. User opens Letters or Gifts from Home / More.
2. User selects a recipient, writes a message, and optionally chooses a delivery date for a letter.
3. For gifts, user chooses a free gift and confirms the message.
4. The recipient receives a private inbox item and a notification state when notification infrastructure is enabled.

## Brand and Color Choices

HAMI uses a warm “evening keepsake” palette rather than the bright gradients common in dating products. The palette should feel intimate, premium, and readable in both light and dark mode.

| Token | Light mode | Dark mode | Intent |
|---|---|---|---|
| `primary` | `#B94A63` | `#E87891` | Rose accent for love, actions, and active states |
| `background` | `#FFF9F7` | `#171316` | Warm paper / deep plum canvas |
| `surface` | `#FFFFFF` | `#241D22` | Cards, sheets, and message surfaces |
| `foreground` | `#291D22` | `#FFF5F2` | Primary text |
| `muted` | `#806F75` | `#B9AAB0` | Supporting copy and metadata |
| `border` | `#EEDFE1` | `#493A42` | Quiet separators |
| `success` | `#4A9276` | `#70C49E` | Completed goals and accepted connections |
| `warning` | `#C88542` | `#E7AA69` | Upcoming dates and attention states |
| `error` | `#B94351` | `#F1848E` | Destructive actions and reports |
| `lavender` | `#ECE5F3` | `#362D40` | Secondary highlight for memories and reflections |
| `peach` | `#F8E2D8` | `#4A302D` | Soft emotional highlight |

Typography should favor a rounded system sans-serif with generous line height. Headings are expressive but restrained; metadata is compact and muted. Cards use large corner radii, subtle borders, and minimal shadows. The visual language should communicate “private digital home,” not public social media.

## Interaction Principles

Primary buttons use a subtle pressed scale and light haptic feedback on native platforms. Cards use opacity feedback. Destructive actions are separated from primary actions and require confirmation. Location sharing is off by default and always displays its active duration and audience. Empty states should explain the next useful action instead of showing unexplained blank space.

## MVP Boundary

The first working build will focus on onboarding, a seeded local relationship dashboard, Today updates, Memories, Chat, Connect, Letters, Gifts, Important Dates, and Profile/Privacy surfaces. These flows will be fully navigable and stateful within the app. Production authentication, realtime sync, media upload, push delivery, and server authorization remain explicit extension points for the backend phase rather than being represented as insecure fake implementations.

## Internationalization Readiness

All user-facing labels should be centralized in a small translation dictionary with English as the initial locale and reserved keys for Nepali and Japanese. Screens should consume translation keys rather than scattering text constants through render logic.
