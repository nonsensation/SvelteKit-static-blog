import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

import Processor from '@asciidoctor/core'
const processor = Processor()

/**
 * Svelte preprocessor for AsciiDoc files using asciidoctor.js
 * @param {Object} options - Configuration options
 * @param {string} [options.layout] - Path to a Svelte layout component to wrap content
 */
function svasciidoc(options = {}) {
	const { layout } = options;

	return {
		name: 'svasciidoc',
		markup: async ({ content, filename }) => {
			if (!filename?.endsWith('.adoc'))
				return;

			try {
				const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
				const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gm;

				let scripts = "";
				let styles = "";

				const body = content
					.replace(scriptRegex, (match) => {
						scripts += match + "\n";
						return "";
					})
					.replace(styleRegex, (match) => {
						styles += match + "\n";
						return "";
					});

				const doc = processor.load(body);
				const attributes = doc.getAttributes();
				const title = doc.getDocumentTitle();

				if (title)
					attributes.title = title;

				let html = doc.convert({
					'standalone': false,
					'safe': 'unsafe',
					'attributes': { 'icons': 'font', "allow-uri-read": '' }
				});

				// Unescape Svelte components (Capitalized tags)
				html = html
					.replace(/&lt;([A-Z][^&]*?)&gt;/g, '<$1>')
					.replace(/&lt;\/([A-Z][^&]*?)&gt;/g, '</$1>')
					.replace(/&lt;([A-Z][^&]*?)\/&gt;/g, '<$1/>');

				// Build layout wrapper if specified
				const layoutImport = layout ? `import Layout from '${layout}';\n` : '';
				const contentOpen = layout ? '<Layout {metadata}>' : '<div class="adoc-content">';
				const contentClose = layout ? '</Layout>' : '</div>';

				const code = `<!-- source: ${filename} -->
					<script context="module">
						${layoutImport}export const metadata = ${JSON.stringify(attributes)};
					</script>
					${scripts}
					${styles}

					${contentOpen}
						${html}
					${contentClose}`;

				return { code };
			} catch (error) {
				throw new Error(`[svasciidoc] Failed to process ${filename}: ${error.message}`);
			}
		}
	};
};


/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		output: {
			bundleStrategy: 'single',
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	},
	preprocess: [
		mdsvex({
			extensions: ['.md', '.mdx'],
			layout: {
				// _: './src/routes/blog/[slug]/+page.svelte'
			}
		}),
		svasciidoc()],
	extensions: ['.svelte', '.md', '.mdx', '.adoc']
};

export default config;
