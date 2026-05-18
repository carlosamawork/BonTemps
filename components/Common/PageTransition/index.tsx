'use client'
import {AnimatePresence, motion} from 'framer-motion'
import {usePathname} from 'next/navigation'

type Props = {children: React.ReactNode}

// True cross-fade between routes. The wrapper uses `display: grid` with
// every child placed in the same grid cell (`grid-area: 1 / 1`) so the
// outgoing and incoming trees stack on top of each other and both animate
// at the same time — no "blank" frame between them. The grid sizes to the
// taller of the two during the overlap.
export default function PageTransition({children}: Props) {
  const pathname = usePathname()
  return (
    <div style={{display: 'grid'}}>
      <AnimatePresence initial={false}>
        <motion.div
          key={pathname}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.5, ease: [0.4, 0, 0.2, 1]}}
          style={{gridArea: '1 / 1'}}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
