'use strict';
(() => {
 const all=window.PROTOCOLS||{};
 function install(id,entry,nodes) {
  const p=all[id];if(!p)return;
  const C=(label,to)=>({label,to});
  for(const [key,text,choices,page=1] of nodes) p.nodes['rv-'+key]={id:'rv-'+key,text,question:choices.length>1,choices:choices.map(([label,to])=>C(label,'rv-'+to)),page,incomplete:false,contextNodes:[]};
  p.entries=[{to:'rv-'+entry,page:1,label:'Iniciar avaliação clínica'}];
 }
 install('adulto-leptospirose','suspect',[
  ['suspect','SUSPEITA DE LEPTOSPIROSE: febre abrupta, cefaleia e mialgia, associadas a antecedente epidemiológico nos últimos 30 dias (enchentes, alagamentos, esgoto, lixo, contato ocupacional ou área de risco) OU sinais como sufusão conjuntival, oligúria/anúria, icterícia ou hemorragia. Avaliar sinais vitais e exame físico.',[['Avaliar sinais de alerta','alert']]],
  ['alert','HÁ PELO MENOS UM SINAL DE ALERTA: FR >30 irpm, SpO₂ <90% em ar ambiente, oligúria/anúria, hemorragia/hemoptise, PAS <90 mmHg, alteração de consciência, arritmia ou icterícia?', [['Sim','severe'],['Não','mild']]],
  ['mild','SEM SINAIS DE ALERTA: coletar exames e sorologia para leptospirose, notificar o caso conforme vigilância, indicar hidratação e repouso. A fonte municipal de 2024 descreve, para adultos, amoxicilina 500 mg VO a cada 8 horas por 7 dias OU doxiciclina 100 mg VO a cada 12 horas por 7 dias; para crianças, amoxicilina 50 mg/kg/dia, dividida a cada 8 horas por 7 dias. Para sintomas, considera paracetamol ou dipirona conforme avaliação, riscos e contraindicações. Orientar retorno imediato se surgir qualquer sinal de alerta. Doses exigem prescrição e conferência com diretrizes vigentes.',[]],
  ['severe','COM SINAIS DE ALERTA: realizar hemograma, ureia, creatinina, bilirrubinas totais/frações, TAP, TGO, TGP, gama-GT, CPK, sódio, potássio, gasometria arterial, lactato, sorologia para leptospirose, radiografia de tórax e ECG. Cadastrar na CLM, monitorar dados vitais, obter dois acessos venosos, acompanhar débito urinário. O protocolo descreve SF 0,9% 30 mL/kg IV nas primeiras 3 horas com cautela para congestão pulmonar; se choque persistente, avaliar manejo de sepse. Considerar suporte ventilatório em insuficiência respiratória, avaliação de urgências dialíticas em injúria renal e correção supervisionada de eletrólitos. Antibioticoterapia IV descrita: penicilina G cristalina OU ceftriaxona, conforme prescrição e protocolos vigentes. A avaliação e as medidas são complementares, não escolhas excludentes.',[]]
 ]);
 install('adulto-obesidade-morbida','assessment',[
  ['assessment','PACIENTE COM PESO ≥ 150 KG E/OU IMC > 40: avaliar comorbidades como insuficiência renal crônica, insuficiência cardíaca, diabetes mellitus, hipertensão arterial e asma. Verificar sinais de instabilidade.',[['Prosseguir para classificação clínica','unstable']]],
  ['unstable','POSSUI CRITÉRIOS DE INSTABILIDADE? Via aérea não resolvida; ventilação insuficiente; choque, sangramento ativo ou falta de recurso para circulação; mal convulsivo, AVC em curso, edema cerebral ou coma; alterações de temperatura não controladas ou feridas complexas; necessidade de exames ou tratamento indisponíveis na UPA.',[['Sim','transfer'],['Não','observe']]],
  ['transfer','PACIENTE INSTÁVEL: discutir com regulação do SAMU pelo telefone 3360-4980. O regulador do SAMU entra em contato com hospitais de retaguarda para organizar a transferência.',[]],
  ['observe','SEM INSTABILIDADE: cadastrar paciente na CLM. Se durante o internamento surgir qualquer critério de instabilidade clínica, discutir com a regulação do SAMU pelo telefone 3360-4980.',[]]
 ]);
})();
