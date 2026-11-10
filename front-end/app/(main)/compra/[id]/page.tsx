"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/layout/Loading";
import { Error } from "@/components/layout/Error";
import { useGetPurchase } from "@/hooks/purchase/useGetPurchase";

export default function ShowPurchasePage() {
  const params = useParams();

  const purchaseId = params.id as string;

  const purchaseQuery = useGetPurchase(purchaseId);

  if (purchaseQuery.isPending) {
    return <Loading message="Buscando Dados" />;
  }

  if (purchaseQuery.error) {
    return <Error message="Erro ao buscar Dados" />;
  }

  const purchase = purchaseQuery.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compra #{purchase.id}</h1>

        <p className="text-muted-foreground">Detalhes da compra</p>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <strong>Fornecedor</strong>

            <p>{purchase.supplier.name}</p>
          </div>

          <div>
            <strong>Pagamento</strong>

            <p>{purchase.payment}</p>
          </div>

          <div>
            <strong>Status</strong>

            <p>{purchase.user?.name}</p>
          </div>

          <div>
            <strong>Data</strong>

            <p>{new Date(purchase.date).toLocaleDateString()}</p>
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
            {purchase.products.map((product) => (
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
          <div className="text-2xl font-bold">Total: R$ {purchase.total}</div>
        </div>
      </Card>
    </div>
  );
}
