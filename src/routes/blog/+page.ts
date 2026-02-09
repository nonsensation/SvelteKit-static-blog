import type { PostMetadata } from "$lib/types";
import { resolve } from '$app/paths';

export async function load({ fetch }) {
    const response = await fetch(resolve(`/api/posts`));
    const posts: PostMetadata[] = await response.json();
    return { posts };
}