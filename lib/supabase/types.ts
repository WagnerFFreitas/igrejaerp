export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      units: {
        Row: {
          id: string
          name: string
          code: string
          address: string | null
          city: string | null
          state: string | null
          phone: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          address?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          address?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          email?: string | null
          updated_at?: string
        }
      }
      members: {
        Row: {
          id: string
          unit_id: string
          name: string
          email: string | null
          phone: string | null
          cpf: string | null
          birth_date: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          gender: string | null
          marital_status: string | null
          baptism_date: string | null
          membership_date: string | null
          role: string | null
          department: string | null
          photo_url: string | null
          is_active: boolean
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          name: string
          email?: string | null
          phone?: string | null
          cpf?: string | null
          birth_date?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          gender?: string | null
          marital_status?: string | null
          baptism_date?: string | null
          membership_date?: string | null
          role?: string | null
          department?: string | null
          photo_url?: string | null
          is_active?: boolean
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          cpf?: string | null
          birth_date?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          gender?: string | null
          marital_status?: string | null
          baptism_date?: string | null
          membership_date?: string | null
          role?: string | null
          department?: string | null
          photo_url?: string | null
          is_active?: boolean
          observations?: string | null
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          unit_id: string
          member_id: string | null
          employee_name: string
          cpf: string | null
          rg: string | null
          birth_date: string | null
          hire_date: string | null
          termination_date: string | null
          job_title: string | null
          department: string | null
          salary: number
          bank: string | null
          agency: string | null
          account_number: string | null
          pix_key: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          phone: string | null
          email: string | null
          matricula: string | null
          is_active: boolean
          observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          member_id?: string | null
          employee_name: string
          cpf?: string | null
          rg?: string | null
          birth_date?: string | null
          hire_date?: string | null
          termination_date?: string | null
          job_title?: string | null
          department?: string | null
          salary?: number
          bank?: string | null
          agency?: string | null
          account_number?: string | null
          pix_key?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          phone?: string | null
          email?: string | null
          matricula?: string | null
          is_active?: boolean
          observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          member_id?: string | null
          employee_name?: string
          cpf?: string | null
          rg?: string | null
          birth_date?: string | null
          hire_date?: string | null
          termination_date?: string | null
          job_title?: string | null
          department?: string | null
          salary?: number
          bank?: string | null
          agency?: string | null
          account_number?: string | null
          pix_key?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          phone?: string | null
          email?: string | null
          matricula?: string | null
          is_active?: boolean
          observations?: string | null
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          unit_id: string
          type: 'INCOME' | 'EXPENSE'
          category: string
          subcategory: string | null
          description: string
          amount: number
          date: string
          account_id: string | null
          payment_method: string | null
          reference: string | null
          document_url: string | null
          is_recurring: boolean
          recurrence_type: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          type: 'INCOME' | 'EXPENSE'
          category: string
          subcategory?: string | null
          description: string
          amount: number
          date: string
          account_id?: string | null
          payment_method?: string | null
          reference?: string | null
          document_url?: string | null
          is_recurring?: boolean
          recurrence_type?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          type?: 'INCOME' | 'EXPENSE'
          category?: string
          subcategory?: string | null
          description?: string
          amount?: number
          date?: string
          account_id?: string | null
          payment_method?: string | null
          reference?: string | null
          document_url?: string | null
          is_recurring?: boolean
          recurrence_type?: string | null
          created_by?: string | null
          updated_at?: string
        }
      }
      accounts: {
        Row: {
          id: string
          unit_id: string
          name: string
          type: string
          bank: string | null
          agency: string | null
          account_number: string | null
          initial_balance: number
          current_balance: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          name: string
          type: string
          bank?: string | null
          agency?: string | null
          account_number?: string | null
          initial_balance?: number
          current_balance?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          type?: string
          bank?: string | null
          agency?: string | null
          account_number?: string | null
          initial_balance?: number
          current_balance?: number
          is_active?: boolean
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          unit_id: string
          name: string
          description: string | null
          category: string | null
          acquisition_date: string | null
          acquisition_value: number
          current_value: number
          location: string | null
          serial_number: string | null
          condition: string | null
          photo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          name: string
          description?: string | null
          category?: string | null
          acquisition_date?: string | null
          acquisition_value?: number
          current_value?: number
          location?: string | null
          serial_number?: string | null
          condition?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          name?: string
          description?: string | null
          category?: string | null
          acquisition_date?: string | null
          acquisition_value?: number
          current_value?: number
          location?: string | null
          serial_number?: string | null
          condition?: string | null
          photo_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      leaves: {
        Row: {
          id: string
          unit_id: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          reason: string | null
          status: string
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          reason?: string | null
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          employee_id?: string
          type?: string
          start_date?: string
          end_date?: string
          reason?: string | null
          status?: string
          approved_by?: string | null
          approved_at?: string | null
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          unit_id: string
          title: string
          description: string | null
          start_date: string
          end_date: string | null
          location: string | null
          type: string | null
          is_recurring: boolean
          recurrence_pattern: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          title: string
          description?: string | null
          start_date: string
          end_date?: string | null
          location?: string | null
          type?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          location?: string | null
          type?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          created_by?: string | null
          updated_at?: string
        }
      }
      system_users: {
        Row: {
          id: string
          email: string
          display_name: string
          unit_id: string
          role: 'admin' | 'manager' | 'employee' | 'member'
          employee_id: string | null
          member_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name: string
          unit_id: string
          role?: 'admin' | 'manager' | 'employee' | 'member'
          employee_id?: string | null
          member_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          unit_id?: string
          role?: 'admin' | 'manager' | 'employee' | 'member'
          employee_id?: string | null
          member_id?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      payroll: {
        Row: {
          id: string
          unit_id: string
          employee_id: string
          month: number
          year: number
          base_salary: number
          overtime_hours: number
          overtime_value: number
          bonuses: number
          deductions: number
          inss: number
          irrf: number
          fgts: number
          net_salary: number
          payment_date: string | null
          payment_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          employee_id: string
          month: number
          year: number
          base_salary?: number
          overtime_hours?: number
          overtime_value?: number
          bonuses?: number
          deductions?: number
          inss?: number
          irrf?: number
          fgts?: number
          net_salary?: number
          payment_date?: string | null
          payment_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          employee_id?: string
          month?: number
          year?: number
          base_salary?: number
          overtime_hours?: number
          overtime_value?: number
          bonuses?: number
          deductions?: number
          inss?: number
          irrf?: number
          fgts?: number
          net_salary?: number
          payment_date?: string | null
          payment_status?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
