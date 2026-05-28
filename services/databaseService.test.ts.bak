/**
 * ============================================================================
 * DATABASESERVICE.TEST.TS
 * ============================================================================
 *
 * Testes automatizados para validar mapeamento de dados entre frontend e backend
 * Garante sincronização correta de dados de membros
 */

import { 
  mapMemberFromApi, 
  mapMemberToApi, 
  buildMemberProfileData 
} from './databaseService';

// Mock do apiClient
jest.mock('../src/services/apiService', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

/**
 * SUITE: Testes de Mapeamento de Membros
 */
describe('Database Service - Member Mapping', () => {
  
  /**
   * TESTES: mapMemberFromApi (banco → frontend)
   */
  describe('mapMemberFromApi', () => {
    it('deve mapear corretamente dados básicos do membro', () => {
      const mockMemberFromDb = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao@example.com',
        phone: '11987654321',
        status: 'ACTIVE',
        role: 'MEMBER',
      };

      // Simular a chamada
      const result = mapMemberFromApi(mockMemberFromDb);

      expect(result.id).toBe('uuid-1');
      expect(result.unitId).toBe('unit-1');
      expect(result.name).toBe('João Silva');
      expect(result.cpf).toBe('123.456.789-00');
      expect(result.status).toBe('ACTIVE');
    });

    it('deve mapear endereço corretamente', () => {
      const mockMember = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-567',
      };

      const result = mapMemberFromApi(mockMember);

      expect(result.address).toEqual({
        zipCode: '01234-567',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
      });
    });

    it('deve mapear dados de vida cristã corretamente', () => {
      const mockMember = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        baptism_date: '2020-01-15',
        baptism_church: 'Igreja Central',
        membership_date: '2020-03-01',
        holy_spirit_baptism: true,
      };

      const result = mapMemberFromApi(mockMember);

      expect(result.baptismDate).toBe('2020-01-15');
      expect(result.baptismChurch).toBe('Igreja Central');
      expect(result.membershipDate).toBe('2020-03-01');
      expect(result.holySpiritBaptism).toBe('SIM');
    });

    it('deve mapear ministérios corretamente', () => {
      const mockMember = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        main_ministry: 'Louvor',
        ministry_role: 'Músico',
        ecclesiastical_position: 'Diácono',
        other_ministries: ['Visitação', 'Intercessão'],
      };

      const result = mapMemberFromApi(mockMember);

      expect(result.mainMinistry).toBe('Louvor');
      expect(result.ministryRole).toBe('Músico');
      expect(result.ecclesiasticalPosition).toBe('Diácono');
      expect(result.otherMinistries).toEqual(['Visitação', 'Intercessão']);
    });

    it('deve mapear dados financeiros corretamente', () => {
      const mockMember = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        is_tithable: true,
        is_regular_giver: true,
        participates_campaigns: false,
        bank: 'Banco do Brasil',
        bank_agency: '1234',
        bank_account: '567890-1',
        pix_key: 'joao@email.com',
      };

      const result = mapMemberFromApi(mockMember);

      expect(result.isTithable).toBe(true);
      expect(result.isRegularGiver).toBe(true);
      expect(result.participatesCampaigns).toBe(false);
      expect(result.bank).toBe('Banco do Brasil');
      expect(result.bankAccount).toBe('567890-1');
      expect(result.pixKey).toBe('joao@email.com');
    });

    it('deve preservar profile_data e campos extras', () => {
      const mockMember = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        profile_data: {
          contributions: [{ value: 100, date: '2024-01-01' }],
          email_pessoal: 'joao.pessoal@email.com',
          escolaridade: 'Superior Completo',
          is_pcd: true,
          lgpdConsent: { dataProcessing: true },
        },
      };

      const result = mapMemberFromApi(mockMember);

      expect(result.profile_data.contributions).toHaveLength(1);
      expect(result.email_pessoal).toBe('joao.pessoal@email.com');
      expect(result.escolaridade).toBe('Superior Completo');
      expect(result.is_pcd).toBe(true);
      expect(result.lgpdConsent).toEqual({ dataProcessing: true });
    });

    it('deve usar valores padrão para campos ausentes', () => {
      const mockMember = {
        id: 'uuid-1',
        unit_id: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
      };

      const result = mapMemberFromApi(mockMember);

      expect(result.status).toBe('ACTIVE');
      expect(result.role).toBe('MEMBER');
      expect(result.gender).toBe('M');
      expect(result.maritalStatus).toBe('SINGLE');
      expect(result.isTithable).toBe(false);
      expect(result.isRegularGiver).toBe(false);
    });
  });

  /**
   * TESTES: mapMemberToApi (frontend → banco)
   */
  describe('mapMemberToApi', () => {
    it('deve mapear dados do frontend para backend corretamente', () => {
      const mockMemberFrontend = {
        id: 'uuid-1',
        unitId: 'unit-1',
        name: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao@example.com',
        phone: '11987654321',
        status: 'ACTIVE',
        role: 'MEMBER',
      };

      const result = mapMemberToApi(mockMemberFrontend);

      expect(result.id).toBe('uuid-1');
      expect(result.unit_id).toBe('unit-1');
      expect(result.name).toBe('João Silva');
      expect(result.cpf).toBe('123.456.789-00');
      expect(result.status).toBe('ACTIVE');
    });

    it('deve decompor endereço em colunas separadas', () => {
      const mockMember = {
        id: 'uuid-1',
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        address: {
          zipCode: '01234-567',
          street: 'Rua das Flores',
          number: '123',
          complement: 'Apto 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        },
      };

      const result = mapMemberToApi(mockMember);

      expect(result.zip_code).toBe('01234-567');
      expect(result.street).toBe('Rua das Flores');
      expect(result.number).toBe('123');
      expect(result.neighborhood).toBe('Centro');
      expect(result.city).toBe('São Paulo');
      expect(result.state).toBe('SP');
    });

    it('NÃO deve duplicar campos em profile_data', () => {
      const mockMember = {
        id: 'uuid-1',
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        matricula: 'MAT001',
        profession: 'Engenheiro',
        mainMinistry: 'Louvor',
        bank: 'Banco do Brasil',
      };

      const result = mapMemberToApi(mockMember);
      const profileData = result.profile_data;

      // Estes campos NÃO devem estar em profile_data (estão em colunas)
      expect(profileData.matricula).toBeUndefined();
      expect(profileData.profession).toBeUndefined();
      expect(profileData.mainMinistry).toBeUndefined();
      expect(profileData.bank).toBeUndefined();

      // Profile data deve conter APENAS campos extras
      expect(Object.keys(profileData)).toContain('contributions');
      expect(Object.keys(profileData)).toContain('dependents');
      expect(Object.keys(profileData)).toContain('lgpdConsent');
    });

    it('deve converter tipos de dados corretamente', () => {
      const mockMember = {
        id: 'uuid-1',
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        gender: 'F',
        maritalStatus: 'MARRIED',
        holySpiritBaptism: 'SIM',
        isTithable: true,
        isRegularGiver: false,
      };

      const result = mapMemberToApi(mockMember);

      expect(result.gender).toBe('F');
      expect(result.marital_status).toBe('MARRIED');
      expect(result.holy_spirit_baptism).toBe(true);
      expect(result.is_tithable).toBe(true);
      expect(result.is_regular_giver).toBe(false);
    });

    it('deve incluir campos extras em profile_data', () => {
      const mockMember = {
        id: 'uuid-1',
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        email_pessoal: 'joao.pessoal@email.com',
        escolaridade: 'Superior',
        is_pcd: true,
        contributions: [{ value: 100, date: '2024-01-01' }],
        lgpdConsent: { dataProcessing: true },
      };

      const result = mapMemberToApi(mockMember);
      const profileData = result.profile_data;

      expect(profileData.email_pessoal).toBe('joao.pessoal@email.com');
      expect(profileData.escolaridade).toBe('Superior');
      expect(profileData.is_pcd).toBe(true);
      expect(profileData.contributions).toHaveLength(1);
      expect(profileData.lgpdConsent).toEqual({ dataProcessing: true });
    });
  });

  /**
   * TESTES: Ciclo Completo (Frontend → Backend → Frontend)
   */
  describe('Round-trip mapping', () => {
    it('deve preservar dados no ciclo completo', () => {
      const originalMember = {
        id: 'uuid-1',
        unitId: 'unit-1',
        matricula: 'MAT001',
        name: 'João Silva',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        email: 'joao@example.com',
        phone: '11987654321',
        whatsapp: '11987654322',
        profession: 'Engenheiro',
        role: 'MEMBER',
        status: 'ACTIVE',
        fatherName: 'José Silva',
        motherName: 'Maria Silva',
        bloodType: 'O+',
        birthDate: '1990-05-15',
        gender: 'M',
        maritalStatus: 'MARRIED',
        address: {
          zipCode: '01234-567',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        },
        baptismDate: '2015-06-20',
        membershipDate: '2015-08-01',
        mainMinistry: 'Louvor',
        isTithable: true,
        isRegularGiver: true,
        bank: 'Banco do Brasil',
        bankAccount: '567890-1',
        tags: ['ativo', 'levantador'],
      };

      // Frontend → Backend
      const apiPayload = mapMemberToApi(originalMember);

      // Simular resposta do backend (converte para snake_case)
      const dbResponse = {
        id: apiPayload.id,
        unit_id: apiPayload.unit_id,
        matricula: apiPayload.matricula,
        name: apiPayload.name,
        cpf: apiPayload.cpf,
        rg: apiPayload.rg,
        email: apiPayload.email,
        phone: apiPayload.phone,
        whatsapp: apiPayload.whatsapp,
        profession: apiPayload.profession,
        role: apiPayload.role,
        status: apiPayload.status,
        father_name: apiPayload.father_name,
        mother_name: apiPayload.mother_name,
        blood_type: apiPayload.blood_type,
        birth_date: apiPayload.birth_date,
        gender: apiPayload.gender,
        marital_status: apiPayload.marital_status,
        street: apiPayload.street,
        number: apiPayload.number,
        neighborhood: apiPayload.neighborhood,
        city: apiPayload.city,
        state: apiPayload.state,
        zip_code: apiPayload.zip_code,
        baptism_date: apiPayload.baptism_date,
        membership_date: apiPayload.membership_date,
        main_ministry: apiPayload.main_ministry,
        is_tithable: apiPayload.is_tithable,
        is_regular_giver: apiPayload.is_regular_giver,
        bank: apiPayload.bank,
        bank_account: apiPayload.bank_account,
        tags: apiPayload.tags,
        profile_data: apiPayload.profile_data,
      };

      // Backend → Frontend
      const mappedBack = mapMemberFromApi(dbResponse);

      // Validar ciclo completo
      expect(mappedBack.name).toBe(originalMember.name);
      expect(mappedBack.cpf).toBe(originalMember.cpf);
      expect(mappedBack.email).toBe(originalMember.email);
      expect(mappedBack.profession).toBe(originalMember.profession);
      expect(mappedBack.address.city).toBe(originalMember.address.city);
      expect(mappedBack.mainMinistry).toBe(originalMember.mainMinistry);
      expect(mappedBack.isTithable).toBe(originalMember.isTithable);
      expect(mappedBack.tags).toEqual(originalMember.tags);
    });

    it('deve preservar dados extras em profile_data', () => {
      const originalMember = {
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        email_pessoal: 'joao.pessoal@email.com',
        escolaridade: 'Superior',
        is_pcd: true,
        tipo_deficiencia: 'TDA',
        contributions: [{ value: 100, date: '2024-01-01' }],
        dependents: [{ name: 'Filho', relationship: 'FILHO' }],
        lgpdConsent: { dataProcessing: true, marketing: false },
      };

      const apiPayload = mapMemberToApi(originalMember);
      const dbResponse = {
        ...apiPayload,
        profile_data: apiPayload.profile_data,
      };
      const mappedBack = mapMemberFromApi(dbResponse);

      expect(mappedBack.email_pessoal).toBe('joao.pessoal@email.com');
      expect(mappedBack.escolaridade).toBe('Superior');
      expect(mappedBack.is_pcd).toBe(true);
      expect(mappedBack.contributions).toHaveLength(1);
      expect(mappedBack.dependents).toHaveLength(1);
      expect(mappedBack.lgpdConsent).toEqual({ dataProcessing: true, marketing: false });
    });
  });

  /**
   * TESTES: Validação de Dados
   */
  describe('Data validation', () => {
    it('deve usar valores padrão quando dados estão ausentes', () => {
      const minimalMember = {
        name: 'Teste',
        cpf: '123.456.789-00',
      };

      const result = mapMemberToApi(minimalMember);

      expect(result.role).toBe('MEMBER');
      expect(result.status).toBe('ACTIVE');
      expect(result.gender).toBe('M');
      expect(result.marital_status).toBe('SINGLE');
      expect(result.is_tithable).toBe(false);
      expect(result.is_regular_giver).toBe(false);
    });

    it('deve aceitar null para campos opcionais', () => {
      const member = {
        id: 'uuid-1',
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        email: null,
        phone: null,
        profession: null,
      };

      const result = mapMemberToApi(member);

      expect(result.email).toBeNull();
      expect(result.phone).toBeNull();
      expect(result.profession).toBeNull();
    });

    it('deve lidar com arrays vazios em campos multivalorados', () => {
      const member = {
        unitId: 'unit-1',
        name: 'Teste',
        cpf: '123.456.789-00',
        otherMinistries: [],
        tags: [],
        contributions: [],
        dependents: [],
      };

      const result = mapMemberToApi(member);

      expect(result.other_ministries).toEqual([]);
      expect(result.tags).toEqual([]);
      expect(result.profile_data.contributions).toEqual([]);
      expect(result.profile_data.dependents).toEqual([]);
    });
  });
});
