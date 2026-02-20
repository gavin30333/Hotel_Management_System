declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

interface User {
  id?: number;
  username: string;
  password: string;
  role: 'merchant' | 'admin';
}

interface RoomType {
  id?: number;
  name: string;
  nameEn?: string;
  price: number;
  originalPrice?: number;
  area?: number;
  bedType?: string;
  facilities?: string[];
  maxOccupancy?: number;
  breakfast?: boolean;
  description?: string;
}

interface NearbyAttraction {
  name: string;
  distance?: string;
  description?: string;
}

interface Transportation {
  type: 'subway' | 'bus' | 'airport' | 'train' | 'other';
  name: string;
  distance?: string;
  description?: string;
}

interface ShoppingMall {
  name: string;
  distance?: string;
  description?: string;
}

interface Discount {
  id?: number;
  name: string;
  type: 'percentage' | 'fixed' | 'special';
  value: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  conditions?: string;
}

interface Hotel {
  id?: number;
  name: string;
  nameEn?: string;
  address: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  phone: string;
  description: string;
  images: string[];
  status: 'draft' | 'pending' | 'online' | 'offline';
  auditStatus?: 'passed' | 'rejected';
  auditReason?: string;
  createTime?: string;
  updateTime?: string;
  roomTypes?: RoomType[];
  openingDate?: string;
  nearbyAttractions?: NearbyAttraction[];
  transportations?: Transportation[];
  shoppingMalls?: ShoppingMall[];
  discounts?: Discount[];
  facilities?: string[];
  policies?: {
    checkIn?: string;
    checkOut?: string;
    cancellation?: string;
    extraBed?: string;
    pets?: string;
  };
}
