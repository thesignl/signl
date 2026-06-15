import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string
  title?: string
}

const base = (props: IconProps) => ({
  width: props.size ?? 18,
  height: props.size ?? 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': props.title ? undefined : true,
  role: props.title ? 'img' : undefined,
})

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      {props.title ? <title>{props.title}</title> : null}
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M6 6 18 18 M18 6 6 18" />
    </svg>
  )
}

export function BookmarkIcon(props: IconProps & { filled?: boolean }) {
  const { filled, ...rest } = props
  return (
    <svg
      {...base(rest)}
      {...rest}
      fill={filled ? 'currentColor' : 'none'}
    >
      {props.title ? <title>{props.title}</title> : null}
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      {props.title ? <title>{props.title}</title> : null}
      <path d="M4 7h16 M4 12h16 M4 17h16" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      <path d="m5 12 5 5 9-11" />
    </svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4 M12 16h.01" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      <path d="M5 12h14 m-6-6 6 6-6 6" />
    </svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon(props: IconProps) {
  return (
    <svg {...base(props)} {...props}>
      <path d="M3 3l18 18 M10.6 6.1A9.9 9.9 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.1 3.6 M6.6 6.6A17 17 0 0 0 2 12s4 6 10 6c1.5 0 2.8-.3 4-.8" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}
