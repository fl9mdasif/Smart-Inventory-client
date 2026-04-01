/* eslint-disable @typescript-eslint/no-explicit-any */
// import { USER_ROLE } from "@/contains/role";

export type ResponseSuccessType = {
  data: any;
  meta?: TMeta;
};

export type TMeta = {
  limit: number;
  page: number;
  total: number;
  // totalPage: number;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};


export interface TCategory {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TProductStatus = 'active' | 'out_of_stock' | 'low_stock';

export interface TProduct {
  name: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  status?: TProductStatus;
  stockQuantity?: number;
  minStockThreshold?: number;
  restockIgnored?: boolean;
}


export type TOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';




export interface TShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  country?: string;
}

export interface TStatusHistoryEntry {
  status: TOrderStatus;
  note?: string;
  changedAt?: Date;
}

// ── Main Order Interface ───────────────────────────────────────────────────────
export interface TOrder {
  // user: Types.ObjectId;
  productId: string;
  customerName: string;
  productName: string;
  price: number;
  quantity: number;
  shippingAddress: TShippingAddress;
  subtotal: number;
  statusHistory: TStatusHistoryEntry[];
  discount?: number;
  orderStatus?: TOrderStatus;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;


}
