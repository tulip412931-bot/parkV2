<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const area = ref('坤煌（长寿）食品产业园')
const dateRange = ref('本月')
const building = ref('全部')

const stats = [
  { label: '项目数量', value: '1', unit: '个', color: '#2563eb' },
  { label: '管理面积', value: '20,194.73', unit: '㎡', color: '#7c3aed' },
  { label: '户数', value: '14', unit: '户', color: '#059669' },
  { label: '空置车位/车位总数', value: '0/0', unit: '', color: '#d97706' }
]

const stewards = [
  { name: '张丽华', amount: 12680.00, rate: 68.5 },
  { name: '李明辉', amount: 9450.00, rate: 55.2 },
  { name: '王秀英', amount: 7820.00, rate: 48.7 },
  { name: '陈建国', amount: 5340.00, rate: 32.1 },
  { name: '刘小红', amount: 3210.00, rate: 21.8 }
]

const receivables = [
  { name: '物业费', due: 45800, actualDue: 45800, received: 28600, arrears: 17200, progress: 62.4 },
  { name: '租金', due: 128000, actualDue: 128000, received: 98500, arrears: 29500, progress: 76.9 },
  { name: '水费', due: 3200, actualDue: 3200, received: 2100, arrears: 1100, progress: 65.6 },
  { name: '电费', due: 8600, actualDue: 8600, received: 6800, arrears: 1800, progress: 79.1 },
  { name: '停车费', due: 0, actualDue: 0, received: 0, arrears: 0, progress: 0 }
]

const chargeStats = [
  { name: '物业费', amount: 28600, ratio: 21.0 },
  { name: '租金', amount: 98500, ratio: 72.3 },
  { name: '水费', amount: 2100, ratio: 1.5 },
  { name: '电费', amount: 6800, ratio: 5.0 },
  { name: '停车费', amount: 200, ratio: 0.2 }
]

const chargeTotal = chargeStats.reduce((s, i) => s + i.amount, 0)

const donutRef = ref(null)
const barRef = ref(null)
let donutChart = null
let barChart = null

function initCharts() {
  if (donutRef.value) {
    donutChart = echarts.init(donutRef.value)
    donutChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
      legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { fontSize: 12, color: '#6b7280' } },
      color: ['#2563eb', '#e5e7eb'],
      graphic: { type: 'text', left: 'center', top: 'center', style: { text: '0.00%', fontSize: 22, fontWeight: 700, fill: '#111827', textAlign: 'center' } },
      series: [{ type: 'pie', radius: ['50%', '75%'], center: ['35%', '50%'], label: { show: false },
        data: [{ value: 0, name: '已收' }, { value: 100, name: '未收' }]
      }]
    })
  }
  if (barRef.value) {
    barChart = echarts.init(barRef.value)
    barChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 20, top: 30, bottom: 30 },
      xAxis: { type: 'category', data: receivables.map(r => r.name), axisLabel: { color: '#6b7280' } },
      yAxis: { type: 'value', axisLabel: { color: '#6b7280' }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
      series: [{ type: 'bar', data: receivables.map(r => r.arrears), barWidth: 32,
        itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#f59e0b' }, { offset: 1, color: '#fde68a' }
        ]), borderRadius: [4, 4, 0, 0] }
      }]
    })
  }
}

function handleResize() { donutChart?.resize(); barChart?.resize() }

onMounted(async () => { await nextTick(); initCharts(); window.addEventListener('resize', handleResize) })
onBeforeUnmount(() => { window.removeEventListener('resize', handleResize); donutChart?.dispose(); barChart?.dispose() })

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div class="billing-dashboard">
    <!-- Filter bar -->
    <div class="filter-bar">
      <select v-model="area" class="form-select"><option>坤煌（长寿）食品产业园</option></select>
      <div class="quick-btns">
        <button v-for="d in ['本月','本季','本年']" :key="d" :class="{ active: dateRange === d }" @click="dateRange = d">{{ d }}</button>
      </div>
      <select v-model="building" class="form-select"><option>全部</option><option>A栋</option><option>B栋</option></select>
    </div>

    <!-- Stat cards -->
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

    <!-- Row: donut + steward ranking -->
    <div class="chart-grid mb-3">
      <div class="card">
        <div class="card-header"><h3 class="card-title">收费率</h3></div>
        <div ref="donutRef" style="height:260px;width:100%;"></div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">管家收费排行榜</h3></div>
        <table class="data-table">
          <thead><tr><th>管家姓名</th><th>收费金额</th><th>收费率</th></tr></thead>
          <tbody>
            <tr v-for="s in stewards" :key="s.name">
              <td class="font-medium">{{ s.name }}</td>
              <td class="font-num">¥{{ fmt(s.amount) }}</td>
              <td><span class="badge badge-blue">{{ s.rate }}%</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Receivables table -->
    <div class="card mb-3">
      <div class="card-header"><h3 class="card-title">应收已收欠费统计</h3></div>
      <table class="data-table">
        <thead><tr><th>收费项目</th><th>应收</th><th>实际应收</th><th>已收</th><th>欠费</th><th style="min-width:140px">收费进度</th></tr></thead>
        <tbody>
          <tr v-for="r in receivables" :key="r.name">
            <td class="font-medium">{{ r.name }}</td>
            <td class="font-num">¥{{ fmt(r.due) }}</td>
            <td class="font-num">¥{{ fmt(r.actualDue) }}</td>
            <td class="font-num text-success">¥{{ fmt(r.received) }}</td>
            <td class="font-num text-danger">¥{{ fmt(r.arrears) }}</td>
            <td>
              <div class="progress-bar"><div class="progress-fill" :style="{ width: r.progress + '%' }"></div></div>
              <span class="text-sm text-gray">{{ r.progress }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Row: charge stats + arrears chart -->
    <div class="chart-grid">
      <div class="card">
        <div class="card-header"><h3 class="card-title">收费统计</h3><span class="text-sm font-bold">总计 ¥{{ fmt(chargeTotal) }}</span></div>
        <table class="data-table">
          <thead><tr><th>收费项目</th><th>收款金额</th><th>占比</th></tr></thead>
          <tbody>
            <tr v-for="c in chargeStats" :key="c.name">
              <td class="font-medium">{{ c.name }}</td>
              <td class="font-num">¥{{ fmt(c.amount) }}</td>
              <td>{{ c.ratio }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">欠费统计</h3></div>
        <div ref="barRef" style="height:260px;width:100%;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.billing-dashboard { max-width: 1400px; }
.progress-bar { height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden; display: inline-block; width: 100px; vertical-align: middle; margin-right: 8px; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #3b82f6); border-radius: 4px; transition: width 0.3s; }
</style>
