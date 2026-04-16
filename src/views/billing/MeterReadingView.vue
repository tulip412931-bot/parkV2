<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('shared')
const currentPage = ref(1)
const pageSize = 10

const rooms = ['03-14-01','03-14-02','03-14-03','03-14-04','03-14-05','4-1-01','4-1-02','4-1-03','物业-01','物业-02']
const names = ['重庆星辰科技有限公司','四川云图数据有限公司','重庆智远物联有限公司','成都蓝海软件有限公司','重庆鼎新能源科技有限公司','贵州云算大数据有限公司']
const meterTypes = ['水表', '电表', '燃气表']
const locations = ['A栋大厅', 'B栋大厅', 'A栋地下室', 'B栋地下室', '园区公共区域', '停车场', '绿化带']

function rng(seed) { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 } }
function pad(n) { return String(n).padStart(2, '0') }

function genShared(seed, count) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const last = Math.round(r() * 5000 * 100) / 100
    const curr = last + Math.round(r() * 500 * 100) / 100
    const usage = Math.round((curr - last) * 100) / 100
    const price = [3.5, 0.85, 2.8][Math.floor(r() * 3)]
    const day = Math.floor(r() * 16) + 1
    return {
      id: i + 1, meterNo: 'GM' + String(1001 + i),
      name: `公摊${meterTypes[Math.floor(r() * meterTypes.length)]}${i + 1}号`,
      location: locations[Math.floor(r() * locations.length)],
      lastReading: last, currentReading: curr, usage, price,
      amount: Math.round(usage * price * 100) / 100,
      time: `2026-04-${pad(day)} 09:00:00`
    }
  })
}

function genHousehold(seed, count) {
  const r = rng(seed)
  return Array.from({ length: count }, (_, i) => {
    const type = meterTypes[Math.floor(r() * meterTypes.length)]
    const last = Math.round(r() * 3000 * 100) / 100
    const curr = last + Math.round(r() * 300 * 100) / 100
    const usage = Math.round((curr - last) * 100) / 100
    const price = type === '水表' ? 3.5 : type === '电表' ? 0.85 : 2.8
    const day = Math.floor(r() * 16) + 1
    return {
      id: i + 1, room: rooms[Math.floor(r() * rooms.length)],
      customer: names[Math.floor(r() * names.length)],
      meterType: type, lastReading: last, currentReading: curr,
      usage, price, amount: Math.round(usage * price * 100) / 100,
      time: `2026-04-${pad(day)} 09:00:00`
    }
  })
}

const sharedRecords = genShared(901, 15)
const householdRecords = genHousehold(902, 15)

const currentRecords = computed(() => activeTab.value === 'shared' ? sharedRecords : householdRecords)
const totalPages = computed(() => Math.ceil(currentRecords.value.length / pageSize) || 1)
const pagedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return currentRecords.value.slice(start, start + pageSize)
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
function setPage(p) { if (p >= 1 && p <= totalPages.value) currentPage.value = p }
function switchTab(tab) { activeTab.value = tab; currentPage.value = 1 }
</script>

<template>
  <div class="meter-reading">
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">仪表抄表</h1>
        <p class="page-subtitle">公摊仪表与分户仪表抄表管理</p>
      </div>
      <div class="btn-group">
        <button class="btn btn-primary">批量录入</button>
        <button class="btn btn-default">导出</button>
      </div>
    </div>

    <div class="card">
      <div class="tabs">
        <div class="tab-item" :class="{ active: activeTab === 'shared' }" @click="switchTab('shared')">公摊仪表抄表<span class="tab-count">{{ sharedRecords.length }}</span></div>
        <div class="tab-item" :class="{ active: activeTab === 'household' }" @click="switchTab('household')">分户仪表抄表<span class="tab-count">{{ householdRecords.length }}</span></div>
      </div>

      <div class="table-wrapper">
        <table class="data-table" v-if="activeTab === 'shared'">
          <thead>
            <tr><th>仪表编号</th><th>仪表名称</th><th>安装位置</th><th>上次读数</th><th>本次读数</th><th>用量</th><th>单价</th><th>金额</th><th>抄表时间</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-num">{{ rec.meterNo }}</td>
              <td class="font-medium">{{ rec.name }}</td>
              <td>{{ rec.location }}</td>
              <td class="font-num">{{ fmt(rec.lastReading) }}</td>
              <td class="font-num">{{ fmt(rec.currentReading) }}</td>
              <td class="font-num font-medium">{{ fmt(rec.usage) }}</td>
              <td class="font-num">{{ rec.price }}</td>
              <td class="font-num text-success">¥{{ fmt(rec.amount) }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
              <td><button class="btn btn-text btn-sm">录入读数</button></td>
            </tr>
          </tbody>
        </table>
        <table class="data-table" v-else>
          <thead>
            <tr><th>房号</th><th>客户名称</th><th>仪表类型</th><th>上次读数</th><th>本次读数</th><th>用量</th><th>单价</th><th>金额</th><th>抄表时间</th></tr>
          </thead>
          <tbody>
            <tr v-for="rec in pagedRecords" :key="rec.id">
              <td class="font-medium">{{ rec.room }}</td>
              <td class="truncate" style="max-width:150px;">{{ rec.customer }}</td>
              <td><span class="badge" :class="rec.meterType === '水表' ? 'badge-blue' : rec.meterType === '电表' ? 'badge-orange' : 'badge-purple'">{{ rec.meterType }}</span></td>
              <td class="font-num">{{ fmt(rec.lastReading) }}</td>
              <td class="font-num">{{ fmt(rec.currentReading) }}</td>
              <td class="font-num font-medium">{{ fmt(rec.usage) }}</td>
              <td class="font-num">{{ rec.price }}</td>
              <td class="font-num text-success">¥{{ fmt(rec.amount) }}</td>
              <td class="text-gray text-sm">{{ rec.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ currentRecords.length }} 条记录</span>
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
.meter-reading { max-width: 1400px; }
</style>
