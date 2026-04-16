<script setup>
import { ref, computed } from 'vue'

const searchKey = ref('')
const selectedRoom = ref(null)

const treeData = [
  { label: '坤煌（长寿）食品产业园', children: [
    { label: '03-14', rooms: ['03-14-01','03-14-02','03-14-03','03-14-04','03-14-05','03-14-06'] },
    { label: '4-1', rooms: ['4-1-01','4-1-02','4-1-03','4-1-04'] },
    { label: '物业用房', rooms: ['物业-01','物业-02','物业-03','物业-04'] }
  ]}
]

const expandedNodes = ref(['坤煌（长寿）食品产业园'])
const activeBuilding = ref('03-14')

function toggleNode(label) {
  const idx = expandedNodes.value.indexOf(label)
  if (idx >= 0) expandedNodes.value.splice(idx, 1)
  else expandedNodes.value.push(label)
}

const currentBuilding = computed(() => {
  for (const park of treeData) {
    const b = park.children.find(c => c.label === activeBuilding.value)
    if (b) return b
  }
  return treeData[0].children[0]
})

const customers = {
  '03-14-01': { name: '重庆星辰科技有限公司', contact: '张伟', phone: '138****2345' },
  '03-14-02': { name: '四川云图数据有限公司', contact: '李芳', phone: '139****6789' },
  '03-14-03': { name: '重庆智远物联有限公司', contact: '王强', phone: '158****1234' },
  '4-1-01': { name: '成都蓝海软件有限公司', contact: '刘敏', phone: '188****5678' },
  '物业-01': { name: '坤煌物业管理处', contact: '陈静', phone: '166****9012' }
}

const feeItems = [
  { name: '物业费', period: '2026-04', due: 3200.00, paid: 0, arrears: 3200.00 },
  { name: '租金', period: '2026-04', due: 15000.00, paid: 15000.00, arrears: 0 },
  { name: '水费', period: '2026-03', due: 186.50, paid: 186.50, arrears: 0 },
  { name: '电费', period: '2026-03', due: 542.80, paid: 542.80, arrears: 0 }
]

function selectRoom(room) { selectedRoom.value = room }
function getCustomer(room) { return customers[room] || { name: '空置', contact: '-', phone: '-' } }

const filteredRooms = computed(() => {
  const rooms = currentBuilding.value.rooms || []
  if (!searchKey.value) return rooms
  return rooms.filter(r => r.includes(searchKey.value))
})

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div class="charge-center">
    <!-- Search -->
    <div class="filter-bar">
      <div class="search-input-wrapper">
        <span class="search-input-icon">&#128269;</span>
        <input v-model="searchKey" class="form-input" placeholder="客户姓名/联系电话/资源代码/合同编号/合同名称" />
      </div>
    </div>

    <div class="center-layout">
      <!-- Left tree -->
      <div class="tree-panel card">
        <div class="card-header"><h3 class="card-title">楼宇列表</h3></div>
        <div v-for="park in treeData" :key="park.label" class="tree-root">
          <div class="tree-node" @click="toggleNode(park.label)">
            <span class="tree-arrow" :class="{ open: expandedNodes.includes(park.label) }">&#9654;</span>
            <span class="font-medium">{{ park.label }}</span>
          </div>
          <div v-if="expandedNodes.includes(park.label)" class="tree-children">
            <div v-for="child in park.children" :key="child.label"
              class="tree-leaf" :class="{ active: activeBuilding === child.label }"
              @click="activeBuilding = child.label; selectedRoom = null">
              {{ child.label }}
              <span class="tag">{{ child.rooms.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right content -->
      <div class="content-panel">
        <!-- Room grid -->
        <div class="card mb-2">
          <div class="card-header">
            <h3 class="card-title">{{ activeBuilding }} - 房间列表</h3>
            <span class="text-sm text-gray">共 {{ filteredRooms.length }} 间</span>
          </div>
          <div class="room-grid">
            <div v-for="room in filteredRooms" :key="room"
              class="room-item" :class="{ active: selectedRoom === room, occupied: !!customers[room] }"
              @click="selectRoom(room)">
              <div class="room-icon">&#127970;</div>
              <div class="room-label">{{ room }}</div>
              <span v-if="customers[room]" class="badge badge-green" style="font-size:10px;">已租</span>
              <span v-else class="badge badge-gray" style="font-size:10px;">空置</span>
            </div>
          </div>
        </div>

        <!-- Detail panel -->
        <div v-if="selectedRoom" class="card animate-fadeIn">
          <div class="card-header">
            <h3 class="card-title">{{ selectedRoom }} 收费详情</h3>
            <div class="btn-group">
              <button class="btn btn-primary btn-sm">收费</button>
              <button class="btn btn-default btn-sm">打印收据</button>
            </div>
          </div>
          <div class="detail-info mb-2">
            <div class="detail-row"><span class="detail-label">客户名称</span><span class="font-medium">{{ getCustomer(selectedRoom).name }}</span></div>
            <div class="detail-row"><span class="detail-label">联系人</span><span>{{ getCustomer(selectedRoom).contact }}</span></div>
            <div class="detail-row"><span class="detail-label">联系电话</span><span>{{ getCustomer(selectedRoom).phone }}</span></div>
            <div class="detail-row"><span class="detail-label">房间编号</span><span>{{ selectedRoom }}</span></div>
          </div>
          <table class="data-table">
            <thead><tr><th>收费项目</th><th>应收期间</th><th>应收金额</th><th>实收金额</th><th>欠费</th></tr></thead>
            <tbody>
              <tr v-for="f in feeItems" :key="f.name">
                <td class="font-medium">{{ f.name }}</td>
                <td class="text-gray">{{ f.period }}</td>
                <td class="font-num">¥{{ fmt(f.due) }}</td>
                <td class="font-num text-success">¥{{ fmt(f.paid) }}</td>
                <td class="font-num" :class="f.arrears > 0 ? 'text-danger' : ''">¥{{ fmt(f.arrears) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.center-layout { display: flex; gap: 16px; }
.tree-panel { width: 260px; flex-shrink: 0; }
.content-panel { flex: 1; min-width: 0; }
.tree-node { display: flex; align-items: center; gap: 6px; padding: 8px 12px; cursor: pointer; border-radius: var(--radius); }
.tree-node:hover { background: var(--gray-50); }
.tree-arrow { font-size: 10px; color: var(--gray-400); transition: transform 0.2s; display: inline-block; }
.tree-arrow.open { transform: rotate(90deg); }
.tree-children { padding-left: 20px; }
.tree-leaf { padding: 8px 14px; cursor: pointer; border-radius: var(--radius); font-size: 13px; color: var(--gray-700); display: flex; align-items: center; justify-content: space-between; }
.tree-leaf:hover { background: var(--gray-50); }
.tree-leaf.active { background: var(--primary-bg); color: var(--primary); font-weight: 500; }
.room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; }
.room-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px 8px; border: 1px solid var(--gray-200); border-radius: var(--radius-lg); cursor: pointer; transition: var(--transition); text-align: center; }
.room-item:hover { border-color: var(--primary-light); box-shadow: var(--shadow-md); }
.room-item.active { border-color: var(--primary); background: var(--primary-bg); }
.room-item.occupied { border-left: 3px solid var(--success); }
.room-icon { font-size: 28px; }
.room-label { font-size: 12px; font-weight: 500; color: var(--gray-700); }
.detail-info { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; }
.detail-row { display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 4px 0; }
.detail-label { color: var(--gray-500); min-width: 70px; }
@media (max-width: 900px) { .center-layout { flex-direction: column; } .tree-panel { width: 100%; } }
</style>
