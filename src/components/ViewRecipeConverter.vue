<template>
  <div class="converter px-2">
    <p class="text-center">Volume</p>
    <hr />
    <div
      class="form-group d-flex align-items-center justify-content-around mx-auto conversion-flex"
    >
      <label for="fromVolume">From:</label>
      <select class="form-control" id="fromVolume" v-model="model.fromVolume">
        <option value="">Any</option>
        <option v-for="unit in units.vol" :key="unit.str">
          {{ unit.str }}
        </option>
      </select>
      <label for="toVolume">To:</label>
      <select class="form-control" id="toVolume" v-model="model.toVolume">
        <option value=""></option>
        <option v-for="unit in units.vol" :key="unit.str">
          {{ unit.str }}
        </option>
      </select>
    </div>
    <p class="text-center">Weight</p>
    <hr />
    <div
      class="form-group d-flex align-items-center justify-content-around mx-auto conversion-flex"
    >
      <label for="fromWeight">From:</label>
      <select class="form-control" id="fromWeight" v-model="model.fromWeight">
        <option value="">Any</option>
        <option v-for="unit in units.weight" :key="unit.str">
          {{ unit.str }}
        </option>
      </select>
      <label for="toWeight">To:</label>
      <select class="form-control" id="toWeight" v-model="model.toWeight">
        <option value=""></option>
        <option v-for="unit in units.weight" :key="unit.str">
          {{ unit.str }}
        </option>
      </select>
    </div>
    <p class="text-center">Length</p>
    <hr />
    <div
      class="form-group d-flex align-items-center justify-content-around mx-auto conversion-flex"
    >
      <label for="fromLength">From:</label>
      <select class="form-control" id="fromLength" v-model="model.fromLength">
        <option value="">Any</option>
        <option v-for="unit in units.len" :key="unit.str">
          {{ unit.str }}
        </option>
      </select>
      <label for="toLength">To:</label>
      <select class="form-control" id="toLength" v-model="model.toLength">
        <option value=""></option>
        <option v-for="unit in units.len" :key="unit.str">
          {{ unit.str }}
        </option>
      </select>
    </div>
    <hr class="mt-5" />
    <div
      class="converter-button-container mx-auto pb-1 d-flex justify-content-between"
    >
      <b-button class="contrastButton" @click="convert">Convert</b-button>
      <b-button class="darkButton" @click="cancel">Cancel</b-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
export default {
  props: ["ingredientsProp"],
  emits: ["conversionDone", "close"],
  data() {
    return {
      model: {
        fromVolume: "",
        toVolume: "",
        fromWeight: "",
        toWeight: "",
        fromLength: "",
        toLength: "",
      },
      units: {
        vol: {
          //factor is equivalent in tbsp
          tsp: { str: "tsp", factor: 3 },
          tbsp: { str: "tbsp", factor: 1 },
          cups: { str: "cups", factor: 0.0625 },
          ml: { str: "ml", factor: 14.79 },
          l: { str: "l", factor: 0.01479 },
          floz: { str: "fl oz", factor: 0.5 },
        },
        weight: {
          //factor is equivalent in oz
          mg: { str: "mg", factor: 28350 },
          g: { str: "g", factor: 28.35 },
          kg: { str: "kg", factor: 0.02835 },
          oz: { str: "oz", factor: 1 },
          lbs: { str: "lbs", factor: 0.0625 },
        },
        len: {
          //factor is equivalent in cm
          cm: { str: "cm", factor: 1 },
          mm: { str: "mm", factor: 1000 },
          in: { str: "in", factor: 0.394 },
        },
      },
      ingredients: null,
    };
  },
  methods: {
    convert() {
      let from = [];
      if (this.model.toVolume) {
        //loop thru each ingredient, if .unitInternal is one of the ones indicated by this.model.fromVolume, convert .amount to this.model.toVolume
        from = [this.model.fromVolume];
        if (from[0] == "") from = Object.keys(this.units.vol); //case where from = Any
        this.ingredients.forEach((ingr) => {
          if (from.includes(ingr.unitInternal)) {
            ingr.amount = this.formatNumber(
              (ingr.amount / this.units.vol[ingr.unitInternal].factor) *
                this.units.vol[this.model.toVolume].factor
            );
            ingr.unit = this.model.toVolume;
            ingr.unitInternal = this.model.toVolume;
          }
        });
      }
      if (this.model.toWeight) {
        from = [this.model.fromWeight];
        if (from[0] == "") from = Object.keys(this.units.weight);
        this.ingredients.forEach((ingr) => {
          if (from.includes(ingr.unitInternal)) {
            ingr.amount = this.formatNumber(
              (ingr.amount / this.units.weight[ingr.unitInternal].factor) *
                this.units.weight[this.model.toWeight].factor
            );
            ingr.unit = this.model.toWeight;
            ingr.unitInternal = this.model.toWeight;
          }
        });
      }
      if (this.model.toLength) {
        from = [this.model.fromLength];
        if (from[0] == "") from = Object.keys(this.units.len);
        this.ingredients.forEach((ingr) => {
          if (from.includes(ingr.unitInternal)) {
            ingr.amount = this.formatNumber(
              (ingr.amount / this.units.len[ingr.unitInternal].factor) *
                this.units.len[this.model.toLength].factor
            );
            ingr.unit = this.model.toLen;
            ingr.unitInternal = this.model.toLen;
          }
        });
      }
      this.$emit("conversionDone", this.ingredients);
    },
    cancel() {
      this.$emit("close");
    },
    getUnit(unit) {
      if (/tsp|tea/i.test(unit)) return this.units.vol.tsp.str;
      if (/tbsp|table/i.test(unit)) return this.units.vol.tbsp.str;
      if (/cup/i.test(unit)) return this.units.vol.cups.str;
      if (/ml|millil/i.test(unit)) return this.units.vol.ml.str;
      if (/liter|litre|^l$/i.test(unit)) return this.units.vol.l.str;
      if (/fluid|fl.*oz/i.test(unit)) return this.units.vol.floz.str;
      if (/mg|millig/i.test(unit)) return this.units.weight.mg.str;
      if (/^g$|^gram/i.test(unit)) return this.units.weight.g.str;
      if (/kg|kilog/i.test(unit)) return this.units.weight.kg.str;
      if (/oz|ounc/i.test(unit)) return this.units.weight.oz.str;
      if (/lb|pound/i.test(unit)) return this.units.weight.lbs.str;
      if (/cm|centim/i.test(unit)) return this.units.len.cm.str;
      if (/mm|millim/i.test(unit)) return this.units.len.mm.str;
      if (/^in|inch/i.test(unit)) return this.units.len.in.str;
      return "";
    },
    formatNumber(num) {
      return Number(num.toPrecision(4));
    },
  },
  created() {
    this.ingredients = cloneDeep(this.ingredientsProp);
    this.ingredients.forEach((obj) => {
      obj.unitInternal = this.getUnit(obj.unit);
    });
  },
};
</script>

<style scoped>
.converter {
  color: var(--my-dark-darker);
  font-weight: 600;
}
.converter > div > label {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
select {
  width: 6rem;
}
.conversion-flex {
  width: 70%;
}
.converter-button-container {
  width: 45%;
  justify-content: space-around;
}
@media screen and (max-width: 429px) {
  .converter-button-container {
    width: 50%;
  }
}
@media screen and (max-width: 379px) {
  .converter-button-container {
    width: 65%;
  }
}
</style>

