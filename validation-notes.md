# Validation Notes

The mobile preview renders the HAMI Home, Today, Chat, and Memories tabs at a 390x844 portrait viewport with the warm cream / aubergine / rose visual system. Home shows a calculated relationship duration, actionable quick actions, a daily moment card, and an On This Day memory card. Today shows the chronological update rail and add-moment entry point. Chat shows private conversation bubbles, online state, search affordance, and composer. Memories shows the On This Day panel, three seed memories, and memory detail/add-memory entry points.

The More route renders in the browser even though one automated screenshot capture returned a transient capture failure. Its Connect row opens a modal sheet with the KURA code, code entry field, and a Send connection request button. No runtime or TypeScript error was visible during this interaction.

The onboarding route initially returned an unavailable page because it was not registered in the root Stack. After adding `<Stack.Screen name="onboarding" />`, the route renders correctly with the HAMI mark, four-step progression, warm keepsake illustration, Skip action, Continue action, and login affordance.

Authentication-first validation: the root route briefly shows a loading state during session resolution and then redirects to /auth when no active account is present. The /auth screen renders HAMI branding, Log in/Create account modes, Google/Facebook/Apple provider buttons, email/phone selector, password input, password recovery entry, and secure login action. The previous Binod–Indreni labels are absent from app screens.

Registration validation: switching to Create account updates the copy and password placeholder correctly; email and password inputs accept values. The form is ready to advance into profile setup after submission.

Profile setup validation: submitting registration opens /profile-setup. The screen starts with a neutral YOU avatar, collects display name and username, offers Partner/Family/Friends/Private group choices, and provides a Create my private home action. Entered test values update the avatar initials immediately.

Authenticated validation: after profile setup with the test user Asha, Home shows “Good morning, Asha” and AS initials, while More shows Asha and PRIVATE. No Binod–Indreni demo identity remains in the rendered app surfaces. More exposes Connect, dates, letters, gifts, future modules, Profile & privacy, and Replay welcome.

Preview recovery validation: a temporary unavailable state occurred while revisiting /more, so managed development services were restarted. Metro rebuilt successfully; the public /auth route now renders the HAMI authentication screen again with no build error.

Realtime-upgrade validation: TypeScript, lint, unit tests, and skill validation passed. The managed preview temporarily reported unavailable during direct /chat navigation, so the server should be restarted before final preview capture. The code guard and state-version changes are intended to keep private tabs auth-gated and prevent legacy demo state rehydration.

Simplified-auth validation: Auth screen visibly presents Name or username and Password as the primary fields. Google login, Facebook login, and Phone number login render with Coming soon labels. A disposable Test User plus password submission successfully advanced to /profile-setup, where the user-owned display name and generated username were present.

Account-experience validation: TypeScript, lint, unit tests, and reusable-skill validation pass. The dedicated profile-settings and forgot-password routes are registered, and the auth screen was wired with Remember Me persistence. The browser preview intermittently reports unavailable after managed-service restarts even though Metro bundles successfully; the implementation remains type-checked and the earlier auth preview rendered correctly.

Connection-gated validation: The partner setup route renders as an explicit Add your person flow with photo, name, bio/details, relationship type choices, and YYYY-MM-DD story start date. Disposable test values Asha / My favorite person / 2022-08-08 were accepted by the form before submission.

Partner-linking validation: Invite route, shareable HAMI code UI, shared gallery route, connected-state gallery upload/caption flow, and connection settings for edit/remove are implemented. TypeScript, lint, and unit tests pass. The current invite acceptance and gallery state are local prototype behavior; cross-account invite persistence and cross-device gallery synchronization still require server-backed invite/gallery tables and procedures.
