<script setup>
import { ref, computed } from 'vue'

const statusFilter = ref('全部')
const dateFrom = ref('')
const dateTo = ref('')
const itemFilter = ref('全部')
const currentPage = ref(1)
const pageSize = 10

const statuses = ['待审核', '已通过', '已驳回']
const statusMap = { '待审核': 'badge-orange', '已通过': 'badge-green', '已驳回': 'badge-red' }
const chargeItems = ['物业费', '租金', '水费', '电费', '停车费']
const names = ['张伟','李娜','王强','刘洋','陈静','杨帆','赵磊','黄丽','周杰','吴敏','孙涛','马丽','朱军','胡明','郭芳','钱进','林峰','何雪','徐刚','邓超']
const reasons = ['困难减免', '空置减免', '协商优惠', '活动减免', '政策减免', '长期客户优惠', '特殊情况减免']
const reviewers = ['管理员A', '管理员B', '管理员C']

const rows = ref(Array.from({ length: 20 }, (_, i) => {
  const orig = [3200, 15800, 520, 1800, 600, 4500, 28000, 890, 2100, 750, 6800, 12400, 340, 3600, 1200, 9500, 21000, 680, 4200, 1500][i]
  const reduction = Math.round(orig * [0.1, 0.2, 0.5, 0.15, 0.3, 0.25, 0.1, 0.5, 0.2, 0.35, 0.15, 0.1, 1.0, 0.2, 0.3, 0.25, 0.15, 0.5, 0.2, 0.4][i])
  return {
    id: `RED2026${String(i + 1).padStart(4, '0')}`,
    time: `2026-0${(i % 4) + 1}-${String(5 + i).padStart(2, '0')} ${9 + (i % 8)}:${String(i * 7 % 60).padStart(2, '0')}`,
    room: `${['A', 'B', 'C'][i % 3]}栋${Math.floor(i / 3 + 1)}0${(i % 5) + 1}`,
    customer: names[i],
    item: chargeItems[i % 5],
    origAmount: orig,
    reduction,
    reason: reasons[i % 7],
    status: statuses[i % 3],
    reviewer: i % 3 === 0 ? '—' : reviewers[i % 3]
  }
}))

const filtered = computed(() => {
  let list = rows.value
  if (statusFilter.value !== '全部') list = list.filter(r => r.status === statusFilter.value)
  if (itemFilter.value !== '全部') list = list.filter(r => r.item === itemFilter.value)
  return list
})

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize))
const paged = computed(() => filtered.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize))

function fmt(n) { return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">减免申请</h1>
      <p class="page-subtitle">管理费用减免申请与审核</p>
    </div>

    <div class="filter-bar">
      <select v-model="statusFilter" class="form-select">
        <option>全部</option>
        <option v-for="s in statuses" :key="s">{{ s }}</option>
      </select>
      <input v-model="dateFrom" type="date" class="form-input" style="width:auto;">
      <input v-model="dateTo" type="date" class="form-input" style="width:auto;">
      <select v-model="itemFilter" class="form-select">
        <option>全部</option>
        <option v-for="c in chargeItems" :key="c">{{ c }}</option>
      </select>
    </div>

    <div class="card">
      <table class="data-table">
        <thead>
          <tr>
            <th>申请编号</th><th>申请时间</th><th>房号</th><th>客户名称</th><th>收费项目</th>
            <th>原金额</th><th>减免金额</th><th>减免原因</th><th>审核状态</th><th>审核人</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in paged" :key="r.id">
            <td class="font-medium">{{ r.id }}</td>
            <td>{{ r.time }}</td>
            <td>{{ r.room }}</td>
            <td>{{ r.customer }}</td>
            <td>{{ r.item }}</td>
            <td class="font-num">¥{{ fmt(r.origAmount) }}</td>
            <td class="font-num text-danger">-¥{{ fmt(r.reduction) }}</td>
            <td>{{ r.reason }}</td>
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
