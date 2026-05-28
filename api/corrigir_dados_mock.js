const { Client } = require('pg');

const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

const fakeNames = ["Carlos Silva", "Ana Souza", "Fernanda Lima", "João Costa", "Maria Oliveira", "Roberto Carlos", "Juliana Martins", "Lucas Mendes"];
const fakeBanks = ["Itaú", "Bradesco", "Caixa", "Santander", "Nubank", "Banco do Brasil"];
const fakeCities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"];
const fakeProfessions = ["Professor", "Engenheiro", "Médico", "Autônomo", "Empresário", "Estudante", "Advogado", "Comerciante"];
const fakeMinistries = ["Louvor", "Infantil", "Recepção", "Ação Social", "Jovens", "Casais"];
const fakeRoles = ["Membro", "Diácono", "Presbítero", "Evangelista", "Pastor"];
const fakeBlood = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-'];

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomPhone() { return `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`; }
function randomCep() { return `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(100 + Math.random() * 900)}`; }
function randomCPF() { return `${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`; }
function randomRG() { return `${Math.floor(10 + Math.random() * 90)}.${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}-X`; }

function isInvalid(val) {
    if (val === null || val === undefined) return true;
    if (typeof val === 'string') {
        const lower = val.trim().toLowerCase();
        if (lower === '' || lower.includes('teste')) return true;
    }
    return false;
}

async function fixData() {
    await client.connect();
    try {
        console.log("Analisando Membros para corrigir dados vazios ou 'teste'...");
        const membros = await client.query('SELECT * FROM membros');
        
        let count = 0;
        for (let row of membros.rows) {
            const updates = [];
            const values = [];
            let i = 1;

            const checkAndUpdate = (col, fakeValue) => {
                if (isInvalid(row[col])) {
                    updates.push(`${col} = $${i++}`);
                    values.push(fakeValue);
                }
            };

            // Dados Pessoais
            checkAndUpdate('nome', randomChoice(fakeNames));
            checkAndUpdate('cpf', randomCPF());
            checkAndUpdate('rg', randomRG());
            checkAndUpdate('email', `${randomChoice(fakeNames).split(' ')[0].toLowerCase()}${Math.floor(Math.random()*100)}@email.com`);
            checkAndUpdate('telefone', randomPhone());
            checkAndUpdate('whatsapp', randomPhone());
            checkAndUpdate('celular', randomPhone());
            checkAndUpdate('profissao', randomChoice(fakeProfessions));
            checkAndUpdate('nome_pai', randomChoice(fakeNames));
            checkAndUpdate('nome_mae', randomChoice(fakeNames));
            checkAndUpdate('tipo_sanguineo', randomChoice(fakeBlood));
            checkAndUpdate('contato_emergencia', randomPhone());
            checkAndUpdate('escolaridade', randomChoice(['Ensino Médio', 'Superior Completo', 'Pós-graduação', 'Ensino Fundamental']));
            
            // Endereço
            checkAndUpdate('cep', randomCep());
            checkAndUpdate('logradouro', `Rua ${randomChoice(fakeNames)}`);
            checkAndUpdate('numero', `${Math.floor(1 + Math.random() * 1000)}`);
            checkAndUpdate('bairro', 'Centro');
            checkAndUpdate('cidade', randomChoice(fakeCities));
            checkAndUpdate('estado', 'SP');

            // Igreja
            checkAndUpdate('local_conversao', 'Igreja Sede');
            checkAndUpdate('igreja_batismo', 'Igreja Sede');
            checkAndUpdate('pastor_batizador', 'Pr. Silas');
            checkAndUpdate('igreja_origem', 'Assembleia de Deus');
            checkAndUpdate('ministerio_principal', randomChoice(fakeMinistries));
            checkAndUpdate('funcao_ministerio', 'Líder');
            checkAndUpdate('cargo_eclesiastico', randomChoice(fakeRoles));
            checkAndUpdate('curso_discipulado', 'CONCLUIDO');
            checkAndUpdate('escola_biblica', 'FREQUENTA');
            checkAndUpdate('batismo_espirito_santo', 'SIM');

            // Financeiro
            checkAndUpdate('banco', randomChoice(fakeBanks));
            checkAndUpdate('agencia_bancaria', `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(Math.random() * 9)}`);
            checkAndUpdate('conta_bancaria', `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(Math.random() * 9)}`);
            checkAndUpdate('chave_pix', randomPhone());
            
            // Outros
            checkAndUpdate('observacoes', 'Membro muito ativo na comunidade.');
            checkAndUpdate('talentos', 'Música, Administração');
            checkAndUpdate('dons_espirituais', 'Ensino, Exortação');

            if (updates.length > 0) {
                const query = `UPDATE membros SET ${updates.join(', ')} WHERE id = $${i}`;
                values.push(row.id);
                await client.query(query, values);
                count++;
            }
        }
        console.log(`Corrigidos ${count} membros com dados vazios ou 'teste'.`);

    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
fixData();
