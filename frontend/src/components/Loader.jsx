export function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className={`${sizes[size]} border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin`}
        style={{ borderWidth: 3 }} />
      {text && <p className="text-slate-500 text-sm">{text}</p>}
    </div>
  )
}

export function TourCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-52 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-4 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return <div className="skeleton h-28 rounded-2xl" />
}
