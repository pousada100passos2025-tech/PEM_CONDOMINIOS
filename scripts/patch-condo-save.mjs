import fs from 'node:fs';

const file='src/main.jsx';
let source=fs.readFileSync(file,'utf8');

const oldSnippet=`const payload={empresa_id:empresaId,nome:form.nome.trim(),cnpj:form.cnpj||null,tipo:form.tipo,email:form.email||null,telefone:form.telefone||null,cep:form.cep||null,logradouro:form.logradouro||null,numero:form.numero||null,bairro:form.bairro||null,cidade:form.cidade.trim(),estado:form.estado.trim().toUpperCase(),quantidade_unidades:Number(form.quantidade_unidades||0),observacoes:form.observacoes||null};\n      const{data:condo,error}=await supabase.from('condominios').insert(payload).select().single();\n      if(error)throw error;`;

const newSnippet=`const condoId=crypto.randomUUID();\n      const payload={id:condoId,empresa_id:empresaId,nome:form.nome.trim(),cnpj:form.cnpj||null,tipo:form.tipo,email:form.email||null,telefone:form.telefone||null,cep:form.cep||null,logradouro:form.logradouro||null,numero:form.numero||null,bairro:form.bairro||null,cidade:form.cidade.trim(),estado:form.estado.trim().toUpperCase(),quantidade_unidades:Number(form.quantidade_unidades||0),observacoes:form.observacoes||null};\n      const{error}=await supabase.from('condominios').insert(payload);\n      if(error)throw error;\n      const condo={id:condoId};`;

if(!source.includes(oldSnippet)){
  throw new Error('Fluxo esperado de cadastro de condomínio não encontrado.');
}

source=source.replace(oldSnippet,newSnippet);
fs.writeFileSync(file,source);
