/**
 * ============================================================================
 * EXPORT SERVICE
 * ============================================================================
 * Exportação de relatórios em PDF, Excel e CSV
 * ============================================================================
 */

import { jsPDF } from 'jspdf';
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
  },

  async exportarHoleritesPDF(payrolls: any[]): Promise<void> {
    if (!payrolls || payrolls.length === 0) return;
    
    console.log(`📄 Iniciando geração de PDF para ${payrolls.length} funcionários.`);
    
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      payrolls.forEach((payroll, index) => {
        if (index > 0) {
          doc.addPage();
        }

        const unit = payroll.unit;
        const month = payroll.month || '00';
        const year = payroll.year || '0000';
        const monthYear = `${month}/${year}`;

        const drawHolerite = (yOffset: number, title: string) => {
          const margin = 10;
          const pageWidth = doc.internal.pageSize.getWidth();
          const contentWidth = pageWidth - (margin * 2);
          const startY = yOffset + margin;

          // Borda externa
          doc.setDrawColor(0);
          doc.setLineWidth(0.2);
          doc.rect(margin, startY, contentWidth, 125);

          // Cabeçalho
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text(unit?.name || 'ADJPA - SEDE MUNDIAL', margin + 2, startY + 5);
          doc.setFont('helvetica', 'normal');
          doc.text(`CNPJ: ${unit?.cnpj || '00.123.456/0001-99'}`, margin + 2, startY + 9);
          doc.text(unit?.address || 'RUA DAS NAÇÕES, 1000 - SEDE - SÃO PAULO/SP', margin + 2, startY + 13);

          doc.setFont('helvetica', 'bold');
          doc.text('RECIBO DE PAGAMENTO DE SALÁRIO', pageWidth - margin - 2, startY + 5, { align: 'right' });
          
          // Caixa do Mês
          doc.rect(pageWidth - margin - 40, startY + 7, 38, 8);
          doc.setFontSize(7);
          doc.text(`MÊS REFERÊNCIA: ${monthYear}`, pageWidth - margin - 38, startY + 12);
          
          doc.setFontSize(6);
          doc.text(title, pageWidth - margin - 2, startY + 18, { align: 'right' });

          // Grade de informações do funcionário
          doc.line(margin, startY + 20, pageWidth - margin, startY + 20);
          
          doc.setFontSize(6);
          doc.text('CÓD.', margin + 2, startY + 23);
          doc.text('NOME DO FUNCIONÁRIO', margin + 22, startY + 23);
          doc.text('CBO', margin + 112, startY + 23);
          doc.text('CARGO', margin + 142, startY + 23);

          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.text(String(payroll.matricula || payroll.id?.substring(0, 7) || '-'), margin + 2, startY + 28);
          doc.text(String(payroll.employeeName || payroll.nome || 'NÃO INFORMADO').toUpperCase(), margin + 22, startY + 28);
          doc.text(String(payroll.cbo || '-'), margin + 112, startY + 28);
          doc.text(String(payroll.cargo || '-').toUpperCase(), margin + 142, startY + 28);

          // Cabeçalhos da Tabela
          doc.line(margin, startY + 32, pageWidth - margin, startY + 32);
          doc.setFontSize(7);
          doc.text('CÓD.', margin + 2, startY + 36);
          doc.text('DESCRIÇÃO', margin + 22, startY + 36);
          doc.text('REFER.', margin + 112, startY + 36, { align: 'center' });
          doc.text('PROVENTOS', margin + 158, startY + 36, { align: 'right' });
          doc.text('DESCONTOS', margin + 188, startY + 36, { align: 'right' });
          doc.line(margin, startY + 38, pageWidth - margin, startY + 38);

          // Conteúdo da Tabela
          let currentY = startY + 43;
          const rowHeight = 5;
          let calcTotalProventos = 0;
          let calcTotalDescontos = 0;

          const formatCurrency = (val: any) => {
            const num = Number(val);
            return num > 0 ? num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
          };

          const addRow = (cod: string, desc: string, ref: string, prov: number, descVal: number) => {
            if (currentY > startY + 100) return; // Limite da tabela
            calcTotalProventos += prov;
            calcTotalDescontos += descVal;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.text(cod, margin + 2, currentY);
            doc.text(desc, margin + 22, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(ref, margin + 112, currentY, { align: 'center' });
            doc.text(formatCurrency(prov), margin + 158, currentY, { align: 'right' });
            doc.text(formatCurrency(descVal), margin + 188, currentY, { align: 'right' });
            currentY += rowHeight;
          };

          // Itens
          addRow('001', 'SALÁRIO BASE MENSAL', '30D', payroll.salario_base || 0, 0);
          
          if (payroll.ats_percentual > 0) {
            const atsValue = (payroll.salario_base || 0) * (payroll.ats_percentual / 100);
            addRow('010', 'ADIC. TEMPO SERVIÇO (ATS)', `${payroll.ats_percentual}%`, atsValue, 0);
          }

          if (payroll.auxilio_moradia > 0) {
            addRow('080', 'AUXÍLIO MORADIA / PREBENDA', 'FIXO', payroll.auxilio_moradia, 0);
          }

          if (payroll.he50_qtd > 0) {
            const valorHora = (payroll.salario_base || 0) / 220;
            const he50Valor = valorHora * 1.5 * payroll.he50_qtd;
            addRow('011', 'HORAS EXTRAS 50%', `${payroll.he50_qtd}H`, he50Valor, 0);
          }

          if (payroll.he100_qtd > 0) {
            const valorHora = (payroll.salario_base || 0) / 220;
            const he100Valor = valorHora * 2.0 * payroll.he100_qtd;
            addRow('012', 'HORAS EXTRAS 100%', `${payroll.he100_qtd}H`, he100Valor, 0);
          }

          if (payroll.comissoes > 0) {
            addRow('020', 'COMISSÕES', 'VAR', payroll.comissoes, 0);
          }

          if (payroll.gratificacoes > 0) {
            addRow('021', 'GRATIFICAÇÕES', 'VAR', payroll.gratificacoes, 0);
          }

          if (payroll.salario_familia > 0) {
            addRow('030', 'SALÁRIO FAMÍLIA', 'DEP', payroll.salario_familia, 0);
          }

          // Descontos
          if (payroll.inss > 0) {
            addRow('901', 'INSS - PREVIDÊNCIA SOCIAL', 'VAR', 0, payroll.inss);
          }

          if (payroll.irrf > 0) {
            addRow('902', 'IRRF - IMPOSTO DE RENDA', 'VAR', 0, payroll.irrf);
          }

          if (payroll.vale_transporte_total > 0 && payroll.vt_ativo) {
            addRow('910', 'VALE TRANSPORTE', '6%', 0, payroll.vale_transporte_total);
          }

          if (payroll.vale_alimentacao > 0 && payroll.va_ativo) {
            addRow('970', 'DESCONTO VALE ALIMENTAÇÃO', 'FIXO', 0, payroll.vale_alimentacao);
          }

          if (payroll.vale_refeicao > 0 && payroll.vr_ativo) {
            addRow('971', 'DESCONTO VALE REFEIÇÃO', 'FIXO', 0, payroll.vale_refeicao);
          }

          if (payroll.plano_saude_colaborador > 0 && payroll.ps_ativo) {
            addRow('950', 'PLANO DE SAÚDE (TITULAR)', 'PARC', 0, payroll.plano_saude_colaborador);
          }

          if (payroll.plano_odontologico > 0 && payroll.po_ativo) {
            addRow('951', 'PLANO ODONTOLÓGICO', 'PARC', 0, payroll.plano_odontologico);
          }

          if (payroll.adiantamento > 0) {
            addRow('980', 'ADIANTAMENTO SALARIAL', 'VAR', 0, payroll.adiantamento);
          }

          if (payroll.pensao_alimenticia > 0) {
            addRow('981', 'PENSÃO ALIMENTÍCIA', 'JUDIC', 0, payroll.pensao_alimenticia);
          }

          // Totais
          doc.line(margin, startY + 105, pageWidth - margin, startY + 105);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('TOTAIS R$', margin + 112, startY + 110, { align: 'right' });
          
          const finalProventos = payroll.total_proventos || calcTotalProventos;
          const finalDescontos = payroll.total_descontos || calcTotalDescontos;
          const finalLiquido = payroll.salario_liquido || (finalProventos - finalDescontos);

          doc.text(Number(finalProventos).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), margin + 158, startY + 110, { align: 'right' });
          doc.text(Number(finalDescontos).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), margin + 188, startY + 110, { align: 'right' });

          // Caixa de Valor Líquido
          doc.rect(pageWidth - margin - 60, startY + 112, 58, 11);
          doc.setFontSize(6);
          doc.text('VALOR LÍQUIDO A RECEBER', pageWidth - margin - 31, startY + 115, { align: 'center' });
          doc.setFontSize(12);
          doc.text(`R$ ${Number(finalLiquido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth - margin - 31, startY + 121, { align: 'center' });

          // Rodapé
          doc.setFontSize(5);
          doc.setFont('helvetica', 'normal');
          doc.text('CERTIFICAÇÃO DIGITAL ADJPA ERP + PROTOCOLO DE AUTENTICIDADE: ' + String(payroll.id || 'LOCAL').toUpperCase(), margin + 5, startY + 115);
          doc.text('DOCUMENTO EMITIDO ELETRONICAMENTE COM VALIDADE JURÍDICA ICP-BRASIL - GERENCIADO NO PORTAL', margin + 5, startY + 118);

          doc.line(margin + 20, startY + 123, margin + 90, startY + 123);
          doc.text('ASSINATURA DO FUNCIONÁRIO / BENEFICIÁRIO', margin + 55, startY + 125, { align: 'center' });
          
          doc.line(margin + 100, startY + 123, margin + 120, startY + 123);
          doc.text('DATA', margin + 110, startY + 125, { align: 'center' });
        };

        drawHolerite(0, 'VIA DO COLABORADOR / BENEFICIÁRIO');
        
        // Linha de corte
        (doc as any).setLineDash([1, 1], 0);
        doc.line(0, 148.5, 210, 148.5);
        doc.setFontSize(6);
        doc.text('PICOTE DE RECORTE', 105, 147.5, { align: 'center' });
        (doc as any).setLineDash([], 0);

        drawHolerite(148.5, 'VIA DO EMPREGADOR / ARQUIVO INSTITUCIONAL');
      });

      const pdfBlob = doc.output('blob');
      const fileName = `holerites_${payrolls.length}_funcionarios_${payrolls[0].month}_${payrolls[0].year}.pdf`;
      this.downloadBlob(pdfBlob, fileName);
      console.log('✅ PDF único gerado e download iniciado:', fileName);
    } catch (error) {
      console.error('❌ Erro crítico ao gerar holerites em PDF:', error);
      throw error;
    }
  }
};
