'use strict';
(()=>{
 const all=window.PROTOCOLS||{};
 function api(p){return {q:(id,text,choices,criteria='',page=1)=>p.nodes[id]={id,text,page,question:true,choices:choices.map(([label,to])=>({label,to})),criteria,contextNodes:[],incomplete:false},t:(id,text,page=1)=>p.nodes[id]={id,text,page,question:false,choices:[],contextNodes:[],incomplete:false},link:(id,to)=>p.nodes[id].choices=[{label:'Continuar',to}]};}
 const preg=all['adulto-dor-abdominal-em-gestantes'];
 if(preg){const n=preg.nodes;
 n['ob-start'].text=n.p1n4.text;
 n['ob-gravity'].criteria=n.p1n6.text+'\nA idade gestacional >20 semanas consta isolada na lista de gravidade; o documento não esclarece se é condição contextual para síndrome hipertensiva ou critério suficiente. Registrar idade e validar interpretação; não omitir nem criar um limiar corrigido.';
 n['ob-gravity'].text='Há sinais de gravidade descritos no quadro?';
 n['ob-obstetric'].criteria=n.p1n11.text+'\nDiagnósticos não obstétricos considerados: '+n.p1n13.text;
 n['ob-maternity'].text=n.p1n21.text+'\nDipirona e metoclopramida estão em mg/mL sem dose/volume: a fonte não permite inferir a quantidade a administrar.';
 n['ob-labor-ref'].text='Seguir fluxo de assistência ao trabalho de parto na UPA para avaliação, escore de Malinas e assistência ao parto iminente.';
 n['ob-severe'].text='Discutir com regulação SAMU 3360-4980. Seguir fluxo de síndrome hipertensiva na gestação ou fluxo de sangramento genital feminino conforme quadro clínico.';
 }
 const abdomen=all['adulto-dor-abdominal-no-adulto'];
 if(abdomen){const n=abdomen.nodes,{q,t,link}=api(abdomen);
 abdomen.entries=[{to:'p1n4',page:1,label:'Avaliação inicial da dor abdominal'}];link('p1n4','p2n4');n.p2n4.criteria=n.p2n6.text;n.p2n16.criteria=n.p1n8.text;
 const tests=n.p1n7.text,types=n.p1n6.text;
 const simple='Analgesia simples do quadro: dipirona 500 mg/mL IV ou IM; hioscina 20 mg IV; cetoprofeno 100 mg/mL IM. Dipirona/cetoprofeno estão apresentados como concentrações, sem dose/volume. Não converter em dose por inferência.';
 const escalation='Escalonamento analgésico do quadro: tramadol 50 mg/mL IV (dose/volume não definidos); morfina 10 mg/mL, dose 2–4 mg IV. Intervalos de repetição não especificados.';
 const management=n.p2n5.text+'\nPENDÊNCIAS: concentração sem dose/volume para dipirona, cetoprofeno, metoclopramida e tramadol. A repetição de fluidos não tem teto nem critérios de reidratação explícitos; a cautela em ICC/DRC foi preservada. Não converter concentração em dose.';
 for(const key of ['p2n14','p2n45']){n[key].text='Discutir com regulação SAMU 3360-4980.\n'+management;link(key,'abd-tube');}
 q('abd-tube','Há abdome agudo oclusivo com vômitos OU hemorragia digestiva alta?',[['Sim','abd-tube-consider'],['Não','abd-regulation']],'Condição específica do quadro de manejo clínico.',2);
 t('abd-tube-consider','Considerar sonda nasogástrica aberta e sonda vesical de demora. Manter discussão com regulação SAMU 3360-4980.',2);t('abd-regulation','Manter discussão com regulação SAMU 3360-4980.',2);
 n.p2n23.text='Determinar o tipo de abdome agudo; propedêutica complementar; cadastrar na CLM.\n'+types+'\n'+tests;link('p2n23','abd-occlusion');
 n.p2n27.text=simple+' Reavaliar após medicação.';n.p2n31.text=escalation+'\n'+tests;
 n.p2n33.criteria=types;n.p2n36.text='Propedêutica complementar, se ainda não realizada; cadastrar na CLM.\n'+tests;link('p2n36','abd-occlusion');
 q('abd-occlusion','O RX mostra os achados de abdome agudo oclusivo descritos?',[['Sim','abd-occlusive-samu'],['Não','abd-clm']],n.p1n11.text,2);
 t('abd-occlusive-samu','Acionar regulação SAMU 3360-4980 para abdome agudo oclusivo.\n'+management,2);link('abd-occlusive-samu','abd-tube');t('abd-clm','Cadastro na CLM conforme ramo clínico.',2);
 }
 const pelvic=all['adulto-dor-pelvica-na-mulher'];
 if(pelvic){const n=pelvic.nodes,{q,t,link}=api(pelvic);
 n['ob-start'].criteria=n.p1n4.text+'\n'+n.p1n6.text;
 const management=n.p1n13.text+'\nDipirona, cetoprofeno e metoclopramida aparecem como concentrações, sem dose/volume. Preservar a exclusão de cetoprofeno em gestantes; não inferir doses.';
 n['ob-severe'].text='Discutir com regulação SAMU 3360-4980.\n'+management;n['ob-hcg-pos'].text='Beta-HCG positivo: discutir com regulação SAMU 3360-4980.\n'+management;
 n['ob-preg-ref'].text='Seguir fluxo de dor abdominal em gestantes, com avaliação de gravidade e encaminhamento conforme as decisões daquele fluxo.';
 n['ob-chronic'].text=n.p1n16.text+'\nA fonte não define intervalo/duração dos sintomáticos nem dose em volume da dipirona.';
 n['ob-perit'].text=n.p1n27.text+'\nPENDÊNCIAS: o quadro apresenta alternativa ceftriaxona 100 mg/kg/dia sem teto e metronidazol 40 mg/kg/dia “de 8/8 h” sem esclarecer divisão da dose diária. Não interpretar dose diária como dose por administração; validar alternativas por peso. O regime fixo transcrito é ceftriaxona 2 g IV 1x/dia mais metronidazol 500 mg IV 8/8 h.';
 q('ob-gyneco','Qual causa ginecológica foi identificada?',[['Dismenorreia','pelvic-dysmenorrhea'],['Neoplasia','pelvic-neoplasia'],['Doença inflamatória pélvica','pelvic-pid']]);
 t('pelvic-dysmenorrhea','Tratamento domiciliar com sintomáticos: ibuprofeno 600 mg + paracetamol 500 mg OU dipirona 500 mg/mL. Fonte sem intervalos/duração nem volume da dipirona.');
 t('pelvic-neoplasia','Encaminhar para avaliação hospitalar.');
 t('pelvic-pid','Esquema municipal para DIP: ceftriaxona 250 mg IM dose única + doxiciclina 100 mg VO 12/12 h por 14 dias + metronidazol 500 mg VO 12/12 h por 14 dias; sintomáticos; referenciar à APS. A dose de ceftriaxona é a da edição de 25/06/2024; sua adequação à diretriz vigente permanece pendente de validação clínica, sem substituição inferida.');
 q('ob-non-gyneco','Qual causa não ginecológica foi identificada?',[['ITU','pelvic-uti'],['Litíase urinária','pelvic-stone'],['Neoplasia','pelvic-neoplasia'],['Constipação','pelvic-constipation']]);
 t('pelvic-uti','Seguir fluxo de infecção do trato urinário.');t('pelvic-stone','Seguir fluxo de cólica renal.');t('pelvic-constipation','Orientar dieta rica em fibras e hidratação; sintomáticos.');
 }
 for(const p of [preg,abdomen,pelvic])if(p)for(const node of Object.values(p.nodes))for(const key of ['text','criteria'])if(node[key])node[key]=node[key].replace(/\(?VER P\.[12]\)?/gi,'');
})();
