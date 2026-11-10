"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useGetSale } from "@/hooks/sale/useGetSale";

export default function ShowSalePage() {
  const params = useParams();

  const saleId = params.id as string;

  const saleQuery = useGetSale(saleId);

  if (saleQuery.isPending) {
    return <p>Carregando...</p>;
  }

  if (saleQuery.error) {
    return <p>Erro ao carregar venda</p>;
  }

  const sale = saleQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Venda #{sale.id}</h1>

        <p className="text-muted-foreground">Detalhes da compra</p>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <strong>ID venda</strong>

            <p>{sale.id}</p>
          </div>
          <div>
            <strong>Cliente</strong>
            <p>{sale.customer?.name ?? "Sem cliente"}</p>
          </div>
          <div>
            <strong>Criador por:</strong>
            <p>{sale.user?.name}</p>
          </div>

          <div className="flex gap-6">
            <div>
              <strong>Pagamento</strong>

              <p>{sale.payment}</p>
            </div>

            <div>
              <strong>Desconto(%)</strong>
              <p>{sale.discountPercent}</p>
            </div>
          </div>

          <div>
            <strong>Observações</strong>

            <p>{sale.observation}</p>
          </div>

          <div>
            <strong>Data</strong>

            <p>{new Date(sale.dateTime).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Produtos Comprados</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Produto</th>

              <th className="text-left p-2">Quantidade</th>

              <th className="text-left p-2">Preço</th>

              <th className="text-left p-2">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {sale.products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">{product.product.name}</td>

                <td className="p-2">{product.quantity}</td>

                <td className="p-2">R$ {product.price}</td>

                <td className="p-2">R$ {product.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="text-2xl font-bold">
            <p>Total: R$ {sale.total}</p>
            <p>Valor do Desconto : R$ {sale.discountValue}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
