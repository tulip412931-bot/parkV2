<script setup>
import { ref, computed } from 'vue'

const name = ref('')
const totalAmount = ref(10000)
const method = ref('按面积')
const area = ref('')
const building = ref('全部')
const showPreview = ref(false)

const methods = ['按面积', '按户数', '自定义比例']
const names = ['张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄丽','周杰','吴敏','孙涛','马丽','朱军','胡明']
const areas = [120.5, 85.3, 200.0, 150.8, 95.2, 180.6, 110.3, 220.0, 75.5, 160.4, 135.7, 90.1, 170.2, 105.8]
const totalArea = computed(() => areas.reduce((s, a) => s + a, 0))

const previewRows = computed(() => names.map((n, i) => {
  const areaVal = areas[i]
  let ratio, amt
  if (method.value === '按面积') {
    ratio = areaVal / totalArea.value
    amt = totalAmount.value * ratio
  } else if (method.value === '按户数') {
    ratio = 1 / names.length
    amt = totalAmount.value / names.length
  } else {
    ratio = areaVal / totalArea.value
    amt = totalAmount.value * ratio
  }
  return {
    room: `${['A', 'B', 'C'][i % 3]}栋${Math.floor(i / 3 + 1)}0${(i % 5) + 1}`,
    customer: n, area: areaVal,
    ratio: (ratio * 100).toFixed(2),
    amount: amt.toFixed(2)
  }
}))

const history = ref([
  { time: '2026-03-15 10:30', name: '3月公共水费分摊', total: 8500, method: '按面积', building: 'A栋,B栋', rooms: 14, status: '已确认' },
  { time: '2026-02-20 14:00', name: '2月电梯维保分摊', total: 12000, method: '按户数', building: '全部', rooms: 28, status: '已确认' },
  { time: '2026-01-18 09:45', name: '1月绿化费分摊', total: 6200, method: '按面积', building: 'C栋', rooms: 10, status: '已撤销' }
])

const historyStatusClass = (s) => s === '已确认' ? 'badge-green' : 'badge-red'

function handleCalc() { showPreview.value = true }

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">固定金额分摊</h1>
      <p class="page-subtitle">将固定金额按规则分摊到各房间</p>
    </div>

    <div class="card mb-3">
      <div class="card-header"><h3 class="card-title">分摊设置</h3></div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label required">分摊名称</label>
          <input v-model="name" class="form-input" placeholder="如：3月公共水费分摊">
        </div>
        <div class="form-group">
          <label class="form-label required">总金额</label>
          <input v-model.number="totalAmount" type="number" class="form-input" placeholder="请输入总金额">
        </div>
        <div class="form-group">
          <label class="form-label required">分摊方式</label>
          <select v-model="method" class="form-select">
            <option v-for="m in methods" :key="m">{{ m }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">管理区</label>
          <select v-model="area" class="form-select">
            <option value="">请选择</option><option>坤煌（长寿）食品产业园</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">楼宇</label>
          <select v-model="building" class="form-select">
            <option>全部</option><option>A栋</option><option>B栋</option><option>C栋</option>
          </select>
        </div>
      </div>
      <div class="btn-group mt-2">
        <button class="btn btn-default" @click="handleCalc">计算预览</button>
        <button class="btn btn-primary" :disabled="!showPreview">确认分摊</button>
      </div>
    </div>

    <div v-if="showPreview" class="card mb-3">
      <div class="card-header">
        <h3 class="card-title">分摊预览</h3>
        <span class="text-sm font-bold">总金额 ¥{{ fmt(totalAmount) }} | 方式：{{ method }}</span>
      </div>
      <table class="data-table">
        <thead><tr><th>房号</th><th>客户名称</th><th>面积(㎡)</th><th>分摊比例</th><th>分摊金额</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in previewRows" :key="i">
            <td class="font-medium">{{ r.room }}</td>
            <td>{{ r.customer }}</td>
            <td class="font-num">{{ r.area }}</td>
            <td class="font-num">{{ r.ratio }}%</td>
            <td class="font-num text-primary">¥{{ r.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header"><h3 class="card-title">历史分摊记录</h3></div>
      <table class="data-table">
        <thead>
          <tr><th>分摊时间</th><th>分摊名称</th><th>总金额</th><th>分摊方式</th><th>楼宇</th><th>房间数</th><th>状态</th></tr>
        </thead>
        <tbody>
          <tr v-for="(h, i) in history" :key="i">
            <td>{{ h.time }}</td>
            <td class="font-medium">{{ h.name }}</td>
            <td class="font-num">¥{{ fmt(h.total) }}</td>
            <td>{{ h.method }}</td>
            <td>{{ h.building }}</td>
            <td>{{ h.rooms }}</td>
            <td><span class="badge" :class="historyStatusClass(h.status)">{{ h.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
