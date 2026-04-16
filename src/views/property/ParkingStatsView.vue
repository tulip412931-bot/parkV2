<script setup>
import { ref, computed } from 'vue'

const currentPage = ref(1)
const pageSize = 10

const spots = ref([
  { id: 'P-A001', zone: 'A区', type: '地下', status: '已租', plate: '渝A12345', tenant: '重庆鑫旺食品有限公司', rent: 500, expire: '2025-06-30' },
  { id: 'P-A002', zone: 'A区', type: '地下', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-A003', zone: 'A区', type: '地下', status: '已租', plate: '渝B67890', tenant: '四川味道餐饮管理公司', rent: 500, expire: '2025-08-15' },
  { id: 'P-A004', zone: 'A区', type: '地下', status: '已售', plate: '渝C11223', tenant: '张伟', rent: 0, expire: '' },
  { id: 'P-A005', zone: 'A区', type: '地下', status: '已租', plate: '渝D44556', tenant: '长寿湖渔业有限公司', rent: 500, expire: '2025-12-31' },
  { id: 'P-B001', zone: 'B区', type: '地上', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-B002', zone: 'B区', type: '地上', status: '已租', plate: '渝E77889', tenant: '重庆辣妹子食品厂', rent: 350, expire: '2025-09-30' },
  { id: 'P-B003', zone: 'B区', type: '地上', status: '已租', plate: '渝F99001', tenant: '坤煌冷链物流公司', rent: 350, expire: '2025-07-31' },
  { id: 'P-B004', zone: 'B区', type: '地上', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-B005', zone: 'B区', type: '地上', status: '已售', plate: '渝G22334', tenant: '李芳', rent: 0, expire: '' },
  { id: 'P-C001', zone: 'C区', type: '地下', status: '已租', plate: '渝H55667', tenant: '渝味鲜食品有限公司', rent: 500, expire: '2025-10-31' },
  { id: 'P-C002', zone: 'C区', type: '地下', status: '已租', plate: '渝J88990', tenant: '巴渝食品加工厂', rent: 500, expire: '2025-11-30' },
  { id: 'P-C003', zone: 'C区', type: '地下', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-C004', zone: 'C区', type: '地下', status: '已售', plate: '渝K11234', tenant: '陈杰', rent: 0, expire: '' },
  { id: 'P-C005', zone: 'C区', type: '地下', status: '已租', plate: '渝L44567', tenant: '重庆绿源农业公司', rent: 500, expire: '2026-01-31' },
  { id: 'P-D001', zone: 'D区', type: '地上', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-D002', zone: 'D区', type: '地上', status: '已租', plate: '渝M77890', tenant: '长寿特产批发中心', rent: 350, expire: '2025-12-31' },
  { id: 'P-D003', zone: 'D区', type: '地上', status: '已租', plate: '渝N00123', tenant: '重庆佳禾食品公司', rent: 350, expire: '2026-03-31' },
  { id: 'P-D004', zone: 'D区', type: '地上', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-D005', zone: 'D区', type: '地上', status: '已售', plate: '渝P33456', tenant: '王丽华', rent: 0, expire: '' },
  { id: 'P-E001', zone: 'E区', type: '地下', status: '已租', plate: '渝Q66789', tenant: '三峡鱼制品有限公司', rent: 500, expire: '2026-02-28' },
  { id: 'P-E002', zone: 'E区', type: '地下', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
  { id: 'P-E003', zone: 'E区', type: '地下', status: '已租', plate: '渝R99012', tenant: '渝北冷鲜配送中心', rent: 500, expire: '2026-04-30' },
  { id: 'P-E004', zone: 'E区', type: '地下', status: '已租', plate: '渝S22345', tenant: '重庆火锅底料厂', rent: 500, expire: '2025-11-30' },
  { id: 'P-E005', zone: 'E区', type: '地下', status: '空置', plate: '', tenant: '', rent: 0, expire: '' },
])

const statusMap = { '空置': 'badge-orange', '已租': 'badge-green', '已售': 'badge-blue' }
const totalRented = computed(() => spots.value.filter(s => s.status === '已租').length)
const totalEmpty = computed(() => spots.value.filter(s => s.status === '空置').length)
const totalSold = computed(() => spots.value.filter(s => s.status === '已售').length)
const rentRate = computed(() => ((totalRented.value / spots.value.length) * 100).toFixed(1))

const totalPages = computed(() => Math.ceil(spots.value.length / pageSize) || 1)
const pagedData = computed(() => {
  const s = (currentPage.value - 1) * pageSize
  return spots.value.slice(s, s + pageSize)
})
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">车位状态统计表</h1>
      <p class="page-subtitle">园区车位使用及出租情况统计</p>
    </div>

    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">总车位</div><div class="stat-card-value">{{ spots.length }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">已租</div><div class="stat-card-value text-success">{{ totalRented }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">空置</div><div class="stat-card-value text-warning">{{ totalEmpty }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">已售</div><div class="stat-card-value text-primary">{{ totalSold }}</div></div></div>
      <div class="stat-card"><div class="stat-card-content"><div class="stat-card-label">出租率</div><div class="stat-card-value">{{ rentRate }}%</div></div></div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>车位编号</th><th>区域</th><th>类型</th><th>车位状态</th><th>绑定车牌</th><th>租户/业主</th><th>月租金</th><th>到期日期</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in pagedData" :key="row.id">
              <td class="font-medium">{{ row.id }}</td>
              <td>{{ row.zone }}</td>
              <td>{{ row.type }}</td>
              <td><span class="badge" :class="statusMap[row.status]">{{ row.status }}</span></td>
              <td class="font-num">{{ row.plate || '-' }}</td>
              <td class="truncate" style="max-width:160px">{{ row.tenant || '-' }}</td>
              <td class="font-num">{{ row.rent ? '¥' + row.rent : '-' }}</td>
              <td>{{ row.expire || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <span class="pagination-info">共 {{ spots.length }} 条记录</span>
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
