<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import { fmt } from '@/composables/useDemoData'

/* Filters */
const dateStart = ref('')
const dateEnd = ref('')
const quickRange = ref('本月')
const quickOptions = ['本月', '本季', '本年']
function doSearch() { /* placeholder */ }

/* Stat cards */
const statCards = [
  { label: '线索新增', value: '65', unit: '条', color: '#2563eb' },
  { label: '转化率', value: '38.6', unit: '%', color: '#16a34a' },
  { label: '完成率', value: '72', unit: '%', color: '#7c3aed' },
  { label: '热度TOP', value: 'A栋3层', unit: '', color: '#ea580c' },
  { label: '行业TOP', value: '信息技术', unit: '', color: '#0891b2' }
]

/* Chart refs */
const trendRef = ref(null)
const sourceRef = ref(null)
const industryRef = ref(null)
const funnelRef = ref(null)
let charts = []

function initCharts() {
  // 1. Line chart - 线索新增趋势
  if (trendRef.value) {
    const c = echarts.init(trendRef.value)
    c.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        data: [12, 18, 15, 20],
        smooth: true,
        itemStyle: { color: '#2563eb' },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(37,99,235,0.25)' }, { offset: 1, color: 'rgba(37,99,235,0.02)' }] } }
      }]
    })
    charts.push(c)
  }

  // 2. Pie chart - 来源渠道
  if (sourceRef.value) {
    const c = echarts.init(sourceRef.value)
    c.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
      legend: { bottom: 0, left: 'center', textStyle: { fontSize: 12 } },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        label: { formatter: '{b}\n{d}%', fontSize: 12 },
        data: [
          { value: 35, name: '平台咨询', itemStyle: { color: '#2563eb' } },
          { value: 25, name: '线下登记', itemStyle: { color: '#7c3aed' } },
          { value: 22, name: '客户推荐', itemStyle: { color: '#16a34a' } },
          { value: 18, name: '外部推广', itemStyle: { color: '#ea580c' } }
        ]
      }]
    })
    charts.push(c)
  }

  // 3. Horizontal bar - 行业意向
  if (industryRef.value) {
    const c = echarts.init(industryRef.value)
    c.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 80, right: 30, top: 10, bottom: 20 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: ['电子商务', '现代服务', '新能源', '生物医药', '智能制造', '信息技术'].reverse() },
      series: [{
        type: 'bar',
        data: [4, 6, 7, 8, 12, 18].reverse(),
        itemStyle: { color: '#7c3aed', borderRadius: [0, 4, 4, 0] },
        barWidth: 20
      }]
    })
    charts.push(c)
  }

  // 4. Funnel as centered bar chart
  if (funnelRef.value) {
    const c = echarts.init(funnelRef.value)
    const funnelData = [
      { name: '线索', value: 65 },
      { name: '意向', value: 42 },
      { name: '洽谈', value: 28 },
      { name: '签约', value: 18 }
    ]
    const maxVal = 65
    const colors = ['#3b82f6', '#6366f1', '#a855f7', '#16a34a']
    c.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: 60, right: 60, top: 10, bottom: 20 },
      xAxis: {
        type: 'value',
        max: maxVal,
        show: false
      },
      yAxis: {
        type: 'category',
        data: funnelData.map(d => d.name).reverse(),
        axisTick: { show: false },
        axisLine: { show: false }
      },
      series: [
        {
          type: 'bar',
          data: funnelData.map((d, i) => ({
            value: d.value,
            itemStyle: { color: colors[i], borderRadius: 4 },
            label: { show: true, position: 'right', formatter: d.value + '', fontWeight: 700, fontSize: 13 }
          })).reverse(),
          barWidth: 32,
          barCategoryGap: '30%'
        }
      ]
    })
    charts.push(c)
  }
}

function handleResize() {
  charts.forEach(c => c.resize())
}

onMounted(() => {
  nextTick(initCharts)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(c => c.dispose())
  charts = []
})
</script>

<template>
  <div class="page-view">
    <div class="banner">
      <span class="banner-icon">&#x1f4ca;</span>
      独立数据分析体系，与租售板块数据联动但不混淆
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="filter-bar">
        <input v-model="dateStart" type="date" class="form-input" />
        <input v-model="dateEnd" type="date" class="form-input" />
        <div class="quick-btns">
          <button
            v-for="q in quickOptions"
            :key="q"
            class="btn"
            :class="quickRange === q ? 'btn-primary' : 'btn-default'"
            @click="quickRange = q"
          >{{ q }}</button>
        </div>
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>
    </div>

    <!-- Stat cards: 5 columns -->
    <div class="stats-row">
      <div v-for="(sc, i) in statCards" :key="i" class="stat-item">
        <div class="stat-item-label">{{ sc.label }}</div>
        <div class="stat-item-value" :style="{ color: sc.color }">
          {{ sc.value }}<span class="stat-item-unit">{{ sc.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 4 Charts 2x2 -->
    <div class="chart-cards">
      <div class="chart-card">
        <div class="chart-card-header"><span class="chart-card-title">线索新增趋势</span></div>
        <div ref="trendRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header"><span class="chart-card-title">来源渠道</span></div>
        <div ref="sourceRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header"><span class="chart-card-title">行业意向</span></div>
        <div ref="industryRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header"><span class="chart-card-title">招商漏斗</span></div>
        <div ref="funnelRef" class="chart-box"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.banner {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
}
.banner-icon { font-size: 18px; }
.quick-btns { display: flex; gap: 4px; }
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.stat-item {
  background: #fff;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  text-align: center;
}
.stat-item-label { font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.stat-item-value { font-size: 26px; font-weight: 800; }
.stat-item-unit { font-size: 13px; font-weight: 400; color: #6b7280; margin-left: 2px; }

@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
</style>
