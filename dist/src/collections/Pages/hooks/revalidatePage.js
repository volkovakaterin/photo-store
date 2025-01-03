import { revalidatePath } from 'next/cache';
export const revalidatePage = ({ doc, previousDoc, req: { payload }, }) => {
    if (doc._status === 'published') {
        const path = doc.slug === 'home' ? '/' : `/${doc.slug}`;
        payload.logger.info(`Revalidating page at path: ${path}`);
        revalidatePath(path);
    }
    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
        const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`;
        payload.logger.info(`Revalidating old page at path: ${oldPath}`);
        revalidatePath(oldPath);
    }
    return doc;
};
//# sourceMappingURL=revalidatePage.js.map