import { z } from "zod";
//schema para validação dos dados de criação
export const SupplierRequestSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    cnpj: z.string().optional(),
    observations: z.string().optional(),
});
//schema para validação dos dados de atualização de fornecedores, onde todos os campos são opcionais
export const UpdateSupplierRequestSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    cnpj: z.string().optional(),
    observations: z.string().optional(),
});
//schema para validação dos dados de resposta da API, incluindo os campos adicionais id, createdAt e updatedAt
export const SupplierResponseSchema = SupplierRequestSchema.extend({
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
