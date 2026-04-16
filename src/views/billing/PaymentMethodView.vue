<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const editingId = ref(null)
const form = ref({ name: '', code: '', desc: '', feeRate: '', sort: '' })

const methods = ref([
  { id: 1, name: '现金', code: 'CASH', desc: '现金收款', feeRate: 0, enabled: true, sort: 1 },
  { id: 2, name: '微信支付', code: 'WECHAT', desc: '微信扫码或小程序支付', feeRate: 0.6, enabled: true, sort: 2 },
  { id: 3, name: '支付宝', code: 'ALIPAY', desc: '支付宝扫码支付', feeRate: 0.6, enabled: true, sort: 3 },
  { id: 4, name: '银行转账', code: 'BANK_TRANSFER', desc: '对公银行账户转账', feeRate: 0, enabled: true, sort: 4 },
  { id: 5, name: 'POS刷卡', code: 'POS', desc: 'POS机刷卡支付', feeRate: 0.38, enabled: true, sort: 5 },
  { id: 6, name: '支票', code: 'CHECK', desc: '支票支付', feeRate: 0, enabled: false, sort: 6 },
  { id: 7, name: '银行托收', code: 'BANK_COLLECT', desc: '银行委托代收', feeRate: 0.1, enabled: false, sort: 7 }
])

function openCreate() {
  editingId.value = null
  form.value = { name: '', code: '', desc: '', feeRate: '', sort: '' }
  showModal.value = true
}
function openEdit(item) {
  editingId.value = item.id
  form.value = { name: item.name, code: item.code, desc: item.desc, feeRate: String(item.feeRate), sort: String(item.sort) }
  showModal.value = true
}
function saveForm() { showModal.value = false }
function toggleEnabled(item) { item.enabled = !item.enabled }
</script>

<template>
  <div class="payment-method">
    <div class="page-header flex justify-between items-center">
      <div>
        <h1 class="page-title">支付方式配置</h1>
        <p class="page-subtitle">管理收费支持的支付渠道</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">新建支付方式</button>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>支付方式名称</th><th>支付编码</th><th>描述</th><th>手续费率(%)</th><th>是否启用</th><th>排序</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="item in methods" :key="item.id">
              <td class="font-medium">{{ item.name }}</td>
              <td class="font-num">{{ item.code }}</td>
              <td class="text-gray">{{ item.desc }}</td>
              <td class="font-num">{{ item.feeRate.toFixed(2) }}%</td>
              <td><span class="badge" :class="item.enabled ? 'badge-green' : 'badge-gray'">{{ item.enabled ? '已启用' : '已停用' }}</span></td>
              <td class="font-num">{{ item.sort }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-text btn-sm" @click="openEdit(item)">编辑</button>
                  <button class="btn btn-text btn-sm" :class="item.enabled ? 'danger' : ''" @click="toggleEnabled(item)">{{ item.enabled ? '停用' : '启用' }}</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingId ? '编辑支付方式' : '新建支付方式' }}</h3>
          <button class="modal-close" @click="showModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label required">支付方式名称</label>
            <input v-model="form.name" class="form-input" placeholder="请输入名称" />
          </div>
          <div class="form-group">
            <label class="form-label required">支付编码</label>
            <input v-model="form.code" class="form-input" placeholder="如 WECHAT" />
          </div>
          <div class="form-group">
            <label class="form-label">描述</label>
            <textarea v-model="form.desc" class="form-textarea" placeholder="请输入描述"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">手续费率(%)</label>
              <input v-model="form.feeRate" class="form-input" type="number" step="0.01" placeholder="0.00" />
            </div>
            <div class="form-group">
              <label class="form-label required">排序</label>
              <input v-model="form.sort" class="form-input" type="number" placeholder="1" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="saveForm">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-method { max-width: 1400px; }
</style>
