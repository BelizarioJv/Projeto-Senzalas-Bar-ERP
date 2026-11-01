import { api } from "./api";
import axios from "axios";
import { ProductData, ProductFormData, ProductFilters } from "@/types/product";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { MetaData } from "@/types/metaDataPage";

export interface ProductResponse {
  data: ProductData[];
  meta: MetaData;
}

// Buscar produtos na API /products
export async function getProducts(
  filters?: ProductFilters,
): Promise<ProductResponse> {
  try {
    const response = await api.get<ProductResponse>("/products", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Buscar produto específico
export async function showProduct(id: string): Promise<ProductData> {
  try {
    const response = await api.get<ProductData>(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Criar produto
export async function createProduct(
  data: ProductFormData,
): Promise<ProductData> {
  try {
    const response = await api.post<ProductData>("/products", data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

//upload image s3
export async function uploadProductImage(productId: number, file: File) {
  const formData = new FormData();

  formData.append("image", file);

  try {
    const response = await api.post(`/products/${productId}/image`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Erro ao enviar imagem: ${error.response.data.message}`,
        );
      }

      throw new Error(`Erro ao enviar imagem: ${error.message}`);
    }
  }
}

//Buscar imagem do produto
export async function getProductImage(productId: number): Promise<string> {
  try {
    const response = await api.get<{ imageUrl: string }>(
      `/products/${productId}/image-url`,
    );
    return response.data.imageUrl;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Erro ao buscar imagem do produto: ${error.response.data.message}`,
        );
      }

      throw new Error(`Erro ao buscar imagem do produto: ${error.message}`);
    }

    throw error;
  }
}

// Atualizar produto
export async function updateProduct(id: string, data: ProductData) {
  try {
    const response = await api.put<ProductData>(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Deletar produto
export async function deleteProduct(id: string) {
  try {
    const response = await api.delete<ProductData>(`/products/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Buscar produtos com estoque baixo
export async function getProductsLowStock(): Promise<ProductData[]> {
  try {
    const response = await api.get<ProductData[]>(`/products/low-stock`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
