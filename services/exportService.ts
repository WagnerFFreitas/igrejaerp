/**
 * ============================================================================
 * EXPORT SERVICE
 * ============================================================================
 * Exportação de relatórios em PDF, Excel e CSV
 * ============================================================================
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { utils as XLSXUtils, writeFile as XLSXwriteFile, WorkBook } from 'xlsx';

export const exportService = {
  /**
   * ==========================================================================
   * EXPORTAÇÃO PDF
   * ==========================================================================
   */

  async gerarPDF(
    titulo: string,
    colunas: { header: string; key: string }[],
    dados: any[],
    opcoes?: {
      orientacao?: 'portrait' | 'landscape';
      tamanho?: 'a4' | 'letter';
      cabecalhoPersonalizado?: (doc: jsPDF) => void;
      rodapePersonalizado?: (doc: jsPDF) => void;
    }
  ): Promise<Blob> {
    return new Promise((resolve) => {
      const doc = new jsPDF({
        orientation: opcoes?.orientacao || 'portrait',
        unit: 'mm',
        format: opcoes?.tamanho || 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Cabeçalho
      if (opcoes?.cabecalhoPersonalizado) {
        opcoes.cabecalhoPersonalizado(doc);
      } else {
        doc.setFontSize(18);
        doc.setTextColor(79, 70, 229); // Indigo
        doc.text(titulo, pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, 27, { align: 'center' });
      }

      // Preparar dados para tabela
      const corpoDados = dados.map(dado => 
        colunas.map(col => dado[col.key] || '')
      );

      const cabecalhosTabela = colunas.map(col => col.header);

      // Gerar tabela
      (doc as any).autoTable({
        head: [cabecalhosTabela],
        body: corpoDados,
        startY: 35,
        theme: 'striped',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [79, 70, 229] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 35, bottom: 20 }
      });

      // Rodapé
      if (opcoes?.rodapePersonalizado) {
        opcoes.rodapePersonalizado(doc);
      } else {
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        }
      }

      // Converter para Blob
      const pdfBlob = doc.output('blob');
      resolve(pdfBlob);
    });
  },

  /**
   * ==========================================================================
   * EXPORTAÇÃO EXCEL
   * ==========================================================================
   */

  async gerarExcel(
    nomeArquivo: string,
    planilhas: {
      nome: string;
      colunas: { header: string; key: string }[];
      dados: any[];
    }[]
  ): Promise<Blob> {
    const wb: WorkBook = XLSXUtils.book_new();

    planilhas.forEach(planilha => {
      // Preparar dados
      const dadosFormatados = planilha.dados.map(dado => {
        const linha: any = {};
        planilha.colunas.forEach(col => {
          linha[col.header] = dado[col.key] || '';
        });
        return linha;
      });

      // Criar worksheet
      const ws = XLSXUtils.json_to_sheet(dadosFormatados);

      // Adicionar ao workbook
      XLSXUtils.book_append_sheet(wb, ws, planilha.nome.substring(0, 31)); // Excel limita nomes a 31 chars
    });

    // Gerar blob
    return new Promise((resolve) => {
      const wbout = XLSXwriteFile(wb, `${nomeArquivo}.xlsx`, { bookType: 'xlsx', type: 'array' });
      resolve(new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    });
  },

  /**
   * ==========================================================================
   * EXPORTAÇÃO CSV
   * ==========================================================================
   */

  async gerarCSV(
    colunas: { header: string; key: string }[],
    dados: any[]
  ): Promise<Blob> {
    // Cabeçalho
    const cabecalho = colunas.map(col => col.header).join(';');
    
    // Linhas
    const linhas = dados.map(dado => 
      colunas.map(col => {
        const valor = dado[col.key] || '';
        // Escapar valores com ponto-e-vírgula ou quebras de linha
        if (String(valor).includes(';') || String(valor).includes('\n')) {
          return `"${valor}"`;
        }
        return valor;
      }).join(';')
    );

    const csvContent = [cabecalho, ...linhas].join('\n');
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  },

  /**
   * ==========================================================================
   * DOWNLOAD DE ARQUIVOS
   * ==========================================================================
   */

  downloadBlob(blob: Blob, nomeArquivo: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * ==========================================================================
   * RELATÓRIOS PRONTOS
   * ==========================================================================
   */

  async exportarBalancetePDF(
    receitas: any[],
    despesas: any[],
    periodo: string
  ): Promise<void> {
    const colunas = [
      { header: 'Data', key: 'data' },
      { header: 'Descrição', key: 'descricao' },
      { header: 'Categoria', key: 'categoria' },
      { header: 'Valor', key: 'valor' }
    ];

    const dados = [
      ...receitas.map(r => ({ ...r, valor: `R$ ${r.valor.toFixed(2)}` })),
      ...despesas.map(d => ({ ...d, valor: `R$ -${d.valor.toFixed(2)}` }))
    ];

    const blob = await this.gerarPDF('Balancete Financeiro', colunas, dados, {
      orientacao: 'landscape',
      cabecalhoPersonalizado: (doc) => {
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text('BALANCETE FINANCEIRO', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Período: ${periodo}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
      }
    });

    this.downloadBlob(blob, `balancete_${periodo.replace(/\//g, '-')}.pdf`);
  },

  async exportarDREPDF(
    dreData: any,
    periodo: string
  ): Promise<void> {
    const colunas = [
      { header: 'Descrição', key: 'descricao' },
      { header: 'Valor', key: 'valor' }
    ];

    const dados = [
      { descricao: 'Receita Operacional Bruta', valor: `R$ ${dreData.receitaBruta.toFixed(2)}` },
      { descricao: '(-) Deduções e Impostos', valor: `R$ -${dreData.deducoes.toFixed(2)}` },
      { descricao: '(=) Receita Líquida', valor: `R$ ${dreData.receitaLiquida.toFixed(2)}` },
      { descricao: '(-) Custo dos Serviços', valor: `R$ -${dreData.custoServicos.toFixed(2)}` },
      { descricao: '(=) Lucro Bruto', valor: `R$ ${dreData.lucroBruto.toFixed(2)}` },
      { descricao: '(-) Despesas Administrativas', valor: `R$ -${dreData.despesasAdministrativas.toFixed(2)}` },
      { descricao: '(=) Resultado Operacional', valor: `R$ ${dreData.resultadoOperacional.toFixed(2)}` },
      { descricao: '(+/-) Outras Receitas/Despesas', valor: `R$ ${dreData.outrasReceitasDespesas.toFixed(2)}` },
      { descricao: '(=) Resultado Líquido', valor: `R$ ${dreData.resultadoLiquido.toFixed(2)}` }
    ];

    const blob = await this.gerarPDF('DRE Gerencial', colunas, dados, {
      orientacao: 'portrait',
      cabecalhoPersonalizado: (doc) => {
        doc.setFontSize(16);
        doc.setTextColor(79, 70, 229);
        doc.text('DEMONSTRATIVO DO RESULTADO DO EXERCÍCIO', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Período: ${periodo}`, doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });
      }
    });

    this.downloadBlob(blob, `dre_${periodo.replace(/\//g, '-')}.pdf`);
  },

  async exportarFluxoCaixaExcel(
    lancamentos: any[],
    projecao?: number[]
  ): Promise<void> {
    const planilhas = [
      {
        nome: 'Fluxo de Caixa',
        colunas: [
          { header: 'Data', key: 'data' },
          { header: 'Histórico', key: 'historico' },
          { header: 'Entradas', key: 'entradas' },
          { header: 'Saídas', key: 'saidas' },
          { header: 'Saldo', key: 'saldo' }
        ],
        dados: lancamentos
      }
    ];

    if (projecao && projecao.length > 0) {
      const projecaoDados = projecao.map((valor, idx) => ({
        dia: idx + 1,
        saldo_projetado: `R$ ${valor.toFixed(2)}`
      }));

      planilhas.push({
        nome: 'Projeção',
        colunas: [
          { header: 'Dia', key: 'dia' },
          { header: 'Saldo Projetado', key: 'saldo_projetado' }
        ],
        dados: projecaoDados
      });
    }

    const blob = await this.gerarExcel('fluxo_caixa', planilhas);
    this.downloadBlob(blob, 'fluxo_de_caixa.xlsx');
  }
};
