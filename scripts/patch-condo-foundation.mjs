import fs from 'node:fs';

const file='src/main.jsx';
let source=fs.readFileSync(file,'utf8');

if(!source.includes("import'./condo-brand.css';")){
  source=source.replace("import'./app.css';","import'./app.css';\nimport'./condo-brand.css';");
}

const sideOld='<div className="side-brand"><img src="/pem-condominios-logo.jpg" alt="PEM Condomínios"/><div><strong>PEM</strong><span>Condomínios</span></div>';
const sideNew='<div className="side-brand"><div className="pem-mark" aria-label="PEM Condomínios"><Building2 size={28}/></div><div><strong>PEM Condomínios</strong><span>Professional Event Management</span></div>';
if(source.includes(sideOld)) source=source.replace(sideOld,sideNew);

const loginBrand='<section className="brand"><img className="brand-logo" src="/pem-condominios-logo.jpg" alt="PEM Condomínios - Gestão Condominial Inteligente"/></section>';
const brandPanel='<section className="brand"><div className="brand-panel"><div className="brand-panel-mark"><Building2 size={54}/></div><div><span>PROFESSIONAL EVENT MANAGEMENT</span><strong>PEM Condomínios</strong><small>Gestão condominial inteligente</small></div></div></section>';
source=source.split(loginBrand).join(brandPanel);

source=source.replaceAll('ADMINISTRAÇÃO CONDOMINIAL','GESTÃO CONDOMINIAL');
source=source.replaceAll('PEM Condomínios · Gestão Condominial Inteligente','PEM Condomínios · Professional Event Management');
source=source.replace('Cadastre o condomínio, organize unidades e moradores e mantenha reservas, cobranças, ocorrências e comunicação no mesmo lugar.','Administre empresas, condomínios, unidades e moradores com financeiro, cobranças, reservas, documentos, ocorrências e comunicação integrados.');
source=source.replace('Bem-vindo ao PEM Condomínios','Controle completo da operação condominial');

fs.writeFileSync(file,source);
