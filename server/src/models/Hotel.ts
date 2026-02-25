import mongoose, { Document, Schema } from 'mongoose';

export interface IRoomType extends Document {
  name: string;
  nameEn?: string;
  price: number;
  originalPrice?: number;
  area?: number;
  bedType?: string;
  maxOccupancy?: number;
  breakfast?: boolean;
}

export interface INearbyAttraction {
  name: string;
  distance?: string;
  description?: string;
}

export interface ITransportation {
  type: 'subway' | 'bus' | 'airport' | 'train' | 'other';
  name: string;
  distance?: string;
  description?: string;
}

export interface IShoppingMall {
  name: string;
  distance?: string;
  description?: string;
}

export interface IDiscount {
  name: string;
  type: 'percentage' | 'fixed' | 'special';
  value: number;
  conditions?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface IPolicies {
  checkIn?: string;
  checkOut?: string;
  cancellation?: string;
  extraBed?: string;
  pets?: string;
}

export interface IHotel extends Document {
  name: string;
  nameEn?: string;
  address: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  phone: string;
  description: string;
  images: string[];
  status: 'draft' | 'pending' | 'online' | 'offline' | 'rejected';
  auditStatus?: 'passed' | 'rejected';
  auditReason?: string;
  roomTypes: IRoomType[];
  openingDate?: string;
  nearbyAttractions: INearbyAttraction[];
  transportations: ITransportation[];
  shoppingMalls: IShoppingMall[];
  discounts: IDiscount[];
  facilities: string[];
  policies: IPolicies;
  creator: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roomTypeSchema = new Schema<IRoomType>(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    area: { type: Number },
    bedType: { type: String },
    maxOccupancy: { type: Number },
    breakfast: { type: Boolean },
  },
  { _id: true }
);

const nearbyAttractionSchema = new Schema<INearbyAttraction>(
  {
    name: { type: String, required: true },
    distance: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const transportationSchema = new Schema<ITransportation>(
  {
    type: { type: String, enum: ['subway', 'bus', 'airport', 'train', 'other'], required: true },
    name: { type: String, required: true },
    distance: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const shoppingMallSchema = new Schema<IShoppingMall>(
  {
    name: { type: String, required: true },
    distance: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const discountSchema = new Schema<IDiscount>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['percentage', 'fixed', 'special'], required: true },
    value: { type: Number, required: true },
    conditions: { type: String },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
  },
  { _id: true }
);

const policiesSchema = new Schema<IPolicies>(
  {
    checkIn: { type: String },
    checkOut: { type: String },
    cancellation: { type: String },
    extraBed: { type: String },
    pets: { type: String },
  },
  { _id: false }
);

const hotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: [true, '酒店名称不能为空'],
      trim: true,
      maxlength: [100, '酒店名称最多100个字符'],
    },
    nameEn: {
      type: String,
      trim: true,
      maxlength: [100, '酒店英文名称最多100个字符'],
    },
    address: {
      type: String,
      required: [true, '酒店地址不能为空'],
      trim: true,
    },
    starRating: {
      type: Number,
      required: [true, '酒店星级不能为空'],
      enum: [1, 2, 3, 4, 5],
    },
    phone: {
      type: String,
      required: [true, '联系电话不能为空'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, '酒店描述不能为空'],
      maxlength: [1000, '酒店描述最多1000个字符'],
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'pending', 'online', 'offline', 'rejected'],
      default: 'draft',
    },
    auditStatus: {
      type: String,
      enum: ['passed', 'rejected'],
    },
    auditReason: {
      type: String,
    },
    roomTypes: [roomTypeSchema],
    openingDate: {
      type: String,
    },
    nearbyAttractions: [nearbyAttractionSchema],
    transportations: [transportationSchema],
    shoppingMalls: [shoppingMallSchema],
    discounts: [discountSchema],
    facilities: [
      {
        type: String,
      },
    ],
    policies: policiesSchema,
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

hotelSchema.index({ name: 'text', address: 'text' });
hotelSchema.index({ status: 1, starRating: 1 });
hotelSchema.index({ creator: 1 });

export const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);
export default Hotel;
