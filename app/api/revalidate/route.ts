import {revalidateTag} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

const SECRET = process.env.SANITY_REVALIDATE_SECRET

type WebhookPayload = {_type?: string; slug?: {current?: string}}

export async function POST(req: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      {ok: false, error: 'Missing SANITY_REVALIDATE_SECRET'},
      {status: 500},
    )
  }
  const {isValidSignature, body} = await parseBody<WebhookPayload>(req, SECRET)
  if (!isValidSignature) {
    return NextResponse.json({ok: false, error: 'Invalid signature'}, {status: 401})
  }
  const tag = body?._type
  if (!tag) {
    return NextResponse.json({ok: false, error: 'No _type in payload'}, {status: 400})
  }
  revalidateTag('sanity')
  revalidateTag(tag)
  if (body.slug?.current) revalidateTag(`${tag}:${body.slug.current}`)
  return NextResponse.json({ok: true, tag, slug: body.slug?.current ?? null})
}
