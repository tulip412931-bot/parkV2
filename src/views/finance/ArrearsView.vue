<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const filterArea = ref('')
const filterDuration = ref('')
const filterProject = ref('')

const durations = ['1个月内', '1-3个月', '3-6个月', '6个月以上', '1年以上']
const projects = ['物业费', '水费', '电费', '停车费', '空调费']
const customers = ['重庆智联科技','鼎盛机械','华创电子','朗讯通信','博雅装饰','天宇物流','星辰广告','锐达信息','嘉和贸易','中天建设',
  '远航科技','盛世文化','金桥投资','鸿运商贸','蓝海网络','创新材料','宏图置业','卓越教育','汇丰实业','恒达电气',
  '明德咨询','新世纪传媒','正源环保','瑞丰食品','同方科技']
const buildings = ['1栋','2栋','3栋','4栋','5栋']

const allData = Array.from({ length: 25 }, (_, i) => {
  const bld = buildings[i % 5]
  const floor = (i % 6) + 1
  const room = `${bld}-${floor}${String((i % 4) + 1).padStart(2, '0')}`
  const dur = durations[i % 5]
  const amount = (500 + Math.random() * 9500).toFixed(2)
  const d = new Date(2025, 5 - (i % 6), 10 + (i % 20))
  const lastDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return { id: i + 1, room, customer: customers[i], project: projects[i % 5], amount: parseFloat(amount), duration: dur, lastReminder: lastDate }
})

const filteredData = computed(() => {
  return allData.filter(r => {
    if (filterDuration.value && r.duration !== filterDuration.value) return false
    if (filterProject.value && r.project !== filterProject.value) return false
    return true
  })
})

const totalHouseholds = computed(() => filteredData.value.length)
const totalArrears = computed(() => filteredData.value.reduce((s, r) => s + r.amount, 0))
const avgArrears = computed(() => totalHouseholds.value ? totalArrears.value / totalHouseholds.value : 0)

const summaryCards = computed(() => [
  { label: '总欠费户数', value: totalHouseholds.value, unit: '户', color: 'var(--danger)', bg: 'var(--danger-bg)' },
  { label: '总欠费金额', value: `¥${totalArrears.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, unit: '', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  { label: '平均欠费金额', value: `¥${avgArrears.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, unit: '', color: 'var(--primary)', bg: 'var(--primary-bg)' },
  { label: '最长欠费时长', value: '18', unit: '个月', color: 'var(--secondary)', bg: 'var(--secondary-bg)' }
])

const pieRef = ref(null)
const barRef = ref(null)
let pieChart = null
let barChart = null

function initCharts() {
  if (pieRef.value) {
    pieChart = echarts.init(pieRef.value)
    const pieData = durations.map(d => ({ name: d, value: allData.filter(r => r.duration === d).reduce((s, r) => s + r.amount, 0) }))
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#6b7280', fontSize: 12 } },
      color: ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'],
      series: [{
        type: 'pie', radius: ['40%', '68%'], center: ['35%', '50%'],
        label: { show: true, position: 'inside', formatter: '{d}%', fontSize: 11, color: '#fff', fontWeight: 600 },
        data: pieData,
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' } }
      }]
    })
  }
  if (barRef.value) {
    barChart = echarts.init(barRef.value)
    const sorted = [...allData].sort((a, b) => b.amount - a.amount).slice(0, 10)
    barChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
      grid: { left: 120, right: 30, top: 20, bottom: 30 },
      xAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#6b7280' } },
      yAxis: { type: 'category', data: sorted.map(r => r.customer).reverse(), axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280', fontSize: 12 } },
      series: [{
        type: 'bar', data: sorted.map(r => r.amount).reverse(), barWidth: 18,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#ef4444' }, { offset: 1, color: '#f87171' }
          ]),
          borderRadius: [0, 4, 4, 0]
        }
      }]
    })
  }
}

function handleResize() { pieChart?.resize(); barChart?.resize() }
onMounted(async () => { await nextTick(); initCharts(); window.addEventListener('resize', handleResize) })
onBeforeUnmount(() => { window.removeEventListener('resize', handleResize); pieChart?.dispose(); barChart?.dispose() })

function durationBadge(d) {
  if (d === '1个月内') return 'badge-blue'
  if (d === '1-3个月') return 'badge-orange'
  if (d === '3-6个月') return 'badge-red'
  if (d === '6个月以上') return 'badge-red'
  return 'badge-purple'
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">欠费统计</h1>
      <p class="page-subtitle">财务管理 - 欠费分析与催费管理</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterArea" class="form-select">
        <option value="">全部管理区</option>
        <option>A区</option><option>B区</option><option>C区</option>
      </select>
      <select v-model="filterDuration" class="form-select">
        <option value="">全部欠费时长</option>
        <option v-for="d in durations" :key="d">{{ d }}</option>
      </select>
      <select v-model="filterProject" class="form-select">
        <option value="">全部收费项目</option>
        <option v-for="p in projects" :key="p">{{ p }}</option>
      </select>
      <div class="filter-actions">
        <button class="btn btn-primary">查询</button>
      </div>
    </div>

    <div class="stat-cards">
      <div v-for="c in summaryCards" :key="c.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: c.bg, color: c.color }">!</div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ c.label }}</div>
          <div class="stat-card-value font-num">{{ c.value }}<span v-if="c.unit" class="stat-card-unit">{{ c.unit }}</span></div>
        </div>
      </div>
    </div>

    <div class="chart-grid mb-3">
      <div class="card">
        <div class="card-header"><h3 class="card-title">欠费时长分布</h3></div>
        <div ref="pieRef" class="chart-box"></div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">欠费金额 TOP 10</h3></div>
        <div ref="barRef" class="chart-box"></div>
      </div>
    </div>

    <div class="data-table-card">
      <div class="data-table-header">
        <div><span class="data-table-title">欠费明细</span><span class="data-table-count">共 {{ filteredData.length }} 条</span></div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>房号</th><th>客户名称</th><th>欠费项目</th><th>欠费金额</th><th>欠费时长</th><th>最后催费日期</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredData" :key="row.id">
              <td class="font-medium">{{ row.room }}</td>
              <td>{{ row.customer }}</td>
              <td><span class="tag">{{ row.project }}</span></td>
              <td class="font-num font-semibold text-danger">¥{{ row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</td>
              <td><span class="badge" :class="durationBadge(row.duration)">{{ row.duration }}</span></td>
              <td class="text-gray text-sm">{{ row.lastReminder }}</td>
              <td class="table-actions">
                <button class="btn btn-text btn-sm">催费</button>
                <button class="btn btn-text btn-sm">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card-icon {
  width: 48px; height: 48px; border-radius: var(--radius-lg);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; flex-shrink: 0;
}
</style>
