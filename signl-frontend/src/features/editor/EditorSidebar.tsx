'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import {
  FileIcon,
  PencilIcon,
  ClockIcon,
  CalendarIcon,
  CheckIcon,
  BarIcon,
  UserIcon,
  KeyboardIcon,
  PlusIcon,
} from './icons'

export type EditorNav =
  | 'my-articles'
  | 'drafts'
  | 'review'
  | 'scheduled'
  | 'published'
  | 'my-analytics'
  | 'profile'
  | 'shortcuts'
  | 'editor'

export interface NavCounts {
  all: number
  drafts: number
  review: number
  scheduled: number
  published: number
}

const EMPTY_COUNTS: NavCounts = {
  all: 0,
  drafts: 0,
  review: 0,
  scheduled: 0,
  published: 0,
}

export default function EditorSidebar({
  active,
  counts = EMPTY_COUNTS,
}: {
  active: EditorNav
  counts?: NavCounts
}) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const initials = (user?.name ?? 'SD')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const go = (path: string) => router.push(path)

  return (
    <aside className="ed-sidebar">
      <div className="ed-brand">
        <div className="ed-logo">
          SIGNL<span>.</span>
        </div>
        <div className="ed-env">Editor</div>
      </div>

      <button className="ed-cta" onClick={() => go('/editor/new')}>
        <PlusIcon width={13} height={13} />
        New Article
      </button>

      <div className="ed-group">
        <NavLink
          nav="my-articles"
          label="My Articles"
          href="/editor"
          icon={<FileIcon />}
          count={counts.all}
          active={active}
          go={go}
        />
        <NavLink
          nav="drafts"
          label="Drafts"
          href="/editor?status=drafts"
          icon={<PencilIcon />}
          count={counts.drafts}
          active={active}
          go={go}
        />
        <NavLink
          nav="review"
          label="In Review"
          href="/editor?status=review"
          icon={<ClockIcon />}
          count={counts.review}
          active={active}
          go={go}
        />
        <NavLink
          nav="scheduled"
          label="Scheduled"
          href="/editor?status=scheduled"
          icon={<CalendarIcon />}
          count={counts.scheduled}
          active={active}
          go={go}
        />
        <NavLink
          nav="published"
          label="Published"
          href="/editor?status=published"
          icon={<CheckIcon />}
          count={counts.published}
          active={active}
          go={go}
        />
      </div>

      <div className="ed-group">
        <div className="ed-group-label">Insights</div>
        <NavLink
          nav="my-analytics"
          label="My Analytics"
          href="/editor/analytics"
          icon={<BarIcon />}
          active={active}
          go={go}
        />
      </div>

      <div className="ed-group">
        <div className="ed-group-label">Account</div>
        <NavLink
          nav="profile"
          label="Profile"
          href="/editor/profile"
          icon={<UserIcon />}
          active={active}
          go={go}
        />
        <NavLink
          nav="shortcuts"
          label="Shortcuts"
          href="/editor/shortcuts"
          icon={<KeyboardIcon />}
          active={active}
          go={go}
        />
      </div>

      <div className="ed-sb-footer">
        <div className="ed-avatar">{initials}</div>
        <div className="ed-user">
          <div className="ed-user-name">{user?.name ?? 'Signl Desk'}</div>
          <div className="ed-user-role">{user?.role ?? 'EDITOR'}</div>
        </div>
        <button
          className="ed-block-action"
          aria-label="Sign out"
          onClick={() => {
            logout()
            router.push('/login')
          }}
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

function NavLink({
  nav,
  label,
  icon,
  count,
  href,
  active,
  go,
}: {
  nav: EditorNav
  label: string
  icon: React.ReactNode
  count?: number
  href: string
  active: EditorNav
  go: (path: string) => void
}) {
  return (
    <button
      className={`ed-link${active === nav ? ' active' : ''}`}
      onClick={() => go(href)}
    >
      <span className="ed-icon">{icon}</span>
      {label}
      {count !== undefined ? <span className="ed-count">{count}</span> : null}
    </button>
  )
}
