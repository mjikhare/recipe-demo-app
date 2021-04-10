<template>
  <div id="app">
    <header class="nav flex-wrap">
      <ul class="list-unstyled">
        <li @click="tab = 1">
          <a
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
              />
            </svg>
            SEARCH</a
          >
        </li>
        <li @click="tab = 2">
          <a
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-folder2"
              viewBox="0 0 16 16"
            >
              <path
                d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"
              />
            </svg>
            MY RECIPES</a
          >
        </li>
        <li @click="tab = 3">
          <a
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
              />
            </svg>
            ABOUT</a
          >
        </li>
      </ul>
      <img src="./assets/logo.png" class="logo" alt="Recipe App Logo" />
    </header>
    <main class="main-container container">
      <keep-alive>
        <BrowsePage v-if="tab == 1"></BrowsePage>
        <SavedPage v-if="tab == 2"></SavedPage>
        <AboutPage v-if="tab == 3"></AboutPage>
      </keep-alive>
    </main>
    <footer class="text-center">
      <span>
        Powered by the
        <a href="https://spoonacular.com/food-api/">Spoonacular API</a>.</span
      >
    </footer>
  </div>
</template>

<script>
import BrowsePage from "./components/BrowsePage.vue";
import SavedPage from "./components/SavedPage.vue";
import AboutPage from "./components/AboutPage.vue";
export default {
  data() {
    return {
      tab: 1,
    };
  },
  components: {
    BrowsePage,
    SavedPage,
    AboutPage,
  },
  mounted() {
    let nav = document.querySelector(".nav");
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 0) {
        nav.classList.add("nav-shrink");
      } else {
        nav.classList.remove("nav-shrink");
      }
    });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,600&display=swap");
:root {
  --bg: #00a86b;
  --bg-light: #adffe1;
  --contrast: #ffbc41; /* f9c056 */ /* ffab51 */
  --contrast-darker: #fbb531; /* f6b437 */ /* ec983e */
  --my-light: white;
  --my-dark: #5a795b; /* #2b4c2c; /* #2c3e50 */
  --my-dark-darker: #465e47;
  --my-black: #303030;
  --nav-height: 8rem;
  --footer-height: 6rem;
}
#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--my-dark);
  background-image: linear-gradient(
    0deg,
    hsla(158, 100%, 33%, 1) 17%,
    hsla(0, 0%, 100%, 1) 84%
  );
  min-height: 100vh;
}

/* header styles */
.nav {
  height: var(--nav-height);
  background-color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: height 300ms ease-in-out;
  color: var(--my-light);
}
.nav-shrink {
  height: calc(var(--nav-height) * 2 / 3) !important;
}
.nav ul {
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;
  font-weight: 600;
  align-content: space-evenly;
  height: 100%;
}
.nav ul li {
  width: 100%;
  margin: 0;
}
.nav li:first-child {
  margin-bottom: 0.5rem;
}
.nav a {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.nav svg {
  margin-right: 0.2rem;
}
.logo {
  height: 60%;
  position: absolute;
  right: 2rem;
  max-width: 40%;
  display: none;
}
@media screen and (min-width: 360px) {
  :root {
    --nav-height: 6rem;
  }
  .nav {
    justify-content: start;
  }
  .nav ul {
    height: auto;
  }
  .nav ul li {
    width: auto;
    margin-left: 1.5rem;
  }
  .nav li:first-child {
    margin-bottom: 0;
  }
  .nav a {
    justify-content: start;
  }
}
@media screen and (min-width: 650px) {
  .logo {
    display: block;
  }
}
@media screen and (min-width: 960px) {
  .logo {
    left: 50%;
    right: unset;
    transform: translateX(-50%);
  }
}
@media screen and (min-width: 1100px) {
  .nav ul li {
    margin-left: 3rem;
  }
}
/* end header styles */

.main-container {
  padding-top: var(--nav-height);
  min-height: calc(100vh - var(--footer-height));
}
footer {
  background-color: var(--my-dark-darker);
  color: var(--my-light);
  height: var(--footer-height);
  display: flex !important;
  align-items: center;
  justify-content: center;
}
footer a,
footer a:hover {
  text-decoration: underline;
  color: var(--my-light);
}

/* global form & button styles */
.form-control:focus {
  border-color: var(--my-dark) !important;
  box-shadow: 0 0 0 0.2rem var(--my-dark) !important;
}
.contrastButton {
  background-color: var(--contrast) !important;
  color: var(--my-light) !important;
  border: none !important;
  font-weight: inherit !important;
}
.contrastButton:focus,
.contrastButton:hover:not(:disabled),
.contrastButton:active:not(:disabled) {
  background-color: var(--contrast-darker) !important;
}
.contrastButton:focus:not(:disabled) {
  box-shadow: 0 0 0.2rem var(--contrast) !important;
}
.darkButton {
  background-color: var(--my-dark) !important;
  color: var(--my-light) !important;
  border: none !important;
  font-weight: inherit !important;
}
.darkButton:focus,
.darkButton:hover:not(:disabled),
.darkButton:active:not(:disabled) {
  background-color: var(--my-dark-darker) !important;
}
.darkButton:focus:not(:disabled) {
  box-shadow: 0 0 0.2rem var(--my-dark) !important;
}
</style>
