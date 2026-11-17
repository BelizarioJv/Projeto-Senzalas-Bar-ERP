import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { monthlySalesReportResponse } from "@/types/report";

export function generateSalesReportPDF(report: monthlySalesReportResponse) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Senzalas - Relatório de Vendas", 20, 20);

  doc.setFontSize(11);

  doc.text(
    `Vendas: ${report.summary.totalSales} | Faturamento: R$ ${Number(report.summary.totalAmount).toFixed(2)}`,
    20,
    42,
  );

  autoTable(doc, {
    startY: 55,

    head: [["Data", "Cliente", "Total"]],

    body: report.data.map((sale) => [
      new Date(sale.createdAt).toLocaleDateString(),
      sale.customer?.name ?? "Cliente não identificado",
      `R$ ${Number(sale.total).toFixed(2)}`,
    ]),

    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10 },
  });

  doc.save("relatorio-vendas.pdf");
}
