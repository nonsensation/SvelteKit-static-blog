<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<article class="page-content {data.post?.metadata?.layout}">
	{#if data.post?.metadata?.toc != false}
		{#if data.post?.metadata?.layout == 'docs'}
			<aside id="docs-toc">
				<header>Table of Contents</header>
				<div id="toc"></div>
			</aside>
		{:else if data.post?.metadata?.layout == 'blog'}
			<details class="toc">
				<summary>Table of Contents</summary>
			</details>
		{/if}
	{/if}

	<section class="page-content" id="docs-main">
		{#if data.post?.content}
			<data.post.content />
		{:else}
			<p>Post not found</p>
		{/if}
	</section>

	<div class="tagcloud">
		<!-- {% for tagitem in tags %}
                <a class="tag" href="/Tags#{{ tagitem | slugify }}">{{ tagitem }}</a>
            {% endfor %}
            {% for tagitem in cats %}
                <a class="tag" href="/Categories#{{ tagitem | slugify }}">{{ tagitem }}</a>
            {% endfor %} -->
	</div>
</article>
