import { error } from "@sveltejs/kit";

export const prerender = true;

export async function load({ params }) {
    const allPosts = import.meta.glob('../../../content/**/*.{md,mdx,adoc}');

    const matchingPaths = Object.keys(allPosts).filter((path) => {
        return path.includes(`/${params.slug}/`);
    });

    if (matchingPaths.length === 0) {
        throw error(404, 'Post not found');
    }

    const path = matchingPaths[0];
    const file: any = await allPosts[path]();

    return {
        post: {
            metadata: file.metadata,
            title: file.metadata?.title || 'Untitled',
            content: file.default
        }
    };
}