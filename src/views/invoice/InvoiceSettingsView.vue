<script setup>
import { ref } from 'vue'
import { showToast } from '@/composables/useToast'

const activeTab = ref('company')

// Company info
const company = ref({
  name: '重庆盛创普通科技有限公司',
  taxId: '91500116MAEWH3TL90',
  address: '重庆市渝北区星光大道62号海王星科技大厦',
  phone: '023-67682800',
  bank: '招商银行重庆渝北支行',
  bankAccount: '1234 5678 9012 3456 78'
})

function saveCompany() {
  showToast('企业信息保存成功', 'success')
}

// Staff
const staff = ref([
  { id: 1, username: 'admin', name: '管理员', phone: '138****1234', role: '超级管理员', roleColor: 'blue', status: true },
  { id: 2, username: 'zhangsan', name: '张三', phone: '139****5678', role: '开票员', roleColor: 'green', status: true },
  { id: 3, username: 'lisi', name: '李四', phone: '137****9012', role: '开票员', roleColor: 'green', status: true },
  { id: 4, username: 'wangwu', name: '王五', phone: '136****3456', role: '审核员', roleColor: 'orange', status: false }
])

function toggleStaff(s) {
  s.status = !s.status
  showToast(s.name + (s.status ? ' 已启用' : ' 已禁用'), 'success')
}

// Headers
const headers = ref([
  { id: 1, name: '重庆腾讯信息技术有限公司', taxId: '91500000MA5UQ3YB0C', address: '重庆市渝北区星光大道62号', bank: '招商银行重庆分行' },
  { id: 2, name: '重庆百度科技有限公司', taxId: '91500000MA5UQ4CC1D', address: '重庆市渝中区解放碑88号', bank: '工商银行重庆分行' },
  { id: 3, name: '四川华为技术有限公司', taxId: '91510000MA5UQ5DD2E', address: '成都市高新区天府大道999号', bank: '建设银行成都高新支行' }
])

function deleteHeader(id) {
  headers.value = headers.value.filter(h => h.id !== id)
  showToast('抬头已删除', 'success')
}

// Delivery settings
const deliveryMethods = ref([
  { id: 'email', name: '邮件推送', icon: '\u2709\uFE0F', desc: '通过电子邮件发送发票', active: true },
  { id: 'sms', name: '短信通知', icon: '\uD83D\uDCAC', desc: '通过短信发送发票链接', active: false },
  { id: 'wechat', name: '微信推送', icon: '\uD83D\uDCF1', desc: '通过微信公众号推送', active: true }
])

function toggleDelivery(d) {
  d.active = !d.active
}

function saveDelivery() {
  showToast('交付设置保存成功', 'success')
}

function roleBadge(color) {
  if (color === 'blue') return 'badge badge-blue'
  if (color === 'green') return 'badge badge-green'
  return 'badge badge-orange'
}
</script>

<template>
  <div class="settings-page">
    <!-- Tabs -->
    <div class="tab-bar">
      <div class="tab-item" :class="{ active: activeTab === 'company' }" @click="activeTab = 'company'">企业信息</div>
      <div class="tab-item" :class="{ active: activeTab === 'staff' }" @click="activeTab = 'staff'">开票员管理</div>
      <div class="tab-item" :class="{ active: activeTab === 'headers' }" @click="activeTab = 'headers'">发票抬头管理</div>
      <div class="tab-item" :class="{ active: activeTab === 'delivery' }" @click="activeTab = 'delivery'">交付设置</div>
    </div>

    <!-- Company Info -->
    <div v-if="activeTab === 'company'" class="card">
      <div class="card-title">企业基本信息</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">企业名称</label>
          <input v-model="company.name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">纳税人识别号</label>
          <input :value="company.taxId" type="text" class="form-input" readonly />
        </div>
        <div class="form-group">
          <label class="form-label">注册地址</label>
          <input v-model="company.address" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">联系电话</label>
          <input v-model="company.phone" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">开户银行</label>
          <input v-model="company.bank" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">银行账号</label>
          <input v-model="company.bankAccount" type="text" class="form-input" />
        </div>
      </div>
      <div style="margin-top:20px;text-align:right">
        <button class="btn btn-primary" @click="saveCompany">保存修改</button>
      </div>
    </div>

    <!-- Staff Management -->
    <div v-if="activeTab === 'staff'" class="card">
      <div class="card-title">开票员列表</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>用户名</th>
            <th>姓名</th>
            <th>手机号</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in staff" :key="s.id">
            <td>{{ s.username }}</td>
            <td>{{ s.name }}</td>
            <td>{{ s.phone }}</td>
            <td><span :class="roleBadge(s.roleColor)">{{ s.role }}</span></td>
            <td>
              <span :class="s.status ? 'badge badge-green' : 'badge badge-red'">
                {{ s.status ? '启用' : '禁用' }}
              </span>
            </td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm" @click="showToast('编辑功能开发中', 'info')">编辑</button>
                <button class="btn btn-sm" @click="toggleStaff(s)">
                  {{ s.status ? '禁用' : '启用' }}
                </button>
                <button v-if="s.username !== 'admin'" class="btn btn-sm" style="color:#ff4d4f" @click="showToast('删除功能开发中', 'info')">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Invoice Headers -->
    <div v-if="activeTab === 'headers'" class="card">
      <div class="card-title">
        <span>常用发票抬头</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>企业名称</th>
            <th>纳税人识别号</th>
            <th>注册地址</th>
            <th>开户银行</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in headers" :key="h.id">
            <td>{{ h.name }}</td>
            <td class="col-num">{{ h.taxId }}</td>
            <td>{{ h.address }}</td>
            <td>{{ h.bank }}</td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm" @click="showToast('编辑功能开发中', 'info')">编辑</button>
                <button class="btn btn-sm" style="color:#ff4d4f" @click="deleteHeader(h.id)">删除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delivery Settings -->
    <div v-if="activeTab === 'delivery'" class="card">
      <div class="card-title">发票交付方式</div>
      <div class="delivery-cards">
        <div
          v-for="d in deliveryMethods"
          :key="d.id"
          class="delivery-card"
          :class="{ active: d.active }"
          @click="toggleDelivery(d)"
        >
          <div class="delivery-icon">{{ d.icon }}</div>
          <div class="delivery-name">{{ d.name }}</div>
          <div class="delivery-desc">{{ d.desc }}</div>
          <div class="delivery-status">
            <span :class="d.active ? 'badge badge-green' : 'badge badge-red'">
              {{ d.active ? '已开启' : '已关闭' }}
            </span>
          </div>
        </div>
      </div>
      <div style="margin-top:20px;text-align:right">
        <button class="btn btn-primary" @click="saveDelivery">保存设置</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.col-num {
  font-family: 'DM Sans', sans-serif;
}

.delivery-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.delivery-card {
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delivery-card:hover {
  border-color: #69b1ff;
}

.delivery-card.active {
  border-color: #1677ff;
  background: #e6f4ff;
}

.delivery-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.delivery-name {
  font-size: 16px;
  font-weight: 500;
  color: #141414;
  margin-bottom: 4px;
}

.delivery-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 12px;
}

.delivery-status {
  margin-top: 8px;
}
</style>
