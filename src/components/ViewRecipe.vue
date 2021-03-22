<template>
  <div id="viewRecipe">
    <div class="viewRecipe-inner mx-auto">
      <div class="small-screen-hook">
        <div class="main-image-bg">
          <div class="viewRecipe-buttons">
            <div class="d-flex align-items-center">
              <b-button
                class="viewRecipe-button contrastButton"
                @click="$emit('closeRecipe')"
                size="lg"
                pill
                >Back</b-button
              >
              <b-button
                class="viewRecipe-button contrastButton"
                v-if="isSaved"
                @click="openConfirmDelete = true"
                size="lg"
                pill
                >Delete</b-button
              >
              <b-button
                class="viewRecipe-button contrastButton"
                v-else
                @click="onSave"
                size="lg"
                pill
                >Save</b-button
              >
              <b-button
                class="viewRecipe-button contrastButton"
                @click="onEdit"
                :disabled="!isSaved"
                size="lg"
                pill
                >Edit</b-button
              >
            </div>
          </div>
          <b-carousel
            class="main-image"
            :interval="4000"
            :controls="recipe.images.length > 1"
            :indicators="recipe.images.length > 1"
            style="overflow: hidden"
          >
            <b-carousel-slide
              v-for="image in recipe.images"
              :key="image"
              :img-src="image"
            ></b-carousel-slide>
          </b-carousel>
        </div>

        <h1 class="title">{{ recipe.title }}</h1>
      </div>
      <div class="viewRecipe-content text-left">
        <p>
          <span class="viewRecipe-heading">Preparation time:</span>
          {{ recipe.time }} minutes.
        </p>
        <hr />

        <p class="d-flex align-items-center my-n2">
          <span class="viewRecipe-heading">Yields:</span>
          {{ displayedServings }} servings.
          <span class="d-inline-flex flex-column toggle-servings ml-3">
            <svg
              @click="displayedServings++"
              aria-role="button"
              aria-label="increment servings"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-caret-up-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="m7.13697,3.06996l-5.49233,7.94967c-0.64818,0.93841 -0.12139,2.40622 0.86233,2.40622l10.98467,0a1.14519,1.4504 0 0 0 0.86233,-2.40622l-5.49233,-7.94822a1.14519,1.4504 0 0 0 -1.72466,0l0,-0.00145l-0.00001,0z"
                id="svg_1"
              />
            </svg>
            <svg
              @click="displayedServings == 1 ? null : displayedServings--"
              aria-role="button"
              aria-label="decrement servings"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-caret-down-fill"
              viewBox="0 0 16 16"
            >
              <path
                transform="rotate(-180, 7.99955, 8.00004)"
                id="svg_1"
                d="m7.13697,3.06996l-5.49233,7.94967c-0.64818,0.93841 -0.12139,2.40622 0.86233,2.40622l10.98467,0a1.14519,1.4504 0 0 0 0.86233,-2.40622l-5.49233,-7.94822a1.14519,1.4504 0 0 0 -1.72466,0l0,-0.00145z"
              />
            </svg>
          </span>
        </p>
        <hr />

        <p>
          <span class="viewRecipe-heading">Original recipe page:</span>
          <a :href="recipe.link">Link</a>
        </p>
        <hr />

        <p class="text-left" v-if="recipe.note">
          <span class="viewRecipe-heading">Note:</span> {{ recipe.note }}
        </p>
        <hr v-if="recipe.note" />

        <div class="row pt-2 pb-4">
          <div class="col-sm-6">
            <h5 class="text-center mb-3">
              <span class="viewRecipe-col-heading mr-3">Ingredients</span>
              <span
                class="converter-button"
                style="cursor: pointer"
                @click="openConverter = true"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-gear"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"
                  />
                  <path
                    d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"
                  /></svg
                ><small class="ml-1"><em>Convert</em></small></span
              >
            </h5>
            <ul class="list-unstyled">
              <li
                v-for="ingr in computedIngredients"
                :key="ingr"
                class="viewRecipe-li d-flex align-items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-caret-right-fill mr-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"
                  /></svg
                >{{ ingr }}
              </li>
            </ul>
          </div>

          <div class="col-sm-6">
            <h5 class="viewRecipe-col-heading text-center mb-3">
              Instructions
            </h5>
            <ul style="list-style-type: demical">
              <li
                v-for="step in recipe.instructions"
                :key="step"
                class="viewRecipe-li"
              >
                {{ step }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      v-model="openConverter"
      title="Convert Ingredients"
      hide-footer
      header-class="convert-modal-header"
    >
      <Converter
        :ingredients-prop="recipe.ingredients"
        @conversionDone="conversionDone"
        @close="openConverter = false"
      ></Converter>
    </b-modal>

    <b-modal
      v-model="openConfirmDelete"
      body-class="delete-modal-body"
      size="sm"
      title="Delete this recipe?"
      hide-footer
    >
      <b-button variant="danger" @click="onDelete">Delete</b-button>
      <b-button class="darkButton" @click="openConfirmDelete = false"
        >Cancel</b-button
      >
    </b-modal>
  </div>
</template>

<script>
import Converter from "./ViewRecipeConverter.vue";
export default {
  components: { Converter },
  props: ["recipeId", "recipeLocalid"],
  emits: ["closeRecipe", "editRecipe"],
  data() {
    return {
      isSaved: false,
      index: -1,
      recipe: {
        title: "",
        images: [],
        time: "",
        servings: "",
        link: "",
        ingredients: [],
        instructions: [],
        sourceId: null,
        localId: null,
      },
      openConverter: false,
      openConfirmDelete: false,
      displayedServings: null,
    };
  },
  computed: {
    computedIngredients() {
      let array = [];
      this.recipe.ingredients.forEach((i) => {
        array.push(
          `${Number(
            (
              (i.amount / this.recipe.servings) *
              this.displayedServings
            ).toPrecision(4)
          )} ${i.unit} ${i.name}`
        );
      });
      return array;
    },
  },
  methods: {
    onSave() {
      this.isSaved = true;
      this.$root.savedRecipes.push(this.recipe);
      this.index = this.$root.savedRecipes.length - 1;
      this.$root.localSet(this.recipe);
      this.$root.updateTopId();
    },
    onDelete() {
      this.$root.savedRecipes.splice(this.index, 1);
      this.$root.localRemove(this.recipe.localId);
      this.$emit("closeRecipe");
    },
    onEdit() {
      this.$emit("editRecipe");
    },
    extractRecipeData(r) {
      this.recipe.sourceId = r.id;
      this.recipe.localId = this.$root.getNextLocalId();
      this.recipe.title = r.title;
      this.recipe.images.push(r.image);
      this.recipe.time =
        r.readyInMinutes ||
        "Please see original recipe page for preparation time.";
      this.recipe.servings =
        r.servings ||
        "Please see original recipe page for servings information.";
      this.recipe.link = r.sourceUrl || r.spoonacularSourceUrl;
      r.extendedIngredients.forEach((ingr) => {
        this.recipe.ingredients.push({
          amount: ingr.amount || "",
          unit: ingr.unit || "",
          name: ingr.name || ingr.nameClean || ingr.originalName,
        });
      });
      if (this.recipe.ingredients.length == 0)
        this.recipe.ingredients.push({
          amount: "",
          unit: "",
          name: "Please see original recipe page for ingredients.",
        });
      if (!r.analyzedInstructions) {
        this.recipe.instructions.push(
          "Please see original recipe page for preparation instructions."
        );
      } else {
        r.analyzedInstructions[0].steps.forEach((step) => {
          this.recipe.instructions.push(step.step);
        });
      }
    },
    conversionDone(ingr) {
      this.recipe.ingredients = ingr;
      if (this.isSaved) {
        this.$root.localSet(this.recipe);
      }
      this.openConverter = false;
    },
  },
  created() {
    //coming from saved view
    if (Number.isInteger(this.recipeLocalid)) {
      this.isSaved = true;
      this.index = this.$root.savedRecipes.findIndex((r) => {
        return r.localId == this.recipeLocalid;
      });
      this.recipe = this.$root.savedRecipes[this.index];
      this.displayedServings = this.recipe.servings;
    } else {
      //coming from browse view. check if recipe already saved
      this.index = this.$root.savedRecipes.findIndex((r) => {
        return r.sourceId == this.recipeId;
      });
      if (this.index > -1) {
        this.isSaved = true;
        this.recipe = this.$root.savedRecipes[this.index];
        this.displayedServings = this.recipe.servings;
      } else {
        let query = [{ key: "includeNutrition", value: "false" }];
        this.$root
          .apiCall(`/recipes/${this.recipeId}/information`, query)
          .then((res) => {
            if (res) {
              this.extractRecipeData(res);
              this.displayedServings = this.recipe.servings;
            }
          });
      }
    }
  },
  mounted() {
    //remove body scrollbar
    document.body.style.overflow = "hidden";
  },
  destroyed() {
    document.body.style.overflow = "initial";
  },
};
</script>

<style scoped>
#viewRecipe {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    90deg,
    hsla(0, 0%, 100%, 1) 0%,
    hsla(158, 100%, 84%, 1) 30%,
    hsla(158, 100%, 84%, 1) 70%,
    hsla(0, 0%, 100%, 1) 100%
  );
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1000;
  --viewRecipe-content-width: 100vw;
}
.viewRecipe-inner {
  width: var(--viewRecipe-content-width);
  background-color: var(--my-light);
  color: var(--my-dark-darker);
}
.viewRecipe-buttons {
  position: absolute;
  bottom: -180px;
  z-index: 1;
  width: 100%;
}
.viewRecipe-buttons > div {
  flex-direction: row;
  flex-wrap: wrap;
}
.viewRecipe-button {
  margin: 0 0.7rem 0.6rem 0.7rem;
  height: 3rem;
  border: 1px solid var(--contrast-darker) !important;
  font-weight: 800 !important;
  box-shadow: 0.2rem 0.2rem 0.1rem var(--contrast-darker) !important;
  width: 100%;
}
.viewRecipe-button:focus,
.viewRecipe-button:hover:not(:disabled),
.viewRecipe-button:active:not(:disabled) {
  border-color: var(--contrast-darker) !important;
}
.viewRecipe-button:focus:not(:disabled) {
  box-shadow: 0.2rem 0.2rem 0.1rem var(--contrast-darker) !important;
}
.viewRecipe-button:active:not(:disabled) {
  box-shadow: none !important;
}
.main-image {
  max-height: 75vh;
}
.main-image-bg {
  background-color: var(--bg-light);
}
.viewRecipe-content {
  padding-top: 1rem;
  padding-left: 2rem;
  padding-right: 2rem;
}
.title {
  font-weight: 800;
  color: var(--my-light);
  background-color: var(--contrast);
  text-shadow: 2px 2px 3px var(--contrast-darker);
  padding: 1rem 2rem;
  margin-bottom: 180px;
}
.viewRecipe-heading {
  font-weight: 800;
  color: var(--my-dark-darker);
  padding-right: 1rem;
}
.toggle-servings svg {
  cursor: pointer;
  color: var(--contrast-darker);
}
.viewRecipe-col-heading {
  font-weight: 800;
  color: var(--my-dark-darker);
}
.viewRecipe-content hr {
  border-color: var(--bg-light);
}
.viewRecipe-li {
  margin-bottom: 1rem;
}
.viewRecipe-li::marker {
  font-size: 1.3rem;
  font-weight: 800;
}
.small-screen-hook {
  position: relative;
}
@media screen and (min-width: 370px) {
  .viewRecipe-buttons {
    top: 0.5rem;
    bottom: auto;
    position: sticky;
  }
  .title {
    margin-bottom: 0;
  }
  .viewRecipe-button {
    flex-grow: 1;
    margin-bottom: 0;
    width: 10rem;
  }
  .viewRecipe-buttons > div {
    flex-wrap: nowrap;
  }
  .main-image-bg {
    position: relative;
    margin-top: -48px;
  }
  .small-screen-hook {
    position: static;
  }
}
@media screen and (min-width: 600px) {
  .main-image-bg {
    padding: 1.2rem 1.4rem;
  }
  .viewRecipe-buttons {
    top: 25px;
  }
}
@media screen and (min-width: 740px) {
  #viewRecipe {
    --viewRecipe-content-width: 90vw;
  }
}
@media screen and (min-width: 830px) {
  #viewRecipe {
    --viewRecipe-content-width: 80vw;
  }
}
@media screen and (min-width: 930px) {
  #viewRecipe {
    --viewRecipe-content-width: 70vw;
  }
  .viewRecipe-buttons {
    position: fixed;
    top: 0;
    left: 0;
    width: calc((100vw - var(--viewRecipe-content-width)) / 2);
  }
  .viewRecipe-buttons > div {
    flex-direction: column;
    margin-top: 4rem;
  }
  .main-image-bg {
    position: static;
    margin-top: 0;
  }
  .viewRecipe-button {
    margin-bottom: 0.7rem;
    max-width: 90%;
  }
}
@media screen and (min-width: 1100px) {
  #viewRecipe {
    --viewRecipe-content-width: 60vw;
  }
}
</style>
<style>
.convert-modal-header {
  border-bottom: none !important;
}
.convert-modal-header h5 {
  font-weight: 600;
  color: var(--my-dark-darker);
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}
.delete-modal-body {
  display: flex;
  justify-content: space-around;
}
</style>