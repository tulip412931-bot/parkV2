import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { title: '登录' } },
  {
    path: '/app',
    component: () => import('@/components/AppLayout.vue'),
    redirect: '/app/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: '首页', breadcrumb: ['首页'] } },

      // ===== 收费管理 =====
      // 收费看板
      { path: 'billing/dashboard', name: 'BillingDashboard', component: () => import('@/views/billing/BillingDashboardView.vue'), meta: { title: '收费看板', breadcrumb: ['收费管理', '收费看板'] } },
      // 前台收费
      { path: 'billing/center', name: 'ChargeCenter', component: () => import('@/views/billing/ChargeCenterView.vue'), meta: { title: '收费中心', breadcrumb: ['收费管理', '前台收费', '收费中心'] } },
      { path: 'billing/predeposit', name: 'PreDeposit', component: () => import('@/views/billing/PreDepositView.vue'), meta: { title: '预存费', breadcrumb: ['收费管理', '前台收费', '预存费'] } },
      { path: 'billing/payment-apply', name: 'PaymentApply', component: () => import('@/views/billing/PaymentApplyView.vue'), meta: { title: '交款申请', breadcrumb: ['收费管理', '前台收费', '交款申请'] } },
      { path: 'billing/reminder', name: 'CollectionReminder', component: () => import('@/views/billing/CollectionReminderView.vue'), meta: { title: '催费中心', breadcrumb: ['收费管理', '前台收费', '催费中心'] } },
      { path: 'billing/history', name: 'ChargeHistory', component: () => import('@/views/billing/ChargeHistoryView.vue'), meta: { title: '收费历史记录', breadcrumb: ['收费管理', '前台收费', '收费历史记录'] } },
      { path: 'billing/odd-account', name: 'CustomerOdd', component: () => import('@/views/billing/CustomerOddView.vue'), meta: { title: '客户零头账户', breadcrumb: ['收费管理', '前台收费', '客户零头账户'] } },
      // 应收管理
      { path: 'billing/generate', name: 'BillGenerate', component: () => import('@/views/billing/BillGenerateView.vue'), meta: { title: '生成账单', breadcrumb: ['收费管理', '应收管理', '生成账单'] } },
      { path: 'billing/auto-bill', name: 'AutoBill', component: () => import('@/views/billing/AutoBillView.vue'), meta: { title: '自动生成账单', breadcrumb: ['收费管理', '应收管理', '自动生成账单'] } },
      { path: 'billing/bills', name: 'BillManage', component: () => import('@/views/billing/BillManageView.vue'), meta: { title: '账单管理', breadcrumb: ['收费管理', '应收管理', '账单管理'] } },
      { path: 'billing/reduction', name: 'ReductionApply', component: () => import('@/views/billing/ReductionApplyView.vue'), meta: { title: '减免申请', breadcrumb: ['收费管理', '应收管理', '减免申请'] } },
      { path: 'billing/amort', name: 'FixedAmort', component: () => import('@/views/billing/FixedAmortView.vue'), meta: { title: '固定金额分摊', breadcrumb: ['收费管理', '应收管理', '固定金额分摊'] } },
      { path: 'billing/fee-adjust', name: 'FeeAdjust', component: () => import('@/views/billing/FeeAdjustView.vue'), meta: { title: '费用调整记录', breadcrumb: ['收费管理', '应收管理', '费用调整记录'] } },
      { path: 'billing/designated-reduction', name: 'DesignatedReduction', component: () => import('@/views/billing/DesignatedReductionView.vue'), meta: { title: '指定减免金额统计', breadcrumb: ['收费管理', '应收管理', '指定减免金额统计'] } },
      // 退款管理
      { path: 'billing/refund', name: 'RefundManage', component: () => import('@/views/billing/RefundManageView.vue'), meta: { title: '退款管理', breadcrumb: ['收费管理', '退款管理'] } },
      // 仪表抄表
      { path: 'billing/meter', name: 'MeterReading', component: () => import('@/views/billing/MeterReadingView.vue'), meta: { title: '仪表抄表', breadcrumb: ['收费管理', '仪表抄表'] } },
      // 票据管理
      { path: 'billing/invoice', name: 'InvoiceManage', component: () => import('@/views/billing/InvoiceManageView.vue'), meta: { title: '票据管理', breadcrumb: ['收费管理', '票据管理'] } },
      // 收费设置
      { path: 'billing/settings', name: 'ChargeSettings', component: () => import('@/views/billing/ChargeSettingsView.vue'), meta: { title: '收费项目定义', breadcrumb: ['收费管理', '收费设置', '收费项目定义'] } },
      { path: 'billing/standard', name: 'ChargeStandard', component: () => import('@/views/billing/ChargeStandardView.vue'), meta: { title: '收费标准设置', breadcrumb: ['收费管理', '收费设置', '收费标准设置'] } },
      { path: 'billing/bind-stats', name: 'ChargeBindStats', component: () => import('@/views/billing/ChargeBindStatsView.vue'), meta: { title: '收费标准绑定统计', breadcrumb: ['收费管理', '收费设置', '收费标准绑定统计'] } },
      { path: 'billing/payment-method', name: 'PaymentMethod', component: () => import('@/views/billing/PaymentMethodView.vue'), meta: { title: '支付方式配置', breadcrumb: ['收费管理', '收费设置', '支付方式配置'] } },

      // ===== 财务管理 =====
      { path: 'finance/common', name: 'CommonReport', component: () => import('@/views/finance/CommonReportView.vue'), meta: { title: '常用报表', breadcrumb: ['财务管理', '常用报表'] } },
      { path: 'finance/report', name: 'FinanceReport', component: () => import('@/views/finance/FinanceReportView.vue'), meta: { title: '综合报表', breadcrumb: ['财务管理', '常用报表', '综合报表'] } },
      { path: 'finance/receivable', name: 'Receivable', component: () => import('@/views/finance/ReceivableView.vue'), meta: { title: '应收月度统计', breadcrumb: ['财务管理', '常用报表', '应收月度统计'] } },
      { path: 'finance/collection', name: 'CollectionDaily', component: () => import('@/views/finance/CollectionDailyView.vue'), meta: { title: '已收费用日报', breadcrumb: ['财务管理', '常用报表', '已收费用日报'] } },
      { path: 'finance/fee-report', name: 'FeeReport', component: () => import('@/views/finance/FeeReportView.vue'), meta: { title: '费用报表', breadcrumb: ['财务管理', '费用报表'] } },
      { path: 'finance/monthly', name: 'MonthlyReport', component: () => import('@/views/finance/MonthlyReportView.vue'), meta: { title: '月报表', breadcrumb: ['财务管理', '月报表'] } },
      { path: 'finance/deposit', name: 'DepositReport', component: () => import('@/views/finance/DepositReportView.vue'), meta: { title: '保证金', breadcrumb: ['财务管理', '保证金'] } },
      { path: 'finance/annual', name: 'AnnualReport', component: () => import('@/views/finance/AnnualReportView.vue'), meta: { title: '年度报表', breadcrumb: ['财务管理', '年度报表'] } },
      { path: 'finance/arrears', name: 'Arrears', component: () => import('@/views/finance/ArrearsView.vue'), meta: { title: '欠费统计', breadcrumb: ['财务管理', '欠费报表', '欠费统计'] } },
      { path: 'finance/arrears-report', name: 'ArrearsReport', component: () => import('@/views/finance/ArrearsReportView.vue'), meta: { title: '欠费报表', breadcrumb: ['财务管理', '欠费报表'] } },
      { path: 'finance/reduction', name: 'ReductionReport', component: () => import('@/views/finance/ReductionReportView.vue'), meta: { title: '费用减免统计', breadcrumb: ['财务管理', '费用减免统计'] } },
      { path: 'finance/custom', name: 'CustomReport', component: () => import('@/views/finance/CustomReportView.vue'), meta: { title: '自定义报表', breadcrumb: ['财务管理', '自定义报表'] } },
      { path: 'finance/goal', name: 'GoalManage', component: () => import('@/views/finance/GoalManageView.vue'), meta: { title: '目标管理', breadcrumb: ['财务管理', '目标管理'] } },

      // ===== 房产资源 =====
      { path: 'property/resources', name: 'PropertyResource', component: () => import('@/views/property/PropertyResourceView.vue'), meta: { title: '物业资源管理', breadcrumb: ['房产资源', '房产资源管理', '物业资源管理'] } },
      { path: 'property/types', name: 'ResourceType', component: () => import('@/views/property/ResourceTypeView.vue'), meta: { title: '资源类型管理', breadcrumb: ['房产资源', '房产资源管理', '资源类型管理'] } },
      { path: 'property/steward', name: 'StewardManage', component: () => import('@/views/property/StewardManageView.vue'), meta: { title: '管家管理', breadcrumb: ['房产资源', '房产资源管理', '管家管理'] } },
      { path: 'property/floorplan', name: 'Floorplan', component: () => import('@/views/property/FloorplanView.vue'), meta: { title: '房产资源平面图', breadcrumb: ['房产资源', '房产资源统计', '房产资源平面图'] } },
      { path: 'property/wechat-bind', name: 'WechatBind', component: () => import('@/views/property/WechatBindView.vue'), meta: { title: '微信绑定状态统计', breadcrumb: ['房产资源', '房产资源统计', '微信绑定状态统计'] } },
      { path: 'property/parking', name: 'ParkingStats', component: () => import('@/views/property/ParkingStatsView.vue'), meta: { title: '车位状态统计', breadcrumb: ['房产资源', '房产资源统计', '车位状态统计'] } },
      { path: 'property/room-bind', name: 'RoomBind', component: () => import('@/views/property/RoomBindView.vue'), meta: { title: '房间绑定业主统计', breadcrumb: ['房产资源', '房产资源统计', '房间绑定业主统计'] } },
      { path: 'property/stats', name: 'PropertyStats', component: () => import('@/views/property/PropertyStatsView.vue'), meta: { title: '房态统计', breadcrumb: ['房产资源', '房产资源统计', '房态统计'] } },

      // ===== 系统管理 =====
      // 系统设置
      { path: 'system/init', name: 'SystemInit', component: () => import('@/views/system/SystemInitView.vue'), meta: { title: '系统初始化', breadcrumb: ['系统管理', '系统设置', '系统初始化'] } },
      { path: 'system/logs', name: 'OperationLog', component: () => import('@/views/system/OperationLogView.vue'), meta: { title: '操作日志', breadcrumb: ['系统管理', '系统设置', '操作日志'] } },
      { path: 'system/banner', name: 'BannerSettings', component: () => import('@/views/system/BannerSettingsView.vue'), meta: { title: '轮播图设置', breadcrumb: ['系统管理', '系统设置', '轮播图设置'] } },
      { path: 'system/params', name: 'ParamSettings', component: () => import('@/views/system/ParamSettingsView.vue'), meta: { title: '参数设置', breadcrumb: ['系统管理', '系统设置', '参数设置'] } },
      { path: 'system/print-template', name: 'PrintTemplate', component: () => import('@/views/system/PrintTemplateView.vue'), meta: { title: '打印模板管理', breadcrumb: ['系统管理', '系统设置', '打印模板管理'] } },
      // 组织架构
      { path: 'system/org', name: 'OrgStructure', component: () => import('@/views/system/OrgStructureView.vue'), meta: { title: '组织机构', breadcrumb: ['系统管理', '组织架构', '组织机构'] } },
      { path: 'system/user-org', name: 'UserOrg', component: () => import('@/views/system/UserOrgView.vue'), meta: { title: '用户组织设置', breadcrumb: ['系统管理', '组织架构', '用户组织设置'] } },
      { path: 'system/employees', name: 'EmployeeManage', component: () => import('@/views/system/EmployeeManageView.vue'), meta: { title: '员工管理', breadcrumb: ['系统管理', '组织架构', '员工管理'] } },
      { path: 'system/permission', name: 'Permission', component: () => import('@/views/system/PermissionView.vue'), meta: { title: '权限管理', breadcrumb: ['系统管理', '组织架构', '权限管理'] } },
      { path: 'system/custom-group', name: 'CustomGroup', component: () => import('@/views/system/CustomGroupView.vue'), meta: { title: '自定义用户组', breadcrumb: ['系统管理', '组织架构', '自定义用户组'] } },
      // 消息/合同/角色/用户
      { path: 'system/message', name: 'MessageSettings', component: () => import('@/views/system/MessageSettingsView.vue'), meta: { title: '消息接收设置', breadcrumb: ['系统管理', '消息设置', '消息接收设置'] } },
      { path: 'system/contract-template', name: 'ContractTemplate', component: () => import('@/views/system/ContractTemplateView.vue'), meta: { title: '合同模板管理', breadcrumb: ['系统管理', '合同设置', '合同模板管理'] } },
      { path: 'system/roles', name: 'RoleManage', component: () => import('@/views/system/RoleManageView.vue'), meta: { title: '角色管理', breadcrumb: ['系统管理', '角色管理'] } },

      // ===== 票通发票 =====
      { path: 'invoice/dashboard', name: 'InvoiceDashboard', component: () => import('@/views/invoice/InvoiceDashboardView.vue'), meta: { title: '发票看板', breadcrumb: ['票通发票', '发票看板'] } },
      { path: 'invoice/create', name: 'InvoiceCreate', component: () => import('@/views/invoice/InvoiceCreateView.vue'), meta: { title: '发票开具', breadcrumb: ['票通发票', '发票开具'] } },
      { path: 'invoice/manage', name: 'InvoiceManageV2', component: () => import('@/views/invoice/InvoiceManageView.vue'), meta: { title: '发票管理', breadcrumb: ['票通发票', '发票管理'] } },
      { path: 'invoice/verify', name: 'InvoiceVerify', component: () => import('@/views/invoice/InvoiceVerifyView.vue'), meta: { title: '发票查验', breadcrumb: ['票通发票', '发票查验'] } },
      { path: 'invoice/stats', name: 'InvoiceStats', component: () => import('@/views/invoice/InvoiceStatsView.vue'), meta: { title: '统计分析', breadcrumb: ['票通发票', '统计分析'] } },
      { path: 'invoice/settings', name: 'InvoiceSettings', component: () => import('@/views/invoice/InvoiceSettingsView.vue'), meta: { title: '发票设置', breadcrumb: ['票通发票', '发票设置'] } },

      // ===== 招商租赁 =====
      { path: 'finlease/properties', name: 'LeaseProperty', component: () => import('@/views/finlease/LeasePropertyView.vue'), meta: { title: '租赁房源管理', breadcrumb: ['招商租赁', '租赁房源管理'] } },
      { path: 'finlease/negotiation', name: 'LeaseNegotiation', component: () => import('@/views/finlease/LeaseNegotiationView.vue'), meta: { title: '洽谈与合同', breadcrumb: ['招商租赁', '洽谈与合同'] } },
      { path: 'finlease/orders', name: 'LeaseOrder', component: () => import('@/views/finlease/LeaseOrderView.vue'), meta: { title: '租售订单管理', breadcrumb: ['招商租赁', '租售订单管理'] } },
      { path: 'finlease/report', name: 'LeaseReport', component: () => import('@/views/finlease/LeaseReportView.vue'), meta: { title: '租售统计报表', breadcrumb: ['招商租赁', '租售统计报表'] } },

      // ===== 门禁管理 =====
      { path: 'access/employee', name: 'EmployeeAccess', component: () => import('@/views/access/EmployeeAccessView.vue'), meta: { title: '员工通行管理', breadcrumb: ['门禁管理', '员工通行管理'] } },
      { path: 'access/visitor', name: 'VisitorAccess', component: () => import('@/views/access/VisitorAccessView.vue'), meta: { title: '访客通行管理', breadcrumb: ['门禁管理', '访客通行管理'] } },
      { path: 'access/records', name: 'AccessRecords', component: () => import('@/views/access/AccessRecordsView.vue'), meta: { title: '门禁记录与统计', breadcrumb: ['门禁管理', '门禁记录与统计'] } },

      // ===== 租售板块 =====
      { path: 'rental/properties', name: 'RentalProperties', component: () => import('@/views/rental/RentalPropertiesView.vue'), meta: { title: '房源信息管理', breadcrumb: ['租售板块', '房源信息管理'] } },
      { path: 'rental/intention', name: 'RentalIntention', component: () => import('@/views/rental/RentalIntentionView.vue'), meta: { title: '租售意向管理', breadcrumb: ['租售板块', '租售意向管理'] } },
      { path: 'rental/orders', name: 'RentalOrders', component: () => import('@/views/rental/RentalOrdersView.vue'), meta: { title: '租售订单管理', breadcrumb: ['租售板块', '租售订单管理'] } },
      { path: 'rental/stats', name: 'RentalStats', component: () => import('@/views/rental/RentalStatsView.vue'), meta: { title: '租售数据统计', breadcrumb: ['租售板块', '租售数据统计'] } },

      // ===== 招租板块 =====
      { path: 'leasing/properties', name: 'LeasingProperties', component: () => import('@/views/leasing/LeasingPropertiesView.vue'), meta: { title: '招租房源管理', breadcrumb: ['招租板块', '招租房源管理'] } },
      { path: 'leasing/leads', name: 'LeasingLeads', component: () => import('@/views/leasing/LeasingLeadsView.vue'), meta: { title: '招商线索管理', breadcrumb: ['招租板块', '招商线索管理'] } },
      { path: 'leasing/matching', name: 'LeasingMatching', component: () => import('@/views/leasing/LeasingMatchingView.vue'), meta: { title: '招商智能匹配', breadcrumb: ['招租板块', '招商智能匹配'] } },
      { path: 'leasing/progress', name: 'LeasingProgress', component: () => import('@/views/leasing/LeasingProgressView.vue'), meta: { title: '招商进度管理', breadcrumb: ['招租板块', '招商进度管理'] } },
      { path: 'leasing/stats', name: 'LeasingStats', component: () => import('@/views/leasing/LeasingStatsView.vue'), meta: { title: '招商数据分析', breadcrumb: ['招租板块', '招商数据分析'] } },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
