import type { PostMetadata } from "$lib/types";

export async function load({ fetch }) {
    const response = await fetch('/api/posts');
    const posts: PostMetadata[] = await response.json();
    return { posts };
}