## Relatório Completo de Verificação do Banco de Dados

### Tabela: `membros`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `id_unidade`
- [x] `matricula`
- [x] `nome`
- [x] `cpf`
- [x] `rg`
- [x] `email`
- [x] `telefone`
- [x] `whatsapp`
- [x] `profissao`
- [x] `funcao`
- [x] `status`
- [x] `data_nascimento`
- [x] `sexo`
- [x] `estado_civil`
- [x] `nome_conjuge`
- [x] `data_casamento`
- [x] `nome_pai`
- [x] `nome_mae`
- [x] `tipo_sanguineo`
- [x] `contato_emergencia`
- [x] `cep`
- [x] `logradouro`
- [x] `numero`
- [x] `complemento`
- [x] `bairro`
- [x] `cidade`
- [x] `estado`
- [x] `data_conversao`
- [x] `local_conversao`
- [x] `data_batismo`
- [x] `igreja_batismo`
- [x] `pastor_batizador`
- [x] `batismo_espirito_santo`
- [x] `data_membro`
- [x] `igreja_origem`
- [x] `curso_discipulado`
- [x] `escola_biblica`
- [x] `ministerio_principal`
- [x] `funcao_ministerio`
- [x] `outros_ministerios`
- [x] `cargo_eclesiastico`
- [x] `data_consagracao`
- [x] `dizimista`
- [x] `ofertante_regular`
- [x] `participa_campanhas`
- [x] `banco`
- [x] `agencia_bancaria`
- [x] `conta_bancaria`
- [x] `chave_pix`
- [x] `observacoes`
- [x] `necessidades_especiais`
- [x] `talentos`
- [x] `tags`
- [x] `familia_id`
- [x] `avatar`
- [x] `cell_group`
- [x] `dons_espirituais`
- [x] `escolaridade`
- [x] `is_pcd`
- [x] `tipo_deficiencia`
- [x] `celular`
- [x] `lgpd_consent`
- [x] `criado`
- [x] `atualizado`
- [x] `dados_perfil`

**Campos no Banco de Dados vs. Código:**
- [!] `ministerio` (Extra no DB, não definido no código)
- [!] `grupo_pequeno` (Extra no DB, não definido no código)
- [!] `ofertante` (Extra no DB, não definido no código)
- [!] `valor_dizimo` (Extra no DB, não definido no código)

---

### Tabela: `transactions`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `id_unidade`
- [x] `descricao`
- [x] `valor`
- [x] `data_transacao`
- [x] `tipo_transacao`
- [x] `situacao`
- [x] `data_competencia`
- [x] `categoria`
- [x] `centro_custo`
- [x] `natureza_operacao`
- [x] `id_conta`
- [x] `id_membro`
- [x] `forma_pagamento`
- [x] `projeto_id`
- [x] `nome_fornecedor`
- [x] `data_vencimento`
- [x] `data_pagamento`
- [x] `valor_pago`
- [x] `valor_restante`
- [x] `parcelado`
- [x] `numero_parcela`
- [x] `total_parcelas`
- [x] `id_transacao_origem`
- [x] `conciliado`
- [ ] `conciliation_date` (Não encontrado no DB)
- [ ] `notes` (Não encontrado no DB)
- [ ] `external_id` (Não encontrado no DB)
- [x] `criado`
- [x] `atualizado`

**Campos no Banco de Dados vs. Código:**
- [!] `observacoes` (Extra no DB, não definido no código)
- [!] `created_by` (Extra no DB, não definido no código)
- [!] `data_conciliacao` (Extra no DB, não definido no código)
- [!] `id_externo` (Extra no DB, não definido no código)

---

### Tabela: `employees`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `id_unidade`
- [x] `nome`
- [x] `cpf`
- [x] `rg`
- [x] `ctps`
- [x] `ctps_serie`
- [x] `pis`
- [x] `birth_date`
- [x] `sexo`
- [x] `estado_civil`
- [x] `blood_type`
- [x] `email`
- [x] `telefone`
- [x] `celular`
- [x] `emergency_contact`
- [x] `naturalidade`
- [x] `escolaridade`
- [x] `raca_cor`
- [x] `nome_mae`
- [x] `nome_pai`
- [x] `deficiencia`
- [x] `deficiencia_obs`
- [x] `avatar`
- [x] `observacoes_saude`
- [x] `cep`
- [x] `logradouro`
- [x] `numero`
- [x] `complemento`
- [x] `bairro`
- [x] `cidade`
- [x] `estado`
- [x] `address_country`
- [x] `matricula`
- [x] `cargo`
- [x] `funcao`
- [x] `departamento`
- [x] `cbo`
- [x] `data_admissao`
- [x] `data_demissao`
- [x] `tipo_contrato`
- [x] `regime_trabalho`
- [x] `sindicato`
- [x] `convencao_coletiva`
- [x] `salario_base`
- [x] `tipo_salario`
- [x] `forma_pagamento`
- [x] `dia_pagamento`
- [x] `jornada_trabalho`
- [x] `escala_trabalho`
- [x] `horario_entrada`
- [x] `horario_saida`
- [x] `inicio_intervalo`
- [x] `fim_intervalo`
- [x] `duracao_intervalo`
- [x] `segunda_a_sexta`
- [x] `sabado`
- [x] `trabalha_feriados`
- [x] `controla_intervalo`
- [x] `horas_extras_autorizadas`
- [x] `tipo_registro_ponto`
- [x] `tolerancia_ponto`
- [x] `codigo_horario`
- [x] `banco`
- [x] `codigo_banco`
- [x] `agencia`
- [x] `conta`
- [x] `tipo_conta`
- [x] `titular`
- [x] `chave_pix`
- [x] `vt_ativo`
- [x] `vt_valor_diario`
- [x] `vt_qtd_vales_dia`
- [x] `vale_transporte_total`
- [x] `va_ativo`
- [x] `va_operadora`
- [x] `vale_alimentacao`
- [x] `vr_ativo`
- [x] `vr_operadora`
- [x] `vale_refeicao`
- [x] `ps_ativo`
- [x] `ps_operadora`
- [x] `ps_tipo_plano`
- [x] `ps_carteirinha`
- [x] `plano_saude_colaborador`
- [x] `ps_dependentes_ativo`
- [x] `plano_saude_dependentes`
- [x] `po_ativo`
- [x] `po_operadora`
- [x] `po_carteirinha`
- [x] `plano_odontologico`
- [x] `auxilio_moradia`
- [x] `vale_farmacia`
- [x] `seguro_vida`
- [x] `auxilio_creche`
- [x] `auxilio_educacao`
- [x] `gympass_plano`
- [x] `titulo_eleitor`
- [x] `titulo_eleitor_zona`
- [x] `titulo_eleitor_secao`
- [x] `reservista`
- [x] `cnh_numero`
- [x] `cnh_categoria`
- [x] `cnh_vencimento`
- [x] `aso_data`
- [x] `esocial_categoria`
- [x] `esocial_matricula`
- [x] `esocial_natureza_atividade`
- [x] `esocial_tipo_regime_prev`
- [x] `esocial_tipo_regime_trab`
- [x] `esocial_indicativo_admissao`
- [x] `esocial_tipo_jornada`
- [x] `esocial_descricao_jornada`
- [x] `esocial_contrato_parcial`
- [x] `esocial_teletrabalho`
- [x] `esocial_clausula_asseguratoria`
- [x] `esocial_sucessao_trab`
- [x] `esocial_tipo_admissao`
- [x] `esocial_cnpj_anterior`
- [x] `esocial_matricula_anterior`
- [x] `esocial_data_admissao_origem`
- [x] `ativo`
- [x] `criado`
- [x] `atualizado`
- [x] `dados_perfil`

**Campos no Banco de Dados vs. Código:**
- [!] `created_by` (Extra no DB, não definido no código)

---

### Tabela: `payroll_periods`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `id_unidade`
- [ ] `month` (Não encontrado no DB)
- [ ] `year` (Não encontrado no DB)
- [ ] `start_date` (Não encontrado no DB)
- [ ] `end_date` (Não encontrado no DB)
- [x] `criado_por`
- [ ] `notes` (Não encontrado no DB)
- [ ] `status` (Não encontrado no DB)

**Campos no Banco de Dados vs. Código:**
- [!] `mes` (Extra no DB, não definido no código)
- [!] `ano` (Extra no DB, não definido no código)
- [!] `situacao` (Extra no DB, não definido no código)
- [!] `data_inicio` (Extra no DB, não definido no código)
- [!] `data_final` (Extra no DB, não definido no código)
- [!] `processado` (Extra no DB, não definido no código)
- [!] `fechado` (Extra no DB, não definido no código)
- [!] `total_funcionarios` (Extra no DB, não definido no código)
- [!] `total_folha` (Extra no DB, não definido no código)
- [!] `total_inss` (Extra no DB, não definido no código)
- [!] `total_fgts` (Extra no DB, não definido no código)
- [!] `total_irrf` (Extra no DB, não definido no código)
- [!] `observacoes` (Extra no DB, não definido no código)

---

### Tabela: `payroll_calculations`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [ ] `employee_id` (Não encontrado no DB)
- [ ] `competency_month` (Não encontrado no DB)
- [ ] `gross_salary` (Não encontrado no DB)
- [ ] `base_salary` (Não encontrado no DB)
- [ ] `overtime` (Não encontrado no DB)
- [ ] `night_shift` (Não encontrado no DB)
- [ ] `hazard_pay` (Não encontrado no DB)
- [ ] `commission` (Não encontrado no DB)
- [ ] `bonuses` (Não encontrado no DB)
- [ ] `family_salary` (Não encontrado no DB)
- [ ] `other_allowances` (Não encontrado no DB)
- [x] `inss`
- [x] `irrf`
- [x] `fgts`
- [ ] `health_insurance` (Não encontrado no DB)
- [ ] `dental_insurance` (Não encontrado no DB)
- [ ] `meal_allowance` (Não encontrado no DB)
- [ ] `meal_ticket` (Não encontrado no DB)
- [ ] `transport` (Não encontrado no DB)
- [x] `pharmacy`
- [x] `life_insurance`
- [ ] `advance` (Não encontrado no DB)
- [x] `consignado`
- [ ] `coparticipation` (Não encontrado no DB)
- [ ] `absences` (Não encontrado no DB)
- [ ] `delays` (Não encontrado no DB)
- [ ] `alimony` (Não encontrado no DB)
- [ ] `other_deductions` (Não encontrado no DB)
- [ ] `total_allowances` (Não encontrado no DB)
- [ ] `total_deductions` (Não encontrado no DB)
- [ ] `net_salary` (Não encontrado no DB)
- [ ] `employer_cost` (Não encontrado no DB)
- [ ] `inss_base` (Não encontrado no DB)
- [ ] `inss_rate` (Não encontrado no DB)
- [ ] `inss_value` (Não encontrado no DB)
- [ ] `irrf_base` (Não encontrado no DB)
- [ ] `irrf_rate` (Não encontrado no DB)
- [ ] `irrf_deduction` (Não encontrado no DB)
- [ ] `irrf_value` (Não encontrado no DB)
- [ ] `fgts_base` (Não encontrado no DB)
- [ ] `fgts_rate` (Não encontrado no DB)
- [ ] `fgts_value` (Não encontrado no DB)

**Campos no Banco de Dados vs. Código:**
- [!] `id_funcionario` (Extra no DB, não definido no código)
- [!] `mes_competencia` (Extra no DB, não definido no código)
- [!] `salario_bruto` (Extra no DB, não definido no código)
- [!] `salario_base` (Extra no DB, não definido no código)
- [!] `horas_extras` (Extra no DB, não definido no código)
- [!] `adicional_noturno` (Extra no DB, não definido no código)
- [!] `insalubridade` (Extra no DB, não definido no código)
- [!] `comissao` (Extra no DB, não definido no código)
- [!] `bonificacoes` (Extra no DB, não definido no código)
- [!] `salario_familia` (Extra no DB, não definido no código)
- [!] `outros_proventos` (Extra no DB, não definido no código)
- [!] `union` (Extra no DB, não definido no código)
- [!] `plano_saude` (Extra no DB, não definido no código)
- [!] `plano_odontologico` (Extra no DB, não definido no código)
- [!] `vale_alimentacao` (Extra no DB, não definido no código)
- [!] `vale_refeicao` (Extra no DB, não definido no código)
- [!] `transporte` (Extra no DB, não definido no código)
- [!] `adiantamento` (Extra no DB, não definido no código)
- [!] `coparticipacao` (Extra no DB, não definido no código)
- [!] `faltas` (Extra no DB, não definido no código)
- [!] `atrasos` (Extra no DB, não definido no código)
- [!] `pensao_alimenticia` (Extra no DB, não definido no código)
- [!] `outras_deducoes` (Extra no DB, não definido no código)
- [!] `total_proventos` (Extra no DB, não definido no código)
- [!] `total_descontos` (Extra no DB, não definido no código)
- [!] `salario_liquido` (Extra no DB, não definido no código)
- [!] `custo_empregador` (Extra no DB, não definido no código)
- [!] `base_inss` (Extra no DB, não definido no código)
- [!] `aliquota_inss` (Extra no DB, não definido no código)
- [!] `valor_inss` (Extra no DB, não definido no código)
- [!] `base_irrf` (Extra no DB, não definido no código)
- [!] `aliquota_irrf` (Extra no DB, não definido no código)
- [!] `deducao_irrf` (Extra no DB, não definido no código)
- [!] `valor_irrf` (Extra no DB, não definido no código)
- [!] `base_fgts` (Extra no DB, não definido no código)
- [!] `aliquota_fgts` (Extra no DB, não definido no código)
- [!] `valor_fgts` (Extra no DB, não definido no código)
- [!] `criado` (Extra no DB, não definido no código)
- [!] `atualizado` (Extra no DB, não definido no código)

---

### Tabela: `assets`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [ ] `id_unidade` (Não encontrado no DB)
- [x] `nome`
- [x] `descricao`
- [x] `categoria`
- [x] `data_aquisicao`
- [x] `valor_aquisicao`
- [x] `valor_atual`
- [x] `taxa_depreciacao`
- [x] `metodo_depreciacao`
- [x] `valor_contabil_atual`
- [x] `depreciacao_acumulada`
- [x] `vida_util_meses`
- [x] `localizacao`
- [x] `cep`
- [x] `logradouro`
- [x] `numero`
- [x] `complemento`
- [x] `bairro`
- [x] `cidade`
- [x] `estado`
- [x] `situacao`
- [x] `condicao`
- [x] `numero_ativo`
- [x] `numero_serie`
- [x] `nota_fiscal_aquisicao`
- [ ] `marca` (Não encontrado no DB)
- [ ] `modelo` (Não encontrado no DB)
- [ ] `fornecedor` (Não encontrado no DB)
- [ ] `responsavel` (Não encontrado no DB)
- [x] `criado`
- [x] `atualizado`

**Campos no Banco de Dados vs. Código:**
- [!] `unit_id` (Extra no DB, não definido no código)
- [!] `funcionario_responsavel_id` (Extra no DB, não definido no código)
- [!] `validade_garantia` (Extra no DB, não definido no código)
- [!] `notas_manutencao` (Extra no DB, não definido no código)

---

### Tabela: `inventory_counts`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [ ] `id_unidade` (Não encontrado no DB)
- [ ] `count_date` (Não encontrado no DB)
- [ ] `counted_by` (Não encontrado no DB)
- [ ] `status` (Não encontrado no DB)
- [ ] `total_assets` (Não encontrado no DB)
- [ ] `total_expected` (Não encontrado no DB)
- [ ] `started_at` (Não encontrado no DB)
- [ ] `completed_at` (Não encontrado no DB)
- [ ] `total_found` (Não encontrado no DB)
- [ ] `completion_percentage` (Não encontrado no DB)

**Campos no Banco de Dados vs. Código:**
- [!] `unit_id` (Extra no DB, não definido no código)
- [!] `data_contagem` (Extra no DB, não definido no código)
- [!] `contagem_por` (Extra no DB, não definido no código)
- [!] `revisado_por` (Extra no DB, não definido no código)
- [!] `situacao` (Extra no DB, não definido no código)
- [!] `total_ativos` (Extra no DB, não definido no código)
- [!] `total_esperado` (Extra no DB, não definido no código)
- [!] `total_encontrado` (Extra no DB, não definido no código)
- [!] `diferenca_total` (Extra no DB, não definido no código)
- [!] `percentual_conclusao` (Extra no DB, não definido no código)
- [!] `iniciado` (Extra no DB, não definido no código)
- [!] `concluido` (Extra no DB, não definido no código)

---

### Tabela: `inventory_items`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [ ] `inventory_count_id` (Não encontrado no DB)
- [ ] `asset_id` (Não encontrado no DB)
- [ ] `asset_name` (Não encontrado no DB)
- [ ] `category` (Não encontrado no DB)
- [ ] `expected_quantity` (Não encontrado no DB)
- [ ] `counted_quantity` (Não encontrado no DB)
- [ ] `difference` (Não encontrado no DB)
- [ ] `condition` (Não encontrado no DB)
- [ ] `observations` (Não encontrado no DB)

**Campos no Banco de Dados vs. Código:**
- [!] `contagem_estoque_id` (Extra no DB, não definido no código)
- [!] `ativo_id` (Extra no DB, não definido no código)
- [!] `nome_ativo` (Extra no DB, não definido no código)
- [!] `categoria` (Extra no DB, não definido no código)
- [!] `quantidade_esperada` (Extra no DB, não definido no código)
- [!] `quantidade_contada` (Extra no DB, não definido no código)
- [!] `diferenca` (Extra no DB, não definido no código)
- [!] `condicao` (Extra no DB, não definido no código)
- [!] `location` (Extra no DB, não definido no código)
- [!] `observacoes` (Extra no DB, não definido no código)
- [!] `criado` (Extra no DB, não definido no código)

---

### Tabela: `church_events`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [ ] `id_unidade` (Não encontrado no DB)
- [x] `titulo`
- [x] `descricao`
- [x] `data_evento`
- [x] `hora_evento`
- [x] `local_evento`
- [x] `quantidade_presentes`
- [x] `type`
- [ ] `eh_recorrente` (Não encontrado no DB)
- [x] `padrao_recorrencia`
- [ ] `data_final_recorrencia` (Não encontrado no DB)
- [ ] `evento_id_transacao_origem` (Não encontrado no DB)
- [ ] `eh_evento_gerado` (Não encontrado no DB)
- [x] `criado`
- [x] `atualizado`

**Campos no Banco de Dados vs. Código:**
- [!] `unit_id` (Extra no DB, não definido no código)
- [!] `recorrente` (Extra no DB, não definido no código)
- [!] `data_fim_recorrencia` (Extra no DB, não definido no código)
- [!] `evento_pai_id` (Extra no DB, não definido no código)
- [!] `evento_gerado` (Extra no DB, não definido no código)

---

### Tabela: `app_audit_logs`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `id_unidade`
- [x] `usuario_id`
- [x] `nome_usuario`
- [x] `action`
- [x] `entidade`
- [ ] `entidade_id` (Não encontrado no DB)
- [x] `nome_entidade`
- [x] `data_evento`
- [x] `ip`
- [x] `agente_usuario`
- [x] `details`
- [x] `success`
- [x] `mensagem_erro`
- [x] `hash_anterior`
- [x] `hash`
- [x] `imutavel`
- [ ] `criado` (Não encontrado no DB)

**Campos no Banco de Dados vs. Código:**
- [!] `id_entidade` (Extra no DB, não definido no código)
- [!] `created_at` (Extra no DB, não definido no código)

---

### Tabela: `app_permission_modules`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `codigo`
- [x] `name`
- [x] `categoria`
- [ ] `descricao` (Não encontrado no DB)
- [x] `criado`
- [x] `atualizado`

**Campos no Banco de Dados vs. Código:**
- [!] `description` (Extra no DB, não definido no código)

---

### Tabela: `app_role_permissions`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `role`
- [x] `codigo_modulo`
- [x] `ler`
- [x] `escrever`
- [x] `excluir`
- [x] `gerenciar`
- [x] `criado`
- [x] `atualizado`

**Campos no Banco de Dados vs. Código:**
- [!] `administrador` (Extra no DB, não definido no código)

---

### Tabela: `app_user_permissions`

**Campos no Código vs. Banco de Dados:**
- [x] `id`
- [x] `usuario_id`
- [x] `codigo_modulo`
- [x] `ler`
- [x] `escrever`
- [x] `excluir`
- [x] `gerenciar`
- [x] `criado`
- [x] `atualizado`

**Campos no Banco de Dados vs. Código:**
- [!] `administrador` (Extra no DB, não definido no código)

---

