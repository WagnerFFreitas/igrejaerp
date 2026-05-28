# Processo de Migração de Nomenclatura (Inglês → Português)

## Visão Geral

Migração completa de nomenclatura do projeto IgrejaERP de inglês para português brasileiro.

---

## Pré-requisitos

1. **Backup completo** do repositório e banco de dados
2. **Node.js** instalado
3. **Branch dedicada**: `feature/migracao-portugues`

---

## Fluxo de Execução

### Passo 1: Simulação (Dry-Run)

```bash
# Simular renomeação de arquivos
npm run migracao:dry-run

# Simular substituição de conteúdo
npm run migracao:substituir
```

### Passo 2: Executar Renomeação de Arquivos

```bash
# Renomear todos os arquivos
npm run migracao:renomear

# Ou renomear por fase específica (1-10)
node scripts/renomear-arquivos.js --fase 1    # services/ (raiz)
node scripts/renomear-arquivos.js --fase 2    # utils/ (raiz)
node scripts/renomear-arquivos.js --fase 3    # types/ (raiz)
node scripts/renomear-arquivos.js --fase 4    # components/
node scripts/renomear-arquivos.js --fase 5    # src/services/
node scripts/renomear-arquivos.js --fase 6    # src/hooks/ e src/utils/
node scripts/renomear-arquivos.js --fase 7    # api/scripts/
node scripts/renomear-arquivos.js --fase 8    # api/ (raiz e src)
node scripts/renomear-arquivos.js --fase 9    # configurações
node scripts/renomear-arquivos.js --fase 10   # raiz do projeto
```

### Passo 3: Atualizar Conteúdo dos Arquivos

```bash
# Atualizar imports, nomes de classes, interfaces, etc.
npm run migracao:executar
```

### Passo 4: Validação

```bash
# Verificar se há termos em inglês restantes
npm run migracao:validar

# Verificar se o projeto compila
npm run lint

# Verificar se o build funciona
npm run build
```

### Passo 5: Limpeza (após validação completa)

```bash
# Remover backups
find . -name "*.bak" -delete

# Ou no Windows (PowerShell)
Get-ChildItem -Recurse -Filter "*.bak" | Remove-Item
```

---

## Estrutura de Scripts

| Script | Função |
|--------|--------|
| `scripts/renomear-arquivos.js` | Renomeia arquivos de inglês para português |
| `scripts/substituir-nomenclatura.js` | Substitui conteúdo (imports, classes, etc.) |
| `scripts/validar-nomenclatura.js` | Valida se há termos em inglês restantes |
| `scripts/dicionario-renomeacao-arquivos.json` | Dicionário de mapeamento de arquivos |
| `scripts/dicionario_nomenclaturas.json` | Dicionário de mapeamento de conteúdo |

---

## Comandos npm

| Comando | Descrição |
|---------|-----------|
| `npm run migracao:dry-run` | Simula renomeação (sem alterar nada) |
| `npm run migracao:renomear` | Executa renomeação de arquivos |
| `npm run migracao:substituir` | Simula substituição de conteúdo |
| `npm run migracao:executar` | Executa substituição de conteúdo |
| `npm run migracao:validar` | Valida nomenclatura restante |

---

## Fases de Renomeação

| Fase | Diretório | Qtd Arquivos |
|------|-----------|--------------|
| 1 | `services/` (raiz) | 20 |
| 2 | `utils/` (raiz) | 11 |
| 3 | `types/` (raiz) | 2 |
| 4 | `components/` | 3 |
| 5 | `src/services/` | 12 |
| 6 | `src/hooks/` e `src/utils/` | 3 |
| 7 | `api/scripts/` | 69 |
| 8 | `api/` (raiz, src, database) | 19 |
| 9 | `config/`, `constants/`, `contexts/` | 5 |
| 10 | Raiz do projeto | 3 |
| **Total** | | **128** |

---

## Rollback

Se algo der errado:

```bash
# Reverter renomeações (usando backups .bak)
find . -name "*.bak" -exec bash -c 'mv "$1" "${1%.bak}"' _ {} \;

# Ou reverter tudo via git
git checkout .

# Ou reverter para o tag de backup
git checkout backup-pre-migracao-ptbr
```

---

## Checklist de Validação

### Arquivos
- [ ] Todos os arquivos foram renomeados
- [ ] Nenhum arquivo antigo permanece
- [ ] Backups criados (.bak)

### Imports
- [ ] Todos os imports foram atualizados
- [ ] Nenhum import quebrado
- [ ] `npm run lint` passa sem erros

### Build
- [ ] `npm run build` funciona
- [ ] `cd api && npm run build` funciona
- [ ] Nenhum erro de compilação

### Testes
- [ ] Testes unitários passam
- [ ] Testes de integração passam
- [ ] API responde corretamente
- [ ] Frontend renderiza corretamente

---

## Observações

1. **Modo dry-run**: Sempre execute primeiro com `--dry-run` para verificar o que será alterado
2. **Backups**: Todos os arquivos originais são salvos com extensão `.bak`
3. **Fases**: A renomeação pode ser feita por fase para facilitar o controle
4. **Validação**: Execute a validação após cada fase para detectar problemas cedo
5. **Git**: Faça commit após cada fase concluída para facilitar rollback

---

**Criado em:** 2026-05-28
**Última atualização:** 2026-05-28
