<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const editingType = ref(null)

const form = ref({ name: '', code: '', description: '', status: '启用' })

const types = ref([
  { id: 1, name: '商铺', code: 'SHOP', count: 8, desc: '沿街或园区内商业零售、餐饮类房源', status: '启用' },
  { id: 2, name: '办公室', code: 'OFFICE', count: 5, desc: '标准办公用房，含独立办公及开放工位', status: '启用' },
  { id: 3, name: '仓库', code: 'WAREHOUSE', count: 3, desc: '用于货物存储的封闭式空间', status: '启用' },
  { id: 4, name: '车位', code: 'PARKING', count: 2, desc: '地上/地下停车位资源', status: '启用' },
  { id: 5, name: '厂房', code: 'FACTORY', count: 0, desc: '工业生产加工用房', status: '启用' },
  { id: 6, name: '配套用房', code: 'SUPPORT', count: 0, desc: '物业管理、设备机房等配套功能用房', status: '停用' }
])

function openAdd() {
  editingType.value = null
  form.value = { name: '', code: '', description: '', status: '启用' }
  showModal.value = true
}

function openEdit(item) {
  editingType.value = item
  form.value = { name: item.name, code: item.code, description: item.desc, status: item.status }
  showModal.value = true
}

function saveType() {
  if (editingType.value) {
    editingType.value.name = form.value.name
    editingType.value.code = form.value.code
    editingType.value.desc = form.value.description
    editingType.value.status = form.value.status
  } else {
    types.value.push({
      id: types.value.length + 1,
      name: form.value.name,
      code: form.value.code,
      count: 0,
      desc: form.value.description,
      status: form.value.status
    })
  }
  showModal.value = false
}

function toggleStatus(item) {
  item.status = item.status === '启用' ? '停用' : '启用'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">资源类型管理</h1>
      <p class="page-subtitle">管理房产资源的分类体系</p>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">类型列表</span>
        <button class="btn btn-primary" @click="openAdd">+ 新建类型</button>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>编号</th><th>类型名称</th><th>类型代码</th>
              <th>关联资源数</th><th>描述</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in types" :key="item.id">
              <td class="font-num">{{ item.id }}</td>
              <td class="font-medium">{{ item.name }}</td>
              <td><span class="tag">{{ item.code }}</span></td>
              <td class="font-num">{{ item.count }}</td>
              <td class="truncate" style="max-width:220px">{{ item.desc }}</td>
              <td>
                <span class="badge" :class="item.status === '启用' ? 'badge-green' : 'badge-gray'">
                  <span class="badge-dot" :class="item.status === '启用' ? 'green' : 'gray'"></span>
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm" @click="openEdit(item)">编辑</button>
                  <button
                    class="btn btn-text btn-sm"
                    :class="{ danger: item.status === '启用' }"
                    @click="toggleStatus(item)"
                  >{{ item.status === '启用' ? '停用' : '启用' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">{{ editingType ? '编辑类型' : '新建类型' }}</span>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label required">类型名称</label>
            <input v-model="form.name" class="form-input" placeholder="请输入类型名称" />
          </div>
          <div class="form-group">
            <label class="form-label required">类型代码</label>
            <input v-model="form.code" class="form-input" placeholder="如 SHOP、OFFICE" />
          </div>
          <div class="form-group">
            <label class="form-label">描述</label>
            <textarea v-model="form.description" class="form-textarea" placeholder="请输入描述"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">状态</label>
            <select v-model="form.status" class="form-select">
              <option>启用</option><option>停用</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="saveType">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
