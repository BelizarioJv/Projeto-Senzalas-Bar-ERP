import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);
//schema para validação dos dados de criação
export const LoginRequestSchema = z.object({
    user: z
        .string()
        .transform((val) => val.trim().toLowerCase())
        .openapi({
        example: "JoaoBelizario",
        description: "Nome de usuário",
    }),
    password: z.string().openapi({
        example: "123456",
        description: "Senha do usuário ",
    }),
});
