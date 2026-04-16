<script setup>
import { ref, computed } from 'vue'

const filterArea = ref('')
const filterBuilding = ref('')
const currentPage = ref(1)
const pageSize = 10

const rows = ref([
  { room: 'A-0301', customer: '重庆鑫旺食品有限公司', phone: '13812340001', bound: true, bindTime: '2024-06-15 10:30' },
  { room: 'A-0302', customer: '四川味道餐饮管理公司', phone: '13812340002', bound: true, bindTime: '2024-06-18 14:20' },
  { room: 'A-0303', customer: '长寿湖渔业有限公司', phone: '13812340003', bound: false, bindTime: '' },
  { room: 'A-0304', customer: '园区物业', phone: '13812340004', bound: true, bindTime: '2024-05-20 09:15' },
  { room: 'B-0401', customer: '重庆辣妹子食品厂', phone: '13812340005', bound: true, bindTime: '2024-07-01 11:00' },
  { room: 'B-0402', customer: '坤煌冷链物流公司', phone: '13812340006', bound: false, bindTime: '' },
  { room: 'B-0403', customer: '渝味鲜食品有限公司', phone: '13812340007', bound: true, bindTime: '2024-07-10 16:45' },
  { room: 'B-0501', customer: '巴渝食品加工厂', phone: '13812340008', bound: false, bindTime: '' },
  { room: 'C-0601', customer: '重庆绿源农业公司', phone: '13812340009', bound: true, bindTime: '2024-08-05 08:30' },
  { room: 'C-0602', customer: '长寿特产批发中心', phone: '13812340010', bound: true, bindTime: '2024-08-12 13:20' },
  { room: 'C-0701', customer: '张伟', phone: '13812340011', bound: false, bindTime: '' },
  { room: 'C-0702', customer: '李芳', phone: '13812340012', bound: true, bindTime: '2024-09-01 10:00' },
  { room: 'D-0801', customer: '陈杰', phone: '13812340013', bound: true, bindTime: '2024-09-15 15:30' },
  { room: 'D-0802', customer: '王丽华', phone: '13812340014', bound: false, bindTime: '' },
  { room: 'D-0901', customer: '重庆佳禾食品公司', phone: '13812340015', bound: true, bindTime: '2024-10-01 09:00' },
  { room: 'E-1001', customer: '四川麻辣香锅连锁', phone: '13812340016', bound: false, bindTime: '' },
  { room: 'E-1002', customer: '重庆火锅底料厂', phone: '13812340017', bound: true, bindTime: '2024-10-20 14:10' },
  { room: 'E-1101', customer: '长寿豆干加工厂', phone: '13812340018', bound: true, bindTime: '2024-11-05 11:25' },
  { room: 'F-1201', customer: '渝北冷鲜配送中心', phone: '13812340019', bound: false, bindTime: '' },
  { room: 'F-1301', customer: '三峡鱼制品有限公司', phone: '13812340020', bound: true, bindTime: '2024-11-20 16:00' },
])

const filtered = computed(() => rows.value)
const totalBound = computed(() => rows.value.filter(r => r.bound).length)
const totalUnbound = computed(() => rows.value.filter(r => !r.bound).length)
const bindRate = computed(() => ((totalBound.value / rows.value.length) * 100).toFixed(1))

const totalPages = computed(() => Math.ceil(filtered.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize
  return filtered.value.slice(s, s + pageSize)
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">微信绑定状态统计表</h1>
      <p class="page-subtitle">客户微信绑定情况汇总</p>
    </div>

    <div class="filter-bar">
      <select v-model="filterArea" class="form-select">
        <option value="">全部管理区</option>
        <option>坤煌（长寿）食品产业园</option>
        <option>坤煌（江津）双福园区</option>
      </select>
      <select v-model="filterBuilding" class="form-select">
        <option value="">全部楼宇</option>
        <option>A栋</option><option>B栋</option><option>C栋</option>
        <option>D栋</option><option>E栋</option><option>F栋</option>
      </select>
    </div>

    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">总户数</div><div class="stat-card-value">{{ rows.length }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">已绑定</div><div class="stat-card-value text-success">{{ totalBound }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">未绑定</div><div class="stat-card-value text-warning">{{ totalUnbound }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">绑定率</div><div class="stat-card-value">{{ bindRate }}%</div></div></div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>房号</th><th>客户名称</th><th>手机号</th><th>微信绑定状态</th><th>绑定时间</th><th>操作</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.room">
              <td class="font-medium">{{ row.room }}</td>
              <td>{{ row.customer }}</td>
              <td class="font-num">{{ row.phone }}</td>
              <td><span class="badge" :class="row.bound ? 'badge-green' : 'badge-gray'">{{ row.bound ? '已绑定' : '未绑定' }}</span></td>
              <td>{{ row.bindTime || '-' }}</td>
              <td><button v-if="!row.bound" class="btn btn-text btn-sm">通知绑定</button><span v-else class="text-gray">-</span></td>
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
