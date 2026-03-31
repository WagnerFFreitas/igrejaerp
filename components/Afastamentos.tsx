
import React, { useState } from 'react';
import { PlaneTakeoff, Plus, Search, Stethoscope, Baby, Clock, User, Edit2, X, Save, Loader2, Trash2, Printer, Download, Filter } from 'lucide-react';
import { EmployeeLeave, Payroll, LeaveType } from '../types';
import { dbService } from '../services/databaseService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface AfastamentosProps {
  leaves: EmployeeLeave[];
  setLeaves: (leaves: EmployeeLeave[]) => void;
  currentUnitId: string;
  employees: Payroll[];
}

export const Afastamentos: React.FC<AfastamentosProps> = ({ leaves, setLeaves, currentUnitId, employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [formData, setFormData] = useState<Partial<EmployeeLeave>>({
    type: 'VACATION',
    status: 'SCHEDULED',
  });

  const handleRegister = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.type) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      const employee = employees.find(e => e.id === formData.employeeId);
      const newLeave: EmployeeLeave = {
        id: formData.id || crypto.randomUUID(),
        unitId: currentUnitId,
        employeeId: formData.employeeId!,
        employeeName: employee?.employeeName || 'Desconhecido',
        type: formData.type as LeaveType,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        status: formData.status as any || 'SCHEDULED',
        observations: formData.observations,
      };

      await dbService.saveLeave(newLeave);
      if (formData.id) {
        setLeaves(leaves.map(l => l.id === newLeave.id ? newLeave : l));
      } else {
        setLeaves([...leaves, newLeave]);
      }
      setIsModalOpen(false);
      setFormData({ type: 'VACATION', status: 'SCHEDULED' });
    } catch (error) {
      console.error('Erro ao registrar afastamento:', error);
      alert('Erro ao registrar afastamento.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (leave: EmployeeLeave) => {
    setFormData(leave);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log("Tentando excluir afastamento com ID:", id);
    // if (!confirm('Tem certeza que deseja excluir este afastamento?')) return;
    try {
      await dbService.deleteLeave(id);
      console.log("Exclusão bem-sucedida no banco de dados.");
      setLeaves(leaves.filter(l => l.id !== id));
      console.log("Estado atualizado.");
    } catch (error) {
      console.error('Erro ao excluir afastamento:', error);
      alert('Erro ao excluir afastamento.');
    }
  };

  const handlePrintReport = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Título
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Relatório de Afastamentos & Licenças', 105, 20, { align: 'center' });
      
      // Data
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Emitido em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });
      
      // Filtros aplicados
      let yPos = 40;
      if (searchTerm || filterType || filterStatus || filterEmployee) {
        pdf.setFontSize(10);
        pdf.text('Filtros Aplicados:', 20, yPos);
        yPos += 5;
        
        if (searchTerm) pdf.text(`- Busca: ${searchTerm}`, 25, yPos);
        if (filterType) pdf.text(`- Tipo: ${filterType}`, 25, yPos += 5);
        if (filterStatus) pdf.text(`- Status: ${filterStatus}`, 25, yPos += 5);
        if (filterEmployee) pdf.text(`- Funcionário: ${filterEmployee}`, 25, yPos += 5);
        yPos += 10;
      }
      
      // Cabeçalho da tabela
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Matrícula', 20, yPos);
      pdf.text('Colaborador', 50, yPos);
      pdf.text('Tipo', 100, yPos);
      pdf.text('Status', 130, yPos);
      pdf.text('Início', 160, yPos);
      pdf.text('Fim', 180, yPos);
      
      // Linha separadora
      yPos += 2;
      pdf.line(20, yPos, 190, yPos);
      yPos += 5;
      
      // Dados da tabela
      pdf.setFont('helvetica', 'normal');
      const filteredLeaves = getFilteredLeaves();
      
      filteredLeaves.forEach((leave, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(9);
        pdf.text(employees.find(emp => emp.id === leave.employeeId)?.matricula || 'N/A', 20, yPos);
        pdf.text(leave.employeeName.substring(0, 20), 50, yPos);
        pdf.text(leave.type.substring(0, 12), 100, yPos);
        pdf.text(leave.status.substring(0, 10), 130, yPos);
        pdf.text(new Date(leave.startDate).toLocaleDateString('pt-BR'), 160, yPos);
        pdf.text(new Date(leave.endDate).toLocaleDateString('pt-BR'), 180, yPos);
        
        yPos += 8;
      });
      
      // Total
      yPos += 5;
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total de Registros: ${filteredLeaves.length}`, 20, yPos);
      
      // Salvar PDF
      pdf.save(`relatorio-afastamentos-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar relatório PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getFilteredLeaves = () => {
    return leaves.filter(l => {
      const matchesUnit = l.unitId === currentUnitId;
      const matchesSearch = !searchTerm || 
        l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employees.find(emp => emp.id === l.employeeId)?.matricula?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !filterType || l.type === filterType;
      const matchesStatus = !filterStatus || l.status === filterStatus;
      const matchesEmployee = !filterEmployee || l.employeeId === filterEmployee;
      
      return matchesUnit && matchesSearch && matchesType && matchesStatus && matchesEmployee;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase">Afastamentos & Licenças</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de férias e saúde.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrintReport}
            disabled={isGeneratingPDF}
            className="bg-slate-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl uppercase text-xs flex items-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {isGeneratingPDF ? <Loader2 className="animate-spin" size={18} /> : <Printer size={18} />}
            {isGeneratingPDF ? 'Gerando...' : 'Imprimir Relatório'}
          </button>
          <button 
            onClick={() => { setFormData({ type: 'VACATION', status: 'SCHEDULED' }); setIsModalOpen(true); }}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl uppercase text-xs flex items-center gap-2"
          >
            <Plus size={18} /> Registrar
          </button>
        </div>
      </div>

      {/* Campo de busca e filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, matrícula, tipo ou status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
            showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter size={18} /> Filtros Avançados
          {(filterType || filterStatus || filterEmployee) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ml-1" />
          )}
        </button>
      </div>

      {/* Painel de filtros avançados */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os tipos</option>
              <option value="VACATION">Férias</option>
              <option value="MEDICAL">Médico</option>
              <option value="MATERNITY">Maternidade</option>
              <option value="PATERNITY">Paternidade</option>
              <option value="MILITARY">Militar</option>
              <option value="WEDDING">Casamento</option>
              <option value="BEREAVEMENT">Luto</option>
              <option value="UNPAID">Não Remunerado</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os status</option>
              <option value="SCHEDULED">Agendado</option>
              <option value="ACTIVE">Ativo</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1 ml-1">Funcionário</label>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os funcionários</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.employeeName}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase">
            <tr>
              <th className="px-8 py-5">Matrícula</th>
              <th className="px-8 py-5">Colaborador</th>
              <th className="px-8 py-5">Tipo</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {getFilteredLeaves().map(leave => (
              <tr key={leave.id}>
                <td className="px-8 py-5 text-slate-500">{employees.find(emp => emp.id === leave.employeeId)?.matricula || 'N/A'}</td>
                <td className="px-8 py-5 font-bold">{leave.employeeName}</td>
                <td className="px-8 py-5">{
                  leave.type === 'VACATION' ? 'Férias' :
                  leave.type === 'MEDICAL' ? 'Médico' :
                  leave.type === 'MATERNITY' ? 'Maternidade' :
                  leave.type === 'PATERNITY' ? 'Paternidade' :
                  leave.type === 'MILITARY' ? 'Militar' :
                  leave.type === 'WEDDING' ? 'Casamento' :
                  leave.type === 'BEREAVEMENT' ? 'Luto' :
                  leave.type === 'UNPAID' ? 'Não Remunerado' : leave.type
                }</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase">{
                    leave.status === 'SCHEDULED' ? 'Agendado' :
                    leave.status === 'ACTIVE' ? 'Ativo' :
                    leave.status === 'COMPLETED' ? 'Concluído' :
                    leave.status === 'CANCELLED' ? 'Cancelado' : leave.status
                  }</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 text-slate-400">
                    <button onClick={() => handleEdit(leave)} className="hover:text-indigo-600"><Edit2 size={16} /></button>
                    <button onClick={() => { console.log("Botão excluir clicado para ID:", leave.id); handleDelete(leave.id); }} className="hover:text-rose-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase">{formData.id ? 'Editar' : 'Novo'} Afastamento</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <select 
                className="w-full p-3 rounded-xl border border-slate-200"
                value={formData.employeeId || ''}
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
              >
                <option value="">Selecione o colaborador</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.employeeName}</option>)}
              </select>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200"
                value={formData.type || 'VACATION'}
                onChange={e => setFormData({...formData, type: e.target.value as LeaveType})}
              >
                <option value="VACATION">Férias</option>
                <option value="MEDICAL">Médico</option>
                <option value="MATERNITY">Maternidade</option>
                <option value="PATERNITY">Paternidade</option>
                <option value="MILITARY">Militar</option>
                <option value="WEDDING">Casamento</option>
                <option value="BEREAVEMENT">Luto</option>
                <option value="UNPAID">Não Remunerado</option>
              </select>
              <input type="date" className="w-full p-3 rounded-xl border border-slate-200" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              <input type="date" className="w-full p-3 rounded-xl border border-slate-200" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              <textarea placeholder="Observações" className="w-full p-3 rounded-xl border border-slate-200" value={formData.observations || ''} onChange={e => setFormData({...formData, observations: e.target.value})} />
              <button 
                onClick={handleRegister}
                disabled={isSaving}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {formData.id ? 'Atualizar' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
