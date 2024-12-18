import { PayloadRedirects } from '@/components/PayloadRedirects';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { draftMode } from 'next/headers';
import React, { cache } from 'react';
import { homeStatic } from '@/endpoints/seed/home-static';
import { RenderBlocks } from '@/blocks/RenderBlocks';
import { RenderHero } from '@/heros/RenderHero';
import { generateMeta } from '@/utilities/generateMeta';
import PageClient from './page.client';
export async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise });
    const pages = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1000,
        overrideAccess: false,
        select: {
            slug: true,
        },
    });
    const params = pages.docs
        ?.filter((doc) => {
        return doc.slug !== 'home';
    })
        .map(({ slug }) => {
        return { slug };
    });
    return params;
}
export default async function Page({ params: paramsPromise }) {
    const { slug = 'home' } = await paramsPromise;
    const url = '/' + slug;
    let page;
    page = await queryPageBySlug({
        slug,
    });
    // Remove this code once your website is seeded
    if (!page && slug === 'home') {
        page = homeStatic;
    }
    if (!page) {
        return <PayloadRedirects url={url}/>;
    }
    const { hero, layout } = page;
    return (<article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url}/>

      <RenderHero {...hero}/>
      <RenderBlocks blocks={layout}/>
    </article>);
}
export async function generateMetadata({ params: paramsPromise }) {
    const { slug = 'home' } = await paramsPromise;
    const page = await queryPageBySlug({
        slug,
    });
    return generateMeta({ doc: page });
}
const queryPageBySlug = cache(async ({ slug }) => {
    const { isEnabled: draft } = await draftMode();
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        overrideAccess: draft,
        where: {
            slug: {
                equals: slug,
            },
        },
    });
    return result.docs?.[0] || null;
});
//# sourceMappingURL=page.jsx.map