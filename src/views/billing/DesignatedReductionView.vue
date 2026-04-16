<script setup>
import { ref, computed } from 'vue'

const dateFrom = ref('2026-04-01')
const dateTo = ref('2026-04-16')
const feeType = ref('全部')
const area = ref('全部')
const currentPage = ref(1)
const pageSize = 10

const feeTypes = ['全部', '物业费', '租金', '水费', '电费', '停车费']
const areas = ['全部', 'A区', 'B区', 'C区']
const rooms = ['03-14-01','03-14-02','03-14-03','03-14-04','03-14-05','4-1-01','4-1-02','4-1-03','物业-01','物业-02']
const names = ['重庆星辰科技有限公司','四川云图数据有限公司','重庆智远物联有限公司','成都蓝海软件有限公司','重庆鼎新能源科技有限公司','贵州云算大数据有限公司']
const reasons = ['困难企业帮扶', '长期租户优惠', '政策性减免', '合同约定减免', '管理层特批', '招商引资优惠']
const approvers = ['王总监', '张经理', '李主管', '陈总']

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
const r = rng(502)
function pad(n) { return String(n).padStart(2, '0') }

const records = Array.from({ length: 20 }, (_, i) => {
  const day = Math.floor(r() * 16) + 1, hour = Math.floor(r() * 10) + 8, min = Math.floor(r() * 60)
  return {
    id: i + 1, room: rooms[Math.floor(r() * rooms.length)],
    customer: names[Math.floor(r() * names.length)],
    feeType: feeTypes.slice(1)[Math.floor(r() * (feeTypes.length - 1))],
    amount: Math.round((r() * 5000 + 100) * 100) / 100,
    reason: reasons[Math.floor(r() * reasons.length)],
    approver: approvers[Math.floor(r() * approvers.length)],
    time: `2026-04-${pad(day)} ${pad(hour)}:${pad(min)}:00`
  }
}).sort((a, b) => b.time.localeCompare(a.time))

const filtered = computed(() => {
  return records.filter(rec => {
    if (feeType.value !== '全部' && rec.feeType !== feeType.value) return false
    return true
  })
})

const totalAmount = computed(() => filtered.value.reduce((s, r) => s + r.amount, 0))
const totalCount = computed(() => filtered.value.length)
const monthAmount = computed(() => filtered.value.filter(r => r.time.startsWith('2026-04')).reduce((s, r) => s + r.amount, 0))
const maxAmount = computed(() => filtered.value.length ? Math.max(...filtered.value.map(r => r.amount)) : 0)
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const summaryCards = computed(() => [
  { label: '减免总金额', value: `¥${fmt(totalAmount.value)}`, color: '#2563eb' },
  { label: '减免笔数', value: String(totalCount.value), color: '#7c3aed' },
  { label: '本月减免', value: `¥${fmt(monthAmount.value)}`, color: '#059669' },
  { label: '最大单笔减免', value: `¥${fmt(maxAmount.value)}`, color: '#d97706' }
])

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
</script>

<template>
  <div class="designated-reduction">
    <div class="page-header">
      <h1 class="page-title">指定减免金额统计</h1>
      <p class="page-subtitle">统计和查询所有指定减免记录</p>
    </div>

    <div class="filter-bar">
      <input v-model="dateFrom" type="date" class="form-input" style="width:140px;" />
      <span class="text-gray">~</span>
      <input v-model="dateTo" type="date" class="form-input" style="width:140px;" />
      <select v-model="feeType" class="form-select"><option v-for="f in feeTypes" :key="f">{{ f }}</option></select>
      <select v-model="area" class="form-select"><option v-for="a in areas" :key="a">{{ a }}</option></select>
    </div>

    <div class="stat-cards">
      <div v-for="s in summaryCards" :key="s.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: s.color + '15', color: s.color }">
          <span style="font-size:20px;font-weight:700;">{{ s.label.charAt(0) }}</span>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ s.label }}</div>
          <div class="stat-card-value" style="font-size:20px;">{{ s.value }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>房号</th><th>客户名称</th><th>收费项目</th><th>减免金额</th><th>减免原因</th><th>审批人</th><th>减免时间</th></tr>
          </thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-medium">{{ rec.room }}</td>
              <td class="truncate" style="max-width:160px;">{{ rec.customer }}</td>
              <td>{{ rec.feeType }}</td>
              <td class="font-num text-danger">-¥{{ fmt(rec.amount) }}</td>
              <td>{{ rec.reason }}</td>
              <td>{{ rec.approver }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

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
.designated-reduction { max-width: 1400px; }
</style>
