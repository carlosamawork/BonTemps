// Server-rendered current date. No hydration logic — the same string is
// produced at render time and shipped in HTML. Crawlers see the date at
// request time; users may see a server-side date if their timezone differs
// (acceptable trade-off for portfolio purposes; can be upgraded to a client
// island if locale-aware refresh is required).
const FORMAT: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}

export default function DateBlock({className}: {className?: string}) {
  const today = new Date().toLocaleDateString('en-US', FORMAT)
  return (
    <time dateTime={new Date().toISOString().slice(0, 10)} className={className}>
      {today}
    </time>
  )
}
