<script setup>
import { ref, computed } from 'vue'

const filterArea = ref('')
const filterBuilding = ref('')
const filterType = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 10

const statusMap = {
  '空置': 'badge-orange',
  '自用': 'badge-blue',
  '已出租': 'badge-green',
  '已出售': 'badge-gray'
}

const resources = ref([
  { id: 'RES-2024-0001', building: 'A栋', room: '03-01', type: '商铺', buildArea: 120.5, useArea: 102.3, direction: '南', status: '已出租', customer: '重庆鑫旺食品有限公司', steward: '张明' },
  { id: 'RES-2024-0002', building: 'A栋', room: '03-02', type: '商铺', buildArea: 85.2, useArea: 72.1, direction: '南', status: '空置', customer: '', steward: '张明' },
  { id: 'RES-2024-0003', building: 'A栋', room: '03-03', type: '办公', buildArea: 150.0, useArea: 128.5, direction: '东', status: '已出租', customer: '四川味道餐饮管理公司', steward: '李娜' },
  { id: 'RES-2024-0004', building: 'A栋', room: '03-04', type: '仓库', buildArea: 200.0, useArea: 195.0, direction: '北', status: '自用', customer: '园区物业', steward: '李娜' },
  { id: 'RES-2024-0005', building: 'B栋', room: '04-01', type: '商铺', buildArea: 95.8, useArea: 82.0, direction: '南', status: '已出租', customer: '长寿湖渔业有限公司', steward: '王强' },
  { id: 'RES-2024-0006', building: 'B栋', room: '04-02', type: '办公', buildArea: 110.3, useArea: 96.5, direction: '西', status: '空置', customer: '', steward: '王强' },
  { id: 'RES-2024-0007', building: 'B栋', room: '05-01', type: '住宅', buildArea: 78.6, useArea: 65.2, direction: '南', status: '已出售', customer: '张伟', steward: '赵丽' },
  { id: 'RES-2024-0008', building: 'C栋', room: '06-01', type: '商铺', buildArea: 160.0, useArea: 140.5, direction: '东南', status: '已出租', customer: '重庆辣妹子食品厂', steward: '赵丽' },
  { id: 'RES-2024-0009', building: 'C栋', room: '06-02', type: '车位', buildArea: 15.0, useArea: 15.0, direction: '-', status: '已出售', customer: '李芳', steward: '张明' },
  { id: 'RES-2024-0010', building: 'C栋', room: '07-01', type: '仓库', buildArea: 300.0, useArea: 290.0, direction: '北', status: '已出租', customer: '坤煌冷链物流公司', steward: '李娜' },
  { id: 'RES-2024-0011', building: 'D栋', room: '08-01', type: '办公', buildArea: 132.0, useArea: 115.8, direction: '南', status: '空置', customer: '', steward: '王强' },
  { id: 'RES-2024-0012', building: 'D栋', room: '08-02', type: '商铺', buildArea: 88.5, useArea: 75.0, direction: '东', status: '已出租', customer: '渝味鲜食品有限公司', steward: '赵丽' },
  { id: 'RES-2024-0013', building: 'D栋', room: '09-01', type: '住宅', buildArea: 92.0, useArea: 78.5, direction: '西南', status: '已出租', customer: '陈杰', steward: '张明' },
  { id: 'RES-2024-0014', building: 'E栋', room: '10-01', type: '车位', buildArea: 15.0, useArea: 15.0, direction: '-', status: '空置', customer: '', steward: '李娜' },
  { id: 'RES-2024-0015', building: 'E栋', room: '10-02', type: '商铺', buildArea: 105.0, useArea: 90.2, direction: '南', status: '已出租', customer: '巴渝食品加工厂', steward: '王强' },
  { id: 'RES-2024-0016', building: 'E栋', room: '11-01', type: '仓库', buildArea: 250.0, useArea: 242.0, direction: '北', status: '自用', customer: '园区物业', steward: '赵丽' },
  { id: 'RES-2024-0017', building: 'F栋', room: '12-01', type: '办公', buildArea: 145.0, useArea: 126.0, direction: '东', status: '已出租', customer: '重庆绿源农业公司', steward: '张明' },
  { id: 'RES-2024-0018', building: 'F栋', room: '13-01', type: '商铺', buildArea: 70.5, useArea: 60.0, direction: '南', status: '空置', customer: '', steward: '李娜' },
  { id: 'RES-2024-0019', building: 'F栋', room: '14-01', type: '住宅', buildArea: 85.0, useArea: 72.8, direction: '西', status: '已出售', customer: '王丽华', steward: '王强' },
  { id: 'RES-2024-0020', building: 'F栋', room: '4-1', type: '商铺', buildArea: 130.0, useArea: 112.5, direction: '南', status: '已出租', customer: '长寿特产批发中心', steward: '赵丽' }
])

const filtered = computed(() => {
  return resources.value.filter(r => {
    if (filterBuilding.value && r.building !== filterBuilding.value) return false
    if (filterType.value && r.type !== filterType.value) return false
    if (filterStatus.value && r.status !== filterStatus.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">物业资源管理</h1>
      <p class="page-subtitle">坤煌（长寿）食品产业园 - 房产资源台账</p>
    </div>

    <div class="card mb-3">
      <div class="filter-bar">
        <select v-model="filterArea" class="form-select">
          <option value="">全部管理区</option>
          <option>坤煌（长寿）食品产业园</option>
        </select>
        <select v-model="filterBuilding" class="form-select">
          <option value="">全部楼宇</option>
          <option>A栋</option><option>B栋</option><option>C栋</option>
          <option>D栋</option><option>E栋</option><option>F栋</option>
        </select>
        <select v-model="filterType" class="form-select">
          <option value="">全部资源类型</option>
          <option>住宅</option><option>商铺</option><option>办公</option>
          <option>车位</option><option>仓库</option>
        </select>
        <select v-model="filterStatus" class="form-select">
          <option value="">全部使用状态</option>
          <option>空置</option><option>自用</option><option>已出租</option><option>已出售</option>
        </select>
        <div class="filter-actions">
          <button class="btn btn-primary">+ 新建资源</button>
          <button class="btn btn-default">导入</button>
          <button class="btn btn-default">导出</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>资源编号</th><th>楼宇</th><th>房号</th><th>资源类型</th>
              <th>建筑面积(㎡)</th><th>使用面积(㎡)</th><th>朝向</th>
              <th>使用状态</th><th>绑定客户</th><th>管家</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-medium">{{ row.id }}</td>
              <td>{{ row.building }}</td>
              <td>{{ row.room }}</td>
              <td>{{ row.type }}</td>
              <td class="font-num">{{ row.buildArea.toFixed(1) }}</td>
              <td class="font-num">{{ row.useArea.toFixed(1) }}</td>
              <td>{{ row.direction }}</td>
              <td><span class="badge" :class="statusMap[row.status]">{{ row.status }}</span></td>
              <td class="truncate" style="max-width:140px">{{ row.customer || '-' }}</td>
              <td>{{ row.steward }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm">查看</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条记录</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button
            v-for="p in totalPages" :key="p"
            class="pagination-btn" :class="{ active: p === currentPage }"
            @click="currentPage = p"
          >{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
</style>
