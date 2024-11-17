<template>
    <div class="structure-editor">
      <h2>{{ title }}</h2>
      <div class="item-list">
        <ItemEditor v-for="(item, index) in filteredItems" :key="index" :item="item" @updateItem="updateItem" />
      </div>
    </div>
  </template>
  
  <script>
  import ItemEditor from './ItemEditor.vue';
  
  export default {
    props: ['title', 'items'],
    computed: {
      filteredItems() {
        return this.items.filter(item => item && item.name !== 'None' && item.name !== 'Empty');
      }
    },
    methods: {
      updateItem(offset, field, newValue) {
        this.$emit('updateItem', offset, field, newValue);
      },
    },
    components: {
      ItemEditor,
    },
  };
  </script>
  

<style scoped>
.structure-editor {
  margin: 20px 0;
  padding: 10px;
  background-color: #eceff4;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}
</style>