const { Client } = require('pg');

const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

const fakeNames = ["Carlos Silva", "Ana Souza", "Fernanda Lima", "João Costa", "Maria Oliveira", "Roberto Carlos"];
const fakeBanks = ["Itaú", "Bradesco", "Caixa", "Santander", "Nubank", "Banco do Brasil"];
const fakeCities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"];
const fakeProfessions = ["Professor", "Engenheiro", "Médico", "Autônomo", "Empresário", "Estudante"];
const fakeMinistries = ["Louvor", "Infantil", "Recepção", "Ação Social", "Jovens", "Casais"];

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPhone() { return `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`; }
function randomCep() { return `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(100 + Math.random() * 900)}`; }
function randomCPF() { return `${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`; }
function randomRG() { return `${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-X`; }

async function fillData() {
    await client.connect();
    try {
        console.log("Atualizando Membros...");
        const membros = await client.query('SELECT id FROM membros');
        for (let row of membros.rows) {
            const updates = [];
            const values = [];
            let i = 1;

            const addUpdate = (col, val) => {
                updates.push(`${col} = COALESCE(${col}, $${i++})`);
                values.push(val);
            };

            // Dados pessoais básicos
            addUpdate('nome_pai', randomChoice(fakeNames));
            addUpdate('nome_mae', randomChoice(fakeNames));
            addUpdate('telefone', randomPhone());
            addUpdate('profissao', randomChoice(fakeProfessions));
            addUpdate('tipo_sanguineo', randomChoice(['O+', 'A+', 'B+', 'AB+', 'O-']));
            addUpdate('contato_emergencia', randomPhone());
            
            // Endereço
            addUpdate('cep', randomCep());
            addUpdate('logradouro', `Rua ${randomChoice(fakeNames)}`);
            addUpdate('numero', `${Math.floor(1 + Math.random() * 1000)}`);
            addUpdate('bairro', 'Centro');
            addUpdate('cidade', randomChoice(fakeCities));
            addUpdate('estado', 'SP');

            // Igreja
            addUpdate('local_conversao', 'Igreja Sede');
            addUpdate('igreja_batismo', 'Igreja Sede');
            addUpdate('pastor_batizador', 'Pr. Silas');
            addUpdate('igreja_origem', 'Assembleia de Deus');
            addUpdate('ministerio_principal', randomChoice(fakeMinistries));

            // Financeiro
            addUpdate('banco', randomChoice(fakeBanks));
            addUpdate('agencia_bancaria', `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(Math.random() * 9)}`);
            addUpdate('conta_bancaria', `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(Math.random() * 9)}`);
            addUpdate('chave_pix', randomPhone());

            // Corrigir cpf Teste (mock malfeito)
            await client.query(`UPDATE membros SET cpf = $1, nome = $2 WHERE nome = 'Teste Atualizado'`, [randomCPF(), 'Membro Atualizado']);

            const query = `UPDATE membros SET ${updates.join(', ')} WHERE id = $${i}`;
            values.push(row.id);
            await client.query(query, values);
        }
        console.log("Membros atualizados!");

        console.log("Atualizando Employees...");
        const funcionarios = await client.query('SELECT id FROM funcionarios');
        for (let row of funcionarios.rows) {
            const updates = [];
            const values = [];
            let i = 1;

            const addUpdate = (col, val) => {
                updates.push(`${col} = COALESCE(${col}, $${i++})`);
                values.push(val);
            };

            addUpdate('nome_pai', randomChoice(fakeNames));
            addUpdate('nome_mae', randomChoice(fakeNames));
            addUpdate('contato_emergencia', randomPhone());
            addUpdate('naturalidade', randomChoice(fakeCities));
            addUpdate('escolaridade', randomChoice(['Ensino Médio', 'Superior Completo', 'Pós-graduação']));
            addUpdate('raca_cor', randomChoice(['Branca', 'Parda', 'Preta', 'Indígena']));
            
            addUpdate('ctps', `${Math.floor(1000000 + Math.random() * 9000000)}`);
            addUpdate('ctps_serie', `${Math.floor(100 + Math.random() * 900)}-${Math.floor(Math.random() * 9)}`);
            addUpdate('pis', `${Math.floor(100 + Math.random() * 900)}.${Math.floor(10000 + Math.random() * 90000)}.${Math.floor(10 + Math.random() * 90)}-${Math.floor(Math.random() * 9)}`);
            
            // CNH
            addUpdate('cnh_numero', `${Math.floor(10000000000 + Math.random() * 90000000000)}`);
            addUpdate('cnh_categoria', randomChoice(['B', 'AB', 'D']));

            // Horários
            addUpdate('horario_entrada', '08:00:00');
            addUpdate('horario_saida', '17:00:00');
            addUpdate('inicio_intervalo', '12:00:00');
            addUpdate('fim_intervalo', '13:00:00');

            const query = `UPDATE funcionarios SET ${updates.join(', ')} WHERE id = $${i}`;
            values.push(row.id);
            await client.query(query, values);
        }
        console.log("Employees atualizados!");

    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
fillData();
