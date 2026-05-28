const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function run() {
    await client.connect();
    try {
        console.log("Localizando um membro para preencher...");
        const res = await client.query("SELECT * FROM membros LIMIT 1");
        if (res.rows.length === 0) {
            console.log("Nenhum membro encontrado.");
            return;
        }
        const member = res.rows[0];
        const memberId = member.id;
        const profileData = member.dados_perfil || {};

        // Adicionando Dependentes e Vínculo
        const dependentes = [
            { id: "dep1", nome: "Lucas Mendes Junior", parentesco: "FILHO", dataNascimento: "2015-05-10" },
            { id: "dep2", nome: "Mariana Mendes", parentesco: "FILHO", dataNascimento: "2018-08-22" }
        ];
        
        // Adicionando 4 meses de dízimos
        const contribuicoes = [];
        const date = new Date();
        for (let i = 0; i < 4; i++) {
            const mDate = new Date(date.getFullYear(), date.getMonth() - i, 15);
            contribuicoes.push({
                id: `tithe-${i}`,
                valor: 250.00,
                data: mDate.toISOString().split('T')[0],
                tipo: 'Dizimo',
                descricao: `Dízimo: ${member.nome}`
            });
        }

        // Criando JSON B aprimorado
        const updatedProfile = {
            ...profileData,
            dependentes,
            contribuicoes,
            vinculoFamiliarId: "FAM-1029"
        };

        // Atualizando banco de dados com os campos solicitados
        const updateQuery = `
            UPDATE membros 
            SET 
                escolaridade = 'Ensino Superior Completo',
                data_conversao = '2010-03-15',
                local_conversao = 'Acampamento Jovem',
                igreja_origem = 'Igreja Sede (Templo Central)',
                data_batismo = '2011-01-20',
                data_consagracao = '2015-11-10',
                outros_ministerios = ARRAY['Comunicação', 'Missões'],
                data_membro = '2018-02-05',
                dons_espirituais = 'Ensino, Sabedoria, Liderança',
                dados_perfil = $1
            WHERE id = $2
            RETURNING *
        `;

        await client.query(updateQuery, [JSON.stringify(updatedProfile), memberId]);

        console.log(`Membro ${member.nome} atualizado com sucesso com todos os dados solicitados!`);

    } catch (err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
run();
