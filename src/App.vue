<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:3000/assets';

const assets = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const form = ref({
  asset_name: '',
  stock_quantity: 0,
  category: 'Consumable'
});

const isEditing = ref(false);
const editingId = ref(null);

const showSuccess = (msg) => {
  successMessage.value = msg;
  setTimeout(() => { successMessage.value = ''; }, 3000);
};

const resetForm = () => {
  form.value = {
    asset_name: '',
    stock_quantity: 0,
    category: 'Consumable'
  };
  isEditing.value = false;
  editingId.value = null;
};

const fetchAssets = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const res = await axios.get(API_URL);
    assets.value = res.data;
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Gagal memuat data aset.';
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!form.value.asset_name.trim()) {
    alert('Nama asset tidak boleh kosong');
    return;
  }

  if (form.value.stock_quantity < 0) {
    alert('Jumlah stok tidak boleh negatif');
    return;
  }

  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/${editingId.value}`, form.value);
      showSuccess(`Asset #${editingId.value} berhasil diperbarui`);
    } else {
      await axios.post(API_URL, form.value);
      showSuccess('Asset berhasil ditambahkan');
    }
    resetForm();
    await fetchAssets();
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat menyimpan data.');
  }
};

const handleEdit = (item) => {
  isEditing.value = true;
  editingId.value = item.asset_id;
  form.value = {
    asset_name: item.asset_name,
    stock_quantity: item.stock_quantity,
    category: item.category
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleDelete = async (id, name) => {
  if (confirm(`Hapus asset "${name}"?`)) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      showSuccess(`Asset "${name}" berhasil dihapus`);
      await fetchAssets();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus asset.');
    }
  }
};

onMounted(() => {
  fetchAssets();
});
</script>

<template>
  <div class="app-layout">
    <header class="header">
      <div class="header-content">
        <h1>Sistem Manajemen Asset Fumindo</h1>
        <p class="subtitle">Pengelolaan Inventaris & Aset Operasional</p>
      </div>
    </header>

    <main class="container">
      <div v-if="successMessage" class="alert alert-success">
        ✓ {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger">
        ⚠ {{ errorMessage }}
      </div>

      <section class="card form-card">
        <div class="card-header">
          <h2>{{ isEditing ? `Edit Asset #${editingId}` : 'Tambah Asset Baru' }}</h2>
          <span v-if="isEditing" class="editing-indicator">Mode Edit</span>
        </div>

        <form @submit.prevent="handleSubmit" class="form-body">
          <div class="form-row">
            <div class="form-group flex-2">
              <label for="asset_name">Nama Asset <span class="required">*</span></label>
              <input
                id="asset_name"
                v-model="form.asset_name"
                type="text"
                placeholder="Contoh: Pestisida Fumigasi X"
                required
              />
            </div>

            <div class="form-group flex-1">
              <label for="stock_quantity">Jumlah Stok <span class="required">*</span></label>
              <input
                id="stock_quantity"
                v-model.number="form.stock_quantity"
                type="number"
                min="0"
                placeholder="0"
                required
              />
            </div>

            <div class="form-group flex-1">
              <label for="category">Kategori <span class="required">*</span></label>
              <select id="category" v-model="form.category">
                <option value="Consumable">Consumable</option>
                <option value="Non-Consumable">Non-Consumable</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? 'Simpan Perubahan' : 'Tambah Asset' }}
            </button>
            <button
              v-if="isEditing"
              type="button"
              @click="resetForm"
              class="btn btn-secondary"
            >
              Batal
            </button>
          </div>
        </form>
      </section>

      <section class="card table-card">
        <div class="card-header space-between">
          <h2>Daftar Asset</h2>
          <button @click="fetchAssets" class="btn btn-outline" :disabled="loading">
            {{ loading ? 'Memuat...' : 'Refresh' }}
          </button>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 80px;">ID</th>
                <th>Nama Asset</th>
                <th style="width: 140px;">Stok</th>
                <th style="width: 180px;">Kategori</th>
                <th style="width: 180px; text-align: center;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="text-center py-4">Memuat data...</td>
              </tr>
              <tr v-else-if="assets.length === 0">
                <td colspan="5" class="text-center py-4 empty-state">
                  Belum ada data asset.
                </td>
              </tr>
              <tr v-else v-for="asset in assets" :key="asset.asset_id">
                <td class="font-mono">#{{ asset.asset_id }}</td>
                <td class="font-bold">{{ asset.asset_name }}</td>
                <td>{{ asset.stock_quantity }} unit</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      asset.category === 'Consumable' ? 'badge-consumable' : 'badge-nonconsumable'
                    ]"
                  >
                    {{ asset.category }}
                  </span>
                </td>
                <td class="action-buttons">
                  <button
                    @click="handleEdit(asset)"
                    class="btn btn-sm btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(asset.asset_id, asset.asset_name)"
                    class="btn btn-sm btn-delete"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-bottom: 40px;
}

.header {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  color: white;
  padding: 30px 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.header h1 {
  margin: 0 0 6px 0;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.container {
  max-width: 900px;
  margin: -20px auto 0;
  padding: 0 15px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  background-color: #ffffff;
}

.card-header.space-between {
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
}

.editing-indicator {
  background: #fef3c7;
  color: #b45309;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  margin-left: 10px;
}

.form-body {
  padding: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.flex-1 { flex: 1; min-width: 160px; }
.flex-2 { flex: 2; min-width: 240px; }

.form-group label {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #334155;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select {
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.15s;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #64748b;
  color: white;
}
.btn-secondary:hover {
  background-color: #475569;
}

.btn-outline {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 12px;
}
.btn-outline:hover {
  background: #f1f5f9;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 4px;
}

.btn-edit {
  background-color: #f59e0b;
  color: white;
}
.btn-edit:hover {
  background-color: #d97706;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}
.btn-delete:hover {
  background-color: #dc2626;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th {
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

tr:hover td {
  background-color: #f8fafc;
}

.font-mono {
  font-family: monospace;
  font-weight: 600;
  color: #64748b;
}

.font-bold {
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-consumable {
  background-color: #e0f2fe;
  color: #0369a1;
}

.badge-nonconsumable {
  background-color: #fef3c7;
  color: #92400e;
}

.action-buttons {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.alert {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 500;
}

.alert-success {
  background-color: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.alert-danger {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.text-center { text-align: center; }
.py-4 { padding-top: 24px; padding-bottom: 24px; }
.empty-state { color: #94a3b8; font-style: italic; }
</style>
