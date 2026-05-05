'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {usePathname} from 'next/navigation'

type Props = {children: React.ReactNode}

// Per-route blur + fade entry. The exit step is intentionally instant so
// the user never waits for the previous page to disappear before the
// next one starts painting; only the new tree animates in (blur(8px) →
// 0, opacity 0 → 1) which echoes the header's backdrop-filter language
// without adding navigation latency. `initial={false}` on the
// AnimatePresence skips the very first mount so the intro overlay
// reveal isn't fighting a redundant page-level fade underneath.
export default function PageTransition({children}: Props) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{opacity: 0, filter: 'blur(8px)'}}
        animate={{opacity: 1, filter: 'blur(0px)'}}
        transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
