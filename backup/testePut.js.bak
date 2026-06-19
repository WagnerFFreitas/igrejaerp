const axios = require('axios');
(async () => {
    try {
        const res = await axios.put('http://localhost:3000/api/members/4a52de60-a2c2-4293-b369-b133ef40fb64', {
            nome: 'Teste',
            cpf: '12345678901',
            email: 'teste@teste.com'
        });
        console.log("Success:", res.data);
    } catch(err) {
        console.error("Error status:", err.response?.status);
        console.error("Error data:", err.response?.data);
    }
})();
