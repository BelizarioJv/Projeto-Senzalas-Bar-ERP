import { registry } from "../registry.js";
import { LoginRequestSchema } from "../schemas/LoginRequestSchema.js";
registry.registerPath({
    method: "post",
    path: "/login",
    tags: ["Auth"],
    summary: "Realizar login",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: LoginRequestSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Login realizado.",
        },
        401: {
            description: "Usuário ou senha inválidos.",
        },
    },
});
