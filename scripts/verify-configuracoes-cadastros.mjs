import fs from 'node:fs';
const source=fs.readFileSync('src/main.jsx','utf8');
const required=["id:'configuracoes'","id:'cadastros'","function ConfiguracoesPage","function CadastrosPage","from('condominios').update","from('prestadores_servicos').insert","Fornecedores","Manutenção"];
const missing=required.filter(marker=>!source.includes(marker));
if(missing.length){console.error('PEM Condomínios: faltam marcadores de Configurações/Cadastros:',missing.join(', '));process.exit(1)}
console.log('PEM Condomínios: Configurações e Cadastros verificados');
