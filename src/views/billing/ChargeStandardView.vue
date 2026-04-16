<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const editingId = ref(null)
const form = ref({ name: '', feeType: '', method: '', price: '', unit: '', building: '', effectDate: '' })

const feeTypes = ['物业费', '租金', '水费', '电费', '停车费', '公摊水费', '公摊电费', '垃圾清运费']
const billingMethods = ['按面积', '按户', '按用量', '固定金额']
const units = ['元/㎡/月', '元/户/月', '元/吨', '元/度', '元/月', '元/立方']
const buildings = ['全部楼宇', 'A栋', 'B栋', 'C栋', 'A栋+B栋']

const standards = ref([
  { id: 1, name: '物业费标准(A栋)', feeType: '物业费', method: '按面积', price: 2.50, unit: '元/㎡/月', building: 'A栋', effectDate: '2026-01-01', enabled: true },
  { id: 2, name: '物业费标准(B栋)', feeType: '物业费', method: '按面积', price: 2.80, unit: '元/㎡/月', building: 'B栋', effectDate: '2026-01-01', enabled: true },
  { id: 3, name: '租金标准(A栋)', feeType: '租金', method: '按面积', price: 25.00, unit: '元/㎡/月', building: 'A栋', effectDate: '2026-01-01', enabled: true },
  { id: 4, name: '租金标准(B栋)', feeType: '租金', method: '按面积', price: 22.00, unit: '元/㎡/月', building: 'B栋', effectDate: '2026-01-01', enabled: true },
  { id: 5, name: '生活用水', feeType: '水费', method: '按用量', price: 3.50, unit: '元/吨', building: '全部楼宇', effectDate: '2026-01-01', enabled: true },
  { id: 6, name: '商业用电', feeType: '电费', method: '按用量', price: 0.85, unit: '元/度', building: '全部楼宇', effectDate: '2026-01-01', enabled: true },
  { id: 7, name: '地面停车', feeType: '停车费', method: '固定金额', price: 300.00, unit: '元/月', building: '全部楼宇', effectDate: '2026-01-01', enabled: true },
  { id: 8, name: '地下停车', feeType: '停车费', method: '固定金额', price: 500.00, unit: '元/月', building: '全部楼宇', effectDate: '2026-03-01', enabled: true },
  { id: 9, name: '公摊水费标准', feeType: '公摊水费', method: '按面积', price: 0.30, unit: '元/㎡/月', building: '全部楼宇', effectDate: '2026-01-01', enabled: true },
  { id: 10, name: '公摊电费标准', feeType: '公摊电费', method: '按面积', price: 0.50, unit: '元/㎡/月', building: '全部楼宇', effectDate: '2026-01-01', enabled: true },
  { id: 11, name: '垃圾清运费', feeType: '垃圾清运费', method: '按户', price: 50.00, unit: '元/户/月', building: '全部楼宇', effectDate: '2026-01-01', enabled: true },
  { id: 12, name: '临时用电(旧)', feeType: '电费', method: '按用量', price: 1.20, unit: '元/度', building: 'C栋', effectDate: '2025-06-01', enabled: false }
])

function openCreate() {
  editingId.value = null
  form.value = { name: '', feeType: '', method: '', price: '', unit: '', building: '', effectDate: '' }
  showModal.value = true
}
function openEdit(item) {
  editingId.value = item.id
  form.value = { name: item.name, feeType: item.feeType, method: item.method, price: String(item.price), unit: item.unit, building: item.building, effectDate: item.effectDate }
  showModal.value = true
}
function saveForm() { showModal.value = false }
function toggleStatus(item) { item.enabled = !item.enabled }
function copyStandard(item) {
  const newItem = { ...item, id: Date.now(), name: item.name + '(副本)', enabled: false }
  standards.value.push(newItem)
}
function fmt(n) { return Number(n).toFixed(2) }
</script>

<template>
  <div class="charge-standard">
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">收费标准设置</h1>
        <p class="page-subtitle">管理园区各项收费标准</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">新建标准</button>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>标准名称</th><th>收费项目</th><th>计费方式</th><th>单价</th><th>单位</th><th>适用楼宇</th><th>生效日期</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in standards" :key="item.id">
              <td class="font-medium">{{ item.name }}</td>
              <td>{{ item.feeType }}</td>
              <td><span class="badge badge-blue">{{ item.method }}</span></td>
              <td class="font-num">{{ fmt(item.price) }}</td>
              <td class="text-gray">{{ item.unit }}</td>
              <td>{{ item.building }}</td>
              <td class="text-gray text-sm">{{ item.effectDate }}</td>
              <td><span class="badge" :class="item.enabled ? 'badge-green' : 'badge-gray'">{{ item.enabled ? '启用' : '停用' }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm" @click="openEdit(item)">编辑</button>
                  <button class="btn btn-text btn-sm" @click="copyStandard(item)">复制</button>
                  <button class="btn btn-text btn-sm" :class="item.enabled ? 'danger' : ''" @click="toggleStatus(item)">{{ item.enabled ? '停用' : '启用' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingId ? '编辑收费标准' : '新建收费标准' }}</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">标准名称</label>
              <input v-model="form.name" class="form-input" placeholder="请输入标准名称" />
            </div>
            <div class="form-group">
              <label class="form-label required">收费项目</label>
              <select v-model="form.feeType" class="form-select"><option value="">请选择</option><option v-for="f in feeTypes" :key="f">{{ f }}</option></select>
            </div>
            <div class="form-group">
              <label class="form-label required">计费方式</label>
              <select v-model="form.method" class="form-select"><option value="">请选择</option><option v-for="m in billingMethods" :key="m">{{ m }}</option></select>
            </div>
            <div class="form-group">
              <label class="form-label required">单价</label>
              <input v-model="form.price" class="form-input" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div class="form-group">
              <label class="form-label required">单位</label>
              <select v-model="form.unit" class="form-select"><option value="">请选择</option><option v-for="u in units" :key="u">{{ u }}</option></select>
            </div>
            <div class="form-group">
              <label class="form-label required">适用楼宇</label>
              <select v-model="form.building" class="form-select"><option value="">请选择</option><option v-for="b in buildings" :key="b">{{ b }}</option></select>
            </div>
            <div class="form-group full-width">
              <label class="form-label required">生效日期</label>
              <input v-model="form.effectDate" class="form-input" type="date" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="saveForm">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charge-standard { max-width: 1400px; }
</style>
