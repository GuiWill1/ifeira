class Usuario{
    constructor(uid, nome,email,senha,telefone1,telefone2) {
      this.uid = uid;
      this.nome = nome;
      this.email = email;
      this.senha = senha;
      this.telefone1 = telefone1;
      this.telefone2 = telefone2;
    }
    getName() {
      return this.nome + ' ' + this.email;
    }
  }