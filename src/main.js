import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

Vue.config.devtools = true;

new Vue({
  data() {
    return {
      savedRecipes: [],
    };
  },
  methods: {
    // returns promise that resolves to the requeted JSON data or null
    apiCall(endpoint, queryKeyValueArray) {
      let base = "https://api.spoonacular.com";
      let apiKey = "apiKey=f32d25bb4c614109acc1ee748c0916b3";
      let url = `${base}${endpoint}?${apiKey}`;
      if (queryKeyValueArray) {
        queryKeyValueArray.forEach(pair => {
          url += `&${pair.key}=${pair.value}`;
        });
      }
      console.log(`url is: ${url}`);
      return fetch(url)
        .then(r => {
          if (r.ok) {
            return r.json();
          } else {
            throw {
              status: r.status,
              statusText: r.statusText,
            };
          }
        })
        .then(r => r)
        .catch(err => {
          console.log(err);
          return null;
        });
    },
    getNextLocalId() {
      return this.savedRecipes.length == 0
        ? 0
        : this.savedRecipes[this.savedRecipes.length - 1].localId + 1;
    },
    localSet(recipe) {
      console.log("ls");
      localStorage.setItem(
        `recipe-app-${recipe.localId}`,
        JSON.stringify(recipe)
      );
    },
    localGet(localId) {
      console.log("lg");
      return JSON.parse(localStorage.getItem(`recipe-app-${localId}`));
    },
    localRemove(localId) {
      console.log("lr");
      localStorage.removeItem(`recipe-app-${localId}`);
    },
    updateTopId() {
      console.log("uti");
      localStorage.setItem(
        "recipe-app-top-localId",
        `${this.savedRecipes[this.savedRecipes.length - 1].localId}`
      );
    },
  },
  created() {
    //retrieve localstorage
    console.log("in created");
    let topId = parseInt(localStorage.getItem("recipe-app-top-localId"));
    if (!isNaN(topId)) {
      for (let i = 0; i <= topId; i++) {
        let recipe = this.localGet(i);
        if (recipe) this.savedRecipes.push(recipe);
      }
    }
  },
  render: h => h(App),
}).$mount("#app");
