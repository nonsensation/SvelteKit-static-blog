export type PostMetadata = {
    slug: string;
    title: string;
    published: boolean;
}

export type Post = {
    metadata: PostMetadata;
    content: any;
}