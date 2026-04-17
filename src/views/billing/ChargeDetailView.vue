<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* --- reactive state --- */
const activeTab = ref('arrears')
const selectedRows = ref([])

/* --- demo data --- */
const roomInfo = {
  code: 'KHCS03',
  area: '2559.03',
  owner: '餐餐儿（重庆）食品科技有限公司',
  ownerPhone: '',
  tenant: '',
  tenantPhone: '',
  status: '入住',
  ownerArrears: '26255.70',
  ownerDeposit: '0.00',
  tenantArrears: '0.00',
  tenantDeposit: '0.00'
}

const billRows = Array.from({ length: 10 }, (_, i) => {
  const month = 12 - i
  const mm = String(month).padStart(2, '0')
  const nextMonth = month === 12 ? 1 : month + 1
  const nextMM = String(nextMonth).padStart(2, '0')
  const nextYear = month === 12 ? 2027 : 2026
  return {
    id: i,
    entity: '重庆美灿企业管理有限公司',
    payer: '餐餐儿（重庆）食品科技有限公司',
    resourceCode: 'KHCS03',
    dueMonth: `2026/${mm}`,
    dueDate: `2026/${mm}/01`,
    feeItem: '物业费',
    arrears: 2917.30,
    paid: 0.00,
    receivable: 2917.30,
    feeStart: `2026/${mm}/01`,
    feeEnd: `${nextYear}/${nextMM}/01`,
    standard: '物业费1.2',
    unitPrice: '1.2 元/m²/月'
  }
}).filter(r => {
  const m = parseInt(r.dueMonth.split('/')[1])
  return m >= 4 && m <= 12
})

/* --- filter placeholders --- */
const filters = ref({
  contract: '',
  entity: '',
  feeItem: '',
  dueMonth: '',
  feeStartDate: '',
  payer: ''
})
const groupMode = ref(false)

/* --- selection logic --- */
const allSelected = computed(() => billRows.length > 0 && selectedRows.value.length === billRows.length)

function toggleAll() {
  if (allSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = billRows.map(r => r.id)
  }
}

function toggleRow(id) {
  const idx = selectedRows.value.indexOf(id)
  if (idx >= 0) selectedRows.value.splice(idx, 1)
  else selectedRows.value.push(id)
}

function isSelected(id) {
  return selectedRows.value.includes(id)
}

const selectedCount = computed(() => selectedRows.value.length)
const selectedTotal = computed(() => {
  return selectedRows.value.reduce((sum, id) => {
    const row = billRows.find(r => r.id === id)
    return sum + (row ? row.arrears : 0)
  }, 0)
})

function fmt(n) {
  return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="charge-detail-page">
    <!-- Section 1: Top Header Bar -->
    <div class="top-header">
      <div class="header-main">
        <div class="header-left">
          <span class="header-label">收费对象</span>
          <span class="room-info-tag">房间: 坤煌（长寿）食品产业园-03-1/层-KHCS03（餐餐儿（重庆）食品科技有限公司）</span>
        </div>
        <button class="btn-back" @click="goBack">返回</button>
      </div>
      <div class="header-sub">
        <span class="switch-label">快速切换收费对象</span>
        <span class="current-owner-tag">当前业主：餐餐儿（重...</span>
      </div>
    </div>

    <!-- Section 2: Room Info Panel -->
    <div class="room-info-card">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">房间代码:</span>
          <span class="info-value link-blue">{{ roomInfo.code }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">建筑面积:</span>
          <span class="info-value">{{ roomInfo.area }}m²</span>
        </div>
        <div class="info-item info-item-wide">
          <span class="info-label">当前业主:</span>
          <span class="info-value text-green text-ellipsis" :title="roomInfo.owner">{{ roomInfo.owner }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">联系电话:</span>
          <span class="info-value text-muted">{{ roomInfo.ownerPhone || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">当前租户:</span>
          <span class="info-value text-muted">{{ roomInfo.tenant || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">联系电话:</span>
          <span class="info-value text-muted">{{ roomInfo.tenantPhone || '-' }}</span>
        </div>
      </div>
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">房间状态:</span>
          <span class="info-value">{{ roomInfo.status }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">欠款:</span>
          <span class="info-value text-red">¥{{ roomInfo.ownerArrears }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">欠款:</span>
          <span class="info-value text-red">¥{{ roomInfo.ownerArrears }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">预存款余额:</span>
          <span class="info-value">{{ roomInfo.ownerDeposit }}</span>
          <button class="btn-recharge">充值</button>
        </div>
        <div class="info-item">
          <span class="info-label">欠款:</span>
          <span class="info-value">{{ roomInfo.tenantArrears }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">预存款余额:</span>
          <span class="info-value">{{ roomInfo.tenantDeposit }}</span>
        </div>
      </div>
    </div>

    <!-- Section 3: Tab Bar -->
    <div class="tab-bar">
      <div class="tab-item" :class="{ active: activeTab === 'arrears' }" @click="activeTab = 'arrears'">欠费账单</div>
      <div class="tab-item" :class="{ active: activeTab === 'check' }" @click="activeTab = 'check'">账单异常检查</div>
    </div>

    <!-- Section 4: Filter Bar -->
    <div class="filter-bar">
      <div class="filter-row">
        <div class="filter-item">
          <select v-model="filters.contract" class="filter-select"><option value="">合同</option></select>
        </div>
        <div class="filter-item">
          <select v-model="filters.entity" class="filter-select"><option value="">会计主体</option></select>
        </div>
        <div class="filter-item">
          <select v-model="filters.feeItem" class="filter-select"><option value="">收费项目</option></select>
        </div>
        <div class="filter-item">
          <select v-model="filters.dueMonth" class="filter-select"><option value="">应收月份</option></select>
        </div>
        <div class="filter-item">
          <select v-model="filters.feeStartDate" class="filter-select"><option value="">费用开始日期</option></select>
        </div>
        <div class="filter-item">
          <select v-model="filters.payer" class="filter-select"><option value="">费用承担人</option></select>
        </div>
        <div class="filter-right">
          <label class="group-toggle">
            <input type="checkbox" v-model="groupMode" />
            <span>三分组</span>
          </label>
          <button class="btn-icon" title="设置">&#9881;</button>
        </div>
      </div>
    </div>

    <!-- Section 5: Data Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th class="col-checkbox"><input type="checkbox" :checked="allSelected" @change="toggleAll" /></th>
            <th>会计主体</th>
            <th>费用承担人</th>
            <th>资源代码</th>
            <th class="col-sortable">应收月份 &#8597;</th>
            <th>应收日期</th>
            <th>收费项目</th>
            <th class="col-num">欠款</th>
            <th class="col-num">已收</th>
            <th class="col-num">实际应收</th>
            <th>费用开始~费用结束</th>
            <th>收费标准</th>
            <th>单价</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in billRows" :key="row.id" :class="{ 'row-selected': isSelected(row.id) }">
            <td class="col-checkbox"><input type="checkbox" :checked="isSelected(row.id)" @change="toggleRow(row.id)" /></td>
            <td class="text-ellipsis" :title="row.entity">{{ row.entity }}</td>
            <td class="text-ellipsis" :title="row.payer">{{ row.payer }}</td>
            <td>{{ row.resourceCode }}</td>
            <td>{{ row.dueMonth }}</td>
            <td>{{ row.dueDate }}</td>
            <td>{{ row.feeItem }}</td>
            <td class="col-num text-red">{{ fmt(row.arrears) }}</td>
            <td class="col-num">{{ fmt(row.paid) }}</td>
            <td class="col-num">{{ fmt(row.receivable) }}</td>
            <td class="text-nowrap">{{ row.feeStart }}~{{ row.feeEnd }}</td>
            <td>{{ row.standard }}</td>
            <td>{{ row.unitPrice }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 6: Bottom Action Bar -->
    <div class="bottom-bar">
      <div class="bottom-left">
        <label class="select-all-label">
          <input type="checkbox" :checked="allSelected" @change="toggleAll" />
          <span>全选</span>
        </label>
        <span class="selection-info">已选择 <strong>{{ selectedCount }}</strong>个账单，欠款: <strong class="text-red">¥{{ fmt(selectedTotal) }}</strong></span>
      </div>
      <div class="bottom-right">
        <button class="btn-outlined">预收</button>
        <button class="btn-outlined">临时收费</button>
        <button class="btn-outlined">冻结账单</button>
        <button class="btn-outlined">算违约金</button>
        <button class="btn-outlined btn-with-arrow">更多功能 &#9662;</button>
        <button class="btn-outlined btn-with-arrow">费用调整 &#9662;</button>
        <button class="btn-charge">收费</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* === Page Layout === */
.charge-detail-page {
  background: #f1f5f9;
  min-height: 100vh;
  padding-bottom: 72px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

/* === Section 1: Top Header === */
.top-header {
  background: #fff;
  padding: 14px 24px;
  border-bottom: 1px solid #e8e8e8;
}
.header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.header-label {
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}
.room-info-tag {
  display: inline-block;
  background: #f0f5ff;
  border: 1px solid #d6e4ff;
  border-radius: 3px;
  padding: 3px 10px;
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 700px;
}
.btn-back {
  background: #52c41a;
  color: #fff;
  border: none;
  padding: 6px 20px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}
.btn-back:hover {
  background: #49b018;
}
.header-sub {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.switch-label {
  color: #666;
}
.current-owner-tag {
  display: inline-block;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 3px;
  padding: 2px 10px;
  font-size: 12px;
  color: #52c41a;
}

/* === Section 2: Room Info Panel === */
.room-info-card {
  background: #fff;
  margin: 16px 24px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-left: 3px solid #52c41a;
  padding: 16px 20px;
}
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 0;
  padding: 6px 0;
}
.info-row + .info-row {
  border-top: 1px solid #f0f0f0;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1 1 16%;
  padding: 4px 8px;
  font-size: 13px;
}
.info-item-wide {
  flex: 1 1 24%;
}
.info-label {
  color: #888;
  flex-shrink: 0;
  white-space: nowrap;
}
.info-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.link-blue {
  color: #1890ff;
  cursor: pointer;
}
.link-blue:hover {
  text-decoration: underline;
}
.text-green {
  color: #52c41a;
}
.text-red {
  color: #f5222d;
}
.text-muted {
  color: #bbb;
}
.btn-recharge {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 3px;
  padding: 1px 10px;
  font-size: 12px;
  cursor: pointer;
  color: #333;
  margin-left: 4px;
  transition: border-color 0.2s;
}
.btn-recharge:hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* === Section 3: Tab Bar === */
.tab-bar {
  display: flex;
  gap: 0;
  background: #fff;
  margin: 0 24px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #e8e8e8;
}
.tab-item {
  padding: 12px 24px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  user-select: none;
}
.tab-item:hover {
  color: #1890ff;
}
.tab-item.active {
  color: #1890ff;
  font-weight: 500;
  border-bottom-color: #1890ff;
}

/* === Section 4: Filter Bar === */
.filter-bar {
  background: #fff;
  margin: 0 24px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.filter-item {
  flex-shrink: 0;
}
.filter-select {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 5px 28px 5px 10px;
  font-size: 12px;
  color: #555;
  background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 8px center;
  appearance: none;
  cursor: pointer;
  min-width: 100px;
  transition: border-color 0.2s;
}
.filter-select:hover, .filter-select:focus {
  border-color: #1890ff;
  outline: none;
}
.filter-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.group-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  user-select: none;
}
.group-toggle input {
  cursor: pointer;
}
.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 2px;
  transition: color 0.2s;
}
.btn-icon:hover {
  color: #1890ff;
}

/* === Section 5: Data Table === */
.table-wrapper {
  background: #fff;
  margin: 0 24px;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  white-space: nowrap;
}
.data-table thead th {
  background: #fafafa;
  padding: 10px 12px;
  text-align: left;
  font-weight: 500;
  color: #666;
  border-bottom: 1px solid #e8e8e8;
  font-size: 13px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.data-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
}
.data-table tbody tr:nth-child(even) {
  background: #fafafa;
}
.data-table tbody tr:hover {
  background: #e6f7ff;
}
.data-table tbody tr.row-selected {
  background: #f0f5ff;
}
.data-table tbody td {
  padding: 9px 12px;
  color: #333;
  max-width: 180px;
}
.col-checkbox {
  width: 40px;
  text-align: center;
}
.col-checkbox input[type="checkbox"] {
  cursor: pointer;
}
.col-num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.col-sortable {
  cursor: pointer;
  user-select: none;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.text-nowrap {
  white-space: nowrap;
}

/* === Section 6: Bottom Action Bar === */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
}
.bottom-left {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}
.select-all-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}
.select-all-label input {
  cursor: pointer;
}
.selection-info {
  color: #666;
}
.selection-info strong {
  color: #333;
}
.bottom-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-outlined {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  white-space: nowrap;
}
.btn-outlined:hover {
  border-color: #1890ff;
  color: #1890ff;
}
.btn-with-arrow {
  padding-right: 12px;
}
.btn-charge {
  background: #52c41a;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 24px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-charge:hover {
  background: #49b018;
}

/* === Responsive === */
@media (max-width: 1200px) {
  .info-item {
    flex: 1 1 33%;
  }
}
@media (max-width: 768px) {
  .top-header, .room-info-card, .tab-bar, .filter-bar, .table-wrapper {
    margin-left: 12px;
    margin-right: 12px;
  }
  .bottom-bar {
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .info-item {
    flex: 1 1 50%;
  }
}
</style>
