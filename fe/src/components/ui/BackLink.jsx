import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'

export function BackLink({ children, ...props }) {
  return (
    <button
      className="link inline-flex min-h-11 items-center gap-1.5 p-0 text-ink bg-transparent border-0 cursor-pointer text-[.95rem]"
      type="button"
      {...props}
    >
      <ArrowLeftIcon />
      {children}
    </button>
  )
}
