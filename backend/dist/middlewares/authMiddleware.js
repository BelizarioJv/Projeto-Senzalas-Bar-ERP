import jwt from "jsonwebtoken";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        return res.status(500).json({ error: "Configuração de autenticação ausente" });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err || !decoded) {
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }
        // 1. Forçamos o decoded a respeitar o formato do nosso payload
        const payload = decoded;
        // 2. Injetamos o id no objeto req para que os próximos controllers o acessem
        req.user = payload.id;
        next();
    });
}
