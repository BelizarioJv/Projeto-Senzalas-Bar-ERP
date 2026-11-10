import { ProductData } from "./product";

export interface SaleData {
  id: number;
  dateTime: Date;
  total: number;
  payment: "DINHEIRO" | "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "FIADO";
  discountPercent: number;
  discountValue: number;
  observation: string;
  products: SaleProductData[];
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  } | null;
  customer: {
    id: number;
    name: string;
  } | null;
}

export interface SaleProductData {
  id: number;
  quantity: number;
  price: number | string;
  subtotal: number | string;
  product: ProductData;
}

export interface SaleProductForm {
  productId: number;
  quantity: number;
  price: number;
}

export interface SaleFormData {
  customerId: number;
  dateTime: Date;
  total: number;
  payment: "DINHEIRO" | "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO" | "FIADO";
  discountPercent: number;
  observation: string;
  products: SaleProductForm[];
}
