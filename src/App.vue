<template>
  <div id="app">
    <div class="header">
      <h1>{{ $t('title') }}</h1>
    </div>
    <div class="language-selector">
      🌐
      <select v-model="currentLanguage" @change="changeLanguage">
        <option value="zhs">简体中文</option>
        <option value="zht">繁體中文</option>
        <option value="en">English</option>
      </select>
    </div>
    <div class="content">
      <div class="description">{{ $t('description') }}</div>
      <div class="upload-section">
        <input type="file" @change="handleFileUpload" />
      </div>
      <div v-if="saveFileBuffer" class="download-section">
        <button class="download-button" @click="downloadModifiedFile">{{ $t('download') }}</button>
      </div>
      <div class="structures">
        <StructureEditor v-if="structures.equipment.length" :title="$t('equipment')" :items="structures.equipment" @updateItem="updateItem"/>
        <StructureEditor v-if="structures.hotbar.length" :title="$t('hotbar')" :items="structures.hotbar" @updateItem="updateItem"/>
        <StructureEditor v-if="structures.inventory.length" :title="$t('inventory')" :items="structures.inventory" @updateItem="updateItem"/>
      </div>
      <div v-if="saveFileBuffer" class="download-section">
        <button class="download-button" @click="downloadModifiedFile">{{ $t('download') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import StructureEditor from './components/StructureEditor.vue';
import zhs_json from './assets/zhs.json';
import en_json from './assets/en.json';
import zht_json from './assets/zht.json';

export default {
  data() {
    return {
      currentLanguage: 'zhs',
      structures: {
        equipment: [],
        hotbar: [],
        inventory: [],
      },
      filename: '',
      saveFileBuffer: null,
      en: null,
      zhs: null,
      zht: null,
    };
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.currentLanguage;

      for (const key in this.structures) {
        for (const item of this.structures[key]) {
          if (this.currentLanguage === 'en') {
            if (this.en[item.name.toLowerCase() + '_itemname'])
              item.locale_name = this.en[item.name.toLowerCase() + '_itemname'];
          } 
          else if (this.currentLanguage === 'zhs') {
            if (this.zhs[item.name.toLowerCase() + '_itemname'])
              item.locale_name = this.zhs[item.name.toLowerCase() + '_itemname'];
          } 
          else if (this.currentLanguage === 'zht') {
            if (this.zht[item.name.toLowerCase() + '_itemname'])
              item.locale_name = this.zht[item.name.toLowerCase() + '_itemname'];
          }
        }
      }
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.filename = file.name;
      this.en = this.parseLocalizationEN();
      this.zhs = this.parseLocalizationZHS(); 
      this.zht = this.parseLocalizationZHT();

      const arrayBuffer = await file.arrayBuffer();
      this.saveFileBuffer = arrayBuffer;
      this.parseFile(new Uint8Array(arrayBuffer));
    },
    parseLocalizationEN() {
      const enLocalization = {};
      for (const key in en_json) {
        const value = en_json[key];
        for (const k in value) {
            const v = value[k];
            enLocalization[k.toLowerCase()] = v;
          }
        }
      return enLocalization;
    },
    parseLocalizationZHS() {
      const zhsLocalization = {};
      for (const key in zhs_json) {
        const value = zhs_json[key];
          for (const k in value) {
            const v = value[k];
            zhsLocalization[k.toLowerCase()] = v;
          }
        }
      return zhsLocalization;
    },
    parseLocalizationZHT() {
      const zhtLocalization = {};
      for (const key in zht_json) {
        const value = zht_json[key];
        for (const k in value) {
          const v = value[k];
          zhtLocalization[k.toLowerCase()] = v;
        }
      }
      return zhtLocalization;
    },
    parseFile(buffer) {
      // 定义特征码
      const signatures = {
        item_data_table:[
          0x49, 0x74, 0x65, 0x6D, 0x44, 0x61, 0x74, 0x61, 0x54, 0x61, 0x62, 0x6C,
          0x65, 0x5F, 0x31, 0x38, 0x5F, 0x42, 0x46, 0x31, 0x30, 0x35, 0x32, 0x46,
          0x31, 0x34, 0x31, 0x46, 0x36, 0x36, 0x41, 0x39, 0x37, 0x36, 0x46, 0x34,
          0x38, 0x34, 0x34, 0x41, 0x42, 0x32, 0x42, 0x31, 0x33, 0x30, 0x36, 0x32,
          0x42
        ],
        changeable_data: [
          0x43, 0x68, 0x61, 0x6E, 0x67, 0x65, 0x61, 0x62, 0x6C, 0x65, 0x44, 0x61,
          0x74, 0x61, 0x5F, 0x31, 0x32, 0x5F, 0x32, 0x42, 0x39, 0x30, 0x45, 0x31,
          0x46, 0x37, 0x34, 0x46, 0x36, 0x34, 0x38, 0x31, 0x33, 0x35, 0x35, 0x37,
          0x39, 0x44, 0x33, 0x39, 0x41, 0x34, 0x39, 0x46, 0x35, 0x41, 0x32, 0x33,
          0x31, 0x33
        ],
        equipment_inventory: [
          0x45, 0x71, 0x75, 0x69, 0x70, 0x6D, 0x65, 0x6E, 0x74, 0x49, 0x6E, 0x76,
          0x65, 0x6E, 0x74, 0x6F, 0x72, 0x79, 0x5F, 0x31, 0x31, 0x5F, 0x37, 0x38,
          0x45, 0x43, 0x36, 0x36, 0x32, 0x42, 0x34, 0x39, 0x33, 0x45, 0x44, 0x34,
          0x33, 0x42, 0x46, 0x33, 0x30, 0x36, 0x43, 0x44, 0x38, 0x46, 0x44, 0x38,
          0x32, 0x45, 0x41, 0x34, 0x35, 0x41
        ],
        hotbar_inventory: [
          0x48, 0x6F, 0x74, 0x62, 0x61, 0x72, 0x49, 0x6E, 0x76, 0x65, 0x6E, 0x74,
          0x6F, 0x72, 0x79, 0x5F, 0x31, 0x32, 0x5F, 0x45, 0x42, 0x30, 0x45, 0x35,
          0x34, 0x35, 0x42, 0x34, 0x34, 0x42, 0x42, 0x37, 0x37, 0x32, 0x45, 0x31,
          0x43, 0x43, 0x46, 0x43, 0x45, 0x42, 0x46, 0x38, 0x46, 0x30, 0x31, 0x37,
          0x30, 0x41, 0x31
        ], 
        inventory: [
          0x49, 0x6E, 0x76, 0x65, 0x6E, 0x74, 0x6F, 0x72, 0x79, 0x5F, 0x38, 0x5F,
          0x37, 0x35, 0x38, 0x42, 0x32, 0x30, 0x37, 0x41, 0x34, 0x38, 0x42, 0x45,
          0x35, 0x45, 0x31, 0x32, 0x42, 0x30, 0x30, 0x32, 0x32, 0x43, 0x39, 0x31,
          0x39, 0x33, 0x38, 0x46, 0x33, 0x32, 0x42, 0x44
        ],
        transmog_inventory: [
          0x54, 0x72, 0x61, 0x6E, 0x73, 0x6D, 0x6F, 0x67, 0x49, 0x6E, 0x76, 0x65,
          0x6E, 0x74, 0x6F, 0x72, 0x79, 0x5F, 0x31, 0x30, 0x36, 0x5F, 0x39, 0x32,
          0x37, 0x41, 0x30, 0x42, 0x36, 0x36, 0x34, 0x37, 0x33, 0x35, 0x30, 0x44,
          0x34, 0x35, 0x33, 0x45, 0x44, 0x32, 0x46, 0x35, 0x42, 0x37, 0x45, 0x30,
          0x30, 0x37, 0x41, 0x44, 0x44, 0x42
        ],
        name: [
          0x4E, 0x61, 0x6D, 0x65, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79
        ],
        cur_durability: [
          0x43, 0x75, 0x72, 0x72, 0x65, 0x6E, 0x74, 0x49, 0x74, 0x65, 0x6D, 0x44,
          0x75, 0x72, 0x61, 0x62, 0x69, 0x6C, 0x69, 0x74, 0x79, 0x5F, 0x34, 0x5F,
          0x32, 0x34, 0x42, 0x34, 0x44, 0x30, 0x45, 0x36, 0x34, 0x45, 0x34, 0x39,
          0x36, 0x42, 0x34, 0x33, 0x46, 0x42, 0x38, 0x44, 0x33, 0x43, 0x41, 0x32,
          0x42, 0x39, 0x44, 0x31, 0x36, 0x31, 0x43, 0x38
        ],
        max_durability: [
          0x4D, 0x61, 0x78, 0x49, 0x74, 0x65, 0x6D, 0x44, 0x75, 0x72, 0x61, 0x62,
          0x69, 0x6C, 0x69, 0x74, 0x79, 0x5F, 0x36, 0x5F, 0x46, 0x35, 0x44, 0x35,
          0x46, 0x30, 0x44, 0x36, 0x34, 0x44, 0x34, 0x44, 0x36, 0x30, 0x35, 0x30,
          0x43, 0x43, 0x43, 0x44, 0x45, 0x34, 0x38, 0x36, 0x39, 0x37, 0x38, 0x35,
          0x30, 0x31, 0x32, 0x42
        ],
        stack: [
          0x43, 0x75, 0x72, 0x72, 0x65, 0x6E, 0x74, 0x53, 0x74, 0x61, 0x63, 0x6B,
          0x5F, 0x39, 0x5F, 0x44, 0x34, 0x34, 0x33, 0x42, 0x36, 0x39, 0x30, 0x34,
          0x34, 0x44, 0x36, 0x34, 0x30, 0x42, 0x30, 0x39, 0x38, 0x39, 0x46, 0x44,
          0x38, 0x41, 0x36, 0x32, 0x39, 0x38, 0x30, 0x31, 0x41, 0x34, 0x39
        ],
        ammo: [
          0x43, 0x75, 0x72, 0x72, 0x65, 0x6E, 0x74, 0x41, 0x6D, 0x6D, 0x6F, 0x49,
          0x6E, 0x4D, 0x61, 0x67, 0x61, 0x7A, 0x69, 0x6E, 0x65, 0x5F, 0x31, 0x32,
          0x5F, 0x44, 0x36, 0x38, 0x43, 0x31, 0x39, 0x30, 0x46, 0x34, 0x42, 0x32,
          0x46, 0x41, 0x37, 0x38, 0x41, 0x34, 0x42, 0x31, 0x44, 0x35, 0x37, 0x38,
          0x33, 0x35, 0x42, 0x39, 0x35, 0x43, 0x35, 0x33, 0x44
        ]
      };

      const equipment_inventory_offset = this.findSignature(buffer, signatures.equipment_inventory);
      if (equipment_inventory_offset === -1) return;

      const hotbar_inventory_offset = this.findSignature(buffer, signatures.hotbar_inventory, equipment_inventory_offset);
      if (hotbar_inventory_offset === -1) return;

      const inventory_offset = this.findSignature(buffer, signatures.inventory, hotbar_inventory_offset);
      if (inventory_offset === -1) return;

      const transmog_inventory_offset = this.findSignature(buffer, signatures.transmog_inventory, inventory_offset);
      if (transmog_inventory_offset === -1) return;

      this.structures.equipment = this.parseStructure(buffer, signatures, equipment_inventory_offset, 12, -1);
      this.structures.hotbar = this.parseStructure(buffer, signatures, hotbar_inventory_offset, -1, inventory_offset);
      this.structures.inventory = this.parseStructure(buffer, signatures, inventory_offset, -1, transmog_inventory_offset);
    },
    parseStructure(buffer, signatures, startOffset, count = -1, end = -1) {
      if (count === -1 && end === -1) return [];

      const items = [];
      let offset = startOffset;

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const equipment_item_offset = this.findSignature(buffer, signatures.item_data_table, offset);
          if (equipment_item_offset === -1) break;

          const equipment_data_offset = this.findSignature(buffer, signatures.changeable_data, equipment_item_offset);
          if (equipment_data_offset === -1) break;

          let name = this.findName(buffer, signatures.name, equipment_item_offset);
          if (name === -1) break;

          let locale_name = name;
          if (this.currentLanguage === 'en') {
            if (this.en[name.toLowerCase() + '_itemname'])
              locale_name = this.en[name.toLowerCase() + '_itemname'];
          }
          else if (this.currentLanguage === 'zhs') {
            if (this.zhs[name.toLowerCase() + '_itemname'])
              locale_name = this.zhs[name.toLowerCase() + '_itemname'];
          }
          else if (this.currentLanguage === 'zht') {
            if (this.zht[name.toLowerCase() + '_itemname'])
              locale_name = this.zht[name.toLowerCase() + '_itemname'];
          }

          const view = new DataView(buffer.buffer);

          let cur_durability_offset = this.findSignature(buffer, signatures.cur_durability, equipment_data_offset);
          if (cur_durability_offset === -1) break;
          cur_durability_offset += signatures.cur_durability.length + 29;
          let cur_durability = view.getFloat64(cur_durability_offset, true);
          cur_durability = Number(cur_durability.toFixed(4));

          let max_durability_offset = this.findSignature(buffer, signatures.max_durability, equipment_data_offset);
          if (max_durability_offset === -1) break;
          max_durability_offset += signatures.max_durability.length + 29;
          let max_durability = view.getFloat64(max_durability_offset, true);
          max_durability = Number(max_durability.toFixed(4));

          let stack_offset = this.findSignature(buffer, signatures.stack, equipment_data_offset);
          if (stack_offset === -1) break;
          stack_offset += signatures.stack.length + 26;
          let stack = view.getInt32(stack_offset, true);

          let ammo_offset = this.findSignature(buffer, signatures.ammo, equipment_data_offset);
          if (ammo_offset === -1) break;
          ammo_offset += signatures.ammo.length + 26;
          let ammo = view.getInt32(ammo_offset, true);

          items.push({
            equipment_item_offset: equipment_item_offset,
            equipment_data_offset: equipment_data_offset,
            name: name,
            locale_name: locale_name,
            cur_durability: cur_durability,
            max_durability: max_durability,
            stack: stack,
            ammo: ammo,
            cur_durability_offset: cur_durability_offset,
            max_durability_offset: max_durability_offset,
            stack_offset: stack_offset,
            ammo_offset: ammo_offset,
          });

          offset = equipment_data_offset + 1;
        }
      }
      else if (end > 0) {
        while (offset < end) {
          const equipment_item_offset = this.findSignature(buffer, signatures.item_data_table, offset);
          if (equipment_item_offset === -1) break;
          if (equipment_item_offset >= end) break;

          const equipment_data_offset = this.findSignature(buffer, signatures.changeable_data, equipment_item_offset);
          if (equipment_data_offset === -1) break;

          let name = this.findName(buffer, signatures.name, equipment_item_offset);
          if (name === -1) break;

          let locale_name = name;
          if (this.currentLanguage === 'en') {
            if (this.en[name.toLowerCase() + '_itemname'])
              locale_name = this.en[name.toLowerCase() + '_itemname'];
          }
          else if (this.currentLanguage === 'zhs') {
            if (this.zhs[name.toLowerCase() + '_itemname'])
              locale_name = this.zhs[name.toLowerCase() + '_itemname'];
          }
          else if (this.currentLanguage === 'zht') {
            if (this.zht[name.toLowerCase() + '_itemname'])
              locale_name = this.zht[name.toLowerCase() + '_itemname'];
          }

          const view = new DataView(buffer.buffer);

          let cur_durability_offset = this.findSignature(buffer, signatures.cur_durability, equipment_data_offset);
          if (cur_durability_offset === -1) break;
          cur_durability_offset += signatures.cur_durability.length + 29;
          let cur_durability = view.getFloat64(cur_durability_offset, true);
          cur_durability = Number(cur_durability.toFixed(4));

          let max_durability_offset = this.findSignature(buffer, signatures.max_durability, equipment_data_offset);
          if (max_durability_offset === -1) break;
          max_durability_offset += signatures.max_durability.length + 29;
          let max_durability = view.getFloat64(max_durability_offset, true);
          max_durability = Number(max_durability.toFixed(4));
          let stack_offset = this.findSignature(buffer, signatures.stack, equipment_data_offset);
          if (stack_offset === -1) break;
          stack_offset += signatures.stack.length + 26;
          let stack = view.getInt32(stack_offset, true);

          let ammo_offset = this.findSignature(buffer, signatures.ammo, equipment_data_offset);
          if (ammo_offset === -1) break;
          ammo_offset += signatures.ammo.length + 26;
          let ammo = view.getInt32(ammo_offset, true);

          items.push({
            equipment_item_offset: equipment_item_offset,
            equipment_data_offset: equipment_data_offset,
            name: name,
            locale_name: locale_name,
            cur_durability: cur_durability,
            max_durability: max_durability,
            stack: stack,
            ammo: ammo,
            cur_durability_offset: cur_durability_offset,
            max_durability_offset: max_durability_offset,
            stack_offset: stack_offset,
            ammo_offset: ammo_offset,
          });

          offset = equipment_data_offset + 1;
        }
      }

      return items;
    },
    findSignature(buffer, signature, start = 0) {
      if (start === -1) return -1;

      for (let i = start; i <= buffer.length - signature.length; i++) {
        let match = true;
        for (let j = 0; j < signature.length; j++) {
          if (buffer[i + j] !== signature[j]) {
            match = false;
            break;
          }
        }
        if (match) return i;
      }
      return -1; // 没有找到
    },
    findName(buffer, signature, start = 0) {
      if (start === -1) return -1;

      let name_offset = this.findSignature(buffer, signature, start);
      if (name_offset === -1) return -1;

      name_offset += signature.length + 14;
      let pos = name_offset;
      while (buffer[pos] !== 0) {
        pos += 1;
      }
      let name = new TextDecoder().decode(buffer.slice(name_offset, pos));
      return name;
    },
    updateItem(offset, field, newValue) {
      const view = new DataView(this.saveFileBuffer);
      if (field === 'cur_durability' || field === 'max_durability') {
        view.setFloat64(offset, parseFloat(newValue), true);
      } else if (field === 'stack' || field === 'ammo') {
        view.setInt32(offset, parseInt(newValue), true);
      }
    },
    downloadModifiedFile() {
      const blob = new Blob([this.saveFileBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = this.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
  components: {
    StructureEditor,
  },
};
</script>

<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
}

#app {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header h1 {
  font-size: 2.5rem;
  color: #4c566a;
  margin-bottom: 30px;
}

.description {
  text-align: left;
  white-space: pre-wrap;
  background-color: #f0f4fc;
  color: #4c566a;
  font-size: 1rem;
  font-weight: 400;
  padding: 15px 20px; 
  border: 1px solid #d8dee9; 
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 20px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description p {
  margin: 0;
  line-height: 1.6;
}

.upload-section {
  margin: 20px 0;
}

.button {
  background-color: #5e81ac;
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #81a1c1;
}

.structures {
  margin: 20px 0;
}

h2 {
  font-size: 1.8rem;
  color: #434c5e;
  margin-bottom: 10px;
}

.download-button {
  background-color: #a3be8c;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.download-button:hover {
  background-color: #b5d89d;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
  .button,
  .download-button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>