/**
 * API data contracts. These describe the JSON shape exchanged with the backend
 * (mocked by MSW now, Mendix REST/OData later). Presentation-only concerns like
 * icon components are NOT part of these types — components map data to icons.
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
