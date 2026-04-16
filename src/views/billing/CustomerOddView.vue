<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const statusFilter = ref('全部')
const currentPage = ref(1)
const pageSize = 10

const names = ['张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄丽','周杰','吴敏','孙涛','马丽','朱军','胡明','郭芳']
const reasons = ['物业费找零', '水费抵扣余额', '电费结算差额', '租金尾数调整', '退费余额转入', '缴费溢出', '系统自动调整']

const rows = ref(Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  room: `${['A', 'B', 'C'][i % 3]}栋${Math.floor(i / 3 + 1)}0${(i % 5) + 1}`,
  customer: names[i],
  balance: [0.35, 1.20, 0.00, 0.58, 2.45, 0.10, 0.87, 3.60, 0.22, 1.05, 0.00, 0.43, 0.76, 1.98, 0.15][i],
  lastTime: `2026-0${(i % 4) + 1}-${String(5 + i).padStart(2, '0')}`,
  reason: reasons[i % 7]
})))

const filtered = computed(() => {
  let list = rows.value
  if (search.value) list = list.filter(r => r.customer.includes(search.value) || r.room.includes(search.value))
  if (statusFilter.value === '有余额') list = list.filter(r => r.balance > 0)
  else if (statusFilter.value === '零余额') list = list.filter(r => r.balance === 0)
  return list
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">客户零头账户</h1>
      <p class="page-subtitle">管理客户零头余额与调整记录</p>
    </div>

    <div class="filter-bar">
      <input v-model="search" class="form-input" placeholder="搜索客户/房号" style="width:auto;min-width:200px;">
      <select v-model="statusFilter" class="form-select">
        <option>全部</option><option>有余额</option><option>零余额</option>
      </select>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>房号</th><th>客户名称</th><th>零头余额</th><th>最近变动时间</th><th>变动原因</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.id">
            <td class="font-medium">{{ r.room }}</td>
            <td>{{ r.customer }}</td>
            <td class="font-num">¥{{ fmt(r.balance) }}</td>
            <td>{{ r.lastTime }}</td>
            <td>{{ r.reason }}</td>
            <td class="table-actions">
              <button class="btn btn-sm btn-primary">调整</button>
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
