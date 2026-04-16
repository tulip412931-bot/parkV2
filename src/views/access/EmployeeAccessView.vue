<script setup>
import { ref, computed } from 'vue'
import { COMPANIES_IN_PARK, DEPARTMENTS, generateEmployees } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const allEmployees = ref(generateEmployees(80))

const activeTab = ref('全部')
const tabs = ['全部', '待审核', '已通过', '已注销']

const filterCompany = ref('')
const filterDept = ref('')
const filterStatus = ref('')
const searchText = ref('')

const page = ref(1)
const pageSize = 15

const tabStatusMap = { '全部': null, '待审核': '审核中', '已通过': '正常', '已注销': '已注销' }

function doSearch() {
  page.value = 1
}

const filteredEmployees = computed(() => {
  let list = allEmployees.value
  const tabStatus = tabStatusMap[activeTab.value]
  if (tabStatus) list = list.filter(e => e.status === tabStatus)
  if (filterCompany.value) list = list.filter(e => e.company === filterCompany.value)
  if (filterDept.value) list = list.filter(e => e.department === filterDept.value)
  if (filterStatus.value) list = list.filter(e => e.status === filterStatus.value)
  if (searchText.value.trim()) {
    const q = searchText.value.trim().toLowerCase()
    list = list.filter(e => e.name.includes(q) || e.phone.includes(q) || e.cardNo.toLowerCase().includes(q))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize)))
const pagedEmployees = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredEmployees.value.slice(start, start + pageSize)
})

function tabCount(tab) {
  const s = tabStatusMap[tab]
  if (!s) return allEmployees.value.length
  return allEmployees.value.filter(e => e.status === s).length
}

function switchTab(tab) {
  activeTab.value = tab
  page.value = 1
}

function statusBadge(status) {
  if (status === '正常') return 'badge badge-green'
  if (status === '审核中') return 'badge badge-orange'
  if (status === '已注销') return 'badge badge-gray'
  return 'badge badge-gray'
}

function approveEmployee(emp) {
  emp.status = '正常'
  showToast(`员工「${emp.name}」审核通过`, 'success')
}

function cancelEmployee(emp) {
  emp.status = '已注销'
  showToast(`员工「${emp.name}」已注销`, 'warning')
}

const avatarColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#4f46e5', '#be185d']
function avatarColor(name) {
  let code = 0
  for (let i = 0; i < name.length; i++) code += name.charCodeAt(i)
  return avatarColors[code % avatarColors.length]
}

function visiblePages() {
  const total = totalPages.value
  const cur = page.value
  const pages = []
  const start = Math.max(1, cur - 2)
  const end = Math.min(total, cur + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
}

const showAddModal = ref(false)
</script>

<template>
  <div class="page-view">
    <div class="page-header flex justify-between items-center">
      <div>
        <h2 class="page-title">员工通行管理</h2>
        <p class="page-subtitle">管理园区企业员工的门禁通行权限</p>
      </div>
      <button class="btn btn-primary" @click="showAddModal = true">+ 添加员工</button>
    </div>

    <div class="card mb-3">
      <div class="filter-bar">
        <select v-model="filterCompany" class="form-select">
          <option value="">全部企业</option>
          <option v-for="c in COMPANIES_IN_PARK" :key="c.name" :value="c.name">{{ c.name }}</option>
        </select>
        <select v-model="filterDept" class="form-select">
          <option value="">全部部门</option>
          <option v-for="d in DEPARTMENTS" :key="d" :value="d">{{ d }}</option>
        </select>
        <select v-model="filterStatus" class="form-select">
          <option value="">全部状态</option>
          <option value="正常">正常</option>
          <option value="审核中">审核中</option>
          <option value="已注销">已注销</option>
        </select>
        <input v-model="searchText" class="form-input" placeholder="搜索姓名/手机号/卡号" style="min-width:200px" @keyup.enter="doSearch" />
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>

      <div class="tabs">
        <div
          v-for="tab in tabs"
          :key="tab"
          class="tab-item"
          :class="{ active: activeTab === tab }"
          @click="switchTab(tab)"
        >
          {{ tab }}<span class="tab-count">{{ tabCount(tab) }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>头像</th>
              <th>姓名</th>
              <th>所属企业</th>
              <th>部门</th>
              <th>工号</th>
              <th>手机号</th>
              <th>门禁卡号</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="emp in pagedEmployees" :key="emp.id">
              <td>
                <div class="avatar-circle" :style="{ background: avatarColor(emp.name) }">{{ emp.photo }}</div>
              </td>
              <td class="font-medium">{{ emp.name }}</td>
              <td class="truncate" style="max-width:180px">{{ emp.company }}</td>
              <td>{{ emp.department }}</td>
              <td class="font-num">EMP{{ String(emp.id).padStart(4, '0') }}</td>
              <td class="font-num">{{ emp.phone }}</td>
              <td class="font-num">{{ emp.cardNo }}</td>
              <td><span :class="statusBadge(emp.status)">{{ emp.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button v-if="emp.status === '审核中'" class="btn btn-text btn-sm" @click="approveEmployee(emp)">审核通过</button>
                  <button v-if="emp.status !== '已注销'" class="btn btn-text btn-sm">编辑</button>
                  <button v-if="emp.status === '正常'" class="btn btn-text btn-sm danger" @click="cancelEmployee(emp)">注销</button>
                </div>
              </td>
            </tr>
            <tr v-if="pagedEmployees.length === 0">
              <td colspan="9" class="table-empty">暂无匹配的员工数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ filteredEmployees.length }} 条记录，第 {{ page }} / {{ totalPages }} 页</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="page <= 1" @click="page--">&lt;</button>
          <button
            v-for="p in visiblePages()"
            :key="p"
            class="pagination-btn"
            :class="{ active: p === page }"
            @click="page = p"
          >{{ p }}</button>
          <button class="pagination-btn" :disabled="page >= totalPages" @click="page++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.avatar-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
