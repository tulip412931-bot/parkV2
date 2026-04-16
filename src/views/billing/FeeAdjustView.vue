<script setup>
import { ref, computed } from 'vue'

const dateFrom = ref('2026-04-01')
const dateTo = ref('2026-04-16')
const adjustType = ref('全部')
const feeType = ref('全部')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = 10

const adjustTypes = ['全部', '增加', '减少', '冲正']
const feeTypes = ['全部', '物业费', '租金', '水费', '电费', '停车费', '公摊水费', '公摊电费']
const rooms = ['03-14-01','03-14-02','03-14-03','03-14-04','03-14-05','4-1-01','4-1-02','4-1-03','物业-01','物业-02']
const names = ['重庆星辰科技有限公司','四川云图数据有限公司','重庆智远物联有限公司','成都蓝海软件有限公司','重庆鼎新能源科技有限公司','贵州云算大数据有限公司']
const types = ['增加', '减少', '冲正']
const typeBadge = { '增加': 'badge-blue', '减少': 'badge-orange', '冲正': 'badge-purple' }
const reasons = ['计算错误更正', '优惠政策调整', '合同变更', '系统录入错误', '客户申诉调整', '管理层审批减免']
const ops = ['张丽华', '李明辉', '王秀英', '陈建国', '刘小红']

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
const r = rng(301)
function pad(n) { return String(n).padStart(2, '0') }

const records = Array.from({ length: 20 }, (_, i) => {
  const day = Math.floor(r() * 16) + 1, hour = Math.floor(r() * 10) + 8, min = Math.floor(r() * 60)
  const fee = feeTypes.slice(1)[Math.floor(r() * (feeTypes.length - 1))]
  const orig = Math.round((r() * 8000 + 500) * 100) / 100
  const type = types[Math.floor(r() * types.length)]
  const adj = Math.round((r() * 2000 + 50) * 100) / 100 * (type === '减少' ? -1 : 1)
  return {
    id: i + 1, no: 'ADJ' + String(20260400001 + i),
    time: `2026-04-${pad(day)} ${pad(hour)}:${pad(min)}:00`,
    room: rooms[Math.floor(r() * rooms.length)],
    customer: names[Math.floor(r() * names.length)],
    feeType: fee, origAmount: orig, adjustAmount: adj,
    finalAmount: Math.round((orig + adj) * 100) / 100,
    type, reason: reasons[Math.floor(r() * reasons.length)],
    operator: ops[Math.floor(r() * ops.length)]
  }
}).sort((a, b) => b.time.localeCompare(a.time))

const filtered = computed(() => {
  return records.filter(rec => {
    if (adjustType.value !== '全部' && rec.type !== adjustType.value) return false
    if (feeType.value !== '全部' && rec.feeType !== feeType.value) return false
    if (keyword.value && !rec.customer.includes(keyword.value) && !rec.room.includes(keyword.value) && !rec.no.includes(keyword.value)) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
</script>

<template>
  <div class="fee-adjust">
    <div class="page-header">
      <h1 class="page-title">费用调整记录</h1>
      <p class="page-subtitle">管理和查询所有费用调整明细</p>
    </div>

    <div class="filter-bar">
      <input v-model="dateFrom" type="date" class="form-input" style="width:140px;" />
      <span class="text-gray">~</span>
      <input v-model="dateTo" type="date" class="form-input" style="width:140px;" />
      <select v-model="adjustType" class="form-select"><option v-for="t in adjustTypes" :key="t">{{ t }}</option></select>
      <select v-model="feeType" class="form-select"><option v-for="f in feeTypes" :key="f">{{ f }}</option></select>
      <div class="search-input-wrapper">
        <span class="search-input-icon">&#128269;</span>
        <input v-model="keyword" class="form-input" placeholder="搜索编号/客户/房号" />
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>调整编号</th><th>调整时间</th><th>房号</th><th>客户名称</th><th>收费项目</th><th>原金额</th><th>调整金额</th><th>调整后金额</th><th>调整类型</th><th>调整原因</th><th>操作人</th></tr>
          </thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.no }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
              <td class="font-medium">{{ rec.room }}</td>
              <td class="truncate" style="max-width:140px;">{{ rec.customer }}</td>
              <td>{{ rec.feeType }}</td>
              <td class="font-num">¥{{ fmt(rec.origAmount) }}</td>
              <td class="font-num" :class="rec.adjustAmount >= 0 ? 'text-success' : 'text-danger'">{{ rec.adjustAmount >= 0 ? '+' : '' }}¥{{ fmt(rec.adjustAmount) }}</td>
              <td class="font-num font-medium">¥{{ fmt(rec.finalAmount) }}</td>
              <td><span class="badge" :class="typeBadge[rec.type]">{{ rec.type }}</span></td>
              <td class="truncate" style="max-width:120px;">{{ rec.reason }}</td>
              <td>{{ rec.operator }}</td>
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
.fee-adjust { max-width: 1400px; }
</style>
