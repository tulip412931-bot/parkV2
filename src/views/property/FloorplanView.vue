<script setup>
import { ref, computed } from 'vue'

const selectedBuilding = ref('A栋')
const selectedRoom = ref(null)

const buildings = ['A栋', 'B栋', 'C栋']
const floors = [4, 3, 2, 1]
const roomsPerFloor = 6

const statusColors = { '已出租': '#16a34a', '空置': '#d97706', '自用': '#9ca3af', '已出售': '#2563eb' }
const statusBg = { '已出租': '#f0fdf4', '空置': '#fffbeb', '自用': '#f3f4f6', '已出售': '#eff6ff' }

const roomData = ref({})
function initRooms() {
  const statuses = ['已出租', '空置', '自用', '已出售']
  const customers = ['重庆鑫旺食品有限公司', '四川味道餐饮管理公司', '长寿湖渔业有限公司', '重庆辣妹子食品厂', '坤煌冷链物流公司', '渝味鲜食品有限公司', '巴渝食品加工厂', '园区物业', '', '', '', '']
  const areas = [120.5, 85.2, 150.0, 200.0, 95.8, 110.3, 78.6, 160.0, 130.0, 88.5, 105.0, 92.0]
  let idx = 0
  buildings.forEach(b => {
    floors.forEach(f => {
      for (let r = 1; r <= roomsPerFloor; r++) {
        const key = `${b}-${f}0${r}`
        const si = idx % statuses.length
        const status = statuses[si]
        roomData.value[key] = {
          room: `${f}0${r}`, building: b, area: areas[idx % areas.length],
          status, customer: status === '空置' ? '' : customers[idx % customers.length]
        }
        idx++
      }
    })
  })
}
initRooms()

const currentRooms = computed(() => {
  const result = {}
  floors.forEach(f => {
    result[f] = []
    for (let r = 1; r <= roomsPerFloor; r++) {
      const key = `${selectedBuilding.value}-${f}0${r}`
      result[f].push({ key, ...roomData.value[key] })
    }
  })
  return result
})

function selectRoom(room) { selectedRoom.value = selectedRoom.value?.key === room.key ? null : room }
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">房产资源平面图</h1>
      <p class="page-subtitle">坤煌食品产业园 - 楼宇房间可视化</p>
    </div>

    <div class="legend mb-2">
      <span v-for="(color, label) in statusColors" :key="label" class="legend-item">
        <span class="legend-dot" :style="{ background: color }"></span>{{ label }}
      </span>
    </div>

    <div class="floorplan-layout">
      <div class="card building-tree">
        <h3 class="card-title mb-2">楼宇选择</h3>
        <div v-for="b in buildings" :key="b" class="tree-item" :class="{ active: selectedBuilding === b }" @click="selectedBuilding = b">
          {{ b }}
        </div>
      </div>
      <div class="card floorplan-grid">
        <div v-for="f in floors" :key="f" class="floor-row">
          <div class="floor-label">{{ f }}F</div>
          <div class="rooms-row">
            <div v-for="room in currentRooms[f]" :key="room.key" class="room-block"
              :style="{ background: statusBg[room.status], borderColor: statusColors[room.status] }"
              @click="selectRoom(room)">
              <span class="room-number">{{ room.room }}</span>
              <span class="room-area">{{ room.area }}㎡</span>
            </div>
          </div>
        </div>
        <div v-if="selectedRoom" class="room-popup card">
          <h4 class="font-semibold mb-1">房间详情</h4>
          <p>房号：{{ selectedRoom.room }}</p>
          <p>面积：{{ selectedRoom.area }}㎡</p>
          <p>状态：<span class="badge" :class="{'badge-green': selectedRoom.status==='已出租','badge-orange': selectedRoom.status==='空置','badge-gray': selectedRoom.status==='自用','badge-blue': selectedRoom.status==='已出售'}">{{ selectedRoom.status }}</span></p>
          <p>客户：{{ selectedRoom.customer || '-' }}</p>
          <button class="btn btn-sm btn-default mt-1" @click="selectedRoom = null">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legend { display: flex; gap: 20px; align-items: center; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--gray-600); }
.legend-dot { width: 12px; height: 12px; border-radius: 3px; }
.floorplan-layout { display: flex; gap: 20px; }
.building-tree { width: 180px; flex-shrink: 0; }
.tree-item { padding: 10px 14px; border-radius: var(--radius); cursor: pointer; font-size: 14px; margin-bottom: 4px; transition: var(--transition); }
.tree-item:hover { background: var(--gray-100); }
.tree-item.active { background: var(--primary); color: var(--white); font-weight: 500; }
.floorplan-grid { flex: 1; position: relative; }
.floor-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.floor-label { width: 36px; font-weight: 600; color: var(--gray-500); font-size: 13px; text-align: center; }
.rooms-row { display: flex; gap: 10px; flex: 1; }
.room-block { width: 100px; height: 68px; border: 2px solid; border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition); }
.room-block:hover { transform: scale(1.05); box-shadow: var(--shadow-md); }
.room-number { font-weight: 600; font-size: 14px; color: var(--gray-800); }
.room-area { font-size: 11px; color: var(--gray-500); }
.room-popup { position: absolute; top: 12px; right: 12px; width: 220px; padding: 16px; z-index: 10; font-size: 13px; line-height: 2; }
</style>
