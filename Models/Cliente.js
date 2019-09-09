

class Cliente extends Usuario{  
 
    constructor(uid, nome, sobrenome, email, senha, dataNascimento,telefone1,telefone2 ){
        this.uid = uid;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
        this.telefone1 = telefone1;
        this.telefone2 = telefone2;

    }
}