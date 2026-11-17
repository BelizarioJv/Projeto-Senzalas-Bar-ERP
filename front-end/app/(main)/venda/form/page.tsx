"use client";

import { useState } from "react";
import { useSaleForm } from "@/hooks/sale/useSaleForm";
import { useCustomers } from "@/hooks/customer/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateSaleForm() {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const customerQuery = useCustomers();

  const {
    register,
    handleSubmit,
    fields,
    products,
    total,
    handleAddProduct,
    onSubmit,
    remove,
    errors,
    productsQuery,
    createSale,
  } = useSaleForm();

  if (productsQuery.isLoading) {
    return <p>Carregando produtos...</p>;
  }

  if (productsQuery.isError) {
    return <p>Erro ao carregar produtos.</p>;
  }
  return (
    <div className="container mx-auto max-w-7xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold">Nova Venda</CardTitle>

          <CardDescription>Cadastre uma nova saida de produtos</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Clientes*/}
            <Card>
              <CardHeader>
                <CardTitle>Cliente</CardTitle>
              </CardHeader>

              <select
                {...register("customerId", {
                  setValueAs: (value) => (value === "" ? undefined : Number(value)),
                })}
                className="
                    mt-1
                    h-10
                    w-full
                    rounded-md
                    border
                    bg-background
                    px-3
                  ">
                <option value="">Selecione</option>

                {customerQuery.data?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </Card>

            {/* Produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Produto</CardTitle>
              </CardHeader>

              <CardContent className="flex gap-4">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="
                    h-10
                    flex-1
                    rounded-md
                    border
                    bg-background
                    px-3
                  ">
                  <option value="">Selecione um produto</option>

                  {productsQuery.data?.data.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - R$
                      {Number(product.salePrice).toFixed(2)}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-32"
                />

                <Button
                  type="button"
                  onClick={() => handleAddProduct(selectedProductId, quantity)}
                  className="bg-accent text-accent-foreground">
                  Adicionar
                </Button>
              </CardContent>
            </Card>

            {/* Observaçoes */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                <label htmlFor="observation" className="text-sm font-medium">
                  Observações
                </label>

                <textarea
                  id="observation"
                  {...register("observation", { maxLength: 500 })}
                  className="w-full border rounded p-2"
                  placeholder="Digite suas observações aqui..."
                />

                {errors.observation && (
                  <span className="text-red-500 text-sm">
                    Máximo de 500 caracteres permitido.
                  </span>
                )}
              </CardContent>
            </Card>

            {/* Carrinho */}
            <Card>
              <CardHeader>
                <CardTitle>Carrinho</CardTitle>

                <CardDescription>Produtos adicionados à compra</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {fields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Nenhum produto adicionado.
                  </p>
                )}

                {fields.map((field, index) => {
                  const product = productsQuery.data?.data.find(
                    (p) => p.id === field.productId,
                  );
                  const item = products[index];

                  return (
                    <div
                      key={field.id}
                      className="
                        flex
                        items-center
                        justify-between
                        border
                        rounded-lg
                        p-4
                      ">
                      <div>
                        <p className="font-medium">{product?.name}</p>

                        <p className="text-sm text-muted-foreground">
                          {item?.quantity} x R$
                          {Number(product?.salePrice || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          R$
                          {(
                            Number(item?.quantity || 0) *
                            Number(product?.salePrice || 0)
                          ).toFixed(2)}
                        </span>

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}>
                          Remover
                        </Button>
                      </div>

                      <input
                        type="hidden"
                        {...register(`products.${index}.productId`)}
                      />

                      <input
                        type="hidden"
                        {...register(`products.${index}.quantity`)}
                      />

                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Dados da Compra */}
            <div className="flex justify-evenly">
              {/* Desconto */}
              <div className="flex flex-col">
                <label
                  htmlFor="discountPercent"
                  className="text-sm font-medium mb-1">
                  Desconto (%)
                </label>
                <Input
                  id="discountPercent"
                  {...register("discountPercent", {
                    valueAsNumber: true,
                    min: 0,
                    max: 100,
                  })}
                  type="number"
                  className="w-32"
                  placeholder="0"
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="flex flex-col ">
                <label htmlFor="payment" className="text-sm font-medium mb-1">
                  Forma de Pagamento
                </label>
                <select
                  id="payment"
                  {...register("payment")}
                  className="h-10 w-full rounded-md border px-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="PIX">PIX</option>
                  <option value="CARTAO_CREDITO">Cartão Crédito</option>
                  <option value="CARTAO_DEBITO">Cartão Débito</option>
                  <option value="FIADO">Fiado</option>
                </select>
              </div>
            </div>

            {/* Resumo */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-muted-foreground">
                    Total da Venda
                  </span>

                  <span className="text-3xl font-bold">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <Button
                  className="mt-6 w-full bg-accent text-accent-foreground"
                  size="lg"
                  type="submit"
                  disabled={createSale.isPending}>
                  {createSale.isPending ? "Salvando..." : "Salvar Venda"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
