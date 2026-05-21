export interface WorkSummary {
  workId: string
  title: string
  authors: string[]
  coverUrl: string | null
  avgRating: number | null
  totalCopies: number
  availableCopies: number
  subjects: string[]
}

export interface WorkDetail extends WorkSummary {
  originalLanguage: string
  description: string
  ratingCount: number
  editions: Edition[]
}

export interface Edition {
  editionId: string
  isbn13: string | null
  language: string | null
  publisher: string | null
  pubYear: number | null
  format: string | null
}

export interface MemberProfile {
  memberId: string
  firstName: string
  lastName: string
  email: string
  level: number
  totalBorrows: number
  onTimeReturns: number
  borrowerRating: number | null
  membershipStatus: string
}

export interface AuthResponse {
  token: string
  member: MemberProfile
}

export interface Borrowing {
  borrowingId: string
  copyId: string
  workId: string
  workTitle: string
  coverUrl: string | null
  status: string
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  renewalsCount: number
  overdue: boolean
  lenderId: string | null
  lenderName: string | null
}

export interface Rating {
  ratingId: string
  workId: string
  memberId: string
  memberName?: string
  score: number
  review: string | null
  createdAt: string
}

export interface IsbnLookupResult {
  resultType: 'found' | 'not_found'
  work: WorkDetail | null
}

export type SpringPage<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const LEVEL_INFO = [
  { level: 1, name: 'Newcomer',  icon: '🌱', minBorrows: 0,  maxBorrows: 4,        perks: ['Borrow books', 'Max 2 active borrows', '7-day loans'] },
  { level: 2, name: 'Reader',    icon: '📖', minBorrows: 5,  maxBorrows: 14,       perks: ['Borrow books', 'Lend your books', 'Max 3 active borrows', '14-day loans'] },
  { level: 3, name: 'Curator',   icon: '🏛️', minBorrows: 15, maxBorrows: 29,       perks: ['All Reader perks', 'Max 5 active borrows', '21-day loans', 'Priority reservations'] },
  { level: 4, name: 'Librarian', icon: '⭐', minBorrows: 30, maxBorrows: Infinity, perks: ['All Curator perks', 'Unlimited active borrows', '30-day loans', 'Trusted lender badge'] },
] as const
