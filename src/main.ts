import { createApp } from "vue";
import "./styles/mug.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { useBeverageStore } from "./stores/beverageStore";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const app = createApp(App);
app.use(pinia);

// run init BEFORE mounting
const store = useBeverageStore();
store.init();

app.mount("#app");