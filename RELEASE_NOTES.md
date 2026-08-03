# MyBahri — Release Notes

What changed in each version, in plain language for everyone using the portal.
Each version below maps to a GitHub Release.

---

## v0.4.0

### New
- You can now open a full weekly view of your attendance. Tap the Daily Attendance card to see each day this week marked Present, Partial, or Absent, along with your punch times, hours, and weekly total.
- Say hello to Bahar, your AI assistant. Look for the new button in the bottom-right corner. It's coming soon!

---

## v0.3.0

### New
- The home banner now shows the latest company announcement, so you'll always see current news (like schedule or policy changes) right at the top.

### Improved
- If the portal ever goes down for planned maintenance, you'll now see a friendly "we'll be back soon" page with a countdown instead of an error.

---

## v0.2.4

### Improved
- The side navigation now gently pushes the page aside when it expands, so it never covers your content.

### Fixed
- Fixed pages and widgets (like Tasks and the org directory) occasionally showing "couldn't load" on first open. They now load reliably, with a "Try again" option if anything hiccups.

---

## v0.2.3

### New
- Multimedia now has separate tabs for Events, News, and a Photo Library (coming soon).
- The calendar highlights days that have events, and hovering a day shows the event name.
- You can now switch the main calendar between Hijri and Gregorian.
- Added a "What's New" button in the top bar that shows the latest updates and their history, with a badge for unread updates.
- The side navigation now expands to show page names when you hover it.

### Improved
- Your leave balance now comes from the system instead of a fixed number.

### Fixed
- The attendance card now always shows today's date.
- The multimedia calendar now opens on the current month instead of a fixed one.
- Event days now show as highlighted on the calendar.
- The org directory now retries and shows a clear "Try again" option if it can't load.

---

## v0.2.0

### New
- Added a new sign-in page with single sign-on and email options.
- Added a new method of authentication with role-based access, so you only see what your role allows.
- Header now shows your name, your role, and options according to your permissions.
- Added Employee Lookup, so you can search for a colleague and see their extension, email, department and floor.
- Added a full CEO message page you can open from the home page.
- Added live weather in the top bar.
- Added a reporting-line view: click a colleague to see where you sit in the organization (your manager, their manager, and your teammates).
- Added an Upcoming Meetings widget: connect your Outlook calendar to see the week's meetings, with quick join links.

### Improved
- Updated the app logo to the official Bahri emblem.
- Congratulating the Employee of the Month now plays a fun celebration.
- Smoother animation when moving between pages.
- Cleaned up the CEO photo on the home page.

### Fixed
- Corrected the CEO's name shown across the portal.
- Various fixes and refinements.

---

## v0.1.0

The first preview of the new, faster MyBahri portal.

### New
- Added a brand-new home dashboard with everything in one place: attendance, to-dos, events, calendar, quick actions, company news and more.
- Added live punch-in / punch-out with a running work timer on the Daily Attendance card.
- Added a To-Do list where you can add new requests, mark them complete, and filter by status.
- Added event registration, so you can register for an event and see the attendee count update.
- Added the Organizational Structure directory with search and team filters.
- Added the Employee of the Month card and birthday wishes you can personalize and send.
- Added Dark Mode, so you can switch between light and dark from the top bar.
- Added seasonal themes (like Saudi National Day) that restyle the portal for special occasions and turn off automatically afterwards.
- Added branded loading animations when you first open the portal and while pages load.

### Improved
- Much faster than before: pages load only what they need, so moving around feels instant.

---

<!--
Style guide (keep it simple — these are for USERS, not developers):
- Use hyphen bullets ("- "), never numbered lists.
- No em dashes or double dashes ("—" / "--") in the notes. Use a period, comma, or colon instead.
- Plain sentences, feature-level. No technical section headers.
- Group under New / Improved / Fixed only.
- Examples: "Added a new method of authentication.", "Fixed various bugs."
Add a new "## vX.Y.Z" section at the top for each release.
(Detailed technical history lives in the git commit messages.)
-->
