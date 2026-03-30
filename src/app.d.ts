// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Disqus-specific Window interface
	interface Window {
		disqus_config?: (this: {
			page: {
				url: string;
				identifier: string;
				title: string;
			};
		}) => void;
	}
}

export {};
