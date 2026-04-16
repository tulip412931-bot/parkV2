<script setup>
import { ref, computed } from 'vue'

const area = ref('全部')
const building = ref('全部')
const search = ref('')
const currentPage = ref(1)
const pageSize = 10

const rows = ref(Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  room: `${['A', 'B', 'C'][i % 3]}栋${Math.floor(i / 3 + 1)}0${(i % 5) + 1}`,
  customer: ['张伟', '李娜', '王强', '刘洋', '陈静', '杨帆', '赵磊', '黄丽', '周杰', '吴敏', '孙涛', '马丽', '朱军', '胡明', '郭芳'][i],
  balance: [12500, 8300, 0, 5600, 23100, 1200, 9800, 15400, 3200, 7600, 18900, 450, 6700, 11200, 4500][i],
  lastTime: `2026-0${Math.floor(i % 4) + 1}-${String(10 + i).padStart(2, '0')}`,
  lastAmount: [5000, 3000, 0, 2000, 10000, 1000, 5000, 8000, 2000, 3000, 10000, 500, 3000, 5000, 2000][i]
})))

const filtered = computed(() => {
  let list = rows.value
  if (search.value) list = list.filter(r => r.customer.includes(search.value) || r.room.includes(search.value))
  return list
})

const totalBalance = computed(() => filtered.value.reduce((s, r) => s + r.balance, 0))
const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">预存费管理</h1>
      <p class="page-subtitle">管理客户预存费充值与余额查询</p>
    </div>

    <div class="filter-bar">
      <select v-model="area" class="form-select">
        <option>全部</option><option>坤煌（长寿）食品产业园</option>
      </select>
      <select v-model="building" class="form-select">
        <option>全部</option><option>A栋</option><option>B栋</option><option>C栋</option>
      </select>
      <input v-model="search" class="form-input" placeholder="搜索客户/房号" style="width:auto;min-width:200px;">
    </div>

    <div class="summary-row mb-3">
      <div class="summary-item">
        <span class="summary-label">预存总余额：</span>
        <span class="summary-value text-primary">¥{{ fmt(totalBalance) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">客户数：</span>
        <span class="summary-value">{{ filtered.length }}</span>
      </div>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>房号</th><th>客户名称</th><th>预存余额</th><th>最近充值时间</th><th>最近充值金额</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.id">
            <td class="font-medium">{{ r.room }}</td>
            <td>{{ r.customer }}</td>
            <td class="font-num" :class="r.balance > 0 ? 'text-success' : 'text-danger'">¥{{ fmt(r.balance) }}</td>
            <td>{{ r.lastTime }}</td>
            <td class="font-num">¥{{ fmt(r.lastAmount) }}</td>
            <td class="table-actions">
              <button class="btn btn-sm btn-primary">充值</button>
              <button class="btn btn-sm btn-default">查看明细</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span class="pagination-info">共 {{ filtered.length }} 条</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="currentPage <= 1" @click="currentPage--">&lt;</button>
          <button v-for="p in totalPages" :key="p" class="pagination-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
          <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>
