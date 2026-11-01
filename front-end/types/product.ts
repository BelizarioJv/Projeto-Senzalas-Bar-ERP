//Tipagem dos dados de produtos
export interface ProductData {
  id: number;
  name: string;
  description?: string;
  category:
    | "CERVEJA"
    | "VINHOS"
    | "DESTILADOS"
    | "REFRIGERANTES"
    | "SUCO"
    | "AGUA";
  brand?: string;
  unitMeasure: "UNIDADE" | "KG" | "LITRO" | "FARDO";
  costPrice: string;
  salePrice: string;
  currentQuantity: number;
  minimumQuantity: number;
  status: "ATIVO" | "INATIVO";
  imageKey: string | null;
  imageUrl: string | null;
  imageType: string | null;
  createdBy: number; // ID do usuário
  createdAt: string;
  updatedAt: string;
  usuario?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProductUpdate {
  name: string;
  description?: string;
  category:
    | "CERVEJA"
    | "VINHOS"
    | "DESTILADOS"
    | "REFRIGERANTES"
    | "SUCO"
    | "AGUA";
  brand?: string;
  unitMeasure: "UNIDADE" | "KG" | "LITRO" | "FARDO";
  costPrice: number;
  salePrice: number;
  minimumQuantity: number;
}

export interface ProductFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  sortBy?: "name" | "createdAt" | "debtBalance";
  order?: "asc" | "desc";
}

export interface ProductFormData {
  name: string;
  description?: string;
  category:
    | "CERVEJA"
    | "VINHOS"
    | "DESTILADOS"
    | "REFRIGERANTES"
    | "SUCO"
    | "AGUA";
  brand?: string;
  unitMeasure: "UNIDADE" | "KG" | "LITRO" | "FARDO";
  costPrice: number;
  salePrice: number;
  minimumQuantity: number;
}
