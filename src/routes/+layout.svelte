<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import logo from '$lib/assets/logo.png';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Theme state (true = dark, false = light)
	let isDarkTheme = $state(true);
	// Font state
	let currentFont = $state('Comfortaa');

	// Initialize from sessionStorage on mount (browser only) - runs once
	if (browser) {
		const savedTheme = sessionStorage.getItem('theme');
		const savedFont = sessionStorage.getItem('font');

		if (savedTheme) {
			isDarkTheme = savedTheme === 'dark';
		}

		if (savedFont) {
			currentFont = savedFont;
		}
	}

	// Apply theme to document when it changes
	$effect(() => {
		if (browser) {
			const theme = isDarkTheme ? 'dark' : 'light';
			document.documentElement.setAttribute('data-theme', theme);
		}
	});

	// Apply font to document when it changes
	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute('data-font', currentFont);
		}
	});

	function switchTheme(e: Event) {
		const target = e.target as HTMLInputElement;
		const theme = target.checked ? 'dark' : 'light';
		isDarkTheme = target.checked;
		sessionStorage.setItem('theme', theme);
	}

	function switchFont(e: Event) {
		const target = e.target as HTMLSelectElement;
		currentFont = target.value;
		sessionStorage.setItem('font', target.value);
	}

	function unblockVideos() {
		document.querySelectorAll('.video_wrapper .video_trigger').forEach((trigger) => {
			const triggerEl = trigger as HTMLElement;
			triggerEl.style.display = 'none';

			const parent = triggerEl.parentNode;
			if (!parent) return;

			for (let i = 0; i < parent.childNodes.length; i++) {
				const videoLayer = parent.childNodes[i] as HTMLElement;

				if (videoLayer.className !== 'video_layer') continue;

				videoLayer.style.display = 'block';

				for (let j = 0; j < videoLayer.childNodes.length; j++) {
					const iframe = videoLayer.childNodes[j] as HTMLIFrameElement;

					if (iframe.tagName?.toLowerCase() !== 'iframe') continue;

					const videoId = triggerEl.getAttribute('data-source');
					iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?controls=1&showinfo=0&autoplay=0&mute=1`;
				}
			}
		});
	}

	// Setup video consent handlers on mount
	$effect(() => {
		if (browser) {
			document.querySelectorAll('.video_wrapper .video_trigger .video-btn').forEach((node) => {
				node.addEventListener('click', () => {
					sessionStorage.setItem('youtube-consent', '1');
					unblockVideos();
				});
			});
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header>
	<a href="/">
		<span class="title">Nonsensation</span>
	</a>
	<a href="/">
		<img alt="logo" class="logo" src={logo} />
	</a>

	<div class="toggle-theme">
		<input
			id="toggle-theme-checkbox"
			type="checkbox"
			checked={isDarkTheme}
			onchange={switchTheme}
		/>
		<label for="toggle-theme-checkbox" class="toggle-theme-icon">
			<svg
				id="icon-theme"
				xmlns="http://www.w3.org/2000/svg"
				width="4em"
				height="2em"
				viewBox="0 0 42 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.25"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="12" y1="1" x2="12" y2="3" />
				<line x1="12" y1="21" x2="12" y2="23" />
				<line x1="1" y1="12" x2="3" y2="12" />
				<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
				<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
				<circle cx="12" cy="12" r="5" fill="currentColor" />

				<line x1="22" y1="0" x2="22" y2="24" stroke-width="0.5" />

				<circle cx="32" cy="12" r="5" fill="currentColor" mask="url(#mask-moon)" />

				<mask id="mask-moon">
					<rect x="0" y="0" width="100%" height="100%" fill="white" />
					<circle cx="39" cy="9" r="8" fill="black" stroke="white" />
				</mask>
			</svg>
		</label>
	</div>
</header>

<div class="wrapper">
	<main>
		{@render children()}
	</main>
</div>

<footer>
	<footer>
		<div class="flexbox">
			<div class="box">
				<div class="top">Find me on:</div>
				<div class="bot"></div>
			</div>
			<div class="box">
				<div class="top">Choose a different font:</div>
				<div class="bot">
					<select id="toggle-font" value={currentFont} onchange={switchFont}>
						<option value="Comfortaa" style="font-family: 'Comfortaa'">Comfortaa</option>
						<option value="Montserrat" style="font-family: 'Montserrat'">Montserrat</option>
						<option value="Open Sans" style="font-family: 'Open Sans'">Open Sans</option>
						<option value="Computer Modern Sans" style="font-family: 'Computer Modern Sans'"
							>Computer Modern Sans</option
						>
						<option value="Computer Modern Serif" style="font-family: 'Computer Modern Serif'"
							>Computer Modern Serif</option
						>
					</select>
				</div>
			</div>
		</div>
	</footer>
</footer>
