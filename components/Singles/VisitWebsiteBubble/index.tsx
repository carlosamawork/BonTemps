import BodyBonTempsRenderer from '@/components/PortableText/BodyBonTempsRenderer'
import LinkBubble from '@/components/Common/LinkBubble'

type Props = {url?: string; description?: unknown}

// "Visit Website" stays here (after the cover) and always links to the
// project's own website. It now shares the LinkBubble component, so it inherits
// the smoother hover animation. The configurable, body-placed button is the
// `linkButton` block instead.
export default function VisitWebsiteBubble({url, description}: Props) {
  if (!url) return null
  return (
    <>
      <LinkBubble url={url} label="Visit Website" />
      {description ? <BodyBonTempsRenderer value={description} /> : null}
    </>
  )
}
