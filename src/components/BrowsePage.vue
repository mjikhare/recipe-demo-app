<template>
  <div class="browse-wrapper">
    <form class="container-fluid text-left">
      <div class="row">
        <div class="form-group col">
          <label for="searchField">Search for recipes</label>
          <input
            class="form-control"
            id="searchField"
            type="text"
            v-model="model.search"
            @input="validateSearch"
            @change="
              {
                validation.showMode = true;
                validateSearch();
              }
            "
            aria-label="search query"
          />
          <small v-if="validation.show" class="form-text text-danger">
            Please enter a query of minimum 3 characters.
          </small>
        </div>
        <div class="col-sm-3 col-lg-2 mb-3 align-self-end">
          <b-button
            @click="search"
            :disabled="searchDisabled"
            class="contrastButton w-100"
            >Search</b-button
          >
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-12 col-md-6">
          <div class="d-flex align-items-start optional-params-wrapper">
            <img
              src="../assets/img2.png"
              class="optional-params"
              alt="Choose optional parameters"
            />
          </div>

          <div class="form-group">
            <label for="includeIngredients">Ingredients to include</label>
            <MultiSearch
              v-model="model.includeIngredients"
              id="includeIngredients"
            ></MultiSearch>
          </div>

          <div class="form-group">
            <label for="excludeIngredients">Ingredients to exclude</label>
            <MultiSearch
              v-model="model.excludeIngredients"
              id="excludeIngredients"
            ></MultiSearch>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="form-group">
            <label for="cuisine">Cuisine</label>
            <select class="form-control" id="cuisine" v-model="model.cuisine">
              <option value="">Any</option>
              <option v-for="cuisine in cuisines" :key="cuisine">
                {{ cuisine }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="diet">Diet</label>
            <select class="form-control" id="diet" v-model="model.diet">
              <option value="">Any</option>
              <option v-for="diet in diets" :key="diet">
                {{ diet }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <fieldset class="position-relative">
              <legend>Intolerances</legend>
              <b-button
                class="intolerancesButton darkButton"
                href="#"
                @click="intolerancesCollapseOpen = !intolerancesCollapseOpen"
                block
                >Specify Intolerances</b-button
              >
              <b-collapse
                v-model="intolerancesCollapseOpen"
                class="intolerancesCollapse position-absolute text-left container"
              >
                <div class="row pt-2 px-lg-0">
                  <div
                    v-for="intolerance in intolerances"
                    :key="intolerance.query"
                    class="form-check mb-3 intoleranceFormGroup"
                  >
                    <input
                      :id="intolerance.query"
                      type="checkbox"
                      :value="intolerance.query"
                      v-model="model.intolerances"
                    />
                    <label :for="intolerance.query" class="form-check-label">{{
                      intolerance.name
                    }}</label>
                  </div>
                </div>
              </b-collapse>
            </fieldset>
          </div>
        </div>
      </div>
    </form>

    <section id="recipes-grid" class="container">
      <div class="row no-gutters">
        <p v-if="noResults" class="noResults mx-auto">
          No recipes found for the given query.
        </p>
        <div
          class="col-sm-6 col-md-4 col-lg-3 p-1"
          v-for="recipe in currentResults"
          :key="recipe.id"
        >
          <div class="card recipe">
            <a @click="openRecipe(recipe.id)">
              <img class="card-img-top" :src="recipe.image" />
              <div class="card-body">
                <h5 class="card-title">{{ recipe.title }}</h5>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <b-pagination
      class="mx-auto my-pagination position-absolute"
      v-if="results.length > 0"
      v-model="pagination.currentPage"
      :total-rows="totalResults"
      :per-page="pagination.perPage"
      aria-controls="recipes-grid"
    ></b-pagination>

    <ViewRecipe
      :recipe-id="modal.id"
      v-if="modal.viewRecipe"
      @closeRecipe="modal.viewRecipe = false"
      @editRecipe="onEditRecipe"
    ></ViewRecipe>

    <EditRecipe
      :recipe-id="modal.id"
      v-if="modal.editRecipe"
      @doneEditRecipe="onDoneEditRecipe"
      @cancelEditRecipe="onDoneEditRecipe"
    ></EditRecipe>
  </div>
</template>

<script>
import MultiSearch from "./BrowsePageMultiSearch.vue";
import ViewRecipe from "./ViewRecipe.vue";
import EditRecipe from "./EditRecipe.vue";
export default {
  components: {
    MultiSearch,
    ViewRecipe,
    EditRecipe,
  },
  data() {
    return {
      modal: {
        viewRecipe: false,
        editRecipe: false,
        id: "",
      },
      model: {
        search: "",
        includeIngredients: [],
        excludeIngredients: [],
        cuisine: "",
        diet: "",
        intolerances: [],
      },
      searchDisabled: false,
      noResults: false,
      validation: {
        valid: true,
        show: false,
        showMode: false,
      },
      pagination: {
        currentPage: 1,
        perPage: 12,
      },
      results: [],
      cuisines: [
        "African",
        "American",
        "British",
        "Cajun",
        "Caribbean",
        "Chinese",
        "Eastern European",
        "European",
        "French",
        "German",
        "Greek",
        "Indian",
        "Irish",
        "Italian",
        "Japanese",
        "Jewish",
        "Korean",
        "Latin American",
        "Mediterranean",
        "Mexican",
        "Middle Eastern",
        "Nordic",
        "Southern",
        "Spanish",
        "Thai",
        "Vietnamese",
      ],
      diets: [
        "Gluten Free",
        "Ketogenic",
        "Vegetarian",
        "Lacto-Vegetarian",
        "Ovo-Vegetarian",
        "Vegan",
        "Pescetarian",
        "Paleo",
        "Primal",
        "Whole30",
      ],
      intolerances: [
        {
          name: "No Dairy",
          query: "dairy",
        },
        {
          name: "No Egg",
          query: "egg",
        },
        {
          name: "No Grain",
          query: "grain",
        },
        {
          name: "No Peanuts",
          query: "peanut",
        },
        {
          name: "No Seafood",
          query: "seafood",
        },
        {
          name: "No Sesame",
          query: "sesame",
        },
        {
          name: "No Shellfish",
          query: "shellfish",
        },
        {
          name: "No Soy",
          query: "soy",
        },
        {
          name: "No Sulfite",
          query: "sulfite",
        },
        {
          name: "No Tree Nuts",
          query: "tree nut",
        },
        {
          name: "No Wheat",
          query: "wheat",
        },
      ],
      intolerancesCollapseOpen: false,
    };
  },
  computed: {
    currentResults() {
      let startInd =
        (this.pagination.currentPage - 1) * this.pagination.perPage;
      let endInd = startInd + this.pagination.perPage;
      if (endInd > this.totalResults) endInd = this.totalResults;
      let r = this.results.slice(startInd, endInd);
      return r;
    },
    totalResults() {
      return this.results.length;
    },
    totalPages() {
      return Math.ceil(this.totalResults / this.pagination.perPage);
    },
  },
  methods: {
    search() {
      this.noResults = false;
      this.validation.showMode = true;
      this.validateSearch();
      if (this.validation.valid) {
        this.searchDisabled = true;
        this.validation.showMode = false;
        this.$root
          .apiCall("/recipes/complexSearch", this.buildQuery())
          .then((res) => {
            if (res) {
              this.results = res.results;
              this.clearForm();
              this.searchDisabled = false;
              if (this.totalResults == 0) {
                this.noResults = true;
              }
            }
          });
      }
    },
    validateSearch() {
      this.validation.valid =
        this.model.search && this.model.search.length > 2 ? true : false;
      this.validation.show = this.validation.showMode
        ? this.validation.valid
          ? false
          : true
        : false;
    },
    buildQuery() {
      let query = [{ key: "query", value: this.model.search.toLowerCase() }];
      if (this.model.includeIngredients.length > 0) {
        query.push({
          key: "includeIngredients",
          value: this.model.includeIngredients.join(",").toLowerCase(),
        });
      }
      if (this.model.excludeIngredients.length > 0) {
        query.push({
          key: "excludeIngredients",
          value: this.model.excludeIngredients.join(",").toLowerCase(),
        });
      }
      if (this.model.cuisine.length > 0) {
        query.push({ key: "cuisine", value: this.model.cuisine.toLowerCase() });
      }
      if (this.model.diet.length > 0) {
        query.push({ key: "diet", value: this.model.diet.toLowerCase() });
      }
      if (this.model.intolerances.length > 0) {
        query.push({
          key: "intolerances",
          value: this.model.intolerances.join(",").toLowerCase(),
        });
      }
      query.push({ key: "number", value: "100" });
      return query;
    },
    clearForm() {
      this.model = {
        search: "",
        includeIngredients: [],
        excludeIngredients: [],
        cuisine: "",
        diet: "",
        intolerances: [],
      };
      this.intolerancesCollapseOpen = false;
    },
    openRecipe(id) {
      this.modal.id = id;
      this.modal.viewRecipe = true;
    },
    onEditRecipe() {
      this.modal.viewRecipe = false;
      this.modal.editRecipe = true;
    },
    onDoneEditRecipe() {
      this.modal.editRecipe = false;
      this.modal.viewRecipe = true;
    },
  },
};
</script>

<style scoped>
.browse-wrapper {
  padding-top: 2rem;
  padding-bottom: 7rem;
  position: relative;
}
.multi-search {
  padding-left: 0;
  padding-right: 0;
}
form {
  background-color: var(--my-light);
  margin-bottom: 2rem;
  padding: 1.5rem;
  font-weight: 600;
}
form legend {
  font-size: inherit;
}
.optional-params-wrapper {
  height: auto;
}
.optional-params {
  max-height: 3rem;
  max-width: 100%;
  margin-bottom: 1.5rem;
}
.intolerancesButton:hover,
.intolerancesButton:active,
.intolerancesButton:focus {
  box-shadow: none !important;
}
.intolerancesCollapse {
  z-index: 1;
  background-color: var(--my-light);
  box-shadow: 0 0 1rem var(--my-dark);
}
.intolerancesCollapse .form-check {
  padding: 0;
}
.intolerancesCollapse > div {
  padding: 0 0.5rem 0 0.5rem;
}
.intolerancesCollapse input {
  margin: 0.5rem;
}
.intoleranceFormGroup {
  flex-basis: 100%;
  max-width: 100%;
}
.noResults {
  font-size: 120%;
  font-weight: 600;
  color: var(--my-light);
}
.recipe {
  height: 100%;
  border-color: var(--my-dark);
  transition: background-color 100ms;
}
.recipe a {
  cursor: pointer;
  color: var(--my-dark) !important;
}
.recipe:hover {
  background-color: var(--my-dark);
  border-color: var(--my-dark);
}
.recipe:hover a {
  color: var(--my-light) !important;
}
.my-pagination {
  width: max-content;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
@media screen and (min-width: 356px) {
  .intoleranceFormGroup {
    flex-basis: 50%;
    max-width: 50%;
  }
  .optional-params-wrapper {
    height: 5.37rem;
  }
  .optional-params {
    margin-bottom: 0;
  }
}
@media screen and (min-width: 576px) {
  #searchField + small {
    position: absolute;
  }
}
@media screen and (min-width: 992px) {
  .intolerancesCollapse .form-check {
    padding-left: 1.25rem;
  }
}
@media screen and (min-width: 1200px) {
  .intoleranceFormGroup {
    flex-basis: 33.333333%;
    max-width: 33.333333%;
  }
}
</style>

