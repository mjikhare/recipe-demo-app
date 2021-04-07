<template>
  <div class="about-wrapper">
    <div class="about-text py-5 px-5">
      <h3>Please Note:</h3>
      <br />
      <p>
        This app is for demo purposes. Data is only persisted in browser's local
        storage and will be deleted if offline website data is cleared.
      </p>
      <br />
      <p>
        <span class="font-italic"
          >Built using Vue.js, Bootstrap and the Spoonacular API. <br />Mikhail
          J., 2021</span
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.about-wrapper {
  padding-top: 2rem;
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
}
.about-text {
  background-color: var(--my-light);
  font-weight: 600;
}
</style>