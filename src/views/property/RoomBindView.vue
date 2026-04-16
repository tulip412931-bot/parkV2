<script setup>
import { ref, computed } from 'vue'

const filterArea = ref('')
const filterBuilding = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 10

const rooms = ref([
  { building: 'A栋', room: '0301', area: 120.5, owner: '李明华', phone: '13900001001', bound: true, bindTime: '2024-03-15' },
  { building: 'A栋', room: '0302', area: 85.2, owner: '张秀英', phone: '13900001002', bound: true, bindTime: '2024-03-18' },
  { building: 'A栋', room: '0303', area: 150.0, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'A栋', room: '0304', area: 200.0, owner: '王建国', phone: '13900001004', bound: true, bindTime: '2024-04-01' },
  { building: 'B栋', room: '0401', area: 95.8, owner: '赵德发', phone: '13900001005', bound: true, bindTime: '2024-04-10' },
  { building: 'B栋', room: '0402', area: 110.3, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'B栋', room: '0403', area: 78.6, owner: '刘翠花', phone: '13900001007', bound: true, bindTime: '2024-05-01' },
  { building: 'B栋', room: '0501', area: 160.0, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'C栋', room: '0601', area: 130.0, owner: '陈志强', phone: '13900001009', bound: true, bindTime: '2024-05-20' },
  { building: 'C栋', room: '0602', area: 88.5, owner: '孙丽萍', phone: '13900001010', bound: true, bindTime: '2024-06-01' },
  { building: 'C栋', room: '0701', area: 105.0, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'C栋', room: '0702', area: 92.0, owner: '周文斌', phone: '13900001012', bound: true, bindTime: '2024-06-15' },
  { building: 'D栋', room: '0801', area: 132.0, owner: '吴秀梅', phone: '13900001013', bound: true, bindTime: '2024-07-01' },
  { building: 'D栋', room: '0802', area: 145.0, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'D栋', room: '0901', area: 70.5, owner: '杨国强', phone: '13900001015', bound: true, bindTime: '2024-07-20' },
  { building: 'E栋', room: '1001', area: 85.0, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'E栋', room: '1002', area: 250.0, owner: '黄建军', phone: '13900001017', bound: true, bindTime: '2024-08-01' },
  { building: 'E栋', room: '1101', area: 300.0, owner: '何晓红', phone: '13900001018', bound: true, bindTime: '2024-08-15' },
  { building: 'F栋', room: '1201', area: 115.8, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'F栋', room: '1301', area: 75.0, owner: '郑伟明', phone: '13900001020', bound: true, bindTime: '2024-09-01' },
  { building: 'F栋', room: '1302', area: 96.5, owner: '冯秀兰', phone: '13900001021', bound: true, bindTime: '2024-09-10' },
  { building: 'A栋', room: '0305', area: 102.3, owner: '', phone: '', bound: false, bindTime: '' },
  { building: 'B栋', room: '0504', area: 128.5, owner: '马建华', phone: '13900001023', bound: true, bindTime: '2024-10-01' },
  { building: 'C栋', room: '0703', area: 195.0, owner: '朱晓明', phone: '13900001024', bound: true, bindTime: '2024-10-15' },
  { building: 'D栋', room: '0903', area: 82.0, owner: '', phone: '', bound: false, bindTime: '' },
])

const filtered = computed(() => {
  return rooms.value.filter(r => {
    if (filterBuilding.value && r.building !== filterBuilding.value) return false
    if (filterStatus.value === 'bound' && !r.bound) return false
    if (filterStatus.value === 'unbound' && r.bound) return false
    return true
  })
})

const totalBound = computed(() => rooms.value.filter(r => r.bound).length)
const totalUnbound = computed(() => rooms.value.filter(r => !r.bound).length)
const bindRate = computed(() => ((totalBound.value / rooms.value.length) * 100).toFixed(1))

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize
  return filtered.value.slice(s, s + pageSize)
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">房间绑定业主状态统计表</h1>
      <p class="page-subtitle">房间与业主绑定情况管理</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterArea" class="form-select"><option value="">全部管理区</option><option>坤煌（长寿）食品产业园</option><option>坤煌（江津）双福园区</option></select>
      <select v-model="filterBuilding" class="form-select"><option value="">全部楼宇</option><option>A栋</option><option>B栋</option><option>C栋</option><option>D栋</option><option>E栋</option><option>F栋</option></select>
      <select v-model="filterStatus" class="form-select"><option value="">全部状态</option><option value="bound">已绑定</option><option value="unbound">未绑定</option></select>
    </div>

    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">总房间数</div><div class="stat-card-value">{{ rooms.length }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">已绑定业主</div><div class="stat-card-value text-success">{{ totalBound }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">未绑定</div><div class="stat-card-value text-warning">{{ totalUnbound }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">绑定率</div><div class="stat-card-value">{{ bindRate }}%</div></div></div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>楼宇</th><th>房号</th><th>面积(㎡)</th><th>业主姓名</th><th>联系电话</th><th>绑定状态</th><th>绑定时间</th></tr></thead>
          <tbody>
            <tr v-for="(row, i) in pagedData" :key="i">
              <td>{{ row.building }}</td>
              <td class="font-medium">{{ row.room }}</td>
              <td class="font-num">{{ row.area.toFixed(1) }}</td>
              <td>{{ row.owner || '-' }}</td>
              <td class="font-num">{{ row.phone || '-' }}</td>
              <td><span class="badge" :class="row.bound ? 'badge-green' : 'badge-gray'">{{ row.bound ? '已绑定' : '未绑定' }}</span></td>
              <td>{{ row.bindTime || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
