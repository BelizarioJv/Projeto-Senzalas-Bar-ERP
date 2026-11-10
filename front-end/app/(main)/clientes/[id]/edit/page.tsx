"use client";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { IUpdateCustomerInput } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, ArrowLeft } from "lucide-react";
import { useGetCustomer } from "@/hooks/customer/useGetCustomer";
import { useUpdateCustomer } from "@/hooks/customer/useUpdateCustomer"; // Crie este hook usando useMutation
import Link from "next/link";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Busca os dados atuais do cliente para preencher o formulário
  const { data: customer, isPending, error } = useGetCustomer(id);
  const updateCustomer = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUpdateCustomerInput>();

  // Assim que os dados do cliente carregarem, preenche os inputs do formulário
  useEffect(() => {
    if (customer) {
      setValue("name", customer.name);
      setValue("phone", customer.phone);
      setValue("email", customer.email);
    }
  }, [customer, setValue]);

  async function onSubmit(data: IUpdateCustomerInput) {
    try {
      // Passa o ID do parâmetro e os dados alterados do formulário para a mutation
      await updateCustomer.mutateAsync({ id, data });

      toast.success("Cadastro do cliente atualizado com sucesso!");
      router.replace(`/customers/${id}`);
    } catch (err: unknown) {
      console.error("Erro ao atualizar cliente:", err);
      toast.error("Não foi possível atualizar o cliente. Tente novamente.");
    }
  }

  if (isPending)
    return (
      <p className="text-center text-gray-500 py-10">
        Carregando dados do cliente...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 py-10">
        Erro ao carregar dados para edição.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-md rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b mb-6">
          <div className="flex gap-4 items-center">
            <Link
              href={`/customers/${id}`}
              className="text-muted-foreground hover:text-foreground transition">
              <ArrowLeft size={24} />
            </Link>
            <CardTitle className="text-2xl font-extrabold">
              Editar Cliente
            </CardTitle>
            <UserCheck className="text-accent" size={28} />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            ID: #{id}
          </span>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Ex: João da Silva"
                {...register("name", {
                  required: "O nome do cliente é obrigatório",
                  minLength: {
                    value: 3,
                    message: "O nome deve conter pelo menos 3 caracteres",
                  },
                })}
              />

              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <Label htmlFor="phone">Telefone / WhatsApp</Label>
              <Input
                id="phone"
                placeholder="Ex: 31999998888"
                {...register("phone")}
              />
            </div>

            {/* E-mail */}
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: cliente@email.com"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Insira um endereço de e-mail válido",
                  },
                })}
              />

              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Ações do Formulário */}
            <div className="flex items-center justify-end gap-4 border-t pt-4">
              <Link
                href={`/customers/${id}`}
                className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition">
                Cancelar
              </Link>

              <Button
                type="submit"
                className="bg-accent-foreground hover:bg-accent transition font-semibold"
                disabled={updateCustomer.isPending}>
                {updateCustomer.isPending
                  ? "Salvando alterações..."
                  : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
