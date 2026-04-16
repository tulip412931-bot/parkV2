<script setup>
import { ref, computed } from 'vue'
import { generateProperties, BUILDINGS, fmt } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const allProperties = ref(generateProperties(60))

const filterBuilding = ref('')
const filterType = ref('')
const filterPriority = ref('')
const searchText = ref('')
const page = ref(1)
const pageSize = 15

const types = ['办公室', '厂房', '仓库', '商铺', '会议室']
const priorities = ['高', '中', '低']
const tagOptions = ['产业配套', '优惠政策', '免租期', '精装修', '交通便利', '配套齐全']

// Enrich properties with leasing-specific data
allProperties.value.forEach((p, i) => {
  p.priority = priorities[i % 3]
  p.promoted = i % 3 !== 2
  const numTags = 1 + (i % 3)
  p.tags = tagOptions.slice(i % tagOptions.length, i % tagOptions.length + numTags)
  if (p.tags.length === 0) p.tags = [tagOptions[0]]
})

function doSearch() { page.value = 1 }

const filteredList = computed(() => {
  let list = allProperties.value
  if (filterBuilding.value) list = list.filter(p => p.building === filterBuilding.value)
  if (filterType.value) list = list.filter(p => p.type === filterType.value)
  if (filterPriority.value) list = list.filter(p => p.priority === filterPriority.value)
  if (searchText.value.trim()) {
    const q = searchText.value.trim().toLowerCase()
    list = list.filter(p => p.code.toLowerCase().includes(q) || p.building.includes(q))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize)))
const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})

function visiblePages() {
  const total = totalPages.value
  const cur = page.value
  const pages = []
  const start = Math.max(1, cur - 2)
  const end = Math.min(total, cur + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
}

function tagClass(tag) {
  if (tag === '产业配套') return 'inline-tag blue'
  if (tag === '优惠政策') return 'inline-tag green'
  if (tag === '免租期') return 'inline-tag orange'
  if (tag === '精装修') return 'inline-tag purple'
  if (tag === '交通便利') return 'inline-tag blue'
  return 'inline-tag gray'
}

function priorityBadge(p) {
  if (p === '高') return 'badge badge-red'
  if (p === '中') return 'badge badge-orange'
  return 'badge badge-gray'
}

function doPromote(item) {
  item.promoted = true
  showToast(`房源「${item.code}」推广成功`, 'success')
}

function doPin(item) {
  showToast(`房源「${item.code}」已置顶`, 'success')
}

function doOffline(item) {
  item.promoted = false
  showToast(`房源「${item.code}」已下架`, 'warning')
}
</script>

<template>
  <div class="page-view">
    <div class="banner">
      <span class="banner-icon">&#x1f4e2;</span>
      可与租售板块共享基础信息，后台独立管理
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="card-title">招租房源管理</h3>
        <div class="card-actions">
          <button class="btn btn-primary">+ 新增</button>
          <button class="btn btn-default">同步租售房源</button>
          <button class="btn btn-default" @click="allProperties = generateProperties(60); allProperties.forEach((p,i) => { p.priority = priorities[i%3]; p.promoted = i%3!==2; const n=1+(i%3); p.tags = tagOptions.slice(i%tagOptions.length, i%tagOptions.length+n); if(!p.tags.length) p.tags=[tagOptions[0]] })">刷新</button>
        </div>
      </div>

      <div class="filter-bar">
        <select v-model="filterBuilding" class="form-select">
          <option value="">全部楼栋</option>
          <option v-for="b in BUILDINGS" :key="b" :value="b">{{ b }}</option>
        </select>
        <select v-model="filterType" class="form-select">
          <option value="">全部类型</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="filterPriority" class="form-select">
          <option value="">全部优先级</option>
          <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
        </select>
        <input v-model="searchText" class="form-input" placeholder="搜索房源编号/楼栋" @keyup.enter="doSearch" />
        <button class="btn btn-primary" @click="doSearch">查询</button>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>房源编号</th>
              <th>楼栋楼层</th>
              <th>面积㎡</th>
              <th>类型</th>
              <th>租金报价</th>
              <th>招商标签</th>
              <th>优先级</th>
              <th>推广状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pagedList" :key="item.id">
              <td class="font-num">{{ item.code }}</td>
              <td>{{ item.building }}{{ item.floor }}</td>
              <td class="font-num">{{ fmt(item.area) }}</td>
              <td>{{ item.type }}</td>
              <td class="font-num">{{ item.price }}元/㎡/月</td>
              <td>
                <span v-for="tag in item.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
              </td>
              <td><span :class="priorityBadge(item.priority)">{{ item.priority }}</span></td>
              <td>
                <span :class="item.promoted ? 'badge badge-green' : 'badge badge-gray'">{{ item.promoted ? '已推广' : '未推广' }}</span>
              </td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm" @click="doPin(item)">置顶</button>
                  <button class="btn btn-text btn-sm" @click="doPromote(item)">推广</button>
                  <button class="btn btn-text btn-sm danger" @click="doOffline(item)">下架</button>
                </div>
              </td>
            </tr>
            <tr v-if="pagedList.length === 0">
              <td colspan="9" class="table-empty">暂无匹配的房源数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-info">共 {{ filteredList.length }} 条记录，第 {{ page }} / {{ totalPages }} 页</span>
        <div class="pagination-controls">
          <button class="pagination-btn" :disabled="page <= 1" @click="page--">&lt;</button>
          <button
            v-for="p in visiblePages()"
            :key="p"
            class="pagination-btn"
            :class="{ active: p === page }"
            @click="page = p"
          >{{ p }}</button>
          <button class="pagination-btn" :disabled="page >= totalPages" @click="page++">&gt;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.banner {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 8px;
}
.banner-icon { font-size: 18px; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.card-actions { display: flex; gap: 8px; }
.inline-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 4px;
  margin-bottom: 2px;
}
.inline-tag.blue { background: #eff6ff; color: #2563eb; }
.inline-tag.green { background: #f0fdf4; color: #16a34a; }
.inline-tag.orange { background: #fff7ed; color: #ea580c; }
.inline-tag.purple { background: #faf5ff; color: #9333ea; }
.inline-tag.gray { background: #f3f4f6; color: #6b7280; }
</style>
