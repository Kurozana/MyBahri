# MyBahri — Admin & Console Notes

Changes to the administration side of the portal: the Admin Console, integrations,
and (later) Content Management. Written in plain language for IT admins and portal
operators.

These notes are intentionally **not versioned**. Administration work is tracked
separately from the staff-facing release notes (see RELEASE_NOTES.md), which carry
the product version. Newest changes are at the top.

---

## August 2026

### API / Integration Suite (new)
- Added an Integrations area that lists every connected system and application in one registry, with its status, endpoint, average response time, uptime and calls today.
- Each integration is classified as System or Application, so you can tell core plumbing apart from business integrations, and search or filter across them.
- Added a per-integration on/off switch, so an integration can be paused without a code change.
- Added a recent-activity log showing individual calls with their result codes and response times, colour-coded so problems stand out.
- Both the registry and the activity log can be exported to Excel.

### Admin Console refinements
- Maintenance mode is now fully editable: set your own heading, message, and an optional "back online" time that shows staff a live countdown.
- Turning maintenance on now asks for confirmation first, with a clear warning that it stops everyone (except admins) from using the portal.
- Notifications became global announcements: publishing one puts it straight onto everyone's home banner, and you can turn any announcement on or off.
- Removed a duplicate "Release Management" entry from the top-bar menu.

### Admin Console (new)
- Introduced the Admin Console, reachable from the top-bar menu for admins, with Overview, Users & Access, Notifications, Audit Log, Analytics, Release Notes, and Settings.
- Users & Access: view accounts, change roles, and enable or disable people.
- Audit Log: a searchable record of who did what and when.
- Analytics: usage at a glance (active users, punches, most-used services, top events).
- Settings: feature flags to turn portal features on or off, plus maintenance mode.

---

<!--
Style guide (same house style as RELEASE_NOTES.md):
- Use hyphen bullets ("- "), never numbered lists.
- No em dashes or double dashes.
- Plain, operator-facing sentences. No version numbers here.
- Add new dated sections at the top (e.g. "## September 2026").
-->
