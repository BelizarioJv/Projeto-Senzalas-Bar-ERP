import { ProductData } from "./product";

export interface PurchaseData {
  id: number;
  date: Date;
  total: number;
  user: {
    id: number;
    name: string;
  } | null;
  supplier: {
    id: number;
    name: string;
  };
  createdBy: string;
  payment: "DINHEIRO" | "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO";
  products: PurchaseProductData[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseProductData {
  id: number;
  quantity: number;
  price: number | string;
  subtotal: number | string;
  product: ProductData;
}

export interface PurchaseProductForm {
  productId: number;
  quantity: number;
  price: number;
}
export interface PurchaseFormData {
  date: Date;
  total: number;
  supplierId: number;
  status: "PENDENTE" | "COMPLETO" | "CANCELADO";
  payment: "DINHEIRO" | "PIX" | "CARTAO_CREDITO" | "CARTAO_DEBITO";
  products: PurchaseProductForm[];
}
