import type { Metadata } from 'next'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export const dynamic = 'force-dynamic'


export default async function Post({
  params,
}: {
  params: { slug?: string }
}) {
  const { slug = '' } = params
  const url = `/posts/${slug}`
  const post = await queryPostBySlug({ slug })

  if (!post) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText
            className="max-w-[48rem] mx-auto"
            content={post.content}
            enableGutter={false}
          />
          {post.relatedPosts?.length && post.relatedPosts?.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p) => typeof p === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}


export async function generateMetadata({
  params,
}: {
  params: { slug?: string }
}): Promise<Metadata> {
  const { slug = '' } = params
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

// Кэшируем запрос к БД
const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
