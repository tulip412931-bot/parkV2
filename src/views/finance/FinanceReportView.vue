<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const filterArea = ref('')
const filterDateStart = ref('2025-01')
const filterDateEnd = ref('2025-12')
const filterType = ref('月度')

const summaryCards = [
  { label: '总应收', value: '¥89,456.00', color: 'var(--primary)', bg: 'var(--primary-bg)' },
  { label: '总实收', value: '¥67,230.00', color: 'var(--success)', bg: 'var(--success-bg)' },
  { label: '总欠费', value: '¥22,226.00', color: 'var(--danger)', bg: 'var(--danger-bg)' },
  { label: '收费率', value: '75.2%', color: 'var(--warning)', bg: 'var(--warning-bg)' }
]

const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const receivable = [8200,7800,8500,7600,8100,7900,8400,7700,8300,8000,7500,8600]
const collected =  [6500,6100,6800,5900,6400,6200,6700,5800,6600,6300,5700,6900]
const arrears = receivable.map((v, i) => v - collected[i])

const tableData = months.map((m, i) => {
  const rate = ((collected[i] / receivable[i]) * 100).toFixed(1)
  const yoy = (Math.random() * 10 - 3).toFixed(1)
  const mom = (Math.random() * 8 - 2).toFixed(1)
  return { month: m, receivable: receivable[i], collected: collected[i], arrears: arrears[i], rate, yoy, mom }
})

const chartRef = ref(null)
let chart = null

function initChart() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { color: '#1e293b', fontSize: 12 } },
    legend: { data: ['应收', '已收', '欠费'], top: 10, right: 10, textStyle: { color: '#6b7280', fontSize: 12 } },
    grid: { left: 50, right: 20, top: 50, bottom: 30 },
    xAxis: { type: 'category', data: months, axisLine: { lineStyle: { color: '#e5e7eb' } }, axisLabel: { color: '#6b7280' } },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#f1f5f9' } }, axisLabel: { color: '#6b7280' } },
    series: [
      { name: '应收', type: 'bar', stack: 'total', data: receivable, barWidth: 24,
        itemStyle: { color: '#3b82f6', borderRadius: [0, 0, 0, 0] } },
      { name: '已收', type: 'bar', stack: 'paid', data: collected, barWidth: 24,
        itemStyle: { color: '#22c55e', borderRadius: [0, 0, 0, 0] } },
      { name: '欠费', type: 'bar', stack: 'debt', data: arrears, barWidth: 24,
        itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] } }
    ]
  })
}

function handleResize() { chart?.resize() }

onMounted(async () => { await nextTick(); initChart(); window.addEventListener('resize', handleResize) })
onBeforeUnmount(() => { window.removeEventListener('resize', handleResize); chart?.dispose() })
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">综合报表</h1>
      <p class="page-subtitle">财务管理 - 综合收费报表分析</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterArea" class="form-select">
        <option value="">全部管理区</option>
        <option>A区</option><option>B区</option><option>C区</option>
      </select>
      <input v-model="filterDateStart" type="month" class="form-input" />
      <span class="text-gray">至</span>
      <input v-model="filterDateEnd" type="month" class="form-input" />
      <select v-model="filterType" class="form-select">
        <option>月度</option><option>季度</option><option>年度</option>
      </select>
      <div class="filter-actions">
        <button class="btn btn-primary">查询</button>
        <button class="btn btn-default">导出报表</button>
      </div>
    </div>

    <div class="stat-cards">
      <div v-for="c in summaryCards" :key="c.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background: c.bg, color: c.color }">¥</div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ c.label }}</div>
          <div class="stat-card-value font-num">{{ c.value }}</div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">
        <h3 class="card-title">月度收费趋势</h3>
      </div>
      <div ref="chartRef" class="chart-box"></div>
    </div>

    <div class="data-table-card">
      <div class="data-table-header">
        <div><span class="data-table-title">报表明细</span><span class="data-table-count">共 {{ tableData.length }} 条</span></div>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>月份</th><th>应收金额</th><th>实收金额</th><th>欠费金额</th><th>收费率</th><th>同比</th><th>环比</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableData" :key="row.month">
              <td class="font-medium">{{ row.month }}</td>
              <td class="font-num">¥{{ row.receivable.toLocaleString() }}</td>
              <td class="font-num text-success">¥{{ row.collected.toLocaleString() }}</td>
              <td class="font-num text-danger">¥{{ row.arrears.toLocaleString() }}</td>
              <td><span class="badge badge-blue">{{ row.rate }}%</span></td>
              <td :class="row.yoy >= 0 ? 'text-success' : 'text-danger'">{{ row.yoy > 0 ? '+' : '' }}{{ row.yoy }}%</td>
              <td :class="row.mom >= 0 ? 'text-success' : 'text-danger'">{{ row.mom > 0 ? '+' : '' }}{{ row.mom }}%</td>
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
