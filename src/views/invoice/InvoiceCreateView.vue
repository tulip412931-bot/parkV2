<script setup>
import { ref, computed } from 'vue'
import { PRODUCTS, fmt, numToCN } from '@/composables/useInvoiceData'
import { showToast } from '@/composables/useToast'

const invoiceType = ref('增值税电子普通发票')
const invoiceDate = ref('2026-04-16')

const buyer = ref({
  name: '重庆腾讯信息技术有限公司',
  taxId: '91500000MA5UQ3YB0C',
  address: '重庆市渝北区星光大道62号海王星科技大厦C区7楼 023-67682800',
  bank: '招商银行重庆分行 123456789012345678'
})

const remark = ref('')
const drawer = ref('管理员')
const reviewer = ref('张经理')
const payee = ref('李会计')

function createItem(product, qty) {
  const rate = product.rate
  const amount = +(product.price * qty / (1 + rate / 100)).toFixed(2)
  const tax = +(product.price * qty - amount).toFixed(2)
  return {
    id: Date.now() + Math.random(),
    name: product.name,
    spec: product.spec,
    unit: product.unit,
    qty,
    price: +(amount / qty).toFixed(6),
    amount,
    rate,
    tax
  }
}

const items = ref([
  createItem(PRODUCTS[0], 2),
  createItem(PRODUCTS[4], 1)
])

function addRow() {
  const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
  const qty = Math.floor(Math.random() * 3) + 1
  items.value.push(createItem(p, qty))
}

function removeRow(idx) {
  if (items.value.length <= 1) {
    showToast('至少保留一行明细', 'warning')
    return
  }
  items.value.splice(idx, 1)
}

function recalcRow(item) {
  item.amount = +(item.price * item.qty).toFixed(2)
  item.tax = +(item.amount * item.rate / 100).toFixed(2)
}

const totalAmount = computed(() => items.value.reduce((s, i) => s + i.amount, 0))
const totalTax = computed(() => items.value.reduce((s, i) => s + i.tax, 0))
const totalAll = computed(() => +(totalAmount.value + totalTax.value).toFixed(2))

const showSuccess = ref(false)
const invoiceNum = ref('')

function saveDraft() {
  showToast('草稿保存成功', 'success')
}

function submitInvoice() {
  if (!buyer.value.name) {
    showToast('请填写购买方名称', 'warning')
    return
  }
  invoiceNum.value = '24' + String(Math.floor(Math.random() * 90000000) + 10000000)
  showSuccess.value = true
  showToast('发票开具成功！', 'success')
}

function closeSuccess() {
  showSuccess.value = false
}
</script>

<template>
  <div class="invoice-page">
    <!-- Card 1: Invoice Type -->
    <div class="card">
      <div class="card-title">发票信息</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">发票类型</label>
          <select v-model="invoiceType" class="form-select">
            <option>增值税电子普通发票</option>
            <option>增值税电子专用发票</option>
            <option>全电发票</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">开票日期</label>
          <input v-model="invoiceDate" type="date" class="form-input" />
        </div>
      </div>
    </div>

    <!-- Card 2: Buyer Info -->
    <div class="card">
      <div class="card-title">购买方信息</div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">名称</label>
          <input v-model="buyer.name" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">纳税人识别号</label>
          <input v-model="buyer.taxId" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">地址、电话</label>
          <input v-model="buyer.address" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">开户行及账号</label>
          <input v-model="buyer.bank" type="text" class="form-input" />
        </div>
      </div>
    </div>

    <!-- Card 3: Items Table -->
    <div class="card">
      <div class="card-title">项目明细</div>
      <div class="item-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:40px">序号</th>
              <th style="min-width:180px">商品名称</th>
              <th style="width:90px">规格型号</th>
              <th style="width:50px">单位</th>
              <th style="width:70px">数量</th>
              <th style="width:100px">单价</th>
              <th style="width:100px">金额</th>
              <th style="width:80px">税率</th>
              <th style="width:100px">税额</th>
              <th style="width:60px">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in items" :key="item.id">
              <td>{{ idx + 1 }}</td>
              <td><input v-model="item.name" class="form-input input-name" /></td>
              <td><input v-model="item.spec" class="form-input" /></td>
              <td><input v-model="item.unit" class="form-input" style="width:50px" /></td>
              <td>
                <input
                  v-model.number="item.qty"
                  type="number"
                  min="1"
                  class="form-input"
                  style="width:70px"
                  @input="recalcRow(item)"
                />
              </td>
              <td>
                <input
                  v-model.number="item.price"
                  type="number"
                  step="0.01"
                  class="form-input"
                  style="width:100px"
                  @input="recalcRow(item)"
                />
              </td>
              <td class="col-num">{{ fmt(item.amount) }}</td>
              <td>
                <select v-model.number="item.rate" class="form-select" style="width:75px" @change="recalcRow(item)">
                  <option :value="13">13%</option>
                  <option :value="9">9%</option>
                  <option :value="6">6%</option>
                  <option :value="3">3%</option>
                  <option :value="0">免税</option>
                </select>
              </td>
              <td class="col-num">{{ fmt(item.tax) }}</td>
              <td>
                <button class="btn btn-sm btn-danger" @click="removeRow(idx)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top:12px">
        <button class="btn" @click="addRow">+ 添加行</button>
      </div>

      <div class="totals-section">
        <div class="totals-row">
          <span class="total-label">合计金额：</span>
          <span class="total-value col-num">{{ fmt(totalAmount) }}</span>
          <span class="total-label" style="margin-left:24px">合计税额：</span>
          <span class="total-value col-num">{{ fmt(totalTax) }}</span>
        </div>
        <div class="totals-row">
          <span class="total-label">价税合计（大写）：</span>
          <span class="total-cn">{{ numToCN(totalAll) }}</span>
          <span class="total-label" style="margin-left:24px">（小写）：</span>
          <span class="total-value col-num">{{ fmt(totalAll) }}</span>
        </div>
      </div>
    </div>

    <!-- Card 4: Remarks & Personnel -->
    <div class="card">
      <div class="card-title">其他信息</div>
      <div class="form-group full-width" style="margin-bottom:16px">
        <label class="form-label">备注</label>
        <textarea v-model="remark" class="form-textarea" placeholder="请输入备注信息（选填）"></textarea>
      </div>
      <div class="form-grid cols-3">
        <div class="form-group">
          <label class="form-label">开票人</label>
          <input v-model="drawer" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">复核人</label>
          <input v-model="reviewer" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">收款人</label>
          <input v-model="payee" type="text" class="form-input" />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-bar">
      <button class="btn" @click="saveDraft">保存草稿</button>
      <button class="btn btn-primary btn-lg" @click="submitInvoice">开具发票</button>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccess" class="modal-overlay" @click.self="closeSuccess">
        <div class="success-modal">
          <div class="success-icon">
            <svg viewBox="0 0 64 64" width="72" height="72">
              <circle cx="32" cy="32" r="30" fill="#f6ffed" stroke="#52c41a" stroke-width="2" />
              <path
                d="M20 33l8 8 16-18"
                fill="none"
                stroke="#52c41a"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="check-path"
              />
            </svg>
          </div>
          <h3>发票开具成功！</h3>
          <p class="inv-num">发票号码：{{ invoiceNum }}</p>
          <p class="inv-type">{{ invoiceType }}</p>
          <p class="inv-amount">价税合计：{{ fmt(totalAll) }}</p>
          <div class="success-actions">
            <button class="btn" @click="closeSuccess">继续开票</button>
            <button class="btn btn-primary" @click="closeSuccess">查看发票</button>
            <button class="btn" @click="closeSuccess">下载PDF</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.invoice-page {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.item-table-wrap {
  overflow-x: auto;
}

.item-table-wrap .form-input,
.item-table-wrap .form-select {
  height: 30px;
  font-size: 13px;
  padding: 0 8px;
}

.input-name {
  min-width: 160px;
}

.totals-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.totals-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
}

.total-label {
  color: #8c8c8c;
  font-size: 13px;
}

.total-value {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #ff4d4f;
}

.total-cn {
  font-size: 14px;
  color: #434343;
  font-weight: 500;
}

.col-num {
  font-family: 'DM Sans', sans-serif;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

/* Success Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.success-modal {
  background: #fff;
  border-radius: 12px;
  padding: 40px 48px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  animation: popIn 0.35s ease;
  min-width: 360px;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

.success-icon {
  margin-bottom: 16px;
}

.check-path {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: drawCheck 0.5s 0.2s ease forwards;
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

.success-modal h3 {
  font-size: 20px;
  font-weight: 600;
  color: #141414;
  margin-bottom: 12px;
}

.inv-num {
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: #434343;
  margin-bottom: 4px;
}

.inv-type {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.inv-amount {
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #ff4d4f;
  margin: 12px 0 24px;
}

.success-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
