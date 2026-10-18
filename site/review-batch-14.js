'use strict';
(()=>{
const P=window.PROTOCOLS||{},put=(p,id,text,choices=[],question=false,page=1,criteria='')=>p.nodes[id]={id,text,choices:choices.map(([label,to])=>({label,to})),question,page,criteria,contextNodes:[],incomplete:false};
const q=(p,id,text,choices,criteria='',page=1)=>put(p,id,text,choices,true,page,criteria),a=(p,id,text,to,page=1)=>put(p,id,text,[['Continuar',to]],false,page),t=(p,id,text,page=1)=>put(p,id,text,[],false,page);
const note=(p,id,text,page=1)=>{p.nodes[id].warnings=[...(p.nodes[id].warnings||[]),{title:'Ponto documental para validação clínica',text,page}];};
{
 const p=P['adulto-pneumonia-no-adulto'];if(p){const n=p.nodes;
 n.p1n5.criteria=n.p1n4.text+'\n'+n.p1n6.text;n.p1n10.criteria=n.p1n9.text;
 n.p1n12.criteria=n.p1n9.text+'\n'+n.p1n13.text;n.p1n17.criteria=n.p1n13.text;
 const tools=window.SCORE_CALCULATORS;if(tools){const f=(key,label)=>({key,label,options:[{label:'Não',points:0},{label:'Sim',points:1}]});tools.definitions.crb={title:'CRB-65 — critérios municipais',protocol:'adulto-pneumonia-no-adulto',nodes:['p1n10','p1n12'],fields:[f('confusion','Confusão mental?'),f('resp','FR >30 irpm?'),f('pressure','PAS <90 mmHg OU PAD <60 mmHg?'),f('age','Idade ≥65 anos?'),{key:'additional',label:'Há ≥1 critério adicional (SO₂ <90% em ar ambiente; 88% em DPOC; ou comorbidade descompensada da lista)?',onlyNodes:['p1n12'],options:[{label:'Não',points:0},{label:'Sim',points:0}]}],source:'SMS Curitiba, Pneumonia, v.3, 25/06/2024, p.1; NICE NG250 confirma 1 ponto por componente.',note:'Soma dos quatro componentes (0–4). Critério adicional não soma ponto; participa da segunda pergunta. O PDF usa FR >30 e PAD <60; NICE usa FR ≥30 e PAD ≤60. Preservados os limites municipais, com divergência registrada, sem substituir os encaminhamentos.'};}
 q(p,'p1n31','Há comorbidades e/ou uso de antibiótico nos últimos três meses?',[['Sim','cap-home-risk'],['Não','cap-home-low']]);
 q(p,'cap-home-low','Qual alternativa domiciliar será prescrita, sem comorbidades e sem antibiótico recente?',[['1ª opção: amoxicilina','cap-amox'],['2ª opção: azitromicina se alergia à amoxicilina','cap-azithro'],['3ª opção: levofloxacino','cap-levo-low']],'Alternativas municipais; a seleção depende da avaliação e prescrição. Não são medicamentos para associação automática.');
 q(p,'cap-home-risk','Qual alternativa domiciliar será prescrita, com comorbidades e/ou antibiótico recente?',[['1ª opção: amoxicilina + azitromicina','cap-amox-azithro'],['2ª opção: levofloxacino','cap-levo-risk'],['3ª opção: ceftriaxona + azitromicina','cap-cef-azithro']]);
 t(p,'cap-amox','Tratamento domiciliar: amoxicilina 500 mg de 8/8 h por 5–7 dias.');
 t(p,'cap-azithro','Tratamento domiciliar: azitromicina 500 mg, 1 comprimido ao dia por 5 dias, se alergia à amoxicilina. Preencher ficha.');
 for(const id of ['cap-levo-low','cap-levo-risk']){t(p,id,'Tratamento domiciliar: levofloxacino 500 mg por 5–7 dias; preencher ficha. A frequência não está especificada nesse quadro domiciliar e exige validação antes da prescrição.');}
 t(p,'cap-amox-azithro','Tratamento domiciliar: amoxicilina 500 mg de 8/8 h + azitromicina 500 mg, 1 comprimido ao dia, por 5–7 dias. Preencher ficha.');
 t(p,'cap-cef-azithro','Tratamento domiciliar: ceftriaxona 1 g, 2 ampolas IV, com frequência impressa como “1x ao” + azitromicina 500 mg, 1 comprimido VO/dia. Preencher ficha. Frequência truncada e duração não definidas; validar antes da prescrição.');
 a(p,'p1n20','Cadastrar paciente na CLM. O ramo municipal associa corticoterapia a uma das alternativas de antibiótico abaixo.','cap-steroid');
 q(p,'cap-steroid','Qual alternativa de corticoterapia será prescrita?',[['Metilprednisolona IV','cap-methyl'],['Prednisona','cap-pred']],'A fonte apresenta as duas alternativas com OU. A duração da metilprednisolona não é informada. A via da prednisona não está explicitada na tabela; validar a prescrição.');
 a(p,'cap-methyl','Metilprednisolona IV 0,5 mg/kg de 12/12 h. Duração ausente na fonte; validar.','cap-iv-antibiotic');
 a(p,'cap-pred','Prednisona 1 mg/kg/dia, máximo 60 mg/dia, por 7 dias. Via não explicitada na tabela; validar.','cap-iv-antibiotic');
 q(p,'cap-iv-antibiotic','Qual alternativa de antibiótico do ramo CLM será prescrita?',[['1ª: ceftriaxona + azitromicina','cap-iv-first'],['2ª: ceftriaxona + levofloxacino','cap-iv-second'],['3ª: clindamicina + levofloxacino','cap-iv-third']]);
 t(p,'cap-iv-first','CLM: ceftriaxona 2 g IV 1x/dia OU 100 mg/kg/dia + azitromicina 500 mg, 1 comprimido VO/dia, por 7–10 dias. Preencher ficha. A população e divisão da alternativa por peso não estão delimitadas; validar.');
 t(p,'cap-iv-second','CLM: ceftriaxona 2 g EV 1x/dia + levofloxacino 500 mg, 1 comprimido VO/dia, por 7–10 dias. Preencher ficha.');
 t(p,'cap-iv-third','CLM: clindamicina 600 mg de 6/6 h + levofloxacino 500 mg, 1 comprimido VO/dia, por 7–10 dias. Preencher ficha. A via da clindamicina não está explicitada; validar.');
 note(p,'p1n19','O diagrama manda classes PSI ≥III ao ramo CLM. A tabela da página 2 orienta reavaliações e alta se estável na classe III, discussão com SAD e CLM se piora; IV/V seguem CLM e V considera UTI. Divergência preservada em tela e pendente de validação, sem escolha clínica inventada.',2);
 note(p,'p1n10','FR >30 e PAD <60 são os comparadores municipais. O CRB-65 da NICE usa FR ≥30 e PAD ≤60. Validar especificamente os limites 30 irpm e 60 mmHg; o algoritmo municipal não foi substituído.');
 }}
{
const p=P['adulto-profilaxia-pos-exposicao-sexual-ao-hiv-consentida'];if(p){
q(p,'pep-scope','Qual é o contexto da exposição?',[['Exposição sexual consentida','pep-time'],['Violência sexual — referências da página 2','pep-violence'],['Acidente ocupacional com material biológico','pep-occupational']],'A UPA realiza atendimento inicial da exposição sexual consentida ao HIV. Outras condutas para prevenção/tratamento de IST são realizadas na UBS.');
q(p,'pep-time','O atendimento ocorre dentro de 72 horas após a exposição?',[['Sim','pep-test'],['Não','pep-late']]);
t(p,'pep-late','PEP não indicada por esse fluxograma após a janela descrita. Orientar e encaminhar a pessoa exposta à UBS para acompanhamento clínico e sorológico. Avaliar contracepção de emergência quando indicada.');
q(p,'pep-test','Realizar teste rápido de HIV. Qual o resultado?',[['Reagente','pep-positive'],['Não reagente','pep-interaction']]);
t(p,'pep-positive','PEP não indicada por esse fluxograma com teste reagente. Orientar e encaminhar a pessoa à UBS para acompanhamento clínico.');
q(p,'pep-interaction','A pessoa usa rifampicina, carbamazepina, fenitoína ou fenobarbital?',[['Sim','pep-double'],['Não','pep-standard']],'Iniciar PEP e orientar acompanhamento clínico/sorológico na UBS. A prescrição abaixo é a apresentada no fluxo de 02/2026 para exposição consentida.');
const prescription='Prescrever no E Saúde, em receita branca simples e formulário específico para PEP. Preencher formulário PEP. Duração: 28 dias. Orientar e encaminhar à UBS para acompanhamento clínico e sorológico.';
a(p,'pep-standard','Tenofovir/lamivudina 300/300 mg: 1 comprimido VO, 1x/dia + dolutegravir 50 mg: 1 comprimido VO, 1x/dia.\n'+prescription,'pep-contraception');
a(p,'pep-double','Tenofovir/lamivudina 300/300 mg: 1 comprimido VO ao dia + dolutegravir 50 mg: 1 comprimido VO de 12/12 h, por interação com um dos quatro fármacos listados. Registrar no campo 39 do formulário.\n'+prescription,'pep-contraception');
q(p,'pep-contraception','Após avaliação, há indicação de contracepção de emergência?',[['Sim','pep-levonorgestrel'],['Não','pep-followup']],'Avaliação concomitante ao atendimento; a fonte não define janela própria nem critérios de indicação. Não foi presumida indicação a partir do teste de HIV.');
q(p,'pep-levonorgestrel','Qual alternativa de levonorgestrel 0,75 mg será prescrita?',[['2 comprimidos em dose única','pep-lng-single'],['1 comprimido a cada 12 h','pep-lng-split']],'As duas alternativas são as descritas no quadro municipal.');
a(p,'pep-lng-single','Levonorgestrel 0,75 mg: 2 comprimidos em dose única, se indicado; prescrever e orientar.','pep-followup');
a(p,'pep-lng-split','Levonorgestrel 0,75 mg: 1 comprimido a cada 12 horas. O total de doses não está explícito nessa alternativa da fonte; validar antes de orientar a repetição. Prescrever e orientar.','pep-followup');
t(p,'pep-followup','Encaminhar à UBS para acompanhamento clínico e sorológico. Demais condutas e orientações para prevenção e tratamento de outras IST devem ocorrer na UBS.');
for(const id of ['pep-standard','pep-double','pep-followup'])p.nodes[id].formURL='https://azt.aids.gov.br/documentos/siclom_operacional/Solicitacao_Medicamentos_PEP_NOVEMBRO_2025NOVO%20MODELO_DIGITAVELvsd.pdf';
const references='Referências impressas em 12/2025, atendimento 24 h: homens e mulheres acima de 12 anos — Hospital de Clínicas, entrada pela maternidade, Rua General Carneiro 181, Alto da Glória, (41) 3360-1800. Mulheres acima de 12 anos: Hospital Universitário Evangélico Mackenzie, Alameda Augusto Stellfeld 1908, Bigorrilho, (41) 3240-5000; Hospital do Trabalhador, Av. República Argentina 4406, Novo Mundo, (41) 3360-1800. Crianças até 11 anos: Hospital Pequeno Príncipe, Rua Desembargador Motta 1070, Água Verde, (41) 3310-1010. A idade de exatamente 12 anos não é abrangida literalmente pelas faixas impressas; validar referência nessa situação.';
t(p,'pep-violence','Violência sexual: utilizar os serviços de referência da página 2.\n'+references,2);
t(p,'pep-occupational','Acidente ocupacional com material biológico: Hospital do Trabalhador, 24 h, Av. República Argentina 4406, Novo Mundo, Curitiba, (41) 3360-1800, conforme quadro de 12/2025. O regime da exposição consentida não foi aplicado automaticamente ao acidente ocupacional.',2);
for(const id of ['pep-time','pep-late','pep-positive']){p.nodes[id].criteria='Contracepção de emergência: avaliar indicação, prescrever e orientar se indicada. Quadro municipal: levonorgestrel 0,75 mg, 2 comprimidos em dose única ou 1 comprimido a cada 12 h. Janela e critérios de indicação não definidos nessa fonte.';if(id!=='pep-time')p.nodes[id].text+='\n'+p.nodes[id].criteria;}
for(const id of ['pep-standard','pep-double'])note(p,id,'A fonte não detalha ajuste por função renal, idade/peso ou condições clínicas especiais, nem o manejo de teste inconclusivo/indisponível. Esses casos exigem validação do esquema individual, sem dose ou decisão de substituição inventada.');
p.entries=[{to:'pep-scope',page:1,label:'Exposição e contexto do atendimento'}];p.status='reconstruido-conferencia-individual';
}}
{
const p=P['adulto-rebaixamento-do-nivel-de-consciencia'];if(p){const n=p.nodes;
n.p1n11.text='Seguir fluxo de CRISES CONVULSIVAS.';n.p1n27.text='Seguir fluxo de INTOXICAÇÕES EXÓGENAS.';
n.p1n22.criteria=n.p1n4.text;n.p1n34.criteria=n.p1n38.text;n.p1n36.text+='\n'+n.p1n41.text+'\nO documento encerra esse ramo no tratamento da causa identificada; não especifica um regime para cada uma das causas listadas.';
q(p,'p1n7','Qual alteração foi identificada para direcionar o manejo?',[['Hipoglicemia: dextro <60 mg/dL','loc-glucose'],['Hiperglicemia','loc-hyper'],['Hipóxia ou taquipneia','loc-resp'],['Hipotensão: PAS >90 e <120 mmHg','loc-volume'],['Hipotensão severa e hipoperfusão','loc-shock'],['Emergência hipertensiva','loc-hypertension'],['Outra alteração ou limiar não definido','loc-vital-gap']],'Mais de uma condição pode coexistir; as medidas correspondentes são complementares. A escolha organiza o acesso à conduta.');
t(p,'loc-glucose','Hipoglicemia (dextro <60 mg/dL): glicose 50%, 50 mL IV, conforme a dose fixa do protocolo adulto. A fonte não informa velocidade ou intervalo para repetir.');
t(p,'loc-vital-gap','A fonte não define conduta específica para essa alteração ou limiar. A avaliação e o manejo da causa permanecem para validação clínica; não foi atribuída outra condição por aproximação.');
t(p,'loc-hyper','Seguir fluxo de EMERGÊNCIAS HIPERGLICÊMICAS.');
t(p,'loc-resp','Seguir fluxo de insuficiência respiratória aguda: no acervo navegável, EMERGÊNCIAS RESPIRATÓRIAS.');
t(p,'loc-volume','Hipotensão com PAS >90 e <120 mmHg: expansão volêmica com SF 0,9%. Volume, velocidade e critérios de repetição não informados nesse quadro; validar a prescrição individual.');
t(p,'loc-shock','Hipotensão severa com hipoperfusão: seguir fluxo de CHOQUE. O limiar foi impresso como “PAS ,90 mmHg”; o comparador está indefinido e não foi escolhido automaticamente.');
t(p,'loc-hypertension','Emergência hipertensiva: seguir fluxo de CRISE HIPERTENSIVA.');
q(p,'p1n31','Qual alteração foi identificada no ECG?',[['Sinais de isquemia','loc-ischemia'],['Taquiarritmia ou bradiarritmia','loc-arrhythmia'],['Ambas','loc-both-ecg'],['Outra alteração não descrita','loc-ecg-gap']],'A fonte apresenta as duas causas como condicionais, sem declarar exclusividade nem definir prioridade se coexistirem.');
t(p,'loc-ecg-gap','O quadro de ECG alterado especifica apenas isquemia e taqui/bradiarritmia; outra alteração requer validação clínica da causa e do manejo.');
t(p,'loc-ischemia','Sinais de isquemia: seguir fluxo de SÍNDROMES CORONARIANAS.');t(p,'loc-arrhythmia','Taquiarritmia/bradiarritmia: seguir fluxo de ARRITMIAS.');t(p,'loc-both-ecg','Sinais de isquemia e taqui/bradiarritmia: estão indicados os fluxos de SÍNDROMES CORONARIANAS e ARRITMIAS. A fonte não define prioridade entre eles.');
note(p,'p1n7','PAS >90 e <120 aparece no ramo de expansão. Para hipotensão severa o original contém “PAS ,90”, sem operador; exatamente 90 e 120 não têm manejo específico definido. Não foi inventado limiar.');
}}
})();
