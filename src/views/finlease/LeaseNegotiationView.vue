<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('negotiation')
const showNegModal = ref(false)

const negForm = ref({ propertyCode:'', customer:'', time:'', content:'', priceResult:'', demand:'', follower:'', status:'进行中' })

const negotiations = ref([
  { id:1, code:'QT2024001', propertyCode:'FY2024001', customer:'重庆智汇科技有限公司', time:'2024-11-02 10:30', content:'客户对A栋101号房源感兴趣，实地看房', priceResult:'租金4500元/月，客户接受', demand:'需要独立网络接入', follower:'张伟', status:'已成交' },
  { id:2, code:'QT2024002', propertyCode:'FY2024002', customer:'四川蓝海贸易公司', time:'2024-11-05 14:00', content:'客户咨询A栋203单间，要求降价', priceResult:'租金协商至3000元/月', demand:'希望免费提供家具', follower:'李娜', status:'进行中' },
  { id:3, code:'QT2024003', propertyCode:'FY2024005', customer:'成都盛达物流集团', time:'2024-10-28 09:15', content:'客户看中B栋201两室一厅，签约意向强', priceResult:'售价110万成交', demand:'需配套停车位2个', follower:'王强', status:'已成交' },
  { id:4, code:'QT2024004', propertyCode:'FY2024007', customer:'重庆鼎盛实业有限公司', time:'2024-11-08 11:00', content:'客户考察C栋整层，用于办公', priceResult:'租金11000元/月待定', demand:'需要重新装修', follower:'赵敏', status:'进行中' },
  { id:5, code:'QT2024005', propertyCode:'FY2024003', customer:'江津新材料科技公司', time:'2024-10-20 15:30', content:'客户对A栋305整层非常满意', priceResult:'租金8500元/月成交', demand:'需要加装消防设施', follower:'张伟', status:'已成交' },
  { id:6, code:'QT2024006', propertyCode:'FY2024006', customer:'重庆华通电子有限公司', time:'2024-11-10 10:00', content:'客户看房B栋302一室一厅', priceResult:'租金3600元/月协商中', demand:'需要24小时门禁', follower:'李娜', status:'进行中' },
  { id:7, code:'QT2024007', propertyCode:'FY2024009', customer:'四川天成食品有限公司', time:'2024-11-01 16:00', content:'客户电话咨询C栋308单间', priceResult:'未达成一致', demand:'预算不超过2500元', follower:'王强', status:'已放弃' },
  { id:8, code:'QT2024008', propertyCode:'FY2024010', customer:'重庆万达商业管理公司', time:'2024-10-25 13:45', content:'D栋102两室一厅实地看房', priceResult:'售价135万成交', demand:'需要物业费优惠', follower:'赵敏', status:'已成交' },
  { id:9, code:'QT2024009', propertyCode:'FY2024012', customer:'江津永辉超市有限公司', time:'2024-11-12 09:30', content:'D栋305标准间看房', priceResult:'租金5000元/月协商中', demand:'需要增加照明设备', follower:'张伟', status:'进行中' },
  { id:10, code:'QT2024010', propertyCode:'FY2024013', customer:'成都天府科创有限公司', time:'2024-10-18 11:30', content:'E栋101整层洽谈', priceResult:'售价195万成交', demand:'需要独立电梯使用权', follower:'李娜', status:'已成交' },
  { id:11, code:'QT2024011', propertyCode:'FY2024011', customer:'重庆利通机械公司', time:'2024-11-15 14:20', content:'D栋203开间电话咨询', priceResult:'租金2200元/月客户考虑中', demand:'需要通风改造', follower:'王强', status:'进行中' },
  { id:12, code:'QT2024012', propertyCode:'FY2024014', customer:'四川锦程教育集团', time:'2024-11-06 10:15', content:'E栋202一室一厅看房', priceResult:'租金3300元/月协商', demand:'用于培训教室', follower:'赵敏', status:'进行中' },
  { id:13, code:'QT2024013', propertyCode:'FY2024015', customer:'重庆中启信息技术公司', time:'2024-11-09 15:00', content:'A栋401标准间实地考察', priceResult:'租金4000元/月待确认', demand:'需要高速宽带', follower:'张伟', status:'进行中' },
  { id:14, code:'QT2024014', propertyCode:'FY2024019', customer:'成都新锐广告有限公司', time:'2024-11-11 09:00', content:'E栋301整层看房', priceResult:'租金8500元/月协商中', demand:'需要开放式格局', follower:'李娜', status:'进行中' },
  { id:15, code:'QT2024015', propertyCode:'FY2024004', customer:'重庆双福物业管理公司', time:'2024-10-30 16:30', content:'B栋102开间咨询', priceResult:'未达成一致', demand:'预算过低', follower:'王强', status:'已放弃' },
])

const deposits = ref([
  { id:1, code:'DJ2024001', property:'FY2024001-A栋101', customer:'重庆智汇科技有限公司', amount:13500, method:'银行转账', time:'2024-11-03', receipt:'RC20241103001', uploaded:true, status:'已收取' },
  { id:2, code:'DJ2024002', property:'FY2024005-B栋201', customer:'成都盛达物流集团', amount:50000, method:'银行转账', time:'2024-10-29', receipt:'RC20241029001', uploaded:true, status:'已收取' },
  { id:3, code:'DJ2024003', property:'FY2024003-A栋305', customer:'江津新材料科技公司', amount:25500, method:'银行转账', time:'2024-10-21', receipt:'RC20241021001', uploaded:true, status:'已收取' },
  { id:4, code:'DJ2024004', property:'FY2024010-D栋102', customer:'重庆万达商业管理公司', amount:60000, method:'银行转账', time:'2024-10-26', receipt:'RC20241026001', uploaded:true, status:'已收取' },
  { id:5, code:'DJ2024005', property:'FY2024013-E栋101', customer:'成都天府科创有限公司', amount:80000, method:'银行转账', time:'2024-10-19', receipt:'RC20241019001', uploaded:true, status:'已收取' },
  { id:6, code:'DJ2024006', property:'FY2024007-C栋101', customer:'重庆鼎盛实业有限公司', amount:36000, method:'微信', time:'2024-11-09', receipt:'', uploaded:false, status:'已收取' },
  { id:7, code:'DJ2024007', property:'FY2024002-A栋203', customer:'四川蓝海贸易公司', amount:9000, method:'支付宝', time:'2024-11-06', receipt:'RC20241106001', uploaded:true, status:'已退还' },
  { id:8, code:'DJ2024008', property:'FY2024012-D栋305', customer:'江津永辉超市有限公司', amount:15000, method:'现金', time:'2024-11-13', receipt:'', uploaded:false, status:'已收取' },
  { id:9, code:'DJ2024009', property:'FY2024017-C栋401', customer:'重庆渝创投资有限公司', amount:19500, method:'银行转账', time:'2024-11-01', receipt:'RC20241101001', uploaded:true, status:'已收取' },
  { id:10, code:'DJ2024010', property:'FY2024019-E栋301', customer:'成都新锐广告有限公司', amount:27000, method:'银行转账', time:'2024-11-12', receipt:'', uploaded:false, status:'已收取' },
])

const depositTotal = computed(() => deposits.value.filter(d => d.status==='已收取').reduce((s, d) => s + d.amount, 0))

const contracts = ref([
  { id:1, code:'HT2024001', name:'A栋101租赁合同', property:'FY2024001', customer:'重庆智汇科技有限公司', signTime:'2024-11-05', period:'2024-11-05至2025-11-04', amount:'4,500元/月', status:'已签约', reason:'' },
  { id:2, code:'HT2024002', name:'B栋201出售合同', property:'FY2024005', customer:'成都盛达物流集团', signTime:'2024-10-30', period:'一次性交付', amount:'110万元', status:'已履约', reason:'' },
  { id:3, code:'HT2024003', name:'A栋305租赁合同', property:'FY2024003', customer:'江津新材料科技公司', signTime:'2024-10-22', period:'2024-10-22至2026-10-21', amount:'8,500元/月', status:'已签约', reason:'' },
  { id:4, code:'HT2024004', name:'D栋102出售合同', property:'FY2024010', customer:'重庆万达商业管理公司', signTime:'2024-10-27', period:'一次性交付', amount:'135万元', status:'已履约', reason:'' },
  { id:5, code:'HT2024005', name:'E栋101出售合同', property:'FY2024013', customer:'成都天府科创有限公司', signTime:'2024-10-20', period:'一次性交付', amount:'195万元', status:'已履约', reason:'' },
  { id:6, code:'HT2024006', name:'C栋101租赁合同', property:'FY2024007', customer:'重庆鼎盛实业有限公司', signTime:'', period:'2024-12-01至2026-11-30', amount:'12,000元/月', status:'待签约', reason:'' },
  { id:7, code:'HT2024007', name:'B栋302租赁合同', property:'FY2024006', customer:'重庆华通电子有限公司', signTime:'', period:'2025-01-01至2025-12-31', amount:'3,800元/月', status:'待签约', reason:'' },
  { id:8, code:'HT2024008', name:'C栋401租赁合同', property:'FY2024017', customer:'重庆渝创投资有限公司', signTime:'2024-11-02', period:'2024-11-02至2025-11-01', amount:'6,500元/月', status:'已解约', reason:'承租方经营调整，双方协商解除' },
  { id:9, code:'HT2024009', name:'D栋305租赁合同', property:'FY2024012', customer:'江津永辉超市有限公司', signTime:'', period:'2024-12-01至2025-11-30', amount:'5,200元/月', status:'待签约', reason:'' },
  { id:10, code:'HT2024010', name:'E栋301租赁合同', property:'FY2024019', customer:'成都新锐广告有限公司', signTime:'', period:'2025-01-01至2026-12-31', amount:'9,000元/月', status:'待签约', reason:'' },
  { id:11, code:'HT2024011', name:'A栋401租赁合同', property:'FY2024015', customer:'重庆中启信息技术公司', signTime:'', period:'2025-01-01至2025-12-31', amount:'4,200元/月', status:'待签约', reason:'' },
  { id:12, code:'HT2024012', name:'B栋201车位出售补充协议', property:'FY2024005', customer:'成都盛达物流集团', signTime:'2024-11-10', period:'一次性交付', amount:'8万元', status:'已签约', reason:'' },
])

function negStatusClass(s) { return { '进行中':'badge-blue','已成交':'badge-green','已放弃':'badge-gray' }[s] || 'badge-gray' }
function depStatusClass(s) { return s==='已收取' ? 'badge-green' : 'badge-orange' }
function conStatusClass(s) { return { '待签约':'badge-orange','已签约':'badge-blue','已履约':'badge-green','已解约':'badge-red' }[s] || 'badge-gray' }

function saveNeg() {
  negotiations.value.unshift({ id:Date.now(), code:'QT'+Date.now(), ...negForm.value })
  showNegModal.value = false
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">洽谈与合同管理</h1>
      <p class="page-subtitle">管理客户洽谈记录、定金收取及合同签署全流程</p>
    </div>

    <div class="tabs">
      <div class="tab-item" :class="{active:activeTab==='negotiation'}" @click="activeTab='negotiation'">洽谈记录 <span class="tab-count">{{ negotiations.length }}</span></div>
      <div class="tab-item" :class="{active:activeTab==='deposit'}" @click="activeTab='deposit'">定金管理 <span class="tab-count">{{ deposits.length }}</span></div>
      <div class="tab-item" :class="{active:activeTab==='contract'}" @click="activeTab='contract'">合同管理 <span class="tab-count">{{ contracts.length }}</span></div>
    </div>

    <!-- Negotiation Tab -->
    <div v-if="activeTab==='negotiation'" class="card">
      <div class="card-header">
        <span class="card-title">洽谈记录列表</span>
        <button class="btn btn-primary" @click="showNegModal=true">+ 新建洽谈记录</button>
      </div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>洽谈编号</th><th>房源编号</th><th>客户名称</th><th>洽谈时间</th><th>洽谈内容</th><th>价格协商</th><th>客户需求</th><th>跟进人</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="n in negotiations" :key="n.id">
              <td class="font-semibold">{{ n.code }}</td><td>{{ n.propertyCode }}</td><td>{{ n.customer }}</td>
              <td class="text-gray">{{ n.time }}</td><td class="truncate" style="max-width:180px" :title="n.content">{{ n.content }}</td>
              <td class="truncate" style="max-width:140px" :title="n.priceResult">{{ n.priceResult }}</td>
              <td class="truncate" style="max-width:120px" :title="n.demand">{{ n.demand }}</td><td>{{ n.follower }}</td>
              <td><span class="badge" :class="negStatusClass(n.status)">{{ n.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Deposit Tab -->
    <div v-if="activeTab==='deposit'" class="card">
      <div class="card-header"><span class="card-title">定金管理列表</span></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>定金编号</th><th>关联房源</th><th>客户名称</th><th>定金金额</th><th>支付方式</th><th>支付时间</th><th>缴费凭证</th><th>收据编号</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="d in deposits" :key="d.id">
              <td class="font-semibold">{{ d.code }}</td><td>{{ d.property }}</td><td>{{ d.customer }}</td>
              <td class="font-num">{{ d.amount.toLocaleString() }}元</td><td>{{ d.method }}</td>
              <td class="text-gray">{{ d.time }}</td>
              <td><span class="badge" :class="d.uploaded?'badge-green':'badge-orange'">{{ d.uploaded?'已上传':'待上传' }}</span></td>
              <td>{{ d.receipt || '-' }}</td>
              <td><span class="badge" :class="depStatusClass(d.status)">{{ d.status }}</span></td>
              <td><div class="table-actions"><button class="btn btn-text btn-sm">查看</button><button class="btn btn-text btn-sm">生成收据</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="summary-row">
        <div class="summary-item"><span class="summary-label">定金收取总额：</span><span class="summary-value font-num">{{ depositTotal.toLocaleString() }}元</span></div>
      </div>
    </div>

    <!-- Contract Tab -->
    <div v-if="activeTab==='contract'" class="card">
      <div class="card-header"><span class="card-title">合同管理列表</span></div>
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>合同编号</th><th>合同名称</th><th>关联房源</th><th>客户名称</th><th>签约时间</th><th>履约周期</th><th>租金/售价</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="c in contracts" :key="c.id">
              <td class="font-semibold">{{ c.code }}</td><td>{{ c.name }}</td><td>{{ c.property }}</td><td>{{ c.customer }}</td>
              <td class="text-gray">{{ c.signTime || '-' }}</td><td>{{ c.period }}</td><td class="font-num">{{ c.amount }}</td>
              <td>
                <span class="badge" :class="conStatusClass(c.status)" :title="c.status==='已解约'?c.reason:''">{{ c.status }}</span>
                <span v-if="c.status==='已解约'" class="text-sm text-danger" :title="c.reason" style="cursor:help;margin-left:4px">(?)</span>
              </td>
              <td><div class="table-actions"><button class="btn btn-text btn-sm">查看</button><button class="btn btn-text btn-sm">下载</button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- New Negotiation Modal -->
    <div v-if="showNegModal" class="modal-overlay" @click.self="showNegModal=false">
      <div class="modal modal-lg">
        <div class="modal-header"><span class="modal-title">新建洽谈记录</span><button class="modal-close" @click="showNegModal=false">&times;</button></div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group"><label class="form-label required">房源编号</label><input v-model="negForm.propertyCode" class="form-input" placeholder="FY2024XXX" /></div>
            <div class="form-group"><label class="form-label required">客户名称</label><input v-model="negForm.customer" class="form-input" /></div>
            <div class="form-group"><label class="form-label required">洽谈时间</label><input v-model="negForm.time" class="form-input" type="datetime-local" /></div>
            <div class="form-group"><label class="form-label">跟进人</label><input v-model="negForm.follower" class="form-input" /></div>
            <div class="form-group full-width"><label class="form-label required">洽谈内容</label><textarea v-model="negForm.content" class="form-textarea" rows="2"></textarea></div>
            <div class="form-group"><label class="form-label">价格协商结果</label><input v-model="negForm.priceResult" class="form-input" /></div>
            <div class="form-group"><label class="form-label">客户需求</label><input v-model="negForm.demand" class="form-input" /></div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn btn-default" @click="showNegModal=false">取消</button><button class="btn btn-primary" @click="saveNeg">保存</button></div>
      </div>
    </div>
  </div>
</template>
