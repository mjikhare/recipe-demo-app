<template>
  <div class="editRecipe">
    <div class="editRecipe-inner mx-auto">
      <h1 class="editRecipe-title py-3">
        {{ `${createNew ? "Create" : "Edit"} Recipe` }}
      </h1>

      <form class="mx-auto">
        <hr />
        <div class="form-group row align-items-center">
          <label class="col-3" for="editTitle">Recipe title:</label>
          <div class="col-9">
            <input
              class="form-control"
              id="editTitle"
              type="text"
              placeholder=""
              v-model="recipe.title"
            />
          </div>
        </div>
        <hr />

        <template v-if="recipe.images.length > 0">
          <div
            v-for="(image, index) in recipe.images"
            :key="image"
            class="form-group row align-items-center"
          >
            <label class="col-3" :for="`edit-images${index}`">{{
              `Image ${index + 1}:`
            }}</label>
            <b-input-group class="col-9">
              <b-form-input
                :id="`edit-images${index}`"
                :value="`${recipe.images[index].slice(0, 31)}...`"
                disabled
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  class="darkButton"
                  @click="recipe.images.splice(index, 1)"
                  >Remove</b-button
                >
              </b-input-group-append>
            </b-input-group>
          </div>
        </template>

        <div class="text-center mb-3">
          <a
            role="button"
            tabindex="0"
            href="#"
            target="_self"
            class="btn darkButton btn-secondary"
            ><label style="cursor: pointer" class="d-inline mb-0" for="addImage"
              >Add Image</label
            ></a
          >
          <input id="addImage" class="d-none" type="file" accept="image/*" />
        </div>
        <hr />

        <div v-if="recipe.note == undefined" class="text-center mb-3">
          <b-button class="darkButton" @click="$set(recipe, 'note', '')"
            >Add Note</b-button
          >
        </div>
        <div v-else class="form-group row align-items-center">
          <label class="col-3" for="edit-note">Note:</label>
          <b-input-group class="col-9">
            <b-form-textarea
              id="edit-note"
              v-model="recipe.note"
            ></b-form-textarea>
            <b-input-group-append>
              <b-button
                class="darkButton"
                @click="$set(recipe, 'note', undefined)"
                >Remove</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </div>
        <hr />

        <div class="form-group row align-items-center">
          <label class="col-3" for="editLink">Original page link:</label>
          <div class="col-9">
            <input
              class="form-control"
              id="editLink"
              type="text"
              placeholder=""
              v-model="recipe.link"
            />
          </div>
        </div>
        <hr />

        <div class="form-group row align-items-center">
          <label class="col-6 col-sm-3 mb-3 mb-sm-0" for="editTime"
            >Preparation time (minutes):</label
          >
          <div class="col-6 col-sm-3 mb-3 mb-sm-0">
            <input
              class="form-control"
              id="editTime"
              type="text"
              placeholder=""
              v-model="recipe.time"
            />
          </div>
          <label class="col-6 col-sm-3" for="editServings"
            >Yields servings:</label
          >
          <div class="col-6 col-sm-3">
            <input
              class="form-control"
              id="editServings"
              type="text"
              placeholder=""
              v-model="recipe.servings"
            />
          </div>
        </div>
        <hr />

        <p>Ingredients</p>
        <template v-if="recipe.ingredients.length > 0">
          <hr class="d-sm-none w-50 m-0" />
          <div
            class="row no-gutters text-left text-sm-center editRecipe-ingr-legend"
          >
            <span class="col-5 col-sm-2">Amount</span>
            <span class="col-5 col-sm-2">Unit</span>
            <span class="col-10 col-sm-8">Name</span>
          </div>
          <hr class="d-sm-none w-50 m-0 mb-3" />
        </template>

        <fieldset
          v-for="(ingr, index) in recipe.ingredients"
          :key="`ingr${index}`"
          :id="`edit-ingredients${index}`"
          class="row form-group no-gutters"
        >
          <div class="col-10 col-sm-12 row no-gutters pr-2">
            <div class="col-6 col-sm-2 pr-1">
              <b-form-input
                aria-label="amount"
                v-model="ingr.amount"
              ></b-form-input>
            </div>
            <div class="col-6 col-sm-2">
              <b-form-input
                aria-label="unit"
                v-model="ingr.unit"
              ></b-form-input>
            </div>
            <b-input-group class="d-none d-sm-flex col-8 pl-1">
              <b-form-input
                aria-label="name"
                v-model="ingr.name"
              ></b-form-input>
              <b-input-group-append class="d-none d-sm-flex">
                <b-button
                  class="darkButton"
                  @click="removeItem('ingredients', index)"
                  >Remove</b-button
                >
              </b-input-group-append>
            </b-input-group>
            <b-form-input
              class="d-block d-sm-none col-12 px-2 mt-1"
              aria-label="name"
              v-model="ingr.name"
            ></b-form-input>
          </div>
          <b-button
            class="darkButton d-sm-none col-2 align-self-center py-2 editRecipe-ingr-remove"
            @click="removeItem('ingredients', index)"
            >Remove</b-button
          >
          <b-button
            class="darkButton col-2 align-self-center py-2 editRecipe-ingr-x"
            @click="removeItem('ingredients', index)"
            >&times;</b-button
          >
        </fieldset>
        <b-button class="darkButton" @click="addItem('ingredients')"
          >Add Ingredient</b-button
        >
        <hr />

        <p class="text-align-center mt-3">Instructions</p>
        <div
          v-for="(step, index) in recipe.instructions"
          :key="`step${index}`"
          class="form-group row align-items-center"
        >
          <label class="col-2" :for="`edit-instructions${index}`">{{
            `Step ${index + 1}:`
          }}</label>
          <b-input-group class="col-10">
            <b-form-textarea
              :id="`edit-instructions${index}`"
              v-model="recipe.instructions[index]"
            ></b-form-textarea>
            <b-input-group-append>
              <b-button
                class="darkButton"
                @click="removeItem('instructions', index)"
                >Remove</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </div>
        <b-button class="darkButton" @click="addItem('instructions')"
          >Add Step</b-button
        >
        <hr />

        <div class="row pb-4 justify-content-around">
          <b-button class="contrastButton editRecipe-bottom-btn" @click="save"
            >Save Changes</b-button
          >
          <b-button class="darkButton editRecipe-bottom-btn" @click="cancel"
            >Cancel</b-button
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
export default {
  props: ["recipeId", "recipeLocalid", "createNew"],
  emits: ["doneEditRecipe", "cancelEditRecipe"],
  data() {
    return {
      recipe: {
        title: "",
        images: [],
        time: "",
        servings: "",
        link: "",
        ingredients: [],
        instructions: [],
        sourceId: -1,
        localId: null,
      },
      index: 0,
    };
  },
  created() {
    if (!this.createNew) {
      this.index = Number.isInteger(this.recipeLocalid)
        ? this.$root.savedRecipes.findIndex((r) => {
            return r.localId == this.recipeLocalid;
          })
        : this.$root.savedRecipes.findIndex((r) => {
            return r.sourceId == this.recipeId;
          });
      this.recipe = cloneDeep(this.$root.savedRecipes[this.index]);
    } else {
      this.recipe.localId = this.recipeLocalid;
    }
  },
  mounted() {
    //remove body scrollbar
    document.body.style.overflow = "hidden";
    //image upload listener
    let fileInput = document.querySelector("#addImage");
    fileInput.addEventListener("change", () => {
      let file = fileInput.files[0];
      if (/^image/.test(file.type)) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.recipe.images.push(reader.result);
        });
        reader.readAsDataURL(file);
      }
    });
  },
  destroyed() {
    document.body.style.overflow = "initial";
  },
  methods: {
    cancel() {
      this.$emit("cancelEditRecipe");
    },
    save() {
      if (this.createNew) {
        this.$root.savedRecipes.push(this.recipe);
      } else {
        this.$set(this.$root.savedRecipes, this.index, this.recipe);
      }
      this.$root.localSet(this.recipe);
      this.$root.updateTopId();
      this.$emit("doneEditRecipe");
    },
    addItem(type) {
      if (type == "ingredients") {
        this.recipe.ingredients.push({
          amount: "",
          unit: "",
          name: "",
        });
        this.$nextTick(() => {
          document
            .querySelector(
              `#edit-ingredients${
                this.recipe.ingredients.length - 1
              } > div > div > input`
            )
            .focus();
        });
      } else {
        this.recipe[type].push("");
        this.$nextTick(() => {
          document
            .querySelector(`#edit-${type}${this.recipe[type].length - 1}`)
            .focus();
        });
      }
    },
    removeItem(type, index) {
      this.recipe[type].splice(index, 1);
      if (type == "ingredients") {
        this.$nextTick(() => {
          let prevEl = document.querySelector(
            `#edit-ingredients${
              this.recipe.ingredients.length - 1
            } > div > div > input`
          );
          if (prevEl) prevEl.focus();
        });
      } else {
        this.$nextTick(() => {
          let prevEl = document.querySelector(
            `#edit-${type}${this.recipe[type].length - 1}`
          );
          if (prevEl) prevEl.focus();
        });
      }
    },
  },
};
</script>

<style scoped>
.editRecipe {
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
  --editRecipe-content-width: 60vw;
}
.editRecipe-inner {
  width: var(--editRecipe-content-width);
  background-color: var(--my-light);
  color: var(--my-dark-darker);
}
.editRecipe-title {
  font-weight: 600;
}
form {
  width: 80%;
}
hr {
  border-color: var(--bg-light);
}
.editRecipe-ingr-x {
  display: none;
}
.editRecipe-bottom-btn {
  width: 15rem;
}
@media screen and (max-width: 1199px) {
  .editRecipe {
    --editRecipe-content-width: 75vw;
  }
}
@media screen and (max-width: 999px) {
  .editRecipe {
    --editRecipe-content-width: 85vw;
  }
}
@media screen and (max-width: 799px) {
  .editRecipe {
    --editRecipe-content-width: 100vw;
  }
}
@media screen and (max-width: 575px) {
  .editRecipe-ingr-legend {
    font-size: 95%;
    font-style: italic;
  }
  .editRecipe-bottom-btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}
@media screen and (max-width: 499px) {
  .editRecipe-ingr-remove {
    display: none;
  }
  .editRecipe-ingr-x {
    display: block;
  }
}
</style>