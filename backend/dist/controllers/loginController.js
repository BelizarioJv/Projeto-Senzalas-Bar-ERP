import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma.js";
import { HttpError } from "../errors/HttpError.js";
import { LoginRequestSchema } from "../docs/schemas/LoginRequestSchema.js";
//Controller de login com geraçao JWT token
export class LoginController {
    index = async (req, res, next) => {
        try {
            const data = LoginRequestSchema.parse(req.body);
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new HttpError(500, "Configuração interna do servidor ausente.");
            }
            const user = await prisma.user.findUnique({ where: { user: data.user } });
            if (!user)
                throw new HttpError(404, "Usuário não encontrado");
            const validPassword = await bcrypt.compare(data.password, user.password);
            if (!validPassword)
                throw new HttpError(401, "Senha inválida");
            const token = jwt.sign({ id: user.id }, secret, {
                expiresIn: "1h",
            });
            res.json({ token });
        }
        catch (error) {
            next(error);
        }
    };
}
