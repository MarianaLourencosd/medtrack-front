export const formatarCPF = (value) => {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d+)/, "$1.$2");
  if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
};

export const formatarTelefone = (value) => {
  const telefone = value.replace(/\D/g, "");
  if (telefone.length <= 2) return telefone;
  if (telefone.length <= 6) return telefone.replace(/(\d{2})(\d+)/, "($1) $2");
  if (telefone.length <= 10) return telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return telefone.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
};

export const formatarAltura = (value) => {
  let altura = value.replace(/[^\d]/g, "");
  if (altura.length === 0) return "";
  if (altura.length === 1) return altura;
  if (altura.length === 2) return `${altura.charAt(0)}.${altura.charAt(1)}`;
  return `${altura.substring(0, altura.length - 2)}.${altura.substring(altura.length - 2)}`;
};


export const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  return digit === parseInt(cpf.charAt(10));
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarSenha = (senha) => {
  return senha && senha.length >= 6;
};

export const validarSenhaForte = (senha) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(senha);
};

export const validarTelefone = (telefone) => {
  const telefoneLimpo = telefone.replace(/\D/g, "");
  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
};

export const validarAltura = (altura) => {
  const alturaStr = altura.toString().replace(",", ".");
  const alturaNum = parseFloat(alturaStr);
  return !isNaN(alturaNum) && alturaNum >= 0.5 && alturaNum <= 2.5;
};

export const validarPeso = (peso) => {
  const pesoStr = peso.toString().replace(",", ".");
  const pesoNum = parseFloat(pesoStr);
  return !isNaN(pesoNum) && pesoNum >= 2 && pesoNum <= 300;
};

export const validarDataNascimento = (data) => {
  if (!data) return false;
  const dataNasc = new Date(data);
  const hoje = new Date();
  const ano1900 = new Date(1900, 0, 1);
  return dataNasc >= ano1900 && dataNasc <= hoje;
};

export const validarSUS = (sus) => {
  const susLimpo = sus.replace(/\D/g, "");
  return susLimpo.length >= 10;
};

export const validarLogin = (email, senha) => {
  const errors = {};
  
  if (!email || !email.trim()) {
    errors.email = "E-mail é obrigatório";
  } else if (!validarEmail(email)) {
    errors.email = "Digite um e-mail válido (ex: usuario@email.com)";
  }
  
  if (!senha) {
    errors.senha = "Senha é obrigatória";
  } else if (!validarSenha(senha)) {
    errors.senha = "A senha deve ter no mínimo 6 caracteres";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validarCadastro = (dados) => {
  const errors = {};
  
  if (!dados.nome || !dados.nome.trim()) {
    errors.nome = "Nome completo é obrigatório";
  } else if (dados.nome.trim().length < 3) {
    errors.nome = "Digite um nome válido (mínimo 3 caracteres)";
  }
  
  if (!dados.cpf) {
    errors.cpf = "CPF é obrigatório";
  } else if (!validarCPF(dados.cpf)) {
    errors.cpf = "CPF inválido";
  }
  
  if (!dados.email || !dados.email.trim()) {
    errors.email = "E-mail é obrigatório";
  } else if (!validarEmail(dados.email)) {
    errors.email = "Digite um e-mail válido (ex: usuario@email.com)";
  }
  

  if (!dados.confirmarEmail || !dados.confirmarEmail.trim()) {
    errors.confirmarEmail = "Confirmação de e-mail é obrigatória";
  } else if (dados.email !== dados.confirmarEmail) {
    errors.confirmarEmail = "Os e-mails não conferem";
  }
  
  if (!dados.senha) {
    errors.senha = "Senha é obrigatória";
  } else if (!validarSenhaForte(dados.senha)) {
    errors.senha = "A senha deve ter no mínimo 6 caracteres, com letras e números";
  }
  
  if (!dados.confirmarSenha) {
    errors.confirmarSenha = "Confirmação de senha é obrigatória";
  } else if (dados.senha !== dados.confirmarSenha) {
    errors.confirmarSenha = "As senhas não conferem";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validarFormulario = (dados) => {
  const errors = {};
  

  if (!dados.nome || !dados.nome.trim()) {
    errors.nome = "Nome completo é obrigatório";
  } else if (dados.nome.trim().length < 3) {
    errors.nome = "Digite um nome válido (mínimo 3 caracteres)";
  }
  
  if (!dados.cpf) {
    errors.cpf = "CPF é obrigatório";
  } else if (!validarCPF(dados.cpf)) {
    errors.cpf = "CPF inválido";
  }
  
  if (!dados.dataNascimento) {
    errors.dataNascimento = "Data de nascimento é obrigatória";
  } else if (!validarDataNascimento(dados.dataNascimento)) {
    errors.dataNascimento = "Data de nascimento inválida";
  }
  
  if (!dados.sexo) {
    errors.sexo = "Sexo é obrigatório";
  }
  
  if (!dados.altura) {
    errors.altura = "Altura é obrigatória";
  } else if (!validarAltura(dados.altura)) {
    errors.altura = "Digite uma altura válida (ex: 1.75)";
  }
  
  if (!dados.peso) {
    errors.peso = "Peso é obrigatório";
  } else if (!validarPeso(dados.peso)) {
    errors.peso = "Digite um peso válido (ex: 70)";
  }
  
  if (!dados.tipoSanguineo) {
    errors.tipoSanguineo = "Tipo sanguíneo é obrigatório";
  }
  
  if (!dados.sus) {
    errors.sus = "Cartão SUS é obrigatório";
  } else if (!validarSUS(dados.sus)) {
    errors.sus = "Número do SUS inválido (mínimo 10 dígitos)";
  }
  
  if (!dados.nomeContato || !dados.nomeContato.trim()) {
    errors.nomeContato = "Nome do contato é obrigatório";
  }
  
  if (!dados.telefoneContato) {
    errors.telefoneContato = "Telefone é obrigatório";
  } else if (!validarTelefone(dados.telefoneContato)) {
    errors.telefoneContato = "Telefone inválido (ex: (11) 99999-9999)";
  }
  
  if (!dados.relacionamento || !dados.relacionamento.trim()) {
    errors.relacionamento = "Relacionamento é obrigatório";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const mensagemSucessoLogin = () => {
  return "✓ Login realizado com sucesso! Redirecionando...";
};

export const mensagemSucessoCadastro = () => {
  return "✓ Cadastro realizado com sucesso! Redirecionando para o login...";
};

export const mensagemSucessoFormulario = () => {
  return "✓ Formulário enviado com sucesso!";
};

export const mensagemErroLogin = () => {
  return "✗ E-mail ou senha inválidos. Tente novamente.";
};

export const mensagemErroCadastro = () => {
  return "✗ Preencha todos os campos corretamente antes de cadastrar.";
};

export const mensagemErroFormulario = () => {
  return "✗ Preencha todos os campos obrigatórios corretamente.";
};


export const validarCampoEmTempoReal = (campo, valor, todosDados = {}) => {
  switch (campo) {
    case "nome":
      if (!valor || !valor.trim()) return "Nome é obrigatório";
      if (valor.trim().length < 3) return "Nome deve ter no mínimo 3 caracteres";
      return null;
      
    case "cpf":
      if (!valor) return "CPF é obrigatório";
      if (!validarCPF(valor)) return "CPF inválido";
      return null;
      
    case "email":
      if (!valor || !valor.trim()) return "E-mail é obrigatório";
      if (!validarEmail(valor)) return "E-mail inválido";
      return null;
      
    case "confirmarEmail":
      if (!valor || !valor.trim()) return "Confirmação de e-mail é obrigatória";
      if (valor !== todosDados.email) return "Os e-mails não conferem";
      return null;
      
    case "senha":
      if (!valor) return "Senha é obrigatória";
      if (!validarSenhaForte(valor)) return "Senha deve ter mínimo 6 caracteres, com letras e números";
      return null;
      
    case "confirmarSenha":
      if (!valor) return "Confirmação de senha é obrigatória";
      if (valor !== todosDados.senha) return "As senhas não conferem";
      return null;
      
    case "telefoneContato":
      if (!valor) return "Telefone é obrigatório";
      if (!validarTelefone(valor)) return "Telefone inválido";
      return null;
      
    case "altura":
      if (!valor) return "Altura é obrigatória";
      if (!validarAltura(valor)) return "Altura inválida (ex: 1.75)";
      return null;
      
    case "peso":
      if (!valor) return "Peso é obrigatório";
      if (!validarPeso(valor)) return "Peso inválido (ex: 70)";
      return null;
      
    default:
      return null;
  }
};

const validacoes = {

  formatarCPF,
  formatarTelefone,
  formatarAltura,
  
  validarCPF,
  validarEmail,
  validarSenha,
  validarSenhaForte,
  validarTelefone,
  validarAltura,
  validarPeso,
  validarDataNascimento,
  validarSUS,
  
  validarLogin,
  validarCadastro,
  validarFormulario,
  
  mensagemSucessoLogin,
  mensagemSucessoCadastro,
  mensagemSucessoFormulario,
  mensagemErroLogin,
  mensagemErroCadastro,
  mensagemErroFormulario,
  
  validarCampoEmTempoReal
};

export default validacoes;