<template>
  <!-- takes v-model directive with array value. works with vue 2. for vue 3, change value to modelValue, input to update:modelValue -->
  <div class="multi-search position-relative">
    <div class="d-flex flex-wrap w-100">
      <span
        v-for="(value, index) in selectedValues"
        :key="value"
        class="selectedLabel flex-shrink-0"
      >
        {{ value }}
        <span @click="changeSelectedValues('remove', index)">&times;</span>
      </span>
      <input
        class="flex-grow-1 form-control"
        v-model="textInputValue"
        @input="onInputDebounced"
        type="text"
        autocomplete="off"
      />
    </div>
    <datalist
      class="w-100 position-absolute d-block"
      v-if="displayDatalist"
      @click="clickDatalist"
    >
      <option
        v-for="ingredient in datalistValues"
        :key="ingredient"
        class="pl-2 py-1 multiSearchOption"
      >
        {{ ingredient }}
      </option>
    </datalist>
  </div>
</template>

<script>
import debounce from "../debounce.js";
export default {
  props: ["value"],
  emits: ["update:value"],
  data() {
    return {
      displayDatalist: false,
      datalistValues: ["one", "two"],
      textInputValue: "",
    };
  },
  computed: {
    selectedValues() {
      return this.value;
    },
  },
  methods: {
    onInput(e) {
      let val = e.target.value;
      if (val && val.length > 2) {
        let query = [
          { key: "number", value: "10" },
          { key: "query", value: val },
        ];
        this.$root
          .apiCall("/food/ingredients/autocomplete", query)
          .then((res) => {
            if (res) {
              this.datalistValues = res.map((obj) => obj.name);
              this.displayDatalist = true;
              // allow closing datalist by clicking outside it
              let closeDatalist = function (eventObj) {
                if (!eventObj.target.classList.contains("multiSearchOption")) {
                  this.displayDatalist = false;
                  this.textInputValue = "";
                }
                window.removeEventListener("click", closeDatalist);
              }.bind(this);
              window.addEventListener("click", closeDatalist);
            }
          });
      }
    },
    clickDatalist(e) {
      if (e.target.tagName == "OPTION") {
        let val = e.target.value;
        if (!this.selectedValues.includes(val)) {
          //no duplicate selections
          this.displayDatalist = false;
          this.textInputValue = "";
          this.changeSelectedValues("add", val);
        }
      }
    },
    changeSelectedValues(action, value) {
      //to avoid mutating values prop
      let copy = Array.from(this.selectedValues);
      if (action == "add") {
        copy.push(value);
      } else if (action == "remove") {
        copy.splice(value, 1);
      }
      this.$emit("input", copy);
    },
  },
  created() {
    this.onInputDebounced = debounce(this.onInput, 400); //change to 350?
  },
};
</script>

<style scoped>
input {
  width: initial;
}
datalist {
  z-index: 1;
  border: 1px solid rgb(161, 159, 159);
  background-color: white;
  font-weight: 400;
  color: #495057;
}
datalist option:hover {
  color: white;
  background-color: #3399ff;
}
.form-control:focus {
  border-color: var(--my-dark);
  box-shadow: 0 0 0 0.2rem var(--my-dark);
}
.selectedLabel {
  border: 2px solid var(--my-dark);
  border-radius: 1rem;
  padding: 0.3rem 0.6rem;
  margin-right: 0.5rem;
}
.selectedLabel > span {
  cursor: pointer;
}
</style>