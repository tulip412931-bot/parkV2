<script setup>
import { ref, computed } from 'vue'

const filterArea = ref('')
const searchKey = ref('')
const currentPage = ref(1)
const pageSize = 10

const stewards = ref([
  { id: 1, name: '张明', phone: '13812345001', area: '坤煌（长寿）食品产业园', buildings: 'A栋/B栋', rooms: 48, totalArea: 5860.5, joinDate: '2021-03-15', status: '在职' },
  { id: 2, name: '李娜', phone: '13812345002', area: '坤煌（长寿）食品产业园', buildings: 'C栋/D栋', rooms: 52, totalArea: 6320.0, joinDate: '2021-06-01', status: '在职' },
  { id: 3, name: '王强', phone: '13812345003', area: '坤煌（长寿）食品产业园', buildings: 'E栋/F栋', rooms: 45, totalArea: 5480.3, joinDate: '2022-01-10', status: '在职' },
  { id: 4, name: '赵丽', phone: '13812345004', area: '坤煌（江津）双福园区', buildings: 'A栋', rooms: 30, totalArea: 3650.0, joinDate: '2022-04-20', status: '在职' },
  { id: 5, name: '陈伟', phone: '13812345005', area: '坤煌（江津）双福园区', buildings: 'B栋', rooms: 28, totalArea: 3420.8, joinDate: '2022-07-15', status: '在职' },
  { id: 6, name: '刘芳', phone: '13812345006', area: '坤煌（长寿）食品产业园', buildings: 'G栋', rooms: 22, totalArea: 2680.0, joinDate: '2023-02-01', status: '在职' },
  { id: 7, name: '杨洋', phone: '13812345007', area: '坤煌（江津）双福园区', buildings: 'C栋', rooms: 35, totalArea: 4200.5, joinDate: '2023-05-10', status: '在职' },
  { id: 8, name: '黄磊', phone: '13812345008', area: '坤煌（长寿）食品产业园', buildings: 'H栋', rooms: 18, totalArea: 2150.0, joinDate: '2020-09-01', status: '离职' },
  { id: 9, name: '周婷', phone: '13812345009', area: '坤煌（江津）双福园区', buildings: 'D栋', rooms: 26, totalArea: 3180.2, joinDate: '2023-08-20', status: '在职' },
  { id: 10, name: '吴杰', phone: '13812345010', area: '坤煌（长寿）食品产业园', buildings: 'I栋', rooms: 20, totalArea: 2400.0, joinDate: '2021-11-15', status: '离职' },
])

const filtered = computed(() => {
  return stewards.value.filter(s => {
    if (filterArea.value && s.area !== filterArea.value) return false
    if (searchKey.value && !s.name.includes(searchKey.value) && !s.phone.includes(searchKey.value)) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">管家管理</h1>
      <p class="page-subtitle">管理物业管家人员及其负责区域分配</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterArea" class="form-select">
        <option value="">全部管理区</option>
        <option>坤煌（长寿）食品产业园</option>
        <option>坤煌（江津）双福园区</option>
      </select>
      <div class="search-input-wrapper">
        <span class="search-input-icon">&#128269;</span>
        <input v-model="searchKey" class="form-input" placeholder="搜索姓名/手机号" />
      </div>
      <div class="filter-actions">
        <button class="btn btn-primary">+ 新建管家</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>姓名</th><th>手机号</th><th>管理区域</th><th>管理楼宇</th>
              <th>管理户数</th><th>管理面积(㎡)</th><th>入职日期</th><th>状态</th><th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-medium">{{ row.name }}</td>
              <td class="font-num">{{ row.phone }}</td>
              <td class="truncate" style="max-width:180px">{{ row.area }}</td>
              <td>{{ row.buildings }}</td>
              <td class="font-num">{{ row.rooms }}</td>
              <td class="font-num">{{ row.totalArea.toFixed(1) }}</td>
              <td>{{ row.joinDate }}</td>
              <td><span class="badge" :class="row.status === '在职' ? 'badge-green' : 'badge-gray'">{{ row.status }}</span></td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button class="btn btn-text btn-sm">查看</button>
                  <button class="btn btn-text btn-sm">分配</button>
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
