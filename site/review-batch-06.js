'use strict';
(()=>{
 const all=window.PROTOCOLS||{};
 function api(p){return {q:(id,text,choices,criteria='',page=1)=>p.nodes[id]={id,text,page,question:true,choices:choices.map(([label,to])=>({label,to})),criteria,contextNodes:[],incomplete:false},t:(id,text,page=1)=>p.nodes[id]={id,text,page,question:false,choices:[],contextNodes:[],incomplete:false},link:(id,to)=>p.nodes[id].choices=[{label:'Continuar',to}]};}
 const home=all['adulto-desospitalizacao-acionamento-do-saude-em-casa'];
 if(home){const n=home.nodes,{q,t,link}=api(home);
 const inclusion=n.p2n4.text,conditions=n.p2n6.text,eligible=n.p2n9.text,excluded=n.p2n11.text;
 home.entries=[{to:'sad-inclusion',page:2,label:'Critérios e solicitação ao Saúde em Casa'}];
 q('sad-inclusion','Todos os critérios de inclusão estão presentes?',[['Sim','sad-exclusion'],['Não','p2n11']],inclusion,2);
 q('sad-exclusion','Existe algum critério de não elegibilidade?',[['Sim','p2n11'],['Não','sad-profile']],excluded,2);
 q('sad-profile','Há situação e perfil elegíveis para cuidado domiciliar?',[['Sim','p2n9'],['Não','p2n11']],conditions+'\n'+eligible,2);link('p2n9','p1n4');
 n.p1n5.text='Preencher solicitação de acolhimento ao Programa Melhor em Casa. Contatos registrados na edição municipal: melhoremcasa@feaes.curitiba.pr.gov.br; WhatsApp 3316-5969; e-Saúde nos dias úteis.\nFORMULÁRIO — identificação: nome completo, RG, CPF, nascimento, nome da mãe, sexo, telefone, cartão SUS, endereço, número, bairro, UBS; acompanhante (sim/não), nome e parentesco.\nSOLICITANTE: UPA, data, nome do médico, motivo, seguimento clínico/reabilitação/paliativo/conclusão de antibiótico; qual antibiótico, dose, início e término; diagnóstico, sinais e sintomas atuais, anexar exames; assinatura e carimbo.\nPARECER MÉDICO SAD: data da visita, favorável sim/não, justificativa, assinatura e carimbo. Usar os canais institucionais para os dados do paciente.';
 q('p1n11','Qual o parecer médico após avaliação dos critérios?',[['Aceito — registrar para quê','p1n13'],['Negado — registrar por quê','p1n14']],inclusion+'\n'+conditions+'\n'+eligible+'\n'+excluded);
 for(const [key,accepted]of [['p1n21',true],['p1n23',false]]){
 q(key,'Quando ocorre o retorno da avaliação?',[['Dia útil',key+'-weekday'],['Final de semana ou feriado',key+'-weekend']]);
 t(key+'-weekday',accepted?'Enfermeiro regulador repassa caso para enfermeiro de área e administrativo.':'Enfermeiro regulador entrega caso para o administrativo.');
 t(key+'-weekend','Enfermeiro plantonista repassa feedback via WhatsApp o mais breve possível e registra no livro de plantão.');}
 const table='ANTIMICROBIANOS DOMICILIARES — tabela documental; doses expressas para adulto. O cabeçalho declara função renal/hepática normal, mas algumas linhas trazem ajuste renal: preservar essa distinção e validar função renal e prescrição individual. Reconstituição/diluição abaixo não define preparo IM/HDC; não aplicar automaticamente a todas as vias. Volume de reconstituição sem apresentação do frasco não permite calcular concentração.\n'+
 'Amicacina: 15–22,5 mg/kg 1x/dia preferencialmente, ou 5–7,5 mg/kg 12/12 h em necessidade de ajuste renal; EVI/IM; sem reconstituição; 100–250 mL SF 0,9%, SG 5% ou RL; 30–60 min.\n'+
 'Gentamicina: 4–7 mg/kg 1x/dia preferencialmente, ou 1–2,5 mg/kg/dose 12/12 h em ajuste renal; EVI/IM; sem reconstituição; 100–250 mL SF 0,9% ou SG 5%; 30–60 min.\n'+
 'Cefepima: 2 g 2x/dia; IM/HDC 0,5–1 g 2x/dia, 1 g por sítio; EVI/IM/HDC; reconstituir 10 mL água estéril; diluir 100 mL SF 0,9% ou SG 5%; 30 min.\n'+
 'Ceftazidima: 2 g 2x/dia; EVI/IM; reconstituir 5–10 mL água estéril; diluir 100 mL SF 0,9% ou SG 5%; 30–60 min.\n'+
 'Ceftriaxona: 1–2 g 1x/dia; IM/HDC 1 g por sítio; EVI/IM/HDC; reconstituir 10 mL água estéril; diluir 100 mL SF 0,9% ou SG 5%; 15–30 min.\n'+
 'Meropenem: 1–2 g 2x/dia EM CASOS DE AJUSTE RENAL; EVI; reconstituir 20 mL água estéril; diluir 100 mL SF 0,9% ou SG 5%; 30–60 min. Não usar essa frequência como regime geral com função renal normal.\n'+
 'Vancomicina: 15–20 mg/kg 2x/dia; EVI; reconstituir 10 mL água estéril; diluir 250 mL SF 0,9% ou SG 5%; 1 h–2 h 30 min.\n'+
 'Ciprofloxacino: 200–400 mg 2x/dia; EVI/VO; bolsa pronta, 60 min para infusão.\nLevofloxacino: 500–750 mg 1x/dia; EVI/VO; bolsa pronta, 60 min para infusão.\n'+n.p3n4.text;
 t('sad-antibiotics',table,3);n['sad-profile'].contextNodes=['sad-antibiotics'];n.p1n11.contextNodes=['sad-antibiotics'];
 }
 const diarrhea=all['adulto-diarreia-aguda'];
 if(diarrhea){const n=diarrhea.nodes,{q,t,link}=api(diarrhea);
 n.p1n4.text+='\nA classificação da fonte sobrepõe aguda e persistente em exatamente 14 dias; validar esse limite, sem mudar o critério >14 dias do quadro de antibióticos.';
 n.p1n15.criteria=n.p1n14.text;n.p1n5.criteria=n.p1n6.text;
 n.p1n16.text=n.p1n16.text.split('NA PRESENÇA DESTAS')[0];link('p1n16','diarrhea-rx');
 q('diarrhea-rx','Há as alterações radiográficas descritas?',[['Sim','diarrhea-samu'],['Não ou exame inconclusivo','diarrhea-rx-undefined']],n.p1n16.text);
 t('diarrhea-samu','Discutir com regulação SAMU 3360-4980.');t('diarrhea-rx-undefined','A fonte não desenha a saída da suspeita de diarreia paradoxal sem essas alterações radiográficas. Definir continuidade após avaliação clínica; não atribuir alta automática.');
 n.p1n11.text=n.p1n12.text+'\nPENDÊNCIAS ESPECÍFICAS: a fonte escreve “SF ,09%” no esquema para cardiopatia/nefropatia; validar concentração antes de prescrever. Metoclopramida e dipirona injetáveis estão em mg/mL sem dose/volume. Não converter concentração em dose. Reavaliar após manejo.';
 n.p1n17.text='Tratamento domiciliar: SRO a cada evacuação; sintomáticos documentados: dipirona 500 mg/mL, paracetamol 500 mg, metoclopramida 10 mg se náuseas/vômitos. A fonte não define dose em volume da dipirona nem intervalos desses sintomáticos.';link('p1n17','diarrhea-antibiotic');
 q('diarrhea-antibiotic','Há disenteria (pus/sangue), diarreia do viajante ou duração >14 dias?',[['Sim','diarrhea-regimen'],['Não','diarrhea-duration']]);
 q('diarrhea-regimen','Trata-se de diarreia do viajante?',[['Sim','diarrhea-travel'],['Não','diarrhea-smztmp']]);
 t('diarrhea-smztmp','Quadro municipal: SMZ+TMP 400+80 mg, 2 comprimidos a cada 12 h por 7 dias.');link('diarrhea-smztmp','diarrhea-duration');
 t('diarrhea-travel','Quadro municipal: SMZ+TMP 400+80 mg, 2 comprimidos a cada 12 h por 7 dias; metronidazol 250 mg, 2 comprimidos a cada 8 h por 7 dias, marcado para diarreia do viajante. O quadro não esclarece alternativa versus associação; validar seleção do esquema, sem prescrever automaticamente ambos.');link('diarrhea-travel','diarrhea-duration');
 q('diarrhea-duration','Diarreia persistente ou crônica?',[['Sim','diarrhea-aps'],['Não','diarrhea-home']],'Persistente ≥14 dias e crônica >30 dias na fonte; exatamente 14 também consta na definição de aguda.');t('diarrhea-aps','Referenciar à APS e manter orientações domiciliares descritas.');t('diarrhea-home','Manter tratamento domiciliar descrito.');
 }
 const anorectal=all['adulto-doencas-anorretais'];
 if(anorectal){const n=anorectal.nodes,{q,t,link}=api(anorectal);
 n.p1n4.criteria=n.p1n17.text;
 const analgesia=n.p1n7.text.split(' ANTIBIOTICOTERAPIA')[0]+'\nAs apresentações dos analgésicos são concentrações sem dose/volume/intervalo; validar prescrição antes de administrar. A via da morfina também não está definida no quadro.';
 n.p1n5.text+='\n'+analgesia+'\nCeftriaxona 2 g IV 1x/dia somente para pacientes na CLM, conforme condição do quadro.';n.p1n18.text+='\n'+analgesia+'\nPara paciente na CLM: ceftriaxona 2 g IV 1x/dia (apresentação 1 g).';
 q('p1n10','Qual apresentação indolor está presente?',[['Sangramento abundante','ano-bleeding'],['Sangramento pequeno ou recorrente','ano-small'],['Sangramento, emagrecimento e fezes em fita','ano-weight'],['Nodulação indolor','ano-nodule'],['Prurido anal','ano-itch']],'Avaliar todas as manifestações presentes; os itens podem coexistir.');
 t('ano-bleeding','Seguir fluxo de hemorragia digestiva.');t('ano-small','Referenciar à APS; orientar dieta.');t('ano-weight','Referenciar à APS.');t('ano-nodule','Referenciar à APS; considerar tumores de pele, condilomas, pólipos e papilas anais hipertrofiadas.');t('ano-itch','Avaliar dermatite local; orientar higiene, dieta e banho de assento; considerar albendazol. Dose não especificada.');
 q('p1n12','Há emergência proctológica?',[['Sim','p1n18'],['Não','ano-diagnosis']],n.p1n14.text);
 q('ano-diagnosis','Qual diagnóstico foi estabelecido?',[['Hemorroidas internas','p1n20'],['Fissura anal','p1n21'],['Fístula anal','p1n25'],['Cisto pilonidal','p1n22']]);
 const conservative='Orientar dieta e ingesta hídrica, banho de assento; considerar lidocaína tópica; paracetamol 500 mg ou ibuprofeno 600 mg constam no quadro, sem intervalos/duração definidos.';
 q('p1n28','Qual o grau da hemorroida interna?',[['Grau 1 — sem prolapso','ano-conservative'],['Grau 2 — redução espontânea','ano-conservative'],['Grau 3 — redução manual','ano-grade3'],['Grau 4 — irredutível','ano-grade4']],conservative+'\n'+n.p1n39.text);
 t('ano-conservative',conservative);t('ano-grade3',conservative+' Referenciar à APS.');t('ano-grade4',conservative+' Encaminhar para avaliação hospitalar pela cirurgia geral.');
 n.p1n31.text='Fissura aguda até 6 semanas; crônica >6 semanas. '+conservative;link('p1n31','ano-refractory');q('ano-refractory','Caso refratário?',[['Sim','ano-fissure-aps'],['Não','ano-conservative']]);t('ano-fissure-aps','Referenciar à APS. '+conservative);
 n.p1n33.text='Cisto pilonidal: massa flutuante ao longo da prega glútea. Sintomáticos: paracetamol 500 mg ou ibuprofeno 600 mg; intervalos/duração não especificados.';link('p1n33','ano-abscess');
 q('ano-abscess','Há abscesso?',[['Sim','ano-technical'],['Não','ano-cellulitis']]);q('ano-technical','Há condições técnicas para incisão e drenagem?',[['Sim','ano-drain'],['Não','ano-cellulitis']]);t('ano-drain','Incisão e drenagem.');link('ano-drain','ano-cellulitis');
 q('ano-cellulitis','Há celulite associada?',[['Sim','ano-antibiotic'],['Não','ano-surgery']]);t('ano-antibiotic','Amoxicilina 500 mg OU sulfametoxazol+trimetoprim 400+80 mg. A fonte não define intervalos ou duração; validar prescrição.');link('ano-antibiotic','ano-surgery');t('ano-surgery','Referenciar para avaliação hospitalar pela cirurgia geral.');
 }
 for(const p of [home,diarrhea,anorectal])if(p)for(const n of Object.values(p.nodes))for(const key of ['text','criteria'])if(n[key])n[key]=n[key].replace(/\(?VER P\.[1-4]\)?/gi,'');
})();
