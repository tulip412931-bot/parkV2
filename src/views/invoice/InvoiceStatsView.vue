<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { showToast } from '@/composables/useToast'

const dateFrom = ref('2026-01-01')
const dateTo = ref('2026-04-16')

const summaryCards = [
  { label: '开票总数', value: '4,523', color: '#1677ff' },
  { label: '开票总金额', value: '¥128.6万', color: '#52c41a' },
  { label: '税额总计', value: '¥16.7万', color: '#fa8c16' },
  { label: '作废冲红数', value: '12', color: '#ff4d4f' }
]

const trend = ref(null)
const typePie = ref(null)
const topClients = ref(null)
const ratePie = ref(null)

let charts = []

function handleQuery() {
  showToast('统计数据已更新', 'success')
}

function setRange(type) {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()
  if (type === 'month') {
    dateFrom.value = `${y}-${String(m + 1).padStart(2, '0')}-01`
  } else if (type === 'quarter') {
    const qm = Math.floor(m / 3) * 3
    dateFrom.value = `${y}-${String(qm + 1).padStart(2, '0')}-01`
  } else if (type === 'year') {
    dateFrom.value = `${y}-01-01`
  }
  dateTo.value = `${y}-${String(m + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  handleQuery()
}

function initCharts() {
  // 1. Trend chart (bar + line)
  if (trend.value) {
    const c = echarts.init(trend.value)
    c.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: { data: ['开票数量', '开票金额(万元)'], top: 0, textStyle: { fontSize: 12, color: '#8c8c8c' } },
      grid: { left: 50, right: 50, top: 40, bottom: 30 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'], axisLine: { lineStyle: { color: '#d9d9d9' } }, axisLabel: { color: '#8c8c8c' } },
      yAxis: [
        { type: 'value', name: '数量', nameTextStyle: { color: '#8c8c8c' }, splitLine: { lineStyle: { color: '#f0f0f0' } }, axisLabel: { color: '#8c8c8c' } },
        { type: 'value', name: '万元', nameTextStyle: { color: '#8c8c8c' }, splitLine: { show: false }, axisLabel: { color: '#8c8c8c' } }
      ],
      series: [
        { name: '开票数量', type: 'bar', data: [980, 1156, 1342, 1286], barWidth: 30, itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] } },
        {
          name: '开票金额(万元)', type: 'line', yAxisIndex: 1, data: [28.5, 32.1, 38.9, 38.6],
          smooth: true, symbol: 'circle', symbolSize: 8,
          lineStyle: { color: '#52c41a', width: 2 },
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(82,196,26,0.15)' }, { offset: 1, color: 'rgba(82,196,26,0)' }]) }
        }
      ]
    })
    charts.push(c)
  }

  // 2. Invoice type donut
  if (typePie.value) {
    const c = echarts.init(typePie.value)
    c.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', right: 20, top: 'center', textStyle: { fontSize: 12, color: '#8c8c8c' } },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: { show: true, position: 'center', fontSize: 14, fontWeight: 700, formatter: '4,523\n总数', color: '#141414' },
        emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
        data: [
          { value: 2680, name: '电子普票', itemStyle: { color: '#1677ff' } },
          { value: 1245, name: '电子专票', itemStyle: { color: '#52c41a' } },
          { value: 598, name: '全电发票', itemStyle: { color: '#fa8c16' } }
        ]
      }]
    })
    charts.push(c)
  }

  // 3. Top 10 clients horizontal bar
  if (topClients.value) {
    const c = echarts.init(topClients.value)
    const companies = [
      '重庆腾讯信息技术有限公司', '重庆百度科技有限公司', '四川华为技术有限公司',
      '成都阿里巴巴科技有限公司', '重庆京东科技有限公司', '重庆美团信息技术有限公司',
      '重庆字节跳动科技有限公司', '贵州茅台酒股份有限公司', '重庆长安汽车股份有限公司',
      '重庆小米通讯技术有限公司'
    ].reverse()
    const values = [8.2, 9.5, 10.1, 11.3, 12.8, 14.2, 15.6, 18.3, 21.5, 25.8].reverse()

    c.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>开票金额: ¥{c}万' },
      grid: { left: 180, right: 40, top: 10, bottom: 20 },
      xAxis: { type: 'value', axisLabel: { color: '#8c8c8c', formatter: '¥{value}万' }, splitLine: { lineStyle: { color: '#f0f0f0' } } },
      yAxis: { type: 'category', data: companies, axisLabel: { color: '#434343', fontSize: 11, width: 160, overflow: 'truncate' }, axisLine: { show: false }, axisTick: { show: false } },
      series: [{
        type: 'bar', data: values, barWidth: 16,
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#1677ff' }, { offset: 1, color: '#69b1ff' }
          ])
        }
      }]
    })
    charts.push(c)
  }

  // 4. Tax rate donut
  if (ratePie.value) {
    const c = echarts.init(ratePie.value)
    c.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', right: 20, top: 'center', textStyle: { fontSize: 12, color: '#8c8c8c' } },
      series: [{
        type: 'pie', radius: ['45%', '70%'], center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
        data: [
          { value: 1856, name: '6% 服务', itemStyle: { color: '#1677ff' } },
          { value: 1890, name: '13% 货物', itemStyle: { color: '#52c41a' } },
          { value: 452, name: '9% 建筑', itemStyle: { color: '#fa8c16' } },
          { value: 325, name: '3% 小规模', itemStyle: { color: '#722ed1' } }
        ]
      }]
    })
    charts.push(c)
  }
}

function handleResize() {
  charts.forEach(c => c.resize())
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(c => c.dispose())
  charts = []
})
</script>

<template>
  <div class="stats-page">
    <!-- Filter Bar -->
    <div class="card">
      <div class="filter-bar">
        <span class="filter-label">统计区间</span>
        <input v-model="dateFrom" type="date" class="form-input" style="width:150px" />
        <span style="color:#8c8c8c">至</span>
        <input v-model="dateTo" type="date" class="form-input" style="width:150px" />
        <button class="btn btn-primary" @click="handleQuery">查询</button>
        <button class="btn" @click="setRange('month')">本月</button>
        <button class="btn" @click="setRange('quarter')">本季</button>
        <button class="btn" @click="setRange('year')">本年</button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div v-for="s in summaryCards" :key="s.label" class="summary-card">
        <div class="summary-value" :style="{ color: s.color }">{{ s.value }}</div>
        <div class="summary-label">{{ s.label }}</div>
      </div>
    </div>

    <!-- Charts 2x2 Grid -->
    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-title">开票趋势（按月）</div>
        <div ref="trend" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">发票类型分布</div>
        <div ref="typePie" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">开票金额TOP10客户</div>
        <div ref="topClients" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">税率分布</div>
        <div ref="ratePie" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.filter-label {
  font-size: 14px;
  color: #434343;
  font-weight: 500;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.summary-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  text-align: center;
}

.summary-value {
  font-family: 'DM Sans', sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 13px;
  color: #8c8c8c;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

.chart-title {
  font-size: 15px;
  font-weight: 500;
  color: #141414;
  margin-bottom: 12px;
}

.chart-box {
  width: 100%;
  height: 300px;
}

/* Bind template refs to chartRefs */
</style>
