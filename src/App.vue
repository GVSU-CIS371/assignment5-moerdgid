<template>
  <div>
    <div class="auth-bar">
  <button v-if="!beverageStore.user" @click="withGoogle">
    Sign in with Google
  </button>

  <div v-else>
    <p>
      Signed in as:
      {{ beverageStore.user.displayName || beverageStore.user.email }}
    </p>
    <button @click="logOut">Sign out</button>
  </div>
</div>

    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <input
  type="text"
    placeholder="Beverage Name"
    v-model="beverageStore.currentName"
  />
    <button
      :disabled="!beverageStore.user"
      @click="beverageStore.makeBeverage()"
    >
      🍺 Make Beverage
    </button>

    <div v-if="beverageStore.user && beverageStore.beverages.length > 0">
      <h3>Saved Beverages</h3>
      <ul>
        <li v-for="bev in beverageStore.beverages" :key="bev.id">
          <label>
            <input
              type="radio"
              name="saved-beverage"
              :value="bev"
              v-model="beverageStore.currentBeverage"
              @change="beverageStore.showBeverage()"
            />
            {{ bev.name }}
          </label>
        </li>
      </ul>
    </div>

  </div>
  <div id="beverage-container" style="margin-top: 20px"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { auth } from "./firebase";

const beverageStore = useBeverageStore();

const withGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

const logOut = async () => {
  await signOut(auth);
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
.auth-bar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.auth-bar button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
