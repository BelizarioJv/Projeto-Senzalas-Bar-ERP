import { z } from "zod";
//listas de opções para campos específicos
const unitOfMeasurement = z.enum(["UNIDADE", "KG", "LITRO", "FARDO"]);
const productStatus = z.enum(["ATIVO", "INATIVO"]);
const productsCategory = z.enum([
    "CERVEJA",
    "VINHOS",
    "DESTILADOS",
    "REFRIGERANTES",
    "SUCO",
    "AGUA",
]);
//Schema para validação dos dados de resposta de produtos, com todos os campos obrigatórios
export const ProductResponseSchema = z
    .object({
    id: z.number().int().openapi({
        example: 1,
        description: "ID do produto",
    }),
    name: z.string().openapi({
        example: "Cerveja Heineken",
        description: "Nome do produto",
    }),
    description: z.string().nullable().openapi({
        example: "Cerveja Heineken 600ml",
        description: "Descrição do produto",
    }),
    category: productsCategory,
    brand: z.string().nullable().openapi({
        example: "Heineken",
        description: "Marca do produto",
    }),
    unitMeasure: unitOfMeasurement,
    costPrice: z.number().nonnegative().openapi({
        example: 5.0,
        description: "Preço de custo do produto",
    }),
    salePrice: z.number().nonnegative().openapi({
        example: 10.5,
        description: "Preço de venda do produto",
    }),
    currentQuantity: z.number().nonnegative().openapi({
        example: 50,
        description: "Quantidade atual em estoque",
    }),
    minimumQuantity: z.number().nonnegative().openapi({
        example: 10,
        description: "Quantidade mínima para estoque",
    }),
    status: productStatus,
    imageKey: z.string().nullable(),
    imageUrl: z.string().nullable(),
    imageType: z.string().nullable(),
    createdBy: z.number().int().nullable().openapi({
        example: 1,
        description: "ID do usuário que criou o produto",
    }),
    createdAt: z.string().datetime().openapi({
        example: "2026-08-11T20:30:00.000Z",
        description: "Data de criação",
    }),
    updatedAt: z.string().datetime().openapi({
        example: "2026-08-11T21:30:00.000Z",
        description: "Data da última atualização",
    }),
})
    .openapi("ProductResponse");
//schema para validação dos dados de listagem de produtos, com paginação, filtros e ordenação
export const MetaProductRequestSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().optional(),
    name: z.string().optional(),
    status: productStatus.optional(),
    sortBy: z.enum(["name", "status", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
});
//schema para validação dos dados de criação de produtos, onde todos os campos são obrigatórios, exceto descrição
export const ProductRequestSchema = z.object({
    name: z.string().min(1, "Name is required").openapi({
        example: "Cerveja Heineken",
        description: "Nome do produto",
    }),
    description: z.string().optional().openapi({
        example: "Cerveja Heineken 600ml",
        description: "Descrição do produto",
    }),
    category: productsCategory.openapi({
        example: "CERVEJA",
        description: "Categoria do produto",
    }),
    brand: z.string().optional().openapi({
        example: "Heineken",
        description: "Marca do produto",
    }),
    unitMeasure: unitOfMeasurement,
    costPrice: z
        .number()
        .positive("Preço de custo deve ser um número positivo")
        .openapi({
        example: 5.0,
        description: "Preço de custo do produto",
    }),
    createdBy: z.number().int().optional(),
    salePrice: z
        .number()
        .positive("Preço de venda deve ser um número positivo")
        .openapi({
        example: 10.5,
        description: "Preço de venda do produto",
    }),
    minimumQuantity: z
        .number()
        .nonnegative("Quantidade mínima não pode ser negativa")
        .openapi({
        example: 10,
        description: "Quantidade mínima do produto",
    }),
});
//schema para validação dos dados de atualização de produtos, onde todos os campos são opcionais e podem ser atualizados individualmente
export const UpdateProductRequestSchema = z.object({
    name: z.string().min(1, "Name is required").optional().openapi({
        example: "Cerveja Artesanal",
        description: "Nome do produto",
    }),
    description: z.string().optional().openapi({
        example: "Cerveja Artesanal 500ml",
        description: "Descrição do produto",
    }),
    category: productsCategory.openapi({
        example: "CERVEJA",
        description: "Categoria do produto",
    }),
    brand: z.string().optional().openapi({
        example: "Cervejaria Artesanal",
        description: "Marca do produto",
    }),
    unitMeasure: unitOfMeasurement.optional().openapi({
        example: "UNIDADE",
        description: "Unidade de medida do produto",
    }),
    costPrice: z.coerce
        .number()
        .positive("Preço de custo deve ser um número positivo")
        .optional()
        .openapi({
        example: 5.0,
        description: "Preço de custo do produto",
    }),
    salePrice: z.coerce
        .number()
        .positive("Preço de venda deve ser um número positivo")
        .optional()
        .openapi({
        example: 10.5,
        description: "Preço de venda do produto",
    }),
    currentQuantity: z.coerce
        .number()
        .nonnegative("Quantidade atual não pode ser negativa")
        .optional()
        .openapi({
        example: 50,
        description: "Quantidade atual do produto",
    }),
    minimumQuantity: z.coerce
        .number()
        .nonnegative("Quantidade mínima não pode ser negativa")
        .optional()
        .openapi({
        example: 10,
        description: "Quantidade mínima do produto",
    }),
    status: productStatus.optional().openapi({
        example: "ATIVO",
        description: "Status do produto",
    }),
});
