<script setup>
import { ref, computed } from 'vue'

const area = ref('全部')
const buildingFilter = ref('全部')
const statusFilter = ref('全部')
const feeTypeFilter = ref('全部')
const dateFrom = ref('2026-04-01')
const dateTo = ref('2026-04-30')
const currentPage = ref(1)
const pageSize = 10

const statusList = ['全部', '待收', '已收', '部分收取', '已减免']
const feeTypes = ['全部', '物业费', '租金', '水费', '电费', '停车费', '公摊水费', '公摊电费']
const statusColors = { '待收': 'badge-orange', '已收': 'badge-green', '部分收取': 'badge-blue', '已减免': 'badge-gray' }

const names = ['重庆星辰科技有限公司','四川云图数据有限公司','重庆智远物联有限公司','成都蓝海软件有限公司','重庆鼎新能源科技有限公司']
const rooms = ['03-14-01','03-14-02','03-14-03','4-1-01','4-1-02','物业-01','03-14-04','03-14-05','4-1-03','4-1-04']
const fees = ['物业费','租金','水费','电费','停车费','公摊水费','公摊电费']
const statuses = ['待收','已收','部分收取','已减免']

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
const r = rng(42)

const bills = Array.from({ length: 30 }, (_, i) => {
  const due = Math.round((r() * 20000 + 500) * 100) / 100
  const st = statuses[Math.floor(r() * 4)]
  const paid = st === '已收' ? due : st === '部分收取' ? Math.round(due * r() * 100) / 100 : st === '已减免' ? due : 0
  return {
    id: i + 1,
    billNo: 'BILL' + String(20260401001 + i),
    room: rooms[Math.floor(r() * rooms.length)],
    customer: names[Math.floor(r() * names.length)],
    feeType: fees[Math.floor(r() * fees.length)],
    cycle: '2026-04-01 ~ 2026-04-30',
    due, paid, arrears: Math.round((due - paid) * 100) / 100,
    status: st
  }
})

const filtered = computed(() => {
  return bills.filter(b => {
    if (statusFilter.value !== '全部' && b.status !== statusFilter.value) return false
    if (feeTypeFilter.value !== '全部' && b.feeType !== feeTypeFilter.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedBills = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
</script>

<template>
  <div class="bill-manage">
    <div class="page-header">
      <h1 class="page-title">账单管理</h1>
      <p class="page-subtitle">管理和跟踪所有收费账单</p>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <select v-model="area" class="form-select"><option>全部</option><option>坤煌（长寿）食品产业园</option></select>
      <select v-model="buildingFilter" class="form-select"><option>全部</option><option>03-14</option><option>4-1</option><option>物业用房</option></select>
      <select v-model="statusFilter" class="form-select"><option v-for="s in statusList" :key="s">{{ s }}</option></select>
      <select v-model="feeTypeFilter" class="form-select"><option v-for="f in feeTypes" :key="f">{{ f }}</option></select>
      <input v-model="dateFrom" type="date" class="form-input" style="width:140px;" />
      <span class="text-gray">~</span>
      <input v-model="dateTo" type="date" class="form-input" style="width:140px;" />
      <div class="filter-actions">
        <button class="btn btn-primary">生成账单</button>
        <button class="btn btn-default">批量收费</button>
        <button class="btn btn-default">导出Excel</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>账单编号</th><th>房号</th><th>客户名称</th><th>收费项目</th>
              <th>账单周期</th><th>应收金额</th><th>实收金额</th><th>欠费金额</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in pagedBills" :key="b.id">
              <td class="font-num">{{ b.billNo }}</td>
              <td class="font-medium">{{ b.room }}</td>
              <td class="truncate" style="max-width:160px;">{{ b.customer }}</td>
              <td>{{ b.feeType }}</td>
              <td class="text-gray text-sm">{{ b.cycle }}</td>
              <td class="font-num">¥{{ fmt(b.due) }}</td>
              <td class="font-num text-success">¥{{ fmt(b.paid) }}</td>
              <td class="font-num" :class="b.arrears > 0 ? 'text-danger' : ''">¥{{ fmt(b.arrears) }}</td>
              <td><span class="badge" :class="statusColors[b.status]">{{ b.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button v-if="b.status === '待收' || b.status === '部分收取'" class="btn btn-text btn-sm">收费</button>
                  <button class="btn btn-text btn-sm">查看</button>
                  <button class="btn btn-text btn-sm">调整</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: currentPage === p }" @click="setPage(p)">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bill-manage { max-width: 1400px; }
</style>
