<script setup>
import { ref, computed } from 'vue'
import { generateProperties, BUILDINGS, PROPERTY_TYPES, fmt } from '@/composables/useDemoData'

const allData = generateProperties(60)
const filters = ref({
  building: '',
  type: '',
  status: '',
  areaMin: '',
  areaMax: '',
  search: ''
})
const currentPage = ref(1)
const pageSize = 15

function doSearch() {
  currentPage.value = 1
}

const filtered = computed(() => {
  return allData.filter(row => {
    if (filters.value.building && row.building !== filters.value.building) return false
    if (filters.value.type && row.type !== filters.value.type) return false
    if (filters.value.status && row.status !== filters.value.status) return false
    if (filters.value.areaMin && row.area < Number(filters.value.areaMin)) return false
    if (filters.value.areaMax && row.area > Number(filters.value.areaMax)) return false
    if (filters.value.search) {
      const s = filters.value.search.toLowerCase()
      if (!row.code.toLowerCase().includes(s) && !row.building.includes(s) && !row.type.includes(s)) return false
    }
    return true
  })
})

const totalCount = computed(() => filtered.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))
const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const cur = currentPage.value
  let s = Math.max(1, cur - 2)
  let e = Math.min(total, s + 4)
  s = Math.max(1, e - 4)
  for (let i = s; i <= e; i++) pages.push(i)
  return pages
})

function statusBadge(status) {
  if (status === '待租') return 'badge-green'
  if (status === '已租') return 'badge-blue'
  if (status === '待售') return 'badge-orange'
  if (status === '已售') return 'badge-purple'
  return 'badge-gray'
}

function handleExport() {
  alert('导出功能开发中')
}
</script>

<template>
  <div style="max-width:1400px">
    <div class="page-note">
      <span>&#9432;</span>
      <span>信息由坤煌产业园统一发布，仅公布产业园联系电话</span>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">房源信息管理</div>
        <div class="flex gap-1">
          <button class="btn btn-primary" @click="allData.unshift">新增房源</button>
          <button class="btn btn-default" @click="handleExport">导出</button>
        </div>
      </div>

      <div class="filter-bar">
        <select v-model="filters.building" class="form-select">
          <option value="">全部楼栋</option>
          <option v-for="b in BUILDINGS" :key="b" :value="b">{{ b }}</option>
        </select>
        <select v-model="filters.type" class="form-select">
          <option value="">全部类型</option>
          <option v-for="t in PROPERTY_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="filters.status" class="form-select">
          <option value="">全部状态</option>
          <option value="待租">待租</option>
          <option value="已租">已租</option>
          <option value="待售">待售</option>
          <option value="已售">已售</option>
        </select>
        <input v-model="filters.areaMin" type="number" class="form-input" placeholder="面积最小" style="width:110px;min-width:auto" />
        <span style="color:#9ca3af">-</span>
        <input v-model="filters.areaMax" type="number" class="form-input" placeholder="面积最大" style="width:110px;min-width:auto" />
        <input v-model="filters.search" class="form-input" placeholder="搜索房源编号/楼栋" style="min-width:180px" />
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>

      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>房源编号</th>
              <th>楼栋</th>
              <th>楼层</th>
              <th>面积㎡</th>
              <th>类型</th>
              <th>租金(元/㎡/月)</th>
              <th>朝向</th>
              <th>配套</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-semibold">{{ row.code }}</td>
              <td>{{ row.building }}</td>
              <td>{{ row.floor }}</td>
              <td class="font-num">{{ fmt(row.area) }}</td>
              <td>{{ row.type }}</td>
              <td class="font-num">{{ row.price }}</td>
              <td>{{ row.orientation }}</td>
              <td class="truncate" style="max-width:200px" :title="row.facilities.join('、')">{{ row.facilities.join('、') }}</td>
              <td><span class="badge" :class="statusBadge(row.status)">{{ row.status }}</span></td>
              <td>
                <div class="flex gap-1">
                  <button class="btn btn-text btn-sm">编辑</button>
                  <button v-if="row.status === '待租' || row.status === '待售'" class="btn btn-text btn-sm">上架</button>
                  <button v-else class="btn btn-text btn-sm">下架</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination-info">共 {{ totalCount }} 条</div>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lsaquo;</button>
          <button v-for="p in visiblePages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&rsaquo;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
