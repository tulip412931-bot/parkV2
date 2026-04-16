<script setup>
import { ref, computed } from 'vue'

const currentPage = ref(1)
const pageSize = 10

const templates = ref([
  { id: 1, name: '物业费收据模板', type: '收据', paper: 'A5', created: '2024-01-15', modified: '2024-06-20', enabled: true, isDefault: true },
  { id: 2, name: '水电费收据模板', type: '收据', paper: 'A5', created: '2024-01-15', modified: '2024-05-10', enabled: true, isDefault: false },
  { id: 3, name: '欠费催缴通知单', type: '催费单', paper: 'A4', created: '2024-02-01', modified: '2024-07-15', enabled: true, isDefault: true },
  { id: 4, name: '月度账单模板', type: '账单', paper: 'A4', created: '2024-02-10', modified: '2024-08-01', enabled: true, isDefault: true },
  { id: 5, name: '年度账单汇总模板', type: '账单', paper: 'A4', created: '2024-03-01', modified: '2024-07-20', enabled: false, isDefault: false },
  { id: 6, name: '租赁合同打印模板', type: '合同', paper: 'A4', created: '2024-03-15', modified: '2024-09-01', enabled: true, isDefault: true },
  { id: 7, name: '临时收据模板', type: '收据', paper: 'A5', created: '2024-04-01', modified: '2024-04-01', enabled: false, isDefault: false },
  { id: 8, name: '催费短信通知单', type: '催费单', paper: 'A5', created: '2024-05-20', modified: '2024-10-01', enabled: true, isDefault: false },
])

const typeMap = { '收据': 'badge-green', '催费单': 'badge-orange', '账单': 'badge-blue', '合同': 'badge-purple' }

const totalPages = computed(() => Math.ceil(templates.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize
  return templates.value.slice(s, s + pageSize)
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">打印模板管理</h1>
      <p class="page-subtitle">管理各类打印模板的配置与使用</p>
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
            <tr><th>模板名称</th><th>模板类型</th><th>纸张大小</th><th>创建时间</th><th>修改时间</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-medium">{{ row.name }}<span v-if="row.isDefault" class="badge badge-blue" style="margin-left:6px;font-size:11px">默认</span></td>
              <td><span class="badge" :class="typeMap[row.type]">{{ row.type }}</span></td>
              <td>{{ row.paper }}</td>
              <td>{{ row.created }}</td>
              <td>{{ row.modified }}</td>
              <td><span class="badge" :class="row.enabled ? 'badge-green' : 'badge-gray'">{{ row.enabled ? '启用' : '停用' }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm">预览</button>
                  <button class="btn btn-text btn-sm">复制</button>
                  <button v-if="!row.isDefault" class="btn btn-text btn-sm">设为默认</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ templates.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
