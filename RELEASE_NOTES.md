# MyBahri — Release Notes

What changed in each version, in plain language for everyone using the portal.
Each version below maps to a GitHub Release.

---

## v0.3.0

### New
1. The home banner now shows the latest company announcement, so you'll always see current news (like schedule or policy changes) right at the top.

### Improved
1. If the portal ever goes down for planned maintenance, you'll now see a friendly "we'll be back soon" page with a countdown instead of an error.

---

## v0.2.4

### Improved
1. The side navigation now gently pushes the page aside when it expands, so it never covers your content.

### Fixed
1. Fixed pages and widgets (like Tasks and the org directory) occasionally showing "couldn't load" on first open — they now load reliably, with a "Try again" option if anything hiccups.

---

## v0.2.3

### New
1. Multimedia now has separate tabs for Events, News, and a Photo Library (coming soon).
2. The calendar highlights days that have events, and hovering a day shows the event name.
3. You can now switch the main calendar between Hijri and Gregorian.
4. Added a "What's New" button in the top bar that shows the latest updates and their history, with a badge for unread updates.
5. The side navigation now expands to show page names when you hover it.

### Improved
1. Your leave balance now comes from the system instead of a fixed number.

### Fixed
1. The attendance card now always shows today's date.
2. The multimedia calendar now opens on the current month instead of a fixed one.
3. Event days now show as highlighted on the calendar.
4. The org directory now retries and shows a clear "Try again" option if it can't load.

---

## v0.2.0

### New
1. Added a new sign-in page with single sign-on and email options.
2. Added a new method of authentication with role-based access, so you only see what your role allows.
3. Header now shows your name, your role, and options according to your permissions.
4. Added Employee Lookup — search for a colleague and see their extension, email, department and floor.
5. Added a full CEO message page you can open from the home page.
6. Added live weather in the top bar.
7. Added a reporting-line view — click a colleague to see where you sit in the organization (your manager, their manager, and your teammates).
8. Added an Upcoming Meetings widget — connect your Outlook calendar to see the week's meetings, with quick join links.

### Improved
1. Updated the app logo to the official Bahri emblem.
2. Congratulating the Employee of the Month now plays a fun celebration.
3. Smoother animation when moving between pages.
4. Cleaned up the CEO photo on the home page.

### Fixed
1. Corrected the CEO's name shown across the portal.
2. Various fixes and refinements.

---

## v0.1.0 — First preview

The first preview of the new, faster MyBahri portal.

### New
1. Added a brand-new home dashboard with everything in one place: attendance, to-dos, events, calendar, quick actions, company news and more.
2. Added live punch-in / punch-out with a running work timer on the Daily Attendance card.
3. Added a To-Do list where you can add new requests, mark them complete, and filter by status.
4. Added event registration — register for an event and see the attendee count update.
5. Added the Organizational Structure directory with search and team filters.
6. Added the Employee of the Month card and birthday wishes you can personalize and send.
7. Added Dark Mode — switch between light and dark from the top bar.
8. Added seasonal themes (like Saudi National Day) that restyle the portal for special occasions and turn off automatically afterwards.
9. Added branded loading animations when you first open the portal and while pages load.

### Improved
1. Much faster than before — pages load only what they need, so moving around feels instant.

---

<!--
Style guide (keep it simple — these are for USERS, not developers):
- Plain sentences, feature-level. No technical section headers.
- Group under New / Improved / Fixed only.
- Examples: "Added a new method of authentication.", "Fixed various bugs."
Add a new "## vX.Y.Z" section at the top for each release.
(Detailed technical history lives in the git commit messages.)
-->
