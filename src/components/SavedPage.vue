<template>
  <div class="saved-wrapper position-relative">
    <section class="container savedForm">
      <b-input
        v-model="search"
        @input="pagination.currentPage = 1"
        placeholder="Filter recipes..."
        aria-label="search"
        id="savedSearchField"
      ></b-input>
      <b-button
        class="contrastButton createRecipeButton my-3"
        @click="createRecipe"
        size="lg"
        pill
        >Create Recipe</b-button
      >
    </section>

    <section class="container">
      <div class="row no-gutters">
        <div
          class="col-sm-6 col-md-4 col-lg-3 p-1"
          v-for="recipe in currentResults"
          :key="recipe.localId"
        >
          <div class="card recipe" @click="openRecipe(recipe.localId)">
            <img class="card-img-top" :src="recipe.images[0]" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title mt-auto">{{ recipe.title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </section>

    <b-pagination
      class="mx-auto my-pagination position-absolute"
      v-if="$root.savedRecipes.length > 0"
      v-model="pagination.currentPage"
      :total-rows="totalResults"
      :per-page="pagination.perPage"
      aria-controls="recipes-grid"
    ></b-pagination>

    <ViewRecipe
      :recipe-localid="modal.localid"
      v-if="modal.viewRecipe"
      @closeRecipe="modal.viewRecipe = false"
      @editRecipe="onEditRecipe"
    ></ViewRecipe>

    <EditRecipe
      :recipe-localid="modal.localid"
      :create-new="modal.createNew"
      v-if="modal.editRecipe"
      @doneEditRecipe="onDoneEditRecipe"
      @cancelEditRecipe="onCancelEditRecipe"
    ></EditRecipe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal: {
        viewRecipe: false,
        editRecipe: false,
        localid: 0,
        createNew: false, //flag
      },
      pagination: {
        currentPage: 1,
        perPage: 12,
      },
      search: "",
    };
  },
  components: {
    ViewRecipe: () =>
      import(
        /* webpackChunkName: 'viewRecipe' */ /* webpackPrefetch: true */ "./ViewRecipe.vue"
      ),
    EditRecipe: () =>
      import(
        /* webpackChunkName: 'viewRecipe' */ /* webpackPrefetch: true */ "./EditRecipe.vue"
      ),
  },
  methods: {
    createRecipe() {
      this.modal.createNew = true;
      this.modal.localid = this.$root.getNextLocalId();
      //allows ViewRecipe to open it after
      this.modal.editRecipe = true;
    },
    openRecipe(localid) {
      this.modal.localid = localid;
      this.modal.viewRecipe = true;
    },
    onEditRecipe() {
      this.modal.viewRecipe = false;
      this.modal.editRecipe = true;
    },
    onDoneEditRecipe() {
      this.modal.editRecipe = false;
      this.modal.createNew = false;
      this.modal.viewRecipe = true;
    },
    onCancelEditRecipe() {
      this.modal.editRecipe = false;
      this.modal.createNew = false;
    },
  },
  computed: {
    currentResults() {
      let startInd =
        (this.pagination.currentPage - 1) * this.pagination.perPage;
      let endInd = startInd + this.pagination.perPage;
      if (endInd > this.totalResults) endInd = this.totalResults;
      let r = this.filteredResults.slice(startInd, endInd);
      return r;
    },
    filteredResults() {
      return this.$root.savedRecipes.filter((r) =>
        r.title.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())
      );
    },
    totalResults() {
      return this.filteredResults.length;
    },
    totalPages() {
      return Math.ceil(this.totalResults / this.pagination.perPage);
    },
  },
};
</script>

<style scoped>
.saved-wrapper {
  padding-top: 2rem;
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
  padding-bottom: 7rem;
}
.savedForm {
  max-width: 50vw;
  margin-bottom: 2rem;
  padding: 0.5rem;
  font-weight: 600;
}
.createRecipeButton {
  border: 1px solid var(--contrast-darker) !important;
  font-weight: 600 !important;
}
.createRecipeButton:focus,
.createRecipeButton:hover,
.createRecipeButton:active {
  border-color: var(--contrast-darker) !important;
}
.recipe {
  height: 100%;
  cursor: pointer;
  border-color: var(--my-dark);
  color: var(--my-dark);
  transition: background-color 100ms;
}
.recipe:hover {
  background-color: var(--my-dark);
  border-color: var(--my-dark);
  color: var(--my-light);
}
.my-pagination {
  width: max-content;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>
