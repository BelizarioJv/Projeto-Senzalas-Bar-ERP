"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { SupplierFormData } from "@/types/supplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useCreateSupplier } from "@/hooks/supplier/useCreateSupplier";

export default function CreateProductPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>();

  const createSupplier = useCreateSupplier();

  async function onSubmit(data: SupplierFormData) {
    try {
      await createSupplier.mutateAsync(data);

      toast.success("Fornecedor cadastrado com sucesso");
      router.replace("/fornecedores");
    } catch (error: unknown) {
      console.error("Erro ao cadastrar Fornecedor:", error);
      toast.error("Não foi possível cadastrar o Fornecedor. Tente novamente.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Card para adicionar Fornecedor */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <CardTitle className="text-2xl font-extrabold">
              Adicionar fornecedor
            </CardTitle>
            <Truck />
          </div>
        </CardHeader>

        <CardContent>
          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Nome</Label>
              {/*Nome */}
              <Input
                id="name"
                placeholder="Surpermecado Bh"
                {...register("name", {
                  required: "Nome obrigatório",
                })}
              />

              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {/*Email */}
              <Input
                type="email"
                id="email"
                placeholder="fornecedor@gmail.com"
                {...register("email", {})}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              {/*Telefone */}
              <Input
                type="phone"
                id="phone"
                placeholder="(31) 9 9999-9999"
                {...register("phone", {})}
              />

              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="address">Endereço</Label>
              {/*Endereço */}
              <Input
                id="address"
                placeholder="fornecedor@gmail.com"
                {...register("address", {})}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cnpj">Cnpj</Label>
              {/*Cnpj */}
              <Input
                id="cnpj"
                placeholder="20.631.800.0001-01"
                {...register("cnpj", {})}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              {/* Observaçoes */}
              <Label htmlFor="observations">Observaçoes</Label>

              <Textarea
                id="observations"
                placeholder="Descrição do fornecedor..."
                {...register("observations")}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-accent-foreground hover:bg-accent-foreground"
              disabled={createSupplier.isPending}>
              {createSupplier.isPending
                ? "Salvando..."
                : "Adicionar Fornecedor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
