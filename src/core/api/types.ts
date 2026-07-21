/**
 * API data contracts — the JSON shapes exchanged with the backend (mocked by MSW
 * now, real backend/GCP later). Pure types: no web or framework dependencies, so
 * this file is shared verbatim by the web app and the future React Native app.
 */

export type TodoStatus = 'Pending Approval' | 'Completed'

export interface TodoDto {
  id: string
  title: string
  when: string
  status: TodoStatus
}

export interface OrgMemberDto {
  id: string
  name: string
  title: string
  initials: string
  team: 'Leadership Team' | 'Product Development'
}
