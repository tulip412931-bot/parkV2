<script setup>
import { ref, computed } from 'vue'

const statusFilter = ref('全部')
const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const pageSize = 10

const statuses = ['待审核', '已通过', '已驳回']
const statusMap = { '待审核': 'badge-orange', '已通过': 'badge-green', '已驳回': 'badge-red' }
const payments = ['银行转账', '微信支付', '支付宝', '现金', 'POS刷卡']
const names = ['张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄丽','周杰','吴敏','孙涛','马丽','朱军','胡明','郭芳','钱进','林峰','何雪','徐刚','邓超']
const reviewers = ['管理员A', '管理员B', '管理员C', '—']

const rows = ref(Array.from({ length: 20 }, (_, i) => ({
  id: `PAY2026${String(i + 1).padStart(4, '0')}`,
  time: `2026-0${(i % 4) + 1}-${String(10 + (i % 20)).padStart(2, '0')} ${9 + (i % 8)}:${String(i * 3 % 60).padStart(2, '0')}`,
  room: `${['A', 'B', 'C'][i % 3]}栋${Math.floor(i / 3 + 1)}0${(i % 5) + 1}`,
  customer: names[i],
  amount: [3500, 12000, 850, 6200, 28000, 1500, 9400, 4300, 7800, 15600, 2200, 11000, 680, 5100, 19800, 3300, 8700, 4600, 13500, 7200][i],
  method: payments[i % 5],
  applicant: names[(i + 3) % 20],
  status: statuses[i % 3],
  reviewer: i % 3 === 0 ? '—' : reviewers[i % 3]
})))

const filtered = computed(() => {
  let list = rows.value
  if (statusFilter.value !== '全部') list = list.filter(r => r.status === statusFilter.value)
  if (search.value) list = list.filter(r => r.customer.includes(search.value) || r.id.includes(search.value))
  return list
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">交款申请</h1>
        <p class="page-subtitle">管理客户交款申请与审核流程</p>
      </div>
      <button class="btn btn-primary">+ 新建交款申请</button>
    </div>

    <div class="filter-bar">
      <select v-model="statusFilter" class="form-select">
        <option>全部</option>
        <option v-for="s in statuses" :key="s">{{ s }}</option>
      </select>
      <input v-model="dateFrom" type="date" class="form-input" style="width:auto;">
      <input v-model="dateTo" type="date" class="form-input" style="width:auto;">
      <input v-model="search" class="form-input" placeholder="搜索编号/客户" style="width:auto;min-width:180px;">
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>申请编号</th><th>申请时间</th><th>房号</th><th>客户名称</th><th>交款金额</th>
            <th>支付方式</th><th>申请人</th><th>审核状态</th><th>审核人</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.id">
            <td class="font-medium">{{ r.id }}</td>
            <td>{{ r.time }}</td>
            <td>{{ r.room }}</td>
            <td>{{ r.customer }}</td>
            <td class="font-num">¥{{ fmt(r.amount) }}</td>
            <td>{{ r.method }}</td>
            <td>{{ r.applicant }}</td>
            <td><span class="badge" :class="statusMap[r.status]">{{ r.status }}</span></td>
            <td>{{ r.reviewer }}</td>
            <td class="table-actions">
              <button v-if="r.status === '待审核'" class="btn btn-sm btn-primary">审核</button>
              <button class="btn btn-sm btn-default">查看</button>
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
