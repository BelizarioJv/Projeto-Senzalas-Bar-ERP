"use client";
import { ChangeEvent, useState } from "react";
import { uploadProductImage } from "@/services/product.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ProductFormData } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";
import { useCreateProduct } from "@/hooks/products/useCreateProducts";

export default function CreateProductPage() {
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const createProduct = useCreateProduct();
  async function onSubmit(data: ProductFormData) {
    try {
      const createdProduct = await createProduct.mutateAsync(data);

      if (image) {
        await uploadProductImage(createdProduct.id, image);
      }

      toast.success("Produto cadastrado com sucesso!");
      router.replace("/produtos");
    } catch (error) {
      console.error("Erro no cadastro:", error);

      toast.error(
        image
          ? "Produto cadastrado ou parcialmente processado. Verifique o upload da imagem."
          : "Não foi possível cadastrar o produto.",
      );
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setImage(file);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Card para adicionar produto */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <CardTitle className="text-2xl font-extrabold">
              Adicionar Produto
            </CardTitle>
            <PackageSearch />
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
                placeholder="Heineken Long Neck"
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
              {/* Categoria */}
              <Label htmlFor="category">Categoria</Label>

              <select
                {...register("category")}
                className="w-full h-10 rounded-md border border-input bg-background px-3">
                <option value="CERVEJA">Cerveja</option>

                <option value="VINHOS">Vinhos</option>

                <option value="DESTILADOS">Destilados</option>

                <option value="REFRIGERANTES">Refrigerantes</option>

                <option value="SUCO">Suco</option>

                <option value="AGUA">Água</option>
              </select>
            </div>

            <div>
              {/* Marca */}
              <Label htmlFor="brand">Marca</Label>

              <Input id="brand" placeholder="Heineken" {...register("brand")} />
            </div>

            <div>
              {/*Unidade de medida */}
              <Label htmlFor="unitMeasure">Unidade de Medida</Label>

              <select
                {...register("unitMeasure")}
                className="w-full h-10 rounded-md border border-input bg-background px-3">
                <option value="UNIDADE">Unidade</option>

                <option value="KG">Kg</option>

                <option value="LITRO">Litro</option>

                <option value="FARDO">Fardo</option>
              </select>
            </div>

            <div>
              {/* Preço de custo */}
              <Label htmlFor="costPrice">Preço de Custo</Label>

              <Input
                id="costPrice"
                type="number"
                step="0.01"
                {...register("costPrice", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              {/* Preço de venda */}
              <Label htmlFor="salePrice">Preço de Venda</Label>

              <Input
                id="salePrice"
                type="number"
                step="0.01"
                {...register("salePrice", {
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Quantidade minima de produto */}
            <div>
              <Label htmlFor="minimumQuantity">Quantidade Mínima</Label>

              <Input
                id="minimumQuantity"
                type="number"
                {...register("minimumQuantity", {
                  valueAsNumber: true,
                })}
              />
            </div>

            <div>
              {/* Descrição */}
              <Label htmlFor="description">Descrição</Label>

              <Textarea
                id="description"
                placeholder="Descrição do produto..."
                {...register("description")}
              />
            </div>

            {/* Imagem */}
            <div>
              <Label htmlFor="image">Imagem do produto</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-accent-foreground hover:bg-accent"
              disabled={createProduct.isPending}>
              {createProduct.isPending ? "Salvando..." : "Adicionar Produto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
