export function ErrorNote({ children }) {
  return (
    <p className="patch tone-ink m-0 flex items-start gap-3 px-4 py-3.5 text-[.95rem] leading-[1.5]" role="alert">
      <span className="flex-none mt-[5px] size-3 bg-hong" aria-hidden="true" />
      {children}
    </p>
  )
}
