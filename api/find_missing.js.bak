const dbCols = new Set(["id","id_unidade","nome","cpf","rg","email","telefone","whatsapp","data_nascimento","sexo","estado_civil","logradouro","bairro","cidade","estado","cep","data_conversao","data_batismo","data_membro","status","funcao","ministerio","grupo_pequeno","dizimista","ofertante","valor_dizimo","observacoes","criado","atualizado","dados_perfil","matricula","profissao","nome_conjuge","data_casamento","nome_pai","nome_mae","tipo_sanguineo","contato_emergencia","numero","complemento","local_conversao","igreja_batismo","pastor_batizador","batismo_espirito_santo","igreja_origem","curso_discipulado","escola_biblica","ministerio_principal","funcao_ministerio","outros_ministerios","cargo_eclesiastico","data_consagracao","ofertante_regular","participa_campanhas","banco","agencia_bancaria","conta_bancaria","chave_pix","necessidades_especiais","talentos","tags","familia_id","avatar","cell_group","dons_espirituais","escolaridade","is_pcd","tipo_deficiencia","celular","lgpd_consent"]);

const allowed = new Set([
  'id', 'id_unidade', 'matricula', 'nome', 'cpf', 'rg', 'email', 'telefone', 'whatsapp',
  'profissao', 'funcao', 'status', 'data_nascimento', 'sexo', 'estado_civil', 'nome_conjuge', 'data_casamento',
  'nome_pai', 'nome_mae', 'tipo_sanguineo', 'contato_emergencia', 'cep', 'logradouro',
  'numero', 'complemento', 'bairro', 'cidade', 'estado', 'data_conversao', 'local_conversao',
  'data_batismo', 'igreja_batismo', 'pastor_batizador', 'batismo_espirito_santo', 'data_membro',
  'igreja_origem', 'curso_discipulado', 'escola_biblica', 'ministerio_principal', 'funcao_ministerio',
  'outros_ministerios', 'cargo_eclesiastico', 'data_consagracao', 'dizimista', 'ofertante_regular',
  'participa_campanhas', 'banco', 'agencia_bancaria', 'conta_bancaria', 'chave_pix', 'observacoes',
  'necessidades_especiais', 'talentos', 'tags', 'familia_id', 'avatar', 'dados_perfil', 'celula', 'cell_group',
  'dons_espirituais', 'escolaridade', 'is_pcd', 'tipo_deficiencia', 'celular', 'lgpd_consent'
]);

for (const field of allowed) {
    if (!dbCols.has(field)) {
        console.log("Missing in DB:", field);
    }
}
