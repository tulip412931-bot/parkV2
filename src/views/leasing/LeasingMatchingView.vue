<script setup>
import { ref, computed } from 'vue'
import { generateLeads, generateProperties, fmt } from '@/composables/useDemoData'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const leads = ref(generateLeads(30))
const properties = ref(generateProperties(40))

const selectedLeadId = ref('')
const matchLoading = ref(false)
const matchResults = ref([])
const hasMatched = ref(false)

const selectedLead = computed(() => {
  if (!selectedLeadId.value) return null
  return leads.value.find(l => l.id === Number(selectedLeadId.value))
})

const matchReasons = [
  ['面积匹配', '价格合适', '楼层满足'],
  ['行业配套', '面积接近', '政策优惠'],
  ['交通便利', '面积匹配', '装修到位'],
  ['价格优势', '楼层合适', '配套齐全']
]

function doMatch() {
  if (!selectedLead.value) return
  matchLoading.value = true
  hasMatched.value = false
  matchResults.value = []

  setTimeout(() => {
    const results = []
    const shuffled = [...properties.value].sort(() => Math.random() - 0.5).slice(0, 4)
    shuffled.forEach((p, i) => {
      results.push({
        ...p,
        matchScore: (85 + Math.floor(Math.random() * 14)),
        matchTags: matchReasons[i % matchReasons.length]
      })
    })
    results.sort((a, b) => b.matchScore - a.matchScore)
    matchResults.value = results
    matchLoading.value = false
    hasMatched.value = true
  }, 1000)
}

function doRecommend(item) {
  showToast(`房源「${item.code}」已推荐给客户`, 'success')
}

function scoreColor(score) {
  if (score >= 95) return '#16a34a'
  if (score >= 90) return '#2563eb'
  if (score >= 85) return '#ea580c'
  return '#6b7280'
}

/* Match history */
const historyData = [
  { time: '2026-04-15 14:30', company: '重庆博创智能科技有限公司', property: 'KH-A-302', score: 96, status: '已签约' },
  { time: '2026-04-12 10:15', company: '成都天宇信息技术有限公司', property: 'KH-B-205', score: 92, status: '已看房' },
  { time: '2026-04-10 16:42', company: '深圳市前海云端科技有限公司', property: 'KH-C-108', score: 89, status: '已推荐' },
  { time: '2026-04-08 09:20', company: '北京中科创新数据有限公司', property: 'KH-A-501', score: 94, status: '已签约' },
  { time: '2026-04-05 11:35', company: '上海盛泰金融科技有限公司', property: 'KH-D-306', score: 87, status: '已看房' }
]

function historyStatusBadge(s) {
  if (s === '已签约') return 'badge badge-green'
  if (s === '已看房') return 'badge badge-blue'
  return 'badge badge-orange'
}
</script>

<template>
  <div class="page-view">
    <div class="card">
      <h3 class="card-title" style="margin-bottom:20px">招商智能匹配</h3>

      <div class="match-layout">
        <!-- Left: Customer needs -->
        <div class="match-left">
          <div class="inner-card">
            <h4 class="inner-card-title">客户需求</h4>
            <div class="form-group" style="margin-bottom:16px">
              <label style="font-size:13px;color:#6b7280;margin-bottom:6px;display:block">选择客户</label>
              <select v-model="selectedLeadId" class="form-select" style="width:100%">
                <option value="">请选择客户...</option>
                <option v-for="lead in leads" :key="lead.id" :value="lead.id">{{ lead.companyName }}</option>
              </select>
            </div>

            <div v-if="selectedLead" class="lead-info">
              <div class="info-row"><span class="info-label">企业名称</span><span class="info-value">{{ selectedLead.companyName }}</span></div>
              <div class="info-row"><span class="info-label">行业</span><span class="info-value">{{ selectedLead.industry }}</span></div>
              <div class="info-row"><span class="info-label">需求面积</span><span class="info-value">{{ fmt(selectedLead.needArea) }}㎡</span></div>
              <div class="info-row"><span class="info-label">预算</span><span class="info-value">{{ selectedLead.budget }}元/㎡/月</span></div>
              <div class="info-row"><span class="info-label">特殊要求</span><span class="info-value">交通便利、配套齐全</span></div>
            </div>
            <div v-else class="lead-placeholder">请从下拉框选择一个客户</div>

            <button class="btn btn-primary" style="width:100%;margin-top:16px" :disabled="!selectedLead || matchLoading" @click="doMatch">
              {{ matchLoading ? '匹配中...' : '智能匹配' }}
            </button>
          </div>
        </div>

        <!-- Right: Match results -->
        <div class="match-right">
          <div class="inner-card">
            <h4 class="inner-card-title">匹配结果</h4>

            <div v-if="matchLoading" class="match-placeholder">
              <div class="loading-spinner"></div>
              <p>正在智能匹配中，请稍候...</p>
            </div>

            <div v-else-if="!hasMatched" class="match-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <p>请选择客户并点击智能匹配</p>
            </div>

            <div v-else class="match-grid">
              <div v-for="item in matchResults" :key="item.id" class="match-card">
                <div class="match-card-header">
                  <span class="match-code">{{ item.code }}</span>
                  <span class="match-score" :style="{ color: scoreColor(item.matchScore) }">{{ item.matchScore }}%</span>
                </div>
                <div class="match-card-body">
                  <div class="match-detail">{{ item.building }}{{ item.floor }} | {{ fmt(item.area) }}㎡</div>
                  <div class="match-detail">租金: {{ item.price }}元/㎡/月</div>
                  <div class="match-tags">
                    <span v-for="tag in item.matchTags" :key="tag" class="match-tag">{{ tag }}</span>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm" style="width:100%;margin-top:10px" @click="doRecommend(item)">推荐</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Match history -->
    <div class="card" style="margin-top:20px">
      <h3 class="card-title" style="margin-bottom:16px">匹配历史</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>匹配时间</th>
              <th>客户企业</th>
              <th>推荐房源</th>
              <th>匹配度</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(h, idx) in historyData" :key="idx">
              <td class="font-num">{{ h.time }}</td>
              <td>{{ h.company }}</td>
              <td class="font-num">{{ h.property }}</td>
              <td><span class="font-num" :style="{ color: scoreColor(h.score), fontWeight: 600 }">{{ h.score }}%</span></td>
              <td><span :class="historyStatusBadge(h.status)">{{ h.status }}</span></td>
              <td><button class="btn btn-text btn-sm">详情</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-view { max-width: 1400px; }
.match-layout {
  display: flex;
  gap: 20px;
}
.match-left { width: 40%; flex-shrink: 0; }
.match-right { width: 60%; flex-grow: 1; }
.inner-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  height: 100%;
}
.inner-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}
.lead-info { display: flex; flex-direction: column; gap: 10px; }
.info-row { display: flex; justify-content: space-between; font-size: 13px; }
.info-label { color: #6b7280; }
.info-value { color: #111827; font-weight: 500; }
.lead-placeholder {
  color: #94a3b8;
  font-size: 14px;
  text-align: center;
  padding: 30px 0;
}
.match-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 14px;
  gap: 12px;
}
.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.match-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.match-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
}
.match-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.match-code { font-weight: 700; font-size: 14px; color: #111827; }
.match-score { font-weight: 800; font-size: 18px; }
.match-card-body { font-size: 13px; color: #4b5563; }
.match-detail { margin-bottom: 4px; }
.match-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.match-tag {
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}
@media (max-width: 768px) {
  .match-layout { flex-direction: column; }
  .match-left, .match-right { width: 100%; }
  .match-grid { grid-template-columns: 1fr; }
}
</style>
