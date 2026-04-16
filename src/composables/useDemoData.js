// ============================================================
// Demo Data Generators - Kunhuang Industrial Park
// ============================================================

// --- Constants ---

export const DEPARTMENTS = ['行政部', '技术部', '市场部', '财务部', '人力资源部', '运营部', '法务部', '产品部']

export const COMPANIES_IN_PARK = [
  { name: '重庆星辰科技有限公司', floor: 'A栋3层', employees: 86 },
  { name: '四川云图数据有限公司', floor: 'A栋5层', employees: 52 },
  { name: '重庆智远物联有限公司', floor: 'B栋2层', employees: 34 },
  { name: '成都蓝海软件有限公司', floor: 'B栋6层', employees: 67 },
  { name: '重庆鼎新能源科技有限公司', floor: 'C栋1层', employees: 45 },
  { name: '贵州云算大数据有限公司', floor: 'C栋3层', employees: 28 },
  { name: '重庆锐创机器人有限公司', floor: 'D栋2层', employees: 41 },
  { name: '四川天启生物科技有限公司', floor: 'D栋5层', employees: 23 }
]

export const BUILDINGS = ['A栋', 'B栋', 'C栋', 'D栋', 'E栋']
export const PROPERTY_TYPES = ['办公室', '厂房', '仓库', '商铺', '会议室']

// --- Internal helpers ---

const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗', '梁', '宋', '郑', '谢', '韩', '唐', '冯', '于', '董', '萧', '程', '曹', '袁', '邓', '许', '傅', '沈', '曾', '彭', '吕']
const GIVEN_NAMES = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '文', '华', '建华', '建国', '建军', '志强', '志明', '海燕', '晓明', '小红', '婷婷', '雪梅', '思远', '浩然', '宇轩', '子涵', '欣怡', '梓萱']
const VISIT_PURPOSES = ['商务洽谈', '面试', '送货', '维修', '参观']
const GATES = ['东门', '西门', '南门', '北门']
const ACCESS_METHODS = ['刷卡', '扫码', '人脸']
const ORIENTATIONS = ['东', '南', '西', '北', '东南', '西南']
const FACILITIES_LIST = ['中央空调', '网络布线', '独立卫生间', '电梯直达', '停车位', '消防系统', '门禁系统', '监控系统', '新风系统', '会议室', '茶水间', '前台']
const INDUSTRIES = ['信息技术', '人工智能', '大数据', '物联网', '新能源', '生物科技', '智能制造', '电子商务', '金融科技', '文化创意', '环保科技', '医疗器械']
const LEAD_SOURCES = ['平台咨询', '线下登记', '客户推荐', '外部推广']
const EXTERNAL_COMPANIES = ['重庆华通贸易有限公司', '成都瑞达物流有限公司', '深圳前海创新科技有限公司', '北京中盛咨询有限公司', '上海易联信息技术有限公司', '广州恒达电子有限公司', '武汉光谷智能科技有限公司', '杭州数联云计算有限公司', '南京紫金半导体有限公司', '西安航天精密制造有限公司']
const ASSIGNEES = ['张经理', '李主管', '王顾问', '刘专员', '陈经理', '赵主管', '周顾问', '吴专员']

// --- Utility functions ---

export function fmt(n) {
  if (n == null) return ''
  return Number(n).toLocaleString('zh-CN')
}

export function randomDate(start, end) {
  const s = start instanceof Date ? start.getTime() : new Date(start).getTime()
  const e = end instanceof Date ? end.getTime() : new Date(end).getTime()
  const d = new Date(s + Math.random() * (e - s))
  return d.toISOString().slice(0, 10)
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomPhone() {
  const prefixes = ['138', '139', '136', '137', '158', '159', '188', '189', '166', '176', '199', '155', '156', '185', '186']
  const prefix = randomPick(prefixes)
  const mid = String(randomInt(1000, 9999))
  const tail = String(randomInt(1000, 9999))
  return prefix + '****' + tail
}

function randomName() {
  return randomPick(SURNAMES) + randomPick(GIVEN_NAMES)
}

function randomIdCard() {
  const area = randomPick(['500102', '500103', '500105', '500106', '500107', '500108', '510104', '510107', '520102', '520113'])
  const year = randomInt(1970, 2000)
  const month = String(randomInt(1, 12)).padStart(2, '0')
  const day = String(randomInt(1, 28)).padStart(2, '0')
  const seq = String(randomInt(100, 999))
  const check = randomPick(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X'])
  const full = area + year + month + day + seq + check
  return full.slice(0, 6) + '********' + full.slice(14)
}

function randomCardNo() {
  return 'KH' + String(randomInt(100000, 999999))
}

function randomDateTime(start, end) {
  const s = start instanceof Date ? start.getTime() : new Date(start).getTime()
  const e = end instanceof Date ? end.getTime() : new Date(end).getTime()
  const d = new Date(s + Math.random() * (e - s))
  const pad = (v) => String(v).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// --- Generators ---

export function generateEmployees(n = 50) {
  const statuses = ['正常', '已注销', '审核中']
  const statusWeights = [0.8, 0.1, 0.1]
  const result = []
  for (let i = 0; i < n; i++) {
    const name = randomName()
    const company = randomPick(COMPANIES_IN_PARK)
    const r = Math.random()
    const status = r < statusWeights[0] ? statuses[0] : r < statusWeights[0] + statusWeights[1] ? statuses[1] : statuses[2]
    result.push({
      id: i + 1,
      name,
      company: company.name,
      department: randomPick(DEPARTMENTS),
      phone: randomPhone(),
      cardNo: randomCardNo(),
      status,
      photo: name.slice(0, 1),
      entryDate: randomDate('2021-01-01', '2026-04-01')
    })
  }
  return result
}

export function generateVisitors(n = 30) {
  const statuses = ['待核销', '已通过', '已过期', '已拒绝']
  const statusWeights = [0.25, 0.45, 0.2, 0.1]
  const result = []
  for (let i = 0; i < n; i++) {
    const name = randomName()
    const hostCompany = randomPick(COMPANIES_IN_PARK)
    const r = Math.random()
    let status
    if (r < statusWeights[0]) status = statuses[0]
    else if (r < statusWeights[0] + statusWeights[1]) status = statuses[1]
    else if (r < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = statuses[2]
    else status = statuses[3]
    const validFrom = randomDate('2026-03-01', '2026-04-15')
    const validTo = randomDate('2026-04-16', '2026-05-30')
    result.push({
      id: i + 1,
      name,
      phone: randomPhone(),
      idCard: randomIdCard(),
      company: randomPick(EXTERNAL_COMPANIES),
      hostCompany: hostCompany.name,
      hostName: randomName(),
      purpose: randomPick(VISIT_PURPOSES),
      qrCode: 'QR' + String(randomInt(100000000, 999999999)),
      validFrom,
      validTo,
      status,
      gate: randomPick(GATES)
    })
  }
  return result
}

export function generateAccessRecords(n = 100) {
  const results = ['通过', '拒绝']
  const reasons = ['', '', '', '', '卡片已过期', '未授权区域', '黑名单人员', '证件异常']
  const arr = []
  for (let i = 0; i < n; i++) {
    const isEmployee = Math.random() > 0.35
    const result = Math.random() > 0.08 ? results[0] : results[1]
    arr.push({
      id: i + 1,
      personName: randomName(),
      type: isEmployee ? '员工' : '访客',
      company: isEmployee ? randomPick(COMPANIES_IN_PARK).name : randomPick(EXTERNAL_COMPANIES),
      gate: randomPick(GATES),
      time: randomDateTime('2026-04-01', '2026-04-16'),
      method: randomPick(ACCESS_METHODS),
      result,
      reason: result === '拒绝' ? randomPick(reasons.filter(r => r !== '')) : ''
    })
  }
  arr.sort((a, b) => b.time.localeCompare(a.time))
  return arr
}

export function generateProperties(n = 40) {
  const statuses = ['待租', '已租', '待售', '已售']
  const statusWeights = [0.35, 0.35, 0.15, 0.15]
  const result = []
  for (let i = 0; i < n; i++) {
    const building = randomPick(BUILDINGS)
    const floorNum = randomInt(1, 8)
    const unitNum = randomInt(1, 6)
    const code = 'KH-' + building.charAt(0) + '-' + floorNum + String(unitNum).padStart(2, '0')
    const type = randomPick(PROPERTY_TYPES)
    const area = type === '厂房' ? randomInt(500, 3000) : type === '仓库' ? randomInt(200, 1500) : randomInt(50, 500)
    const price = type === '厂房' ? randomInt(15, 35) : type === '仓库' ? randomInt(10, 25) : type === '商铺' ? randomInt(60, 150) : randomInt(30, 80)
    const r = Math.random()
    let status
    if (r < statusWeights[0]) status = statuses[0]
    else if (r < statusWeights[0] + statusWeights[1]) status = statuses[1]
    else if (r < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = statuses[2]
    else status = statuses[3]
    const numFacilities = randomInt(3, 7)
    const facilities = []
    const shuffled = [...FACILITIES_LIST].sort(() => Math.random() - 0.5)
    for (let f = 0; f < numFacilities; f++) {
      facilities.push(shuffled[f])
    }
    result.push({
      id: i + 1,
      code,
      building,
      floor: floorNum + '层',
      unit: unitNum + '号',
      area,
      type,
      price,
      status,
      orientation: randomPick(ORIENTATIONS),
      facilities,
      images: [`/placeholder-room-${randomInt(1, 5)}.jpg`]
    })
  }
  return result
}

export function generateIntentions(n = 25) {
  const levels = ['高', '中', '低']
  const statuses = ['新线索', '跟进中', '已签约', '已放弃']
  const statusWeights = [0.2, 0.4, 0.25, 0.15]
  const result = []
  for (let i = 0; i < n; i++) {
    const building = randomPick(BUILDINGS)
    const floorNum = randomInt(1, 8)
    const unitNum = randomInt(1, 6)
    const r = Math.random()
    let status
    if (r < statusWeights[0]) status = statuses[0]
    else if (r < statusWeights[0] + statusWeights[1]) status = statuses[1]
    else if (r < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = statuses[2]
    else status = statuses[3]
    result.push({
      id: i + 1,
      clientName: randomName(),
      phone: randomPhone(),
      targetProperty: 'KH-' + building.charAt(0) + '-' + floorNum + String(unitNum).padStart(2, '0'),
      intentPrice: randomInt(25, 100),
      visitDate: randomDate('2026-01-01', '2026-04-15'),
      level: randomPick(levels),
      status,
      assignee: randomPick(ASSIGNEES),
      notes: randomPick(['客户对面积满意，价格需再商议', '希望尽快入驻，急需办公场地', '需要装修后再确认', '正在对比其他园区', '客户预算有限，需推荐更小户型', '对园区配套设施很满意', '需要与合伙人商量后决定', '计划下季度搬迁']),
      createTime: randomDateTime('2026-01-01', '2026-04-15')
    })
  }
  return result
}

export function generateOrders(n = 20) {
  const types = ['租赁', '出售']
  const statuses = ['待签约', '已签约', '已履约', '已解约']
  const statusWeights = [0.15, 0.45, 0.3, 0.1]
  const result = []
  for (let i = 0; i < n; i++) {
    const building = randomPick(BUILDINGS)
    const floorNum = randomInt(1, 8)
    const unitNum = randomInt(1, 6)
    const propertyCode = 'KH-' + building.charAt(0) + '-' + floorNum + String(unitNum).padStart(2, '0')
    const type = randomPick(types)
    const contractAmount = type === '租赁' ? randomInt(3000, 50000) : randomInt(500000, 5000000)
    const deposit = type === '租赁' ? contractAmount * 2 : Math.round(contractAmount * 0.3)
    const startDate = randomDate('2025-01-01', '2026-04-01')
    const endDate = type === '租赁' ? randomDate('2027-01-01', '2029-12-31') : ''
    const r = Math.random()
    let status
    if (r < statusWeights[0]) status = statuses[0]
    else if (r < statusWeights[0] + statusWeights[1]) status = statuses[1]
    else if (r < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = statuses[2]
    else status = statuses[3]
    result.push({
      id: i + 1,
      orderNo: 'ORD' + String(20260001 + i),
      property: propertyCode,
      client: Math.random() > 0.5 ? randomPick(EXTERNAL_COMPANIES) : randomName(),
      type,
      contractAmount,
      deposit,
      startDate,
      endDate,
      status,
      createTime: randomDateTime('2025-01-01', '2026-04-15')
    })
  }
  return result
}

export function useDemoData() {
  const statCards = [
    { label: '入驻企业', value: '8', unit: '家', icon: 'building', color: '#2563eb' },
    { label: '在管面积', value: '12,680', unit: '㎡', icon: 'area', color: '#7c3aed' },
    { label: '今日通行', value: '342', unit: '人次', icon: 'people', color: '#059669' },
    { label: '待租房源', value: '15', unit: '套', icon: 'house', color: '#d97706' },
    { label: '本月签约', value: '6', unit: '笔', icon: 'contract', color: '#dc2626' },
    { label: '招商线索', value: '28', unit: '条', icon: 'leads', color: '#0891b2' }
  ]

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const trafficBarData = [286, 312, 298, 342, 356, 178, 125]
  const trafficLineData = [260, 290, 275, 320, 340, 165, 110]

  const propertyPieData = [
    { value: 45, name: '已租' },
    { value: 30, name: '待租' },
    { value: 15, name: '已售' },
    { value: 10, name: '待售' }
  ]

  const recentAccessRecords = [
    { time: '14:32', name: '张伟', company: '重庆星辰科技有限公司', type: '员工', direction: '进入', gate: '1号门' },
    { time: '14:28', name: '李娜', company: '坤煌物业管理处', type: '员工', direction: '离开', gate: '2号门' },
    { time: '14:15', name: '王强', company: '重庆鼎盛贸易有限公司', type: '访客', direction: '进入', gate: '1号门' },
    { time: '13:58', name: '赵敏', company: '四川宏远建筑工程公司', type: '员工', direction: '进入', gate: '3号门' },
    { time: '13:42', name: '陈浩', company: '重庆汇智信息技术有限公司', type: '访客', direction: '离开', gate: '1号门' }
  ]

  const todoItems = [
    { text: '3条员工信息待审核', type: 'warning', module: '门禁管理' },
    { text: '2条访客预约待核销', type: 'info', module: '门禁管理' },
    { text: '5套房源信息待更新', type: 'warning', module: '租售板块' },
    { text: '1笔租赁合同即将到期', type: 'error', module: '租售板块' },
    { text: '4条招商线索待跟进', type: 'info', module: '招租板块' }
  ]

  return { statCards, weekDays, trafficBarData, trafficLineData, propertyPieData, recentAccessRecords, todoItems }
}

export function generateLeads(n = 30) {
  const levels = ['高意向', '中意向', '低意向']
  const statuses = ['新线索', '跟进中', '已转化', '已关闭']
  const statusWeights = [0.2, 0.4, 0.25, 0.15]
  const result = []
  const companyNames = [
    '重庆博创智能科技有限公司', '成都天宇信息技术有限公司', '深圳市前海云端科技有限公司',
    '北京中科创新数据有限公司', '上海盛泰金融科技有限公司', '广州粤海电子商务有限公司',
    '武汉光电科技有限公司', '杭州数智云计算有限公司', '南京芯源半导体有限公司',
    '西安航天精密仪器有限公司', '长沙麓谷新材料有限公司', '合肥量子信息科技有限公司',
    '厦门海丝贸易有限公司', '青岛蓝色经济科技有限公司', '大连船舶重工有限公司',
    '苏州纳米材料科技有限公司', '郑州中原数据服务有限公司', '昆明云南绿色能源有限公司',
    '贵阳大数据产业发展有限公司', '兰州西部创新科技有限公司'
  ]
  for (let i = 0; i < n; i++) {
    const r = Math.random()
    let status
    if (r < statusWeights[0]) status = statuses[0]
    else if (r < statusWeights[0] + statusWeights[1]) status = statuses[1]
    else if (r < statusWeights[0] + statusWeights[1] + statusWeights[2]) status = statuses[2]
    else status = statuses[3]
    result.push({
      id: i + 1,
      companyName: companyNames[i % companyNames.length],
      contactPerson: randomName(),
      phone: randomPhone(),
      source: randomPick(LEAD_SOURCES),
      industry: randomPick(INDUSTRIES),
      needArea: randomInt(100, 2000),
      budget: randomInt(20, 120),
      level: randomPick(levels),
      status,
      assignee: randomPick(ASSIGNEES),
      createTime: randomDateTime('2025-06-01', '2026-04-15')
    })
  }
  return result
}
