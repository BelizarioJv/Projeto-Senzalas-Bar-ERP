"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Truck,
  LayoutDashboard,
  ChevronDown,
  Users,
  ScrollText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { open } = useSidebar();
  const { setTheme, theme } = useTheme();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  return (
    <Sidebar className={`bg-gray-900 ${open ? "w-64" : "w-16"}`}>
      <SidebarHeader className="flex flex-col justify-center h-16 items-center bg-background border-r border-border">
        {open && <h2 className="flex text-xl font-bold">Menu</h2>}
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-2 p-2">
        {/* PRODUTOS */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("produtos")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <Package size={20} />
                  {open && "Produtos"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "produtos" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "produtos" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/produtos`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground  hover:bg-gray-30 transition">
                      Ver Produtos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/produtos/form`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Novo Produto
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>

        {/* CLIENTES */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("clientes")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <Users size={20} />
                  {open && "Clientes"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "clientes" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "clientes" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/clientes`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground  hover:bg-gray-30 transition">
                      Ver clientes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/clientes/form`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Novo Cliente
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>

        {/* COMPRA */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("compra")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <ShoppingCart size={20} />
                  {open && "Compra"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "compra" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "compra" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/compra`}
                      className="inline-flex items-center  w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Ver Compras
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/compra/form`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Nova Compra
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>

        {/* VENDA */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("venda")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <DollarSign size={20} />
                  {open && "Venda"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "venda" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "venda" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/venda`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Ver Vendas
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/venda/form`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Nova Venda
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>

        {/* FORNECEDORES */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("fornecedores")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <Truck size={20} />
                  {open && "Fornecedores"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "fornecedores" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "fornecedores" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/fornecedores`}
                      className="inline-flex items-center  w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Ver Fornecedores
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/fornecedores/form`}
                      className="inline-flex items-center  w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Novo Fornecedor
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>

        {/* DASHBOARD */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("dashboard")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <LayoutDashboard size={20} />
                  {open && "Dashboard"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "dashboard" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "dashboard" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/dashboard`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>

        {/* REPORTS */}
        <SidebarGroup>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => toggleMenu("relatorios")}
                className="w-full flex items-center justify-between gap-2 p-2 rounded hover:bg-gray-400 transition">
                <span className="flex items-center gap-2">
                  <ScrollText size={20} />
                  {open && "Relatórios"}
                </span>
                {open && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandedMenu === "relatorios" ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
              {expandedMenu === "relatorios" && open && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-gray-500 pl-3">
                  <li>
                    <Link
                      href={`/relatorios/monthSale`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Vendas Mensais
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/relatorios/monthPurchase`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Compras Mensais
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/relatorios/monthProfit`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Lucro Mensal
                    </Link>
                  </li>

                  <li>
                    <Link
                      href={`/relatorios/topProducts`}
                      className="inline-flex items-center w-full gap-2 px-2 py-1 bg-accent text-accent-foreground rounded-sm hover:bg-gray-30 transition">
                      Produtos Mais Vendidos
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5 bg-background border-t border-accent flex items-center justify-between">
        <h3 className="text-sm text-muted-foreground">
          Versão do software:
          <span className="ml-2 text-sm text-muted-foreground font-medium">
            1.0.0
          </span>
        </h3>
        <Button
          className="rounded-md"
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
