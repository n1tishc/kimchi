export function ErrorNote({ children }) {
  return (
    <p className="m-0 px-3.5 py-3 text-danger bg-danger-wash border-l-4 border-danger text-[.9rem] leading-[1.5]">
      {children}
    </p>
  )
}
