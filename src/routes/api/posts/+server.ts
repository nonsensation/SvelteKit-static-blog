import type { PostMetadata } from "$lib/types";
import { json } from "@sveltejs/kit";


export async function GET() {
    return json(getPosts());
}

function getPosts(): PostMetadata[] {

    // console.error("getPosts");

    const paths = import.meta.glob('../../../content/**/*.{md,mdx,adoc}', { eager: true });

    const posts: PostMetadata[] = [];

    for (const path in paths) {
        const file = paths[path];

        // console.error(path);
        // console.error(file);

        if (!file || typeof file !== 'object') {
            // console.error("no file or not object", path);
            continue;
        }

        if (!('metadata' in file)) {
            // console.log("no metadata in file", path);
            continue;
        }

        const slug = path.split('/').at(-2);

        if (!slug) {
            // console.log("no slug in file", path);
            continue;
        }

        const metadata = file.metadata as Omit<PostMetadata, 'slug'>;

        // console.log(metadata);

        const post: PostMetadata = { ...metadata, slug };

        if (!toBool(post.published)) {
            // console.log("not published", path);
            continue;
        }

        posts.push(post);
    }

    return posts;
}

const toBool = (val: any) => {
    if (val === 'false') return false;
    return !!val;
};

