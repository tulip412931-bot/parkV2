<script setup>
import { ref, computed } from 'vue'

const showModal = ref(false)
const newItem = ref({ name: '', method: '按面积', price: '', unit: '元/㎡/月', scope: '全部', status: '启用' })

const billingMethods = ['按面积', '按户', '按用量', '固定金额']
const units = ['元/㎡/月', '元/户/月', '元/吨', '元/度', '元/月', '元/车位/月']

const feeItems = ref([
  { id: 1, code: 'FEE001', name: '物业费', method: '按面积', price: 2.50, unit: '元/㎡/月', scope: '全部楼宇', status: '启用' },
  { id: 2, code: 'FEE002', name: '租金', method: '按面积', price: 35.00, unit: '元/㎡/月', scope: '全部楼宇', status: '启用' },
  { id: 3, code: 'FEE003', name: '水费', method: '按用量', price: 4.80, unit: '元/吨', scope: '全部楼宇', status: '启用' },
  { id: 4, code: 'FEE004', name: '电费', method: '按用量', price: 1.20, unit: '元/度', scope: '全部楼宇', status: '启用' },
  { id: 5, code: 'FEE005', name: '停车费', method: '固定金额', price: 300.00, unit: '元/车位/月', scope: '地下车库', status: '启用' },
  { id: 6, code: 'FEE006', name: '公摊水费', method: '按面积', price: 0.50, unit: '元/㎡/月', scope: '全部楼宇', status: '启用' },
  { id: 7, code: 'FEE007', name: '公摊电费', method: '按面积', price: 0.80, unit: '元/㎡/月', scope: '全部楼宇', status: '启用' },
  { id: 8, code: 'FEE008', name: '垃圾清运费', method: '按户', price: 50.00, unit: '元/户/月', scope: '全部楼宇', status: '停用' }
])

function toggleStatus(item) {
  item.status = item.status === '启用' ? '停用' : '启用'
}

function openModal() {
  newItem.value = { name: '', method: '按面积', price: '', unit: '元/㎡/月', scope: '全部', status: '启用' }
  showModal.value = true
}

function saveItem() {
  if (!newItem.value.name || !newItem.value.price) return
  const nextId = feeItems.value.length + 1
  feeItems.value.push({
    id: nextId,
    code: 'FEE' + String(nextId).padStart(3, '0'),
    name: newItem.value.name,
    method: newItem.value.method,
    price: Number(newItem.value.price),
    unit: newItem.value.unit,
    scope: newItem.value.scope || '全部楼宇',
    status: '启用'
  })
  showModal.value = false
}

function fmt(n) { return Number(n).toFixed(2) }
</script>

<template>
  <div class="charge-settings">
    <div class="page-header">
      <h1 class="page-title">收费项目定义</h1>
      <p class="page-subtitle">定义和管理收费项目及计费规则</p>
    </div>

    <!-- Actions -->
    <div class="filter-bar">
      <div class="filter-actions" style="margin-left:0;">
        <button class="btn btn-primary" @click="openModal">新建收费项目</button>
        <button class="btn btn-default">导入</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>编号</th><th>收费项目名称</th><th>计费方式</th><th>单价</th><th>单位</th><th>适用范围</th><th>状态</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="item in feeItems" :key="item.id">
              <td class="font-num text-gray">{{ item.code }}</td>
              <td class="font-medium">{{ item.name }}</td>
              <td><span class="tag">{{ item.method }}</span></td>
              <td class="font-num">{{ fmt(item.price) }}</td>
              <td class="text-gray">{{ item.unit }}</td>
              <td>{{ item.scope }}</td>
              <td>
                <span class="badge" :class="item.status === '启用' ? 'badge-green' : 'badge-gray'">
                  <span class="badge-dot" :class="item.status === '启用' ? 'green' : 'gray'"></span>
                  {{ item.status }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm" :class="item.status === '启用' ? 'danger' : ''" @click="toggleStatus(item)">
                    {{ item.status === '启用' ? '停用' : '启用' }}
                  </button>
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
          <h3 class="modal-title">新建收费项目</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label required">收费项目名称</label>
            <input v-model="newItem.name" class="form-input" placeholder="请输入收费项目名称" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">计费方式</label>
              <select v-model="newItem.method" class="form-select">
                <option v-for="m in billingMethods" :key="m">{{ m }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">单价</label>
              <input v-model="newItem.price" type="number" class="form-input" placeholder="0.00" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">单位</label>
              <select v-model="newItem.unit" class="form-select">
                <option v-for="u in units" :key="u">{{ u }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">适用范围</label>
              <input v-model="newItem.scope" class="form-input" placeholder="全部楼宇" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="saveItem">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.charge-settings { max-width: 1400px; }
</style>
