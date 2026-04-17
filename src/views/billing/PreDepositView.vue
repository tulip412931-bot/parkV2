<script setup>
import { ref, computed } from 'vue'

// Filters
const quickSearch = ref('')
const depositType = ref('')
const hideZeroBalance = ref(true)
const filtersExpanded = ref(false)

// Project selector
const currentProject = ref('坤煌（长寿）食品产业园')

// Demo data
const allRows = ref([
  { id: 1, name: '餐餐儿（重庆）食品科技有限公司', phone: '13812345678', nature: '企业', entity: '重庆美灿企业管理有限公司', account: 5680.00, building: 'A栋', code: 'KHCS03', contract: '物业服务合同-2026', type: '物业预存款', offsetItems: '物业费', lastCharge: '2026/03/15', operate: true },
  { id: 2, name: '重庆鼎盛源食品有限公司', phone: '13987654321', nature: '企业', entity: '重庆美灿企业管理有限公司', account: 12300.00, building: 'A栋', code: 'KHCS05', contract: '物业服务合同-2026', type: '物业预存款', offsetItems: '物业费,水费', lastCharge: '2026/02/20', operate: true },
  { id: 3, name: '张伟', phone: '15023456789', nature: '个人', entity: '重庆美灿企业管理有限公司', account: 0, building: 'B栋', code: 'KHCS08', contract: '租赁合同-2025', type: '租金预存款', offsetItems: '租金', lastCharge: '2025/12/01', operate: true },
  { id: 4, name: '重庆九鼎商贸有限公司', phone: '18623456789', nature: '企业', entity: '重庆美灿企业管理有限公司', account: 3450.50, building: 'A栋', code: 'KHCS11', contract: '物业服务合同-2026', type: '物业预存款', offsetItems: '物业费', lastCharge: '2026/01/10', operate: true },
  { id: 5, name: '李娜', phone: '13523456789', nature: '个人', entity: '重庆美灿企业管理有限公司', account: 0, building: 'C栋', code: 'KHCS15', contract: '-', type: '物业预存款', offsetItems: '物业费', lastCharge: '-', operate: true },
  { id: 6, name: '重庆渝味餐饮管理有限公司', phone: '17823456789', nature: '企业', entity: '重庆美灿企业管理有限公司', account: 8920.00, building: 'B栋', code: 'KHCS07', contract: '物业服务合同-2026', type: '水电预存款', offsetItems: '水费,电费', lastCharge: '2026/03/28', operate: true },
  { id: 7, name: '王强', phone: '15123456789', nature: '个人', entity: '重庆美灿企业管理有限公司', account: 1500.00, building: 'A栋', code: 'KHCS02', contract: '租赁合同-2026', type: '租金预存款', offsetItems: '租金', lastCharge: '2026/04/01', operate: true },
  { id: 8, name: '重庆川渝冷链物流有限公司', phone: '13612345678', nature: '企业', entity: '重庆美灿企业管理有限公司', account: 0, building: 'C栋', code: 'KHCS20', contract: '物业服务合同-2025', type: '物业预存款', offsetItems: '物业费', lastCharge: '2025/08/15', operate: true },
])

// Filtered rows
const filteredRows = computed(() => {
  let list = allRows.value
  if (quickSearch.value) {
    const q = quickSearch.value.toLowerCase()
    list = list.filter(r => r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.code.toLowerCase().includes(q))
  }
  if (depositType.value) {
    list = list.filter(r => r.type === depositType.value)
  }
  if (hideZeroBalance.value) {
    list = list.filter(r => r.account > 0)
  }
  return list
})

// Pagination
const currentPage = ref(1)
const pageSize = 20
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)))
const pagedRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

// Show import/export dropdown
const showExportMenu = ref(false)

function fmt(n) {
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function handleReset() {
  quickSearch.value = ''
  depositType.value = ''
  hideZeroBalance.value = true
  currentPage.value = 1
}

function handleSearch() {
  currentPage.value = 1
}
</script>

<template>
  <div class="predeposit-page">
    <!-- Page Header -->
    <div class="page-top-bar">
      <div class="page-top-left">
        <h2 class="page-title">预存费</h2>
        <div class="project-selector">
          <span class="project-icon">🏢</span>
          <span>{{ currentProject }}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <div class="page-top-right">
        <button class="icon-btn" title="全屏">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
        <button class="icon-btn" title="刷新">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
        <button class="icon-btn" title="全屏">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-label" style="color:#52c41a">快速搜索：</label>
          <input v-model="quickSearch" class="filter-input" placeholder="客户名称/手机号/资源代码" />
        </div>
        <div class="filter-item">
          <label class="filter-label">预存款类型：</label>
          <select v-model="depositType" class="filter-select">
            <option value="">选择预存款类型</option>
            <option value="物业预存款">物业预存款</option>
            <option value="租金预存款">租金预存款</option>
            <option value="水电预存款">水电预存款</option>
          </select>
        </div>
        <div class="filter-item">
          <label class="filter-checkbox">
            <input type="checkbox" v-model="hideZeroBalance" />
            <span class="checkmark"></span>
            隐藏当前账户余额为0的数据
          </label>
        </div>
        <div class="filter-actions">
          <button class="btn-reset" @click="handleReset">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            重 置
          </button>
          <button class="btn-query" @click="handleSearch">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            查询
          </button>
          <button class="btn-expand" @click="filtersExpanded = !filtersExpanded">
            展开
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ transform: filtersExpanded ? 'rotate(180deg)' : '' }"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div class="action-left">
        <button class="btn-primary-action">预存充值</button>
        <button class="btn-outlined-action">批量冲抵</button>
        <div class="dropdown-wrapper">
          <button class="btn-outlined-action" @click="showExportMenu = !showExportMenu">
            导入/导出
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div v-if="showExportMenu" class="dropdown-menu">
            <div class="dropdown-item">导入预存费</div>
            <div class="dropdown-item">导出预存费</div>
            <div class="dropdown-item">下载导入模板</div>
          </div>
        </div>
      </div>
      <div class="action-right">
        <button class="toolbar-icon" title="列设置">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
        <button class="toolbar-icon" title="密度">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <button class="toolbar-icon" title="设置">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-name">客户名称</th>
            <th class="col-phone">手机号</th>
            <th class="col-nature">客户性质</th>
            <th class="col-entity">会计主体</th>
            <th class="col-account">预存款账户</th>
            <th class="col-building">楼宇</th>
            <th class="col-code">资源代码</th>
            <th class="col-contract">合同名称</th>
            <th class="col-type">预存款类型</th>
            <th class="col-offset">可冲抵项目</th>
            <th class="col-last">最近充值</th>
            <th class="col-operate">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pagedRows.length === 0">
            <td colspan="12" class="empty-cell">
              <div class="empty-state">
                <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
                  <rect x="8" y="8" width="48" height="32" rx="2" stroke="#d9d9d9" stroke-width="1.5" fill="#fafafa"/>
                  <path d="M20 28h24M20 22h24M20 16h12" stroke="#e8e8e8" stroke-width="1.5" stroke-linecap="round"/>
                  <rect x="24" y="0" width="16" height="10" rx="1" stroke="#d9d9d9" stroke-width="1.5" fill="#fff"/>
                </svg>
                <span>暂无数据</span>
              </div>
            </td>
          </tr>
          <tr v-for="row in pagedRows" :key="row.id">
            <td class="col-name cell-ellipsis">{{ row.name }}</td>
            <td class="col-phone">{{ row.phone }}</td>
            <td class="col-nature">{{ row.nature }}</td>
            <td class="col-entity cell-ellipsis">{{ row.entity }}</td>
            <td class="col-account">
              <span :class="row.account > 0 ? 'amount-positive' : 'amount-zero'">{{ fmt(row.account) }}</span>
            </td>
            <td class="col-building">{{ row.building }}</td>
            <td class="col-code">{{ row.code }}</td>
            <td class="col-contract cell-ellipsis">{{ row.contract }}</td>
            <td class="col-type">{{ row.type }}</td>
            <td class="col-offset cell-ellipsis">{{ row.offsetItems }}</td>
            <td class="col-last">{{ row.lastCharge }}</td>
            <td class="col-operate">
              <button class="link-btn">充值</button>
              <span class="link-divider">|</span>
              <button class="link-btn">明细</button>
              <span class="link-divider">|</span>
              <button class="link-btn">冲抵</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredRows.length > 0" class="pagination-bar">
      <span class="pagination-total">共 {{ filteredRows.length }} 条</span>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
        <button v-for="p in totalPages" :key="p" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
        <button class="page-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.predeposit-page {
  background: #fff;
  border-radius: 4px;
  min-height: calc(100vh - 108px);
  display: flex;
  flex-direction: column;
}

/* === Page Top Bar === */
.page-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.page-top-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.project-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  background: #fff;
}

.project-selector:hover {
  border-color: #52c41a;
}

.project-icon {
  font-size: 14px;
}

.page-top-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
  border-radius: 4px;
}

.icon-btn:hover {
  background: #f5f5f5;
  color: #666;
}

/* === Filter Section === */
.filter-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-label {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
}

.filter-input {
  width: 220px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input::placeholder {
  color: #bfbfbf;
}

.filter-input:focus {
  border-color: #52c41a;
  box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.1);
}

.filter-select {
  width: 180px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
  background: #fff;
  cursor: pointer;
  appearance: auto;
}

.filter-select:focus {
  border-color: #52c41a;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  user-select: none;
}

.filter-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #52c41a;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  border-color: #52c41a;
  color: #52c41a;
}

.btn-query {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 20px;
  border: none;
  border-radius: 4px;
  background: #52c41a;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-query:hover {
  background: #73d13d;
}

.btn-expand {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border: none;
  background: transparent;
  color: #1890ff;
  font-size: 13px;
  cursor: pointer;
}

.btn-expand:hover {
  color: #40a9ff;
}

/* === Action Bar === */
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.action-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary-action {
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 4px;
  background: #52c41a;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary-action:hover {
  background: #73d13d;
}

.btn-outlined-action {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outlined-action:hover {
  border-color: #52c41a;
  color: #52c41a;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 140px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
  z-index: 10;
  padding: 4px 0;
}

.dropdown-item {
  padding: 8px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.action-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
}

.toolbar-icon:hover {
  background: #f5f5f5;
}

/* === Data Table === */
.table-wrapper {
  flex: 1;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table thead {
  background: #fafafa;
}

.data-table th {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 16px;
  font-size: 13px;
  color: #555;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

/* Column widths */
.col-name { width: 180px; }
.col-phone { width: 120px; }
.col-nature { width: 80px; }
.col-entity { width: 180px; }
.col-account { width: 110px; }
.col-building { width: 70px; }
.col-code { width: 90px; }
.col-contract { width: 150px; }
.col-type { width: 110px; }
.col-offset { width: 110px; }
.col-last { width: 100px; }
.col-operate { width: 130px; }

.cell-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
}

.amount-positive {
  color: #52c41a;
  font-weight: 500;
}

.amount-zero {
  color: #999;
}

/* Empty state */
.empty-cell {
  text-align: center;
  padding: 60px 0 !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #bfbfbf;
  font-size: 13px;
}

/* Action links */
.link-btn {
  background: none;
  border: none;
  color: #1890ff;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.link-btn:hover {
  color: #40a9ff;
}

.link-divider {
  color: #e8e8e8;
  margin: 0 4px;
}

/* === Pagination === */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
}

.pagination-total {
  font-size: 13px;
  color: #999;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0 8px;
}

.page-btn:hover:not(:disabled) {
  border-color: #52c41a;
  color: #52c41a;
}

.page-btn.active {
  background: #52c41a;
  border-color: #52c41a;
  color: #fff;
}

.page-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}
</style>
