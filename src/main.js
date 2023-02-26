import { createSSRApp } from "vue";
import { createPinia } from 'pinia'

import Loading from 'vue-next-directive/lib/directives/loading/index'

import App from "./App.vue";
export function createApp() {
	const pinia = createPinia()
	const app = createSSRApp(App);
	app.directive('loading', Loading)
	app.use(pinia)
	return {
		app
	};
}
