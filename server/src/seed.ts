import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Hotel } from './models/Hotel';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management';

const sampleHotels = [
  {
    name: '上海外滩华尔道夫酒店',
    nameEn: 'Waldorf Astoria Shanghai on the Bund',
    address: '上海市黄浦区中山东一路2号',
    starRating: 5,
    phone: '021-63229988',
    description: '华尔道夫酒店坐落于上海外滩，由两栋历史建筑组成，曾是上海总会旧址。酒店融合了老上海的优雅与现代奢华，提供无与伦比的住宿体验。客房装饰典雅，配备顶级设施，部分房间可欣赏外滩及浦东天际线的壮丽景色。',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2011-01-01',
    roomTypes: [
      { name: '豪华江景房', nameEn: 'Deluxe River View Room', price: 2888, originalPrice: 3588, area: 55, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '外滩景观套房', nameEn: 'Bund View Suite', price: 4588, originalPrice: 5888, area: 85, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '华尔道夫套房', nameEn: 'Waldorf Suite', price: 8888, originalPrice: 12888, area: 150, bedType: '大床2.0m', maxOccupancy: 4, breakfast: true },
      { name: '总统套房', nameEn: 'Presidential Suite', price: 28888, originalPrice: 38888, area: 280, bedType: '大床2.0m', maxOccupancy: 6, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '外滩', distance: '步行2分钟', description: '上海最著名的地标，可欣赏浦江两岸美景' },
      { name: '南京路步行街', distance: '步行5分钟', description: '中国第一商业街，购物天堂' },
      { name: '豫园', distance: '1.5公里', description: '明代江南古典园林，感受老上海风情' },
      { name: '东方明珠', distance: '2公里', description: '上海地标性建筑，俯瞰全城' },
      { name: '上海中心大厦', distance: '2.5公里', description: '中国第一高楼，云端观光' },
    ],
    transportations: [
      { type: 'subway', name: '地铁2号线南京东路站', distance: '步行5分钟' },
      { type: 'subway', name: '地铁10号线豫园站', distance: '步行8分钟' },
      { type: 'airport', name: '浦东国际机场', distance: '45公里，约50分钟车程' },
      { type: 'airport', name: '虹桥国际机场', distance: '18公里，约30分钟车程' },
      { type: 'train', name: '上海火车站', distance: '5公里，约15分钟车程' },
    ],
    shoppingMalls: [
      { name: '恒隆广场', distance: '步行10分钟', description: '顶级奢侈品购物中心' },
      { name: '国金中心IFC', distance: '2公里', description: '浦东高端购物商场' },
      { name: '新天地', distance: '1.5公里', description: '时尚餐饮购物街区' },
    ],
    discounts: [
      { name: '连住优惠', type: 'percentage', value: 85, conditions: '连住2晚及以上', description: '连住2晚及以上享85折优惠', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '提前预订', type: 'fixed', value: 300, conditions: '提前7天预订', description: '提前7天预订立减300元', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '蜜月套餐', type: 'special', value: 1, conditions: '提供结婚证', description: '蜜月专属布置+香槟+鲜花', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内游泳池', '健身中心', 'SPA水疗', '米其林餐厅', '会议室', '商务中心', '礼宾服务', '代客泊车', '洗衣服务', '儿童托管', '无障碍设施'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前48小时可免费取消',
      extraBed: '加床收费500元/晚（含早餐）',
      pets: '不允许携带宠物，导盲犬除外',
    },
  },
  {
    name: '北京瑰丽酒店',
    nameEn: 'Rosewood Beijing',
    address: '北京市朝阳区朝阳门外大街8号',
    starRating: 5,
    phone: '010-65978888',
    description: '北京瑰丽酒店是瑰丽酒店集团在中国的首家酒店，位于朝阳门外大街，毗邻CBD核心商圈。酒店设计融合了现代艺术与传统文化，拥有282间客房和套房，六间特色餐厅和酒吧，以及完善的会议和休闲设施。',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2014-10-15',
    roomTypes: [
      { name: '豪华客房', nameEn: 'Deluxe Room', price: 2188, originalPrice: 2688, area: 46, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '行政套房', nameEn: 'Executive Suite', price: 3888, originalPrice: 4888, area: 92, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '瑰丽套房', nameEn: 'Rosewood Suite', price: 6888, originalPrice: 8888, area: 138, bedType: '大床2.0m', maxOccupancy: 4, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '故宫博物院', distance: '4公里', description: '世界最大的古代宫殿建筑群' },
      { name: '天安门广场', distance: '3.5公里', description: '世界最大的城市广场' },
      { name: '三里屯', distance: '2公里', description: '北京最时尚的购物娱乐区' },
      { name: '国贸商城', distance: '1.5公里', description: '高端购物中心' },
    ],
    transportations: [
      { type: 'subway', name: '地铁2号线朝阳门站', distance: '步行5分钟' },
      { type: 'subway', name: '地铁6号线朝阳门站', distance: '步行5分钟' },
      { type: 'airport', name: '首都国际机场', distance: '25公里，约40分钟车程' },
      { type: 'airport', name: '大兴国际机场', distance: '55公里，约60分钟车程' },
    ],
    shoppingMalls: [
      { name: '国贸商城', distance: '1.5公里', description: '北京顶级购物中心' },
      { name: '银泰中心', distance: '2公里', description: '奢侈品购物天堂' },
      { name: 'SKP', distance: '3公里', description: '亚洲最大的奢侈品商场之一' },
    ],
    discounts: [
      { name: '周末特惠', type: 'percentage', value: 88, conditions: '周五至周日入住', description: '周末入住享88折', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '龙庭中餐厅', '怡庭西餐厅', '商务中心', '会议室', '代客泊车', '管家服务'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费400元/晚',
      pets: '允许携带小型宠物，需额外收费',
    },
  },
  {
    name: '三亚亚特兰蒂斯酒店',
    nameEn: 'Atlantis Sanya',
    address: '海南省三亚市海棠区海棠北路36号',
    starRating: 5,
    phone: '0898-88986666',
    description: '三亚亚特兰蒂斯酒店是一座以海洋为主题的综合度假胜地，拥有失落的空间水族馆、水世界水上乐园、海豚湾等独特设施。酒店设计灵感来自传说中的亚特兰蒂斯文明，是海南岛上最具标志性的度假目的地。',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2018-04-28',
    roomTypes: [
      { name: '海景房', nameEn: 'Ocean View Room', price: 2588, originalPrice: 3288, area: 54, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '海景套房', nameEn: 'Ocean View Suite', price: 4588, originalPrice: 5888, area: 108, bedType: '大床2.0m', maxOccupancy: 4, breakfast: true },
      { name: '海底套房', nameEn: 'Underwater Suite', price: 10888, originalPrice: 15888, area: 166, bedType: '大床2.0m', maxOccupancy: 4, breakfast: true },
      { name: '皇家套房', nameEn: 'Royal Suite', price: 88888, originalPrice: 108888, area: 876, bedType: '大床2.0m', maxOccupancy: 8, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '蜈支洲岛', distance: '15公里', description: '中国的马尔代夫，潜水胜地' },
      { name: '海棠湾免税店', distance: '3公里', description: '全球最大的单体免税店' },
      { name: '亚龙湾热带天堂森林公园', distance: '25公里', description: '热带雨林探险' },
      { name: '南山文化旅游区', distance: '40公里', description: '108米海上观音像' },
    ],
    transportations: [
      { type: 'airport', name: '三亚凤凰国际机场', distance: '35公里，约40分钟车程' },
      { type: 'train', name: '三亚站', distance: '30公里，约35分钟车程' },
      { type: 'bus', name: '海棠湾免税店免费穿梭巴士', distance: '酒店门口' },
    ],
    shoppingMalls: [
      { name: '三亚国际免税城', distance: '3公里', description: '全球最大单体免税店' },
      { name: '海棠湾万达广场', distance: '5公里', description: '综合购物中心' },
    ],
    discounts: [
      { name: '水世界门票', type: 'special', value: 1, conditions: '入住即送', description: '入住即送水世界无限次门票', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '早鸟优惠', type: 'percentage', value: 80, conditions: '提前30天预订', description: '提前30天预订享8折', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '亲子套餐', type: 'fixed', value: 500, conditions: '2大1小', description: '亲子套餐立减500元，含儿童早餐', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '水世界水上乐园', '失落的空间水族馆', '海豚湾', '私人海滩', '健身中心', 'SPA', '儿童俱乐部', '多家特色餐厅', '免税店'],
    policies: {
      checkIn: '15:00后',
      checkOut: '11:00前',
      cancellation: '入住前7天可免费取消',
      extraBed: '加床收费600元/晚（含水世界门票）',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '杭州西子湖四季酒店',
    nameEn: 'Four Seasons Hotel Hangzhou at West Lake',
    address: '浙江省杭州市西湖区灵隐路5号',
    starRating: 5,
    phone: '0571-88288888',
    description: '杭州西子湖四季酒店坐落于西湖西北岸，毗邻灵隐寺，被葱郁的茶园和竹林环绕。酒店采用江南园林风格设计，粉墙黛瓦，曲径通幽，将传统中式美学与现代奢华完美融合。',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2010-05-01',
    roomTypes: [
      { name: '园景房', nameEn: 'Garden View Room', price: 2688, originalPrice: 3288, area: 52, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '湖景房', nameEn: 'Lake View Room', price: 3588, originalPrice: 4588, area: 58, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '湖景套房', nameEn: 'Lake View Suite', price: 5888, originalPrice: 7888, area: 105, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '总统别墅', nameEn: 'Presidential Villa', price: 38888, originalPrice: 48888, area: 380, bedType: '大床2.0m', maxOccupancy: 6, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '西湖', distance: '步行5分钟', description: '世界文化遗产，人间天堂' },
      { name: '灵隐寺', distance: '2公里', description: '江南名刹，千年古寺' },
      { name: '雷峰塔', distance: '3公里', description: '白娘子传说发源地' },
      { name: '龙井茶园', distance: '1公里', description: '西湖龙井原产地' },
      { name: '断桥残雪', distance: '2公里', description: '西湖十景之一' },
    ],
    transportations: [
      { type: 'subway', name: '地铁3号线黄龙洞站', distance: '步行10分钟' },
      { type: 'airport', name: '杭州萧山国际机场', distance: '35公里，约45分钟车程' },
      { type: 'train', name: '杭州东站', distance: '12公里，约25分钟车程' },
    ],
    shoppingMalls: [
      { name: '湖滨银泰in77', distance: '3公里', description: '西湖边的大型购物中心' },
      { name: '杭州大厦', distance: '4公里', description: '高端奢侈品购物' },
    ],
    discounts: [
      { name: '茶文化体验', type: 'special', value: 1, conditions: '入住即享', description: '免费龙井茶艺体验', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '连住优惠', type: 'percentage', value: 88, conditions: '连住3晚', description: '连住3晚享88折', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '茶室', '商务中心', '代客泊车', '礼宾服务'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前48小时可免费取消',
      extraBed: '加床收费450元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '成都博舍酒店',
    nameEn: 'The Temple House',
    address: '四川省成都市锦江区笔帖式街81号',
    starRating: 5,
    phone: '028-66366666',
    description: '成都博舍酒店位于大慈寺历史文化街区，是一座融合了清代建筑与现代设计的精品酒店。酒店保留了古老的庭院和传统建筑元素，同时融入了当代艺术和设计，展现了成都这座城市的独特魅力。',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2015-07-01',
    roomTypes: [
      { name: '庭院客房', nameEn: 'Courtyard Room', price: 1688, originalPrice: 2088, area: 45, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '博舍套房', nameEn: 'House Suite', price: 3288, originalPrice: 4288, area: 90, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '顶层套房', nameEn: 'Penthouse Suite', price: 6888, originalPrice: 8888, area: 150, bedType: '大床2.0m', maxOccupancy: 4, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '太古里', distance: '步行2分钟', description: '成都最时尚的购物街区' },
      { name: '大慈寺', distance: '步行5分钟', description: '千年古刹，玄奘出家之地' },
      { name: '春熙路', distance: '步行10分钟', description: '成都最繁华的商业街' },
      { name: '宽窄巷子', distance: '3公里', description: '成都最具代表性的历史文化街区' },
      { name: '锦里古街', distance: '4公里', description: '三国文化与成都民俗融合' },
    ],
    transportations: [
      { type: 'subway', name: '地铁2/3号线春熙路站', distance: '步行5分钟' },
      { type: 'airport', name: '成都双流国际机场', distance: '20公里，约30分钟车程' },
      { type: 'airport', name: '天府国际机场', distance: '60公里，约70分钟车程' },
      { type: 'train', name: '成都东站', distance: '10公里，约20分钟车程' },
    ],
    shoppingMalls: [
      { name: '成都远洋太古里', distance: '步行2分钟', description: '开放式购物街区' },
      { name: 'IFS国际金融中心', distance: '步行5分钟', description: '高端奢侈品购物' },
      { name: '王府井百货', distance: '步行10分钟', description: '老牌百货商场' },
    ],
    discounts: [
      { name: '熊猫套餐', type: 'special', value: 1, conditions: '入住即享', description: '含熊猫基地VIP门票+接送', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '川菜体验', type: 'fixed', value: 200, conditions: '预订餐厅', description: '川菜餐厅消费立减200元', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '川菜餐厅', '西餐厅', '酒吧', '图书馆', '会议室', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费350元/晚',
      pets: '允许携带小型宠物，需提前预约',
    },
  },
  {
    name: '深圳柏悦酒店',
    nameEn: 'Park Hyatt Shenzhen',
    address: '深圳市福田区益田路5023号',
    starRating: 5,
    phone: '0755-88291234',
    description: '深圳柏悦酒店位于福田中心区，毗邻深圳会展中心，是深圳最高的酒店之一。酒店设计简约现代，以"空中花园"为理念，将自然元素融入都市空间，为商务和休闲旅客提供极致的住宿体验。',
    images: [
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2009-12-01',
    roomTypes: [
      { name: '柏悦客房', nameEn: 'Park Room', price: 1888, originalPrice: 2388, area: 48, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '行政套房', nameEn: 'Executive Suite', price: 3588, originalPrice: 4588, area: 95, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '主席套房', nameEn: 'Chairman Suite', price: 8888, originalPrice: 12888, area: 200, bedType: '大床2.0m', maxOccupancy: 4, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '深圳会展中心', distance: '步行5分钟', description: '深圳最大的会展场馆' },
      { name: '莲花山公园', distance: '1公里', description: '城市绿肺，邓小平铜像' },
      { name: '市民中心', distance: '步行10分钟', description: '深圳市政府所在地' },
      { name: '华强北', distance: '2公里', description: '中国电子第一街' },
      { name: '深圳湾公园', distance: '3公里', description: '滨海休闲带' },
    ],
    transportations: [
      { type: 'subway', name: '地铁1/4号线会展中心站', distance: '步行5分钟' },
      { type: 'subway', name: '地铁2/3/11号线福田站', distance: '步行10分钟' },
      { type: 'airport', name: '深圳宝安国际机场', distance: '35公里，约40分钟车程' },
      { type: 'train', name: '深圳北站', distance: '10公里，约20分钟车程' },
      { type: 'train', name: '福田高铁站', distance: '步行10分钟' },
    ],
    shoppingMalls: [
      { name: 'COCO Park', distance: '步行5分钟', description: '时尚购物公园' },
      { name: '连城新天地', distance: '步行5分钟', description: '地下购物中心' },
      { name: '皇庭广场', distance: '步行8分钟', description: '高端购物商场' },
    ],
    discounts: [
      { name: '商务套餐', type: 'percentage', value: 90, conditions: '企业协议价', description: '企业客户享9折优惠', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '会展特惠', type: 'fixed', value: 500, conditions: '会展期间', description: '会展期间入住立减500元', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '空中餐厅', '行政酒廊', '商务中心', '会议室', '代客泊车', '礼宾服务'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费400元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '西安W酒店',
    nameEn: 'W Xi\'an',
    address: '陕西省西安市曲江新区曲江池东路333号',
    starRating: 5,
    phone: '029-89666666',
    description: '西安W酒店坐落于曲江新区，毗邻大唐不夜城和大雁塔。酒店设计融合了古都长安的历史元素与现代潮流文化，是西安最时尚的酒店之一，为年轻态旅客提供独特的住宿体验。',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2018-08-01',
    roomTypes: [
      { name: '奇妙客房', nameEn: 'Wonderful Room', price: 1288, originalPrice: 1688, area: 42, bedType: '大床2.0m', maxOccupancy: 2, breakfast: false },
      { name: '绝佳客房', nameEn: 'Spectacular Room', price: 1688, originalPrice: 2088, area: 48, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: 'W套房', nameEn: 'W Suite', price: 3888, originalPrice: 4888, area: 95, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '大唐不夜城', distance: '步行5分钟', description: '网红打卡地，盛唐风情街' },
      { name: '大雁塔', distance: '步行10分钟', description: '千年古塔，玄奘译经之地' },
      { name: '大唐芙蓉园', distance: '步行15分钟', description: '盛唐文化主题公园' },
      { name: '陕西历史博物馆', distance: '2公里', description: '中国第一座大型现代化博物馆' },
      { name: '城墙', distance: '5公里', description: '中国现存最完整的古城墙' },
    ],
    transportations: [
      { type: 'subway', name: '地铁3号线大雁塔站', distance: '步行10分钟' },
      { type: 'subway', name: '地铁4号线大唐芙蓉园站', distance: '步行10分钟' },
      { type: 'airport', name: '西安咸阳国际机场', distance: '45公里，约50分钟车程' },
      { type: 'train', name: '西安北站', distance: '18公里，约30分钟车程' },
    ],
    shoppingMalls: [
      { name: '赛格国际购物中心', distance: '3公里', description: '西安最大的购物中心' },
      { name: '银泰百货', distance: '2公里', description: '曲江高端购物' },
    ],
    discounts: [
      { name: '周末派对', type: 'percentage', value: 85, conditions: '周五周六入住', description: '周末入住享85折', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '网红打卡', type: 'special', value: 1, conditions: '分享社交媒体', description: '分享酒店打卡送鸡尾酒一杯', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内泳池', '健身中心', 'WET泳池酒吧', '中餐厅', '日料餐厅', '酒吧', '夜店', '会议室', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费300元/晚',
      pets: '允许携带小型宠物',
    },
  },
  {
    name: '厦门康莱德酒店',
    nameEn: 'Conrad Xiamen',
    address: '福建省厦门市思明区思明东路328号',
    starRating: 5,
    phone: '0592-6318888',
    description: '厦门康莱德酒店位于思明区核心地段，可俯瞰鼓浪屿和厦门港美景。酒店设计灵感来自厦门的海洋文化，融合了闽南传统元素与现代奢华，是厦门最具格调的高端酒店之一。',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    ],
    status: 'pending',
    openingDate: '2016-09-01',
    roomTypes: [
      { name: '豪华海景房', nameEn: 'Deluxe Sea View Room', price: 1588, originalPrice: 1988, area: 48, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '行政套房', nameEn: 'Executive Suite', price: 2888, originalPrice: 3888, area: 88, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '鼓浪屿', distance: '轮渡15分钟', description: '世界文化遗产，钢琴之岛' },
      { name: '中山路步行街', distance: '步行10分钟', description: '厦门最繁华的商业街' },
      { name: '南普陀寺', distance: '2公里', description: '闽南佛教圣地' },
      { name: '厦门大学', distance: '2.5公里', description: '中国最美大学之一' },
      { name: '曾厝垵', distance: '5公里', description: '文艺小渔村' },
    ],
    transportations: [
      { type: 'subway', name: '地铁1号线镇海路站', distance: '步行10分钟' },
      { type: 'airport', name: '厦门高崎国际机场', distance: '15公里，约25分钟车程' },
      { type: 'train', name: '厦门站', distance: '3公里，约10分钟车程' },
    ],
    shoppingMalls: [
      { name: '中华城', distance: '步行5分钟', description: '厦门最大的购物中心' },
      { name: 'SM城市广场', distance: '5公里', description: '综合购物商场' },
    ],
    discounts: [
      { name: '海景房升级', type: 'special', value: 1, conditions: '视房态升级', description: '预订即有机会免费升级海景房', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '行政酒廊', '商务中心', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费350元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '丽江金茂璞修雪山酒店',
    nameEn: 'Jinmao Hotel Lijiang',
    address: '云南省丽江市玉龙县束河街道香江路8号',
    starRating: 5,
    phone: '0888-5319999',
    description: '丽江金茂璞修雪山酒店坐落于玉龙雪山脚下，海拔2400米，可直面玉龙雪山的壮丽景色。酒店设计融合了纳西族传统建筑风格与现代奢华，是丽江最顶级的度假酒店之一。',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    ],
    status: 'draft',
    openingDate: '2016-01-01',
    roomTypes: [
      { name: '雪山景观房', nameEn: 'Snow Mountain View Room', price: 2288, originalPrice: 2888, area: 55, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '璞修套房', nameEn: 'J-Suite', price: 4588, originalPrice: 5888, area: 110, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '雪山别墅', nameEn: 'Snow Mountain Villa', price: 12888, originalPrice: 16888, area: 280, bedType: '大床2.0m', maxOccupancy: 6, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '玉龙雪山', distance: '15公里', description: '纳西族神山，终年积雪' },
      { name: '蓝月谷', distance: '18公里', description: '高原湖泊，水色湛蓝' },
      { name: '束河古镇', distance: '步行10分钟', description: '茶马古道上的重要驿站' },
      { name: '丽江古城', distance: '8公里', description: '世界文化遗产，纳西古城' },
      { name: '拉市海', distance: '20公里', description: '高原湿地，候鸟天堂' },
    ],
    transportations: [
      { type: 'airport', name: '丽江三义国际机场', distance: '35公里，约40分钟车程' },
      { type: 'train', name: '丽江站', distance: '15公里，约20分钟车程' },
    ],
    shoppingMalls: [
      { name: '丽江古城四方街', distance: '8公里', description: '古城中心商业区' },
    ],
    discounts: [
      { name: '雪山日出', type: 'special', value: 1, conditions: '入住即享', description: '含玉龙雪山日出观景套餐', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '长住优惠', type: 'percentage', value: 80, conditions: '连住5晚以上', description: '长住享8折优惠', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '雪山观景餐厅', '中餐厅', '茶室', '会议室', '礼宾服务', '机场接送'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前72小时可免费取消',
      extraBed: '加床收费400元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '青岛海尔洲际酒店',
    nameEn: 'InterContinental Qingdao',
    address: '山东省青岛市市南区澳门路98号',
    starRating: 5,
    phone: '0532-66566666',
    description: '青岛海尔洲际酒店位于青岛奥帆中心核心区域，毗邻2008年奥运会帆船比赛场地。酒店可俯瞰浮山湾和青岛城市天际线，是青岛最具国际范儿的豪华酒店。',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    ],
    status: 'offline',
    auditStatus: 'rejected',
    auditReason: '酒店图片质量不符合要求，请上传高清实景图片',
    openingDate: '2008-06-01',
    roomTypes: [
      { name: '豪华海景房', nameEn: 'Deluxe Sea View Room', price: 1288, originalPrice: 1688, area: 45, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '行政套房', nameEn: 'Executive Suite', price: 2588, originalPrice: 3288, area: 90, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '五四广场', distance: '步行5分钟', description: '青岛地标，五月的风雕塑' },
      { name: '奥帆中心', distance: '步行2分钟', description: '2008奥运会帆船比赛场地' },
      { name: '八大关', distance: '2公里', description: '万国建筑博览区' },
      { name: '栈桥', distance: '3公里', description: '青岛标志性建筑' },
      { name: '崂山', distance: '30公里', description: '海上第一名山' },
    ],
    transportations: [
      { type: 'subway', name: '地铁3号线五四广场站', distance: '步行5分钟' },
      { type: 'airport', name: '青岛胶东国际机场', distance: '50公里，约60分钟车程' },
      { type: 'train', name: '青岛站', distance: '5公里，约15分钟车程' },
    ],
    shoppingMalls: [
      { name: '海信广场', distance: '步行5分钟', description: '青岛顶级奢侈品购物中心' },
      { name: '万象城', distance: '步行10分钟', description: '大型综合购物中心' },
    ],
    discounts: [
      { name: '啤酒节套餐', type: 'special', value: 1, conditions: '8月入住', description: '含青岛啤酒节VIP门票', startDate: '2024-08-01', endDate: '2024-08-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '日料餐厅', '行政酒廊', '商务中心', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费350元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '广州四季酒店',
    nameEn: 'Four Seasons Hotel Guangzhou',
    address: '广州市天河区珠江新城珠江西路5号',
    starRating: 5,
    phone: '020-88833666',
    description: '广州四季酒店位于广州国际金融中心，是珠江新城的地标性建筑。酒店占据大楼顶部30层，可俯瞰珠江和广州城市全景，是广州最高的酒店，提供无与伦比的云端住宿体验。',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2012-07-01',
    roomTypes: [
      { name: '豪华城景房', nameEn: 'Deluxe City View Room', price: 1888, originalPrice: 2388, area: 50, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '江景房', nameEn: 'River View Room', price: 2388, originalPrice: 2988, area: 55, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '行政套房', nameEn: 'Executive Suite', price: 4588, originalPrice: 5888, area: 100, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '总统套房', nameEn: 'Presidential Suite', price: 38888, originalPrice: 48888, area: 350, bedType: '大床2.0m', maxOccupancy: 6, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '广州塔', distance: '步行15分钟', description: '广州地标，小蛮腰' },
      { name: '花城广场', distance: '步行5分钟', description: '广州城市客厅' },
      { name: '广东省博物馆', distance: '步行5分钟', description: '华南最大博物馆' },
      { name: '珠江夜游', distance: '步行10分钟', description: '欣赏珠江两岸夜景' },
      { name: '北京路步行街', distance: '5公里', description: '广州最繁华的商业街' },
    ],
    transportations: [
      { type: 'subway', name: '地铁3/5号线珠江新城站', distance: '步行5分钟' },
      { type: 'subway', name: '地铁APM线妇儿中心站', distance: '步行3分钟' },
      { type: 'airport', name: '广州白云国际机场', distance: '40公里，约45分钟车程' },
      { type: 'train', name: '广州南站', distance: '25公里，约35分钟车程' },
    ],
    shoppingMalls: [
      { name: '太古汇', distance: '步行5分钟', description: '广州顶级奢侈品购物中心' },
      { name: 'K11', distance: '步行10分钟', description: '艺术购物中心' },
      { name: '天环广场', distance: '步行5分钟', description: '时尚购物地标' },
    ],
    discounts: [
      { name: '云端下午茶', type: 'special', value: 1, conditions: '预订江景房', description: '含云端下午茶套餐', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '商务优惠', type: 'percentage', value: 88, conditions: '企业协议', description: '企业客户享88折', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '日料餐厅', '行政酒廊', '商务中心', '会议室', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费450元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '南京圣和府邸豪华精选酒店',
    nameEn: 'The Grand Mansion Nanjing',
    address: '江苏省南京市玄武区长江路300号',
    starRating: 5,
    phone: '025-83158888',
    description: '南京圣和府邸豪华精选酒店坐落于长江路历史文化街区，毗邻总统府和1912街区。酒店建筑原为民国时期中央饭店，经精心修复后成为南京最具历史底蕴的奢华酒店。',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2015-05-01',
    roomTypes: [
      { name: '豪华客房', nameEn: 'Deluxe Room', price: 1388, originalPrice: 1788, area: 45, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '府邸套房', nameEn: 'Mansion Suite', price: 2888, originalPrice: 3688, area: 88, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '总统府', distance: '步行5分钟', description: '中国近代史遗址博物馆' },
      { name: '1912街区', distance: '步行2分钟', description: '民国风情休闲街区' },
      { name: '夫子庙', distance: '2公里', description: '中国四大文庙之一' },
      { name: '中山陵', distance: '5公里', description: '孙中山先生陵寝' },
      { name: '玄武湖', distance: '1.5公里', description: '江南三大名湖之一' },
    ],
    transportations: [
      { type: 'subway', name: '地铁2/3号线大行宫站', distance: '步行5分钟' },
      { type: 'airport', name: '南京禄口国际机场', distance: '40公里，约45分钟车程' },
      { type: 'train', name: '南京南站', distance: '15公里，约25分钟车程' },
    ],
    shoppingMalls: [
      { name: '德基广场', distance: '步行10分钟', description: '南京顶级购物中心' },
      { name: '金鹰国际购物中心', distance: '步行5分钟', description: '高端购物商场' },
    ],
    discounts: [
      { name: '民国体验', type: 'special', value: 1, conditions: '入住即享', description: '含民国服饰体验+拍照', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '酒吧', '会议室', '商务中心', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费350元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '武汉万达瑞华酒店',
    nameEn: 'Wanda Reign Wuhan',
    address: '湖北省武汉市武昌区水果湖街东湖路138号',
    starRating: 5,
    phone: '027-59599999',
    description: '武汉万达瑞华酒店坐落于东湖之滨，是武汉最顶级的奢华酒店之一。酒店设计融合了楚文化元素与现代奢华，以"楚韵华章"为主题，展现荆楚大地的独特魅力。',
    images: [
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
    ],
    status: 'pending',
    openingDate: '2014-12-01',
    roomTypes: [
      { name: '豪华湖景房', nameEn: 'Deluxe Lake View Room', price: 1188, originalPrice: 1488, area: 48, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '瑞华套房', nameEn: 'Reign Suite', price: 2888, originalPrice: 3688, area: 95, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '东湖', distance: '步行5分钟', description: '中国最大的城中湖' },
      { name: '黄鹤楼', distance: '5公里', description: '江南三大名楼之一' },
      { name: '湖北省博物馆', distance: '步行10分钟', description: '馆藏曾侯乙编钟' },
      { name: '武汉大学', distance: '3公里', description: '中国最美大学之一' },
      { name: '户部巷', distance: '5公里', description: '武汉小吃一条街' },
    ],
    transportations: [
      { type: 'subway', name: '地铁4号线楚河汉街站', distance: '步行10分钟' },
      { type: 'airport', name: '武汉天河国际机场', distance: '35公里，约40分钟车程' },
      { type: 'train', name: '武汉站', distance: '15公里，约25分钟车程' },
    ],
    shoppingMalls: [
      { name: '楚河汉街', distance: '步行5分钟', description: '民国风情购物街' },
      { name: '万达广场', distance: '步行5分钟', description: '综合购物中心' },
    ],
    discounts: [
      { name: '樱花季', type: 'percentage', value: 85, conditions: '3-4月入住', description: '樱花季入住享85折', startDate: '2024-03-01', endDate: '2024-04-30' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '日料餐厅', '会议室', '商务中心', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费350元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '重庆解放碑威斯汀酒店',
    nameEn: 'The Westin Chongqing Liberation Square',
    address: '重庆市渝中区青年路8号',
    starRating: 5,
    phone: '023-63700000',
    description: '重庆解放碑威斯汀酒店位于重庆最繁华的解放碑商圈，毗邻洪崖洞和长江索道。酒店设计现代时尚，可俯瞰山城独特的立体城市景观，是探索重庆的最佳下榻之选。',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    ],
    status: 'draft',
    openingDate: '2017-06-01',
    roomTypes: [
      { name: '豪华客房', nameEn: 'Deluxe Room', price: 1088, originalPrice: 1388, area: 42, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '行政套房', nameEn: 'Executive Suite', price: 2388, originalPrice: 2988, area: 85, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '解放碑', distance: '步行2分钟', description: '重庆地标，抗战胜利纪念碑' },
      { name: '洪崖洞', distance: '步行10分钟', description: '网红打卡地，千与千寻原型' },
      { name: '长江索道', distance: '步行10分钟', description: '重庆特色交通工具' },
      { name: '朝天门', distance: '1.5公里', description: '长江与嘉陵江交汇处' },
      { name: '磁器口古镇', distance: '15公里', description: '千年古镇，重庆缩影' },
    ],
    transportations: [
      { type: 'subway', name: '地铁1/2号线较场口站', distance: '步行5分钟' },
      { type: 'airport', name: '重庆江北国际机场', distance: '25公里，约35分钟车程' },
      { type: 'train', name: '重庆北站', distance: '10公里，约20分钟车程' },
    ],
    shoppingMalls: [
      { name: '解放碑步行街', distance: '步行2分钟', description: '重庆最繁华商业街' },
      { name: '时代广场', distance: '步行5分钟', description: '高端购物商场' },
    ],
    discounts: [
      { name: '火锅套餐', type: 'special', value: 1, conditions: '入住即享', description: '含重庆火锅体验券', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '行政酒廊', '会议室', '商务中心', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费300元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '天津瑞吉金融街酒店',
    nameEn: 'The St. Regis Tianjin',
    address: '天津市和平区张自忠路158号',
    starRating: 5,
    phone: '022-58300000',
    description: '天津瑞吉金融街酒店坐落于海河之畔，是天津最顶级的奢华酒店之一。酒店传承瑞吉品牌的经典优雅，提供标志性的管家服务，为宾客打造无与伦比的住宿体验。',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2011-10-01',
    roomTypes: [
      { name: '豪华客房', nameEn: 'Deluxe Room', price: 1388, originalPrice: 1788, area: 48, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '瑞吉套房', nameEn: 'St. Regis Suite', price: 3288, originalPrice: 4288, area: 95, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
      { name: '总统套房', nameEn: 'Presidential Suite', price: 18888, originalPrice: 23888, area: 250, bedType: '大床2.0m', maxOccupancy: 5, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '天津之眼', distance: '步行10分钟', description: '世界上唯一建在桥上的摩天轮' },
      { name: '意大利风情区', distance: '步行5分钟', description: '亚洲最大的意大利建筑群' },
      { name: '五大道', distance: '2公里', description: '万国建筑博览区' },
      { name: '古文化街', distance: '1公里', description: '天津传统文化街区' },
      { name: '瓷房子', distance: '2公里', description: '用瓷器装饰的法式建筑' },
    ],
    transportations: [
      { type: 'subway', name: '地铁3号线津湾广场站', distance: '步行5分钟' },
      { type: 'airport', name: '天津滨海国际机场', distance: '20公里，约30分钟车程' },
      { type: 'train', name: '天津站', distance: '步行10分钟' },
    ],
    shoppingMalls: [
      { name: '天河城', distance: '步行5分钟', description: '大型购物中心' },
      { name: '和平大悦城', distance: '步行10分钟', description: '时尚购物商场' },
    ],
    discounts: [
      { name: '管家服务', type: 'special', value: 1, conditions: '入住即享', description: '免费体验瑞吉管家服务', startDate: '2024-01-01', endDate: '2024-12-31' },
      { name: '周末特惠', type: 'percentage', value: 88, conditions: '周五至周日', description: '周末入住享88折', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '日料餐厅', '酒吧', '会议室', '商务中心', '管家服务', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费400元/晚',
      pets: '不允许携带宠物',
    },
  },
  {
    name: '苏州柏悦酒店',
    nameEn: 'Park Hyatt Suzhou',
    address: '江苏省苏州市苏州工业园区西洲路69号',
    starRating: 5,
    phone: '0512-62881234',
    description: '苏州柏悦酒店坐落于金鸡湖畔，是苏州工业园区的高端奢华酒店。酒店设计融合了苏州园林元素与现代美学，以"水韵姑苏"为主题，展现江南水乡的雅致韵味。',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    status: 'online',
    auditStatus: 'passed',
    openingDate: '2020-09-01',
    roomTypes: [
      { name: '湖景房', nameEn: 'Lake View Room', price: 1688, originalPrice: 2088, area: 50, bedType: '大床2.0m', maxOccupancy: 2, breakfast: true },
      { name: '柏悦套房', nameEn: 'Park Suite', price: 3588, originalPrice: 4588, area: 100, bedType: '大床2.0m', maxOccupancy: 3, breakfast: true },
    ],
    nearbyAttractions: [
      { name: '金鸡湖', distance: '步行5分钟', description: '苏州最大的人工湖' },
      { name: '苏州中心', distance: '步行10分钟', description: '苏州最大商业综合体' },
      { name: '拙政园', distance: '8公里', description: '中国四大名园之一' },
      { name: '苏州博物馆', distance: '8公里', description: '贝聿铭设计作品' },
      { name: '平江路', distance: '7公里', description: '苏州最古老的街道' },
    ],
    transportations: [
      { type: 'subway', name: '地铁1号线东方之门站', distance: '步行5分钟' },
      { type: 'airport', name: '苏南硕放国际机场', distance: '25公里，约35分钟车程' },
      { type: 'train', name: '苏州园区站', distance: '5公里，约10分钟车程' },
    ],
    shoppingMalls: [
      { name: '苏州中心', distance: '步行10分钟', description: '苏州最大商业综合体' },
      { name: '久光百货', distance: '步行5分钟', description: '日系高端百货' },
    ],
    discounts: [
      { name: '园林之旅', type: 'special', value: 1, conditions: '入住即享', description: '含拙政园VIP导览服务', startDate: '2024-01-01', endDate: '2024-12-31' },
    ],
    facilities: ['免费WiFi', '室内恒温泳池', '健身中心', 'SPA', '中餐厅', '西餐厅', '行政酒廊', '会议室', '商务中心', '代客泊车'],
    policies: {
      checkIn: '15:00后',
      checkOut: '12:00前',
      cancellation: '入住前24小时可免费取消',
      extraBed: '加床收费380元/晚',
      pets: '不允许携带宠物',
    },
  },
];

const seedDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功');

    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ 创建管理员账户: admin / admin123');
    } else {
      console.log('ℹ️ 管理员账户已存在');
    }

    const existingMerchant = await User.findOne({ username: 'merchant' });
    if (!existingMerchant) {
      await User.create({
        username: 'merchant',
        password: 'merchant123',
        role: 'merchant',
      });
      console.log('✅ 创建商户账户: merchant / merchant123');
    } else {
      console.log('ℹ️ 商户账户已存在');
    }

    const existingMerchant2 = await User.findOne({ username: 'merchant2' });
    if (!existingMerchant2) {
      await User.create({
        username: 'merchant2',
        password: 'merchant123',
        role: 'merchant',
      });
      console.log('✅ 创建商户账户: merchant2 / merchant123');
    }

    const existingMerchant3 = await User.findOne({ username: 'merchant3' });
    if (!existingMerchant3) {
      await User.create({
        username: 'merchant3',
        password: 'merchant123',
        role: 'merchant',
      });
      console.log('✅ 创建商户账户: merchant3 / merchant123');
    }

    const admin = await User.findOne({ username: 'admin' });
    const merchant = await User.findOne({ username: 'merchant' });
    const merchant2 = await User.findOne({ username: 'merchant2' });
    const merchant3 = await User.findOne({ username: 'merchant3' });
    
    const existingHotels = await Hotel.countDocuments();
    if (existingHotels === 0) {
      console.log('📦 开始导入酒店数据...');
      
      // 将酒店分配给不同的商户
      const creators = [merchant, merchant2, merchant3];
      
      for (let i = 0; i < sampleHotels.length; i++) {
        const hotelData = sampleHotels[i];
        // 轮流分配给三个商户
        const creator = creators[i % 3];
        await Hotel.create({
          ...hotelData,
          creator: creator?._id,
        });
        console.log(`  ✓ 已导入: ${hotelData.name} (创建者: ${creator?.username})`);
      }
      
      console.log(`✅ 成功导入 ${sampleHotels.length} 家酒店数据`);
      
      // 显示各商户的酒店数量
      for (const m of [merchant, merchant2, merchant3]) {
        if (m) {
          const count = await Hotel.countDocuments({ creator: m._id });
          console.log(`  - ${m.username}: ${count} 家酒店`);
        }
      }
    } else {
      console.log('ℹ️ 酒店数据已存在，跳过导入');
    }

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n📊 数据统计:');
    console.log(`  - 用户: ${await User.countDocuments()} 个`);
    console.log(`  - 酒店: ${await Hotel.countDocuments()} 家`);
    console.log(`  - 已上线: ${await Hotel.countDocuments({ status: 'online' })} 家`);
    console.log(`  - 待审核: ${await Hotel.countDocuments({ status: 'pending' })} 家`);
    console.log(`  - 草稿: ${await Hotel.countDocuments({ status: 'draft' })} 家`);
    console.log(`  - 已下线: ${await Hotel.countDocuments({ status: 'offline' })} 家`);
    
    console.log('\n👤 测试账户:');
    console.log('  管理员: admin / admin123 (可查看所有酒店)');
    console.log('  商户1: merchant / merchant123 (可查看自己的酒店)');
    console.log('  商户2: merchant2 / merchant123 (可查看自己的酒店)');
    console.log('  商户3: merchant3 / merchant123 (可查看自己的酒店)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
};

seedDatabase();
