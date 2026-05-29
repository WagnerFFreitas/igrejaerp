const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function run() {
    await client.connect();
    try {
        const res = await client.query('SELECT * FROM membros');
        for (const member of res.rows) {
            const memberId = member.id;
            const profileData = member.dados_perfil || {};

            const dependentes = [
                { id: 'dep1', nome: 'Lucas ' + member.nome.split(' ')[0], parentesco: 'FILHO', dataNascimento: '2015-05-10' },
                { id: 'dep2', nome: 'Mariana ' + member.nome.split(' ')[0], parentesco: 'FILHO', dataNascimento: '2018-08-22' }
            ];
            
            const contribuicoes = [];
            const date = new Date();
            for (let i = 0; i < 4; i++) {
                const mDate = new Date(date.getFullYear(), date.getMonth() - i, 15);
                contribuicoes.push({
                    id: 'tithe-' + i + '-' + memberId.substring(0,5),
                    valor: 250.00,
                    data: mDate.toISOString().split('T')[0],
                    tipo: 'Dizimo',
                    descricao: 'Dízimo: ' + member.nome
                });
            }

            const updatedProfile = {
                ...profileData,
                dependentes,
                contribuicoes,
                vinculoFamiliarId: 'FAM-' + memberId.substring(0,4)
            };

            await client.query(`
                UPDATE membros 
                SET 
                    escolaridade = COALESCE(NULLIF(escolaridade, ''), 'Ensino Superior Completo'),
                    data_conversao = COALESCE(NULLIF(data_conversao::text, ''), '2010-03-15')::date,
                    local_conversao = COALESCE(NULLIF(local_conversao, ''), 'Acampamento Jovem'),
                    igreja_origem = COALESCE(NULLIF(igreja_origem, ''), 'Igreja Sede (Templo Central)'),
                    data_batismo = COALESCE(NULLIF(data_batismo::text, ''), '2011-01-20')::date,
                    data_consagracao = COALESCE(NULLIF(data_consagracao::text, ''), '2015-11-10')::date,
                    outros_ministerios = COALESCE(outros_ministerios, ARRAY['Comunicação', 'Missões']),
                    data_membro = COALESCE(NULLIF(data_membro::text, ''), '2018-02-05')::date,
                    dons_espirituais = COALESCE(NULLIF(dons_espirituais, ''), 'Ensino, Sabedoria, Liderança'),
                    nome_pai = COALESCE(NULLIF(nome_pai, ''), 'João Silva'),
                    nome_mae = COALESCE(NULLIF(nome_mae, ''), 'Maria Silva'),
                    telefone = COALESCE(NULLIF(telefone, ''), '(11) 3333-4444'),
                    celular = COALESCE(NULLIF(celular, ''), '(11) 99999-8888'),
                    whatsapp = COALESCE(NULLIF(whatsapp, ''), '(11) 99999-8888'),
                    dados_perfil = $1
                WHERE id = $2
            `, [JSON.stringify(updatedProfile), memberId]);
            console.log('Atualizado: ' + member.nome);
        }
    } catch (err) {
        console.error('DB ERROR:', err.message);
    } finally {
        client.end();
    }
}
run();
