import { prisma } from "../database/prisma.js";
import { ZapiService } from "./zapi.service.js";
export class BillingService {
    zapiService;
    constructor() {
        this.zapiService = new ZapiService();
    }
    async sendDebtReminders() {
        try {
            const customersInDebt = await prisma.customer.findMany({
                where: {
                    debtBalance: {
                        lt: 0,
                    },
                },
            });
            const results = await Promise.all(customersInDebt.map(async (customer) => {
                if (!customer.phone) {
                    results.push({
                        clientId: customer.id,
                        status: "ERROR",
                        error: "Telefone não informado",
                    });
                }
                const message = `Olá, ${customer.name}! Lembramos que você possui um saldo devedor de R$ ${customer.debtBalance}. Assim que possivel passar aqui no bar para tomar uma com nós e acerta a contar ou se preferir fazer o pix para 31991615017`;
                try {
                    await this.zapiService.sendMessage(customer.phone, message);
                    return { clientId: customer.id, status: "SUCCESS" };
                }
                catch (error) {
                    return {
                        clientId: customer.id,
                        status: "ERROR",
                        error: error.message,
                    };
                }
            }));
            return results;
        }
        catch (error) {
            console.error("Erro ao buscar clientes em dívida:", error.message);
            throw error;
        }
    }
}
