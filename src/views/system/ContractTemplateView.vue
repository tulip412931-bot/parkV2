<script setup>
import { ref } from 'vue'

const templates = ref([
  { id: 1, name: '标准租赁合同模板', type: '租赁合同', created: '2024-01-10', modified: '2024-08-15', enabled: true, isDefault: true },
  { id: 2, name: '简易租赁合同模板', type: '租赁合同', created: '2024-02-20', modified: '2024-06-01', enabled: true, isDefault: false },
  { id: 3, name: '物业服务合同模板', type: '物业合同', created: '2024-03-01', modified: '2024-09-10', enabled: true, isDefault: true },
  { id: 4, name: '地下车位租赁合同', type: '车位合同', created: '2024-04-15', modified: '2024-07-20', enabled: true, isDefault: true },
  { id: 5, name: '地上车位租赁合同', type: '车位合同', created: '2024-05-01', modified: '2024-05-01', enabled: false, isDefault: false },
  { id: 6, name: '委托管理服务合同', type: '委托合同', created: '2024-06-10', modified: '2024-10-01', enabled: true, isDefault: true },
])

const typeMap = { '租赁合同': 'badge-blue', '物业合同': 'badge-green', '车位合同': 'badge-orange', '委托合同': 'badge-purple' }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">合同模板管理</h1>
      <p class="page-subtitle">管理各类合同文本模板</p>
    </div>

    <div class="filter-bar">
      <div class="filter-actions">
        <button class="btn btn-primary">+ 新建模板</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>模板名称</th><th>模板类型</th><th>创建时间</th><th>修改时间</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in templates" :key="row.id">
              <td class="font-medium">{{ row.name }}<span v-if="row.isDefault" class="badge badge-blue" style="margin-left:6px;font-size:11px">默认</span></td>
              <td><span class="badge" :class="typeMap[row.type]">{{ row.type }}</span></td>
              <td>{{ row.created }}</td>
              <td>{{ row.modified }}</td>
              <td><span class="badge" :class="row.enabled ? 'badge-green' : 'badge-gray'">{{ row.enabled ? '启用' : '停用' }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm">预览</button>
                  <button class="btn btn-text btn-sm">下载</button>
                  <button v-if="!row.isDefault" class="btn btn-text btn-sm">设为默认</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
