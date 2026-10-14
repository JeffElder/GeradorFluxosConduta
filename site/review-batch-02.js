'use strict';
(()=>{
 const all=window.PROTOCOLS||{};
 const onc=all['adulto-atendimento-de-urgencia-ao-paciente-oncologico-ou-com-suspeita-oncologica'];
 if(onc){
  const n=onc.nodes;
  n.p1n4.criteria='Rebaixamento do nível de consciência; frequência respiratória >30 irpm; enchimento capilar >3 segundos; taquicardia; SatO2 <90% (88% para DPOC).';
  n.p1n28.text='Após cadastrar na CLM, o paciente é clínico ou cirúrgico?';n.p1n28.question=true;
  n.p1n36.text='REALIZAR CONTATO COM NIR EM RODÍZIO: CACON Hospital Erasto Gaertner; UNACON Santa Casa; UNACON Hospital de Clínicas; UNACON Hospital Evangélico.';
 }
 const hiv=all['adulto-avaliacao-do-paciente-com-hiv-na-upa'];
 if(hiv){
  const n=hiv.nodes;
  n.p1n5.choices=[{label:'Resultado reagente — prosseguir com notificação',to:'p1n29'},{label:'Resultado não reagente, indeterminado ou não disponível',to:'review-hiv-outside'}];
  n['review-hiv-outside']={id:'review-hiv-outside',page:1,text:'O resultado não atende à condição “se resultado reagente” para seguir este fluxo. O documento não define investigação ou conduta para resultado não reagente, indeterminado ou pendente. Não notificar como caso de HIV nem iniciar TARV a partir deste caminho; definir investigação na avaliação clínica.',question:false,choices:[],contextNodes:[],incomplete:false};
  n.p1n5.text='Solicitar sorologia para HIV. Qual é o resultado?';n.p1n5.question=true;
  n.p1n23.text='Qual foi o motivo do abandono da TARV?';n.p1n23.question=true;
  n.p1n23.choices=[{label:'Efeito colateral',to:'p1n25'},{label:'Outros motivos: depressão, negação, dificuldade de sigilo etc.',to:'p1n26'}];
  n.p1n29.text='Notificar caso de HIV e encaminhar a ficha de notificação ao distrito sanitário de abrangência.';
  n.p1n14.text='Preencher formulário de antirretroviral e receituário simples com o esquema medicamentoso. Orientar paciente/familiar a retirar na unidade de dispensação de referência. Esquema inicial preferencial registrado: tenofovir 300 mg/lamivudina 300 mg “2 em 1” + dolutegravir 50 mg: 1 comprimido de cada, juntos, uma vez ao dia.\nUNIDADES DE DISPENSAÇÃO (dados da edição municipal de 2024): CEM Vila Hauer, 3217-1283, segunda a sexta 7–19 h; CEM Salgado Filho, 3217-1224, segunda a sexta 7–19 h; COA, 3321-2781, segunda a sexta 7–18 h; Centro de Especialidades Santa Felicidade, 3370-1572 / 3370-1575, segunda a sexta 7–18 h.';
  n.p1n10.text+='\nPendência específica: o prazo mínimo de 15 dias aparece como regra geral, sem distinguir a infecção oportunista. Validar o momento de início conforme a intercorrência; não foi inferido prazo substituto. O ramo de paciente já em TARV orienta manter o esquema, não suspendê-lo por esse prazo.';
 }
 const tb=all['adulto-avaliacao-do-paciente-com-hiv-e-tuberculose-na-upa'];
 if(tb){
  const n=tb.nodes;
  n['tb-hiv-cd4'].text='Qual condição clínica/laboratorial corresponde à tabela de início da TARV?';
  n['tb-hiv-cd4'].criteria='A tabela escreve “sinais de imunodeficiência avançada OU CD4 <50” para 2 semanas e “ausência de sinais OU CD4 ≥50” para a 8ª semana. Quando clínica e CD4 discordam, ambas as linhas podem ser satisfeitas. A fonte não estabelece precedência: não escolher prazo automaticamente.';
  n['tb-hiv-cd4'].choices=[{label:'Somente condição para início em 2 semanas',to:'tb-hiv-early'},{label:'Somente condição para início na 8ª semana',to:'tb-hiv-later'},{label:'Condições sobrepostas, desconhecidas ou indeterminadas',to:'tb-hiv-review'}];
  n['tb-hiv-review'].text='Pendente de definição do momento de TARV: condições clínicas/laboratoriais sobrepostas ou dados insuficientes. Solicitar definição à APS/serviço especializado; não atribuir automaticamente 2 ou 8 semanas.';
  for(const key of ['tb-hiv-early','tb-hiv-later'])n[key].text+=' Preencher receituário simples com o esquema e formulário de antirretroviral.';
  const table='ESQUEMA BÁSICO PARA TUBERCULOSE PULMONAR EM ADULTOS E ADOLESCENTES ≥10 ANOS. Pesar antes da dispensação e repetir pesagem em 15 dias. R=rifampicina; H=isoniazida; Z=pirazinamida; E=etambutol.\nFASE INTENSIVA, 2 MESES — RHZE 150/75/400/275 mg por comprimido: 20–35 kg, 2 comprimidos; 36–50 kg, 3; 51–70 kg, 4; acima de 70 kg, 5.\nMANUTENÇÃO, 4 MESES — RH: 20–35 kg, 1 comprimido 300/150 mg OU 2 de 150/75 mg; 36–50 kg, 1 de 300/150 mg + 1 de 150/75 mg OU 3 de 150/75 mg; 51–70 kg, 2 de 300/150 mg OU 4 de 150/75 mg; acima de 70 kg, 2 de 300/150 mg + 1 de 150/75 mg OU 5 de 150/75 mg.\nA tabela não define esquema para idade <10 anos, peso <20 kg ou arredondamento de peso entre faixas inteiras. Não extrapolar doses.';
  for(const key of ['tb-hiv-abandoned','tb-hiv-new'])n[key].text+='\n\n'+table;
  const guidance='Tomar todos os comprimidos RHZE no mesmo horário; podem ser ingeridos um de cada vez. Preferir jejum ao acordar, aguardando 1 hora para alimentação. Se houver dificuldade, alimentar-se e aguardar 2 horas para tomar. A orientação municipal descreve redução do risco de transmissão após o 15º dia; neste período, evitar contato principalmente com crianças e pessoas com outras doenças, manter máscara cirúrgica dentro de casa e ambientes ventilados/iluminados pelo sol. Reforçar tomada regular. Pesar antes da dispensação e novamente em 15 dias para ajustar a dose.';
  for(const key of ['tb-hiv-street','tb-hiv-aps'])n[key].text+='\n\n'+guidance;
  // As orientações da página 2 complementam os três ramos, sem inventar
  // reinício de RHZE para quem já está em acompanhamento.
  n['tb-hiv-discharge'].criteria=table;
 }
})();
