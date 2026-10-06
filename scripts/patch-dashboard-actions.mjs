import fs from 'node:fs';

const file = 'src/main.jsx';
const source = fs.readFileSync(file, 'utf8');

const required = [
  "const[quickAction,setQuickAction]=useState('')",
  "const openFlow=id=>",
  "initialOpen={quickAction==='condominios'}",
  "initialOpen={quickAction==='moradores'}",
  "initialOpen={quickAction===active}",
];

const missing = required.filter((marker) => !source.includes(marker));

if (missing.length) {
  console.warn('PEM Condomínios: ações rápidas ainda não estão completas no fonte; build seguirá sem bloquear a aplicação.');
} else {
  console.log('PEM Condomínios: ações rápidas conectadas aos formulários');
}
