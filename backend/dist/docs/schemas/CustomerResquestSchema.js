import { z } from "zod";
// Schema base para criação de um cliente
export const CustomerRequestSchema = z.object({
    name: z
        .string("Name is required")
        .min(3, "O nome deve ter no mínimo 3 caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres")
        .openapi({
        example: "João Belizário",
        description: "Nome do cliente",
    }),
    phone: z
        .string()
        .nullable()
        .optional()
        .refine((val) => {
        if (!val)
            return true;
        return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(val);
    }, {
        message: "Número de telefone brasileiro inválido",
    })
        .openapi({
        example: "(11) 91234-5678",
        description: "Número de telefone do cliente",
    }),
    email: z
        .string()
        .email("Formato de e-mail inválido")
        .optional()
        .nullable()
        .openapi({
        example: "joao@senzalas.com",
        description: "E-mail do cliente",
    }),
    // O debtBalance não costuma ser enviado no "create", pois inicia em 0.00.
    // Mas caso queira permitir abrir um cliente já com saldo devedor anterior:
    debtBalance: z
        .number()
        .min(0, "O saldo devedor não pode ser negativo")
        .optional(),
});
// Schema para atualização (partial torna todos os campos opcionais)
export const UpdateCustomerRequestSchema = CustomerRequestSchema.partial();
// Schema para validação dos Query Parameters da listagem/paginação
export const MetaCustomerRequestSchema = z.object({
    page: z.string().optional().default("1"),
    pageSize: z.string().optional().default("10"),
    name: z.string().optional(),
    sortBy: z
        .enum(["name", "createdAt", "debtBalance"])
        .optional()
        .default("name"),
    order: z.enum(["asc", "desc"]).optional().default("asc"),
    onlyDebtors: z.enum(["true", "false"]).optional(),
});
//Schema para validação dos dados de resposta do cliente
export const CustomerResponseSchema = z.object({
    id: z.string().openapi({
        example: "cm123abc",
        description: "ID do cliente",
    }),
    name: z.string().openapi({
        example: "João Belizário",
    }),
    phone: z.string().nullable().openapi({
        example: "(11) 91234-5678",
    }),
    email: z.string().nullable().openapi({
        example: "joao@senzalas.com",
    }),
    debtBalance: z.number().openapi({
        example: 150.5,
    }),
    createdAt: z.string().datetime().openapi({
        example: "2026-08-11T20:00:00.000Z",
    }),
    updatedAt: z.string().datetime().openapi({
        example: "2026-08-11T20:00:00.000Z",
    }),
});
