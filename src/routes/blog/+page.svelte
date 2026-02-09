<script lang="ts">
	let { data } = $props();
</script>

<h1>Blog</h1>

<ul class="flex flex-col gap-4">
	{#each data.posts as post}
		<li class="rounded-lg border border-gray-200 p-4">
			<a href="/blog/{post.slug}">{post.title}</a>
		</li>
	{/each}
</ul>

<style>
</style>
