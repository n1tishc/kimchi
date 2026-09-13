import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'

export function BackLink({ children, ...props }) {
  return (
    <button
      className="inline-flex min-h-[34px] items-center gap-[5px] p-0 text-ink-soft bg-transparent border-0 cursor-pointer text-[.8rem] font-bold transition-colors duration-150 hover:text-tomato focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
      type="button"
      {...props}
    >
      <ArrowLeftIcon />
      {children}
    </button>
  )
}
