<template>
    <div class="item-editor">
      <p><strong>{{ item.locale_name }}</strong></p>
      <div class="input-container"> 
        <label>{{ $t('cur_durability') }}:</label>
        <input type="number" v-model="itemValues.cur_durability" required :min="0" @input="updateCurDurability" :class="{ error: hasError_cur_durability }" />
      </div>
      <div class="input-container">
        <label>{{ $t('max_durability') }}:</label>
        <input type="number" v-model="itemValues.max_durability" required :min="0" @input="updateMaxDurability" :class="{ error: hasError_max_durability }" />
      </div>
      <div class="input-container">
        <label>{{ $t('stack') }}:</label>
        <input type="number" v-model="itemValues.stack" required :min="0" @input="updateStack" :class="{ error: hasError_stack }" />
      </div>
      <div class="input-container">
        <label>{{ $t('ammo') }}:</label>
        <input type="number" v-model="itemValues.ammo" required :min="0" @input="updateAmmo" :class="{ error: hasError_ammo }" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['item'],
    data() {
      return {
        itemValues: {
          cur_durability: this.item.cur_durability,
          max_durability: this.item.max_durability,
          stack: this.item.stack,
          ammo: this.item.ammo,
        },
        hasError_cur_durability: false,
        hasError_max_durability: false,
        hasError_stack: false,
        hasError_ammo: false,
      };
    },
    methods: {
      updateCurDurability() {
        if (this.itemValues.cur_durability === '' || isNaN(this.itemValues.cur_durability) || this.itemValues.cur_durability < 0 || this.itemValues.cur_durability === null) {
          this.hasError_cur_durability = true;
          return;
        } 
        else {
          this.hasError_cur_durability = false;
        }
        this.$emit('updateItem', this.item.cur_durability_offset, 'cur_durability', this.itemValues.cur_durability);
      },
      updateMaxDurability() {
        if (this.itemValues.max_durability === '' || isNaN(this.itemValues.max_durability) || this.itemValues.max_durability < 0 || this.itemValues.max_durability === null) {
          this.hasError_max_durability = true;
          return;
        } 
        else {
          this.hasError_max_durability = false;
        }
        this.$emit('updateItem', this.item.max_durability_offset, 'max_durability', this.itemValues.max_durability);
      },
      updateStack() {
        if (this.itemValues.stack === '' || isNaN(this.itemValues.stack) || this.itemValues.stack < 0 || this.itemValues.stack === null) {
          this.hasError_stack = true;
          return;
        } 
        else {
          this.hasError_stack = false;
        }
        this.$emit('updateItem', this.item.stack_offset, 'stack', this.itemValues.stack);
      },
      updateAmmo() {
        if (this.itemValues.ammo === '' || isNaN(this.itemValues.ammo) || this.itemValues.ammo < 0 || this.itemValues.ammo === null) {
          this.hasError_ammo = true;
          return;
        } 
        else {
          this.hasError_ammo = false;
        }
        this.$emit('updateItem', this.item.ammo_offset, 'ammo', this.itemValues.ammo);
      },
    },
  };
  </script>
  
  <style scoped>
  .item-editor {
    background-color: #ffffff;
    border: 1px solid #d8dee9;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  label {
    font-size: 0.9rem;
    font-weight: bold;
    color: #4c566a;
    display: block;
    margin-top: 5px;
  }

  .input-container {
    position: relative;
  }

  input {
    width: 50%;
    padding: 5px;
    margin: 5px 0;
    border: 1px solid #d8dee9;
    border-radius: 3px;
  }

  input:focus {
    border-color: #5e81ac;
    outline: none;
    box-shadow: 0 0 5px rgba(94, 129, 172, 0.5);
  }

  input.error {
    border: 2px solid red;
    background-color: #ffe6e6;
  }
  </style>
  