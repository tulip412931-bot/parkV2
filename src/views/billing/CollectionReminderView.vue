<script setup>
import { ref, computed } from 'vue'

const area = ref('全部')
const building = ref('全部')
const duration = ref('全部')
const currentPage = ref(1)
const pageSize = 10

const durations = ['全部', '1月内', '1-3月', '3-6月', '6月以上']
const stats = [
  { label: '待催费户数', value: '25', unit: '户', color: '#dc2626' },
  { label: '待催费金额', value: '186,420.00', unit: '元', color: '#d97706' },
  { label: '本月已催费', value: '18', unit: '户', color: '#2563eb' },
  { label: '催费成功率', value: '72.0', unit: '%', color: '#16a34a' }
]

const names = ['张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄丽','周杰','吴敏','孙涛','马丽','朱军','胡明','郭芳','钱进','林峰','何雪','徐刚','邓超','谢芳','韩冰','曹雪','许辉','高洁']
const phones = names.map((_, i) => `138${String(10000000 + i * 1234567).slice(0, 8)}`)
const items = ['物业费', '租金', '水费', '电费', '停车费']
const durationLabels = ['15天', '25天', '2个月', '45天', '4个月', '5个月', '7个月', '1个月', '3个月', '20天']

const rows = ref(Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  room: `${['A', 'B', 'C'][i % 3]}栋${Math.floor(i / 3 + 1)}0${(i % 5) + 1}`,
  customer: names[i],
  phone: phones[i],
  item: items[i % 5],
  amount: [3200, 15800, 520, 1800, 600, 4500, 28000, 890, 2100, 750, 6800, 12400, 340, 3600, 1200, 9500, 21000, 680, 4200, 1500, 7300, 16200, 450, 2800, 950][i],
  durationText: durationLabels[i % 10],
  lastRemind: i % 4 === 0 ? '—' : `2026-03-${String(10 + (i % 20)).padStart(2, '0')}`,
  remindCount: [0, 2, 1, 3, 0, 1, 4, 0, 2, 1, 3, 2, 0, 1, 2, 0, 3, 1, 2, 0, 1, 4, 0, 2, 1][i]
})))

const filtered = computed(() => {
  let list = rows.value
  if (duration.value === '1月内') list = list.filter(r => r.durationText.includes('天'))
  else if (duration.value === '1-3月') list = list.filter(r => r.durationText.includes('1个月') || r.durationText.includes('2个月'))
  else if (duration.value === '3-6月') list = list.filter(r => r.durationText.includes('3个月') || r.durationText.includes('4个月') || r.durationText.includes('5个月'))
  else if (duration.value === '6月以上') list = list.filter(r => r.durationText.includes('7个月'))
  return list
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">催费中心</h1>
      <p class="page-subtitle">欠费客户催缴管理与跟踪</p>
    </div>

    <div class="filter-bar">
      <select v-model="area" class="form-select"><option>全部</option><option>坤煌（长寿）食品产业园</option></select>
      <select v-model="building" class="form-select"><option>全部</option><option>A栋</option><option>B栋</option><option>C栋</option></select>
      <select v-model="duration" class="form-select">
        <option v-for="d in durations" :key="d">{{ d }}</option>
      </select>
    </div>

    <div class="stat-cards">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: s.color + '15', color: s.color }">
          <span style="font-size:20px;font-weight:700;">{{ s.value.charAt(0) }}</span>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ s.label }}</div>
          <div class="stat-card-value">{{ s.value }}<span class="stat-card-unit">{{ s.unit }}</span></div>
        </div>
      </div>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>房号</th><th>客户名称</th><th>联系电话</th><th>欠费项目</th><th>欠费金额</th>
            <th>欠费时长</th><th>最后催费时间</th><th>催费次数</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.id">
            <td class="font-medium">{{ r.room }}</td>
            <td>{{ r.customer }}</td>
            <td>{{ r.phone }}</td>
            <td>{{ r.item }}</td>
            <td class="font-num text-danger">¥{{ fmt(r.amount) }}</td>
            <td>{{ r.durationText }}</td>
            <td>{{ r.lastRemind }}</td>
            <td>{{ r.remindCount }}</td>
            <td class="table-actions">
              <button class="btn btn-sm btn-primary">催费</button>
              <button class="btn btn-sm btn-success">标记已处理</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>
