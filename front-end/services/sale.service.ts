import { api } from "./api";
import { SaleData, SaleFormData } from "@/types/sale";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { MetaData } from "@/types/metaDataPage";

export interface SaleResponse {
  data: SaleData[];
  meta: MetaData;
}

// Buscar vendas na API /Sale
export async function getSale(
  page: number,
  pageSize: number,
): Promise<SaleResponse> {
  try {
    const response = await api.get<SaleResponse>("/sale", {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Buscar venda específico
export async function showSale(id: string): Promise<SaleData> {
  try {
    const response = await api.get<SaleData>(`/sale/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Criar venda
export async function createSale(data: SaleFormData): Promise<SaleData> {
  try {
    const response = await api.post<SaleData>("/sale", data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Atualizar venda
export async function updateSale(id: string, data: SaleData) {
  try {
    const response = await api.put<SaleData>(`/sale/${id}`, data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// Deletar venda
export async function deleteSale(id: string) {
  try {
    const response = await api.delete<SaleData>(`/sale/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function getMonthlyTotalSales(): Promise<number> {
  try {
    const response = await api.get<{ totalSales: number }>(
      "/sale/monthly-total",
    );
    return response.data.totalSales;
  } catch (error) {
    handleAxiosError(error);
    return 0;
  }
}
