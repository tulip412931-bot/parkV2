<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const dateStart = ref('2025-04-01')
const dateEnd = ref('2026-04-16')
const leaseType = ref('')
const propertyFilter = ref('')

const stats = [
  { label:'房源去化率', value:'68.5', unit:'%', color:'#2563eb' },
  { label:'租售总额', value:'2,345,600', unit:'元', color:'#16a34a' },
  { label:'定金收取总额', value:'456,000', unit:'元', color:'#d97706' },
  { label:'客户转化率', value:'42.3', unit:'%', color:'#7c3aed' },
]

const months = ['2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04']
const rentAmounts = [85000, 92000, 78000, 105000, 98000, 112000, 125000, 118000, 130000, 95000, 140000, 135000]
const saleAmounts = [0, 1100000, 0, 0, 1950000, 0, 1350000, 0, 0, 800000, 0, 0]
const disposalRates = [52.3, 55.1, 56.8, 58.2, 60.5, 62.1, 63.8, 64.5, 65.2, 66.0, 67.3, 68.5]

const tableData = [
  { code:'FY2024001', type:'商铺', area:120, leaseType:'租赁', amount:'4,500元/月', time:'2024-11-05', customer:'重庆智汇科技有限公司' },
  { code:'FY2024005', type:'办公', area:150, leaseType:'出售', amount:'110万元', time:'2024-10-30', customer:'成都盛达物流集团' },
  { code:'FY2024003', type:'办公', area:200, leaseType:'租赁', amount:'8,500元/月', time:'2024-10-22', customer:'江津新材料科技公司' },
  { code:'FY2024010', type:'厂房', area:180, leaseType:'出售', amount:'135万元', time:'2024-10-27', customer:'重庆万达商业管理公司' },
  { code:'FY2024013', type:'厂房', area:250, leaseType:'出售', amount:'195万元', time:'2024-10-20', customer:'成都天府科创有限公司' },
  { code:'FY2024017', type:'仓库', area:160, leaseType:'租赁', amount:'6,500元/月', time:'2024-11-02', customer:'重庆渝创投资有限公司' },
  { code:'FY2024012', type:'商铺', area:130, leaseType:'租赁', amount:'5,200元/月', time:'2024-11-13', customer:'江津永辉超市有限公司' },
  { code:'FY2024019', type:'办公', area:220, leaseType:'租赁', amount:'9,000元/月', time:'2024-11-12', customer:'成都新锐广告有限公司' },
]

const barChartRef = ref(null)
const lineChartRef = ref(null)
const groupChartRef = ref(null)
let barChart = null, lineChart = null, groupChart = null

function initCharts() {
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption({
      tooltip: { trigger:'axis', backgroundColor:'#fff', borderColor:'#e5e7eb', textStyle:{ color:'#1e293b', fontSize:12 } },
      legend: { data:['租赁金额','出售金额'], top:10, right:10, textStyle:{ color:'#6b7280', fontSize:12 } },
      grid: { left:60, right:20, top:50, bottom:30 },
      xAxis: { type:'category', data:months, axisLine:{ lineStyle:{ color:'#e5e7eb' } }, axisLabel:{ color:'#6b7280' } },
      yAxis: { type:'value', axisLine:{ show:false }, splitLine:{ lineStyle:{ color:'#f1f5f9' } }, axisLabel:{ color:'#6b7280', formatter:v=>v>=10000?(v/10000)+'万':v } },
      series: [
        { name:'租赁金额', type:'bar', data:rentAmounts, barWidth:20, itemStyle:{ color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#3b82f6'},{offset:1,color:'#93c5fd'}]), borderRadius:[4,4,0,0] } },
        { name:'出售金额', type:'bar', data:saleAmounts, barWidth:20, itemStyle:{ color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'#f59e0b'},{offset:1,color:'#fcd34d'}]), borderRadius:[4,4,0,0] } },
      ]
    })
  }
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    lineChart.setOption({
      tooltip: { trigger:'axis', backgroundColor:'#fff', borderColor:'#e5e7eb', textStyle:{ color:'#1e293b', fontSize:12 }, formatter:p=>p[0].name+'<br/>去化率: '+p[0].value+'%' },
      grid: { left:50, right:20, top:30, bottom:30 },
      xAxis: { type:'category', data:months, axisLine:{ lineStyle:{ color:'#e5e7eb' } }, axisLabel:{ color:'#6b7280' } },
      yAxis: { type:'value', min:40, max:80, axisLine:{ show:false }, splitLine:{ lineStyle:{ color:'#f1f5f9' } }, axisLabel:{ color:'#6b7280', formatter:'{value}%' } },
      series: [{ type:'line', data:disposalRates, smooth:true, symbol:'circle', symbolSize:6, lineStyle:{ color:'#2563eb', width:2 }, itemStyle:{ color:'#2563eb' }, areaStyle:{ color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(37,99,235,0.15)'},{offset:1,color:'rgba(37,99,235,0)'}]) } }]
    })
  }
  if (groupChartRef.value) {
    groupChart = echarts.init(groupChartRef.value)
    groupChart.setOption({
      tooltip: { trigger:'axis', backgroundColor:'#fff', borderColor:'#e5e7eb', textStyle:{ color:'#1e293b', fontSize:12 } },
      legend: { data:['已租','已售','空置'], top:10, right:10, textStyle:{ color:'#6b7280', fontSize:12 } },
      grid: { left:50, right:20, top:50, bottom:30 },
      xAxis: { type:'category', data:['商铺','办公','厂房','仓库'], axisLine:{ lineStyle:{ color:'#e5e7eb' } }, axisLabel:{ color:'#6b7280' } },
      yAxis: { type:'value', axisLine:{ show:false }, splitLine:{ lineStyle:{ color:'#f1f5f9' } }, axisLabel:{ color:'#6b7280' } },
      series: [
        { name:'已租', type:'bar', data:[8,12,5,3], barWidth:24, itemStyle:{ color:'#3b82f6', borderRadius:[4,4,0,0] } },
        { name:'已售', type:'bar', data:[3,5,4,1], barWidth:24, itemStyle:{ color:'#16a34a', borderRadius:[4,4,0,0] } },
        { name:'空置', type:'bar', data:[4,6,3,2], barWidth:24, itemStyle:{ color:'#d1d5db', borderRadius:[4,4,0,0] } },
      ]
    })
  }
}

function handleResize() { barChart?.resize(); lineChart?.resize(); groupChart?.resize() }

onMounted(async () => { await nextTick(); initCharts(); window.addEventListener('resize', handleResize) })
onBeforeUnmount(() => { window.removeEventListener('resize', handleResize); barChart?.dispose(); lineChart?.dispose(); groupChart?.dispose() })
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">租售统计报表</h1>
      <p class="page-subtitle">查看园区租赁与出售业务统计数据，支持数据导出</p>
    </div>

    <div class="filter-bar">
      <input v-model="dateStart" class="form-input" type="date" style="min-width:150px" />
      <span class="text-gray">至</span>
      <input v-model="dateEnd" class="form-input" type="date" style="min-width:150px" />
      <select v-model="leaseType" class="form-select"><option value="">全部类型</option><option value="租赁">租赁</option><option value="出售">出售</option></select>
      <input v-model="propertyFilter" class="form-input" placeholder="房源/场地筛选" style="min-width:150px" />
      <div class="filter-actions"><button class="btn btn-primary">查询</button><button class="btn btn-default">导出报表</button></div>
    </div>

    <div class="stat-cards">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-card-icon" :style="{ background:s.color+'15', color:s.color, fontSize:'20px' }">&#9632;</div>
        <div class="stat-card-content">
          <div class="stat-card-label">{{ s.label }}</div>
          <div class="stat-card-value font-num">{{ s.value }}<span class="stat-card-unit">{{ s.unit }}</span></div>
        </div>
      </div>
    </div>

    <div class="chart-grid mb-3">
      <div class="chart-card">
        <div class="chart-card-header"><span class="chart-card-title">月度租赁金额 vs 出售金额</span></div>
        <div ref="barChartRef" class="chart-box"></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header"><span class="chart-card-title">房源去化率趋势</span></div>
        <div ref="lineChartRef" class="chart-box"></div>
      </div>
    </div>

    <div class="chart-card mb-3">
      <div class="chart-card-header"><span class="chart-card-title">各类房源租售分布</span></div>
      <div ref="groupChartRef" class="chart-box"></div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">租售成交明细</span></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>房源编号</th><th>房源类型</th><th>面积(㎡)</th><th>租售类型</th><th>成交金额</th><th>成交时间</th><th>客户名称</th></tr></thead>
          <tbody>
            <tr v-for="(r, i) in tableData" :key="i">
              <td class="font-semibold">{{ r.code }}</td>
              <td><span class="tag">{{ r.type }}</span></td>
              <td class="font-num">{{ r.area }}</td>
              <td><span class="badge" :class="r.leaseType==='租赁'?'badge-blue':'badge-purple'">{{ r.leaseType }}</span></td>
              <td class="font-num">{{ r.amount }}</td>
              <td class="text-gray">{{ r.time }}</td>
              <td>{{ r.customer }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
