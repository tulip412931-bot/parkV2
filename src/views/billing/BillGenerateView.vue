<script setup>
import { ref } from 'vue'

const area = ref('')
const buildings = ref([])
const chargeItem = ref('')
const periodFrom = ref('2026-01')
const periodTo = ref('2026-03')
const method = ref('按面积')

const previewCount = ref(0)
const previewAmount = ref(0)
const showPreview = ref(false)

const buildingOptions = ['A栋', 'B栋', 'C栋', 'D栋', 'E栋']
const chargeItems = ['物业费', '租金', '水费', '电费', '停车费', '垃圾处理费']
const methods = ['按面积', '按户', '按用量']

const history = ref([
  { time: '2026-03-01 09:15', operator: '管理员A', item: '物业费', building: 'A栋,B栋', count: 28, amount: 45800, status: '已完成' },
  { time: '2026-02-28 14:30', operator: '管理员B', item: '租金', building: 'C栋', count: 12, amount: 128000, status: '已完成' },
  { time: '2026-02-01 10:00', operator: '管理员A', item: '水费', building: 'A栋,B栋,C栋', count: 42, amount: 3200, status: '已完成' },
  { time: '2026-01-31 16:45', operator: '管理员C', item: '电费', building: 'B栋', count: 14, amount: 8600, status: '已撤销' },
  { time: '2026-01-15 11:20', operator: '管理员A', item: '停车费', building: '全部', count: 8, amount: 4800, status: '已完成' }
])

const statusClass = (s) => s === '已完成' ? 'badge-green' : 'badge-red'

function handlePreview() {
  previewCount.value = Math.floor(Math.random() * 30) + 10
  previewAmount.value = Math.floor(Math.random() * 100000) + 5000
  showPreview.value = true
}

function handleReset() {
  area.value = ''; buildings.value = []; chargeItem.value = ''
  periodFrom.value = '2026-01'; periodTo.value = '2026-03'
  method.value = '按面积'; showPreview.value = false
}

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">生成账单</h1>
      <p class="page-subtitle">按条件批量生成收费账单</p>
    </div>

    <div class="card mb-3">
      <div class="card-header"><h3 class="card-title">账单生成条件</h3></div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label required">管理区</label>
          <select v-model="area" class="form-select">
            <option value="">请选择</option><option>坤煌（长寿）食品产业园</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">楼宇（多选）</label>
          <select v-model="buildings" multiple class="form-select" style="min-height:80px;">
            <option v-for="b in buildingOptions" :key="b">{{ b }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">收费项目</label>
          <select v-model="chargeItem" class="form-select">
            <option value="">请选择</option>
            <option v-for="c in chargeItems" :key="c">{{ c }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">生成方式</label>
          <select v-model="method" class="form-select">
            <option v-for="m in methods" :key="m">{{ m }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label required">起始月份</label>
          <input v-model="periodFrom" type="month" class="form-input">
        </div>
        <div class="form-group">
          <label class="form-label required">截止月份</label>
          <input v-model="periodTo" type="month" class="form-input">
        </div>
      </div>

      <div v-if="showPreview" class="summary-row mt-2">
        <div class="summary-item">
          <span class="summary-label">影响房间数：</span>
          <span class="summary-value">{{ previewCount }} 间</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">预估总金额：</span>
          <span class="summary-value text-primary">¥{{ fmt(previewAmount) }}</span>
        </div>
      </div>

      <div class="btn-group mt-2">
        <button class="btn btn-default" @click="handlePreview">预览</button>
        <button class="btn btn-primary">生成账单</button>
        <button class="btn btn-default" @click="handleReset">重置</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3 class="card-title">最近生成记录</h3></div>
      <table class="data-table">
        <thead>
          <tr><th>生成时间</th><th>操作人</th><th>收费项目</th><th>楼宇</th><th>账单数</th><th>总金额</th><th>状态</th></tr>
        </thead>
        <tbody>
          <tr v-for="(h, i) in history" :key="i">
            <td>{{ h.time }}</td>
            <td>{{ h.operator }}</td>
            <td>{{ h.item }}</td>
            <td>{{ h.building }}</td>
            <td class="font-num">{{ h.count }}</td>
            <td class="font-num">¥{{ fmt(h.amount) }}</td>
            <td><span class="badge" :class="statusClass(h.status)">{{ h.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
