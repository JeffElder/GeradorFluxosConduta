'use strict';
(() => {
 const p=window.PROTOCOLS?.['adulto-hemorragia-digestiva'];if(!p)return;
 const n=p.nodes,C=(label,to)=>({label,to});
 function put(id,text,choices=[],question=false){n[id]={id,page:1,text,question,choices:choices.map(([l,to])=>C(l,to)),incomplete:false,contextNodes:[]}}
 const Q=(id,t,ch)=>put(id,t,ch,true), A=(id,t,to)=>put(id,t,[['Próxima etapa',to]]), T=(id,t)=>put(id,t);
 A('hd-start','ANAMNESE: investigar início, dor abdominal, hematêmese, hematoquezia ou melena. Identificar uso de anti-inflamatórios ou anticoagulantes, alcoolismo, hepatopatia, cardiopatia ou nefropatia. Afastar fezes escurecidas por ferro, carvão, vegetais ou sangue deglutido. EXAME FÍSICO: sinais vitais, abdome e peritônio, sinais de doença hepática, região perineal e toque retal para pesquisar sangramento.','hd-instability');
 Q('hd-instability','HÁ SINAIS DE INSTABILIDADE: FC >100 bpm, FR ≥22 irpm, alteração de consciência, SpO₂ <90%, PAS <90 mmHg OU tempo de enchimento capilar >3 segundos?', [['Sim','hd-emergency'],['Não','hd-criteria']]);
 Q('hd-criteria','HÁ CRITÉRIOS PARA HEMORRAGIA DIGESTIVA: hematêmese presenciada, sangue vivo na sonda nasogástrica, hematoquezia presenciada, melena presenciada ou no toque retal, ou sangue vivo ao toque após excluir fissuras/hemorroidas?', [['Sim','hd-emergency'],['Não','hd-exams']]);
 T('hd-emergency','DISCUTIR IMEDIATAMENTE COM A REGULAÇÃO DO SAMU: 3360-4980. MANEJO CLÍNICO: dois acessos venosos calibrosos; O₂ se SpO₂ <90%; considerar sonda nasogástrica; intubação apenas em sangramento vultoso ou rebaixamento de consciência; expansão volêmica com SF 0,9% ou Ringer lactato. O protocolo municipal de 2024 descreve omeprazol 80 mg IV em bolus, seguido de 40 mg a cada 12 horas; metoclopramida IV; e, em cirrose/ascite, ceftriaxona 2 g/dia IV para profilaxia de peritonite bacteriana espontânea. Intervenções farmacológicas exigem prescrição e avaliação de contraindicações.');
 A('hd-exams','SUSPEITA DE HEMORRAGIA DIGESTIVA SEM PREENCHER OS CRITÉRIOS ANTERIORES: solicitar hemograma, sódio, potássio, creatinina, ureia, função hepática e coagulograma. Calcular escore Glasgow-Blatchford (EGB) usando ureia, hemoglobina, PAS, pulso, melena, síncope, hepatopatia e cardiopatia.','hd-score');
 Q('hd-score','QUAL É O ESCORE GLASGOW-BLATCHFORD CALCULADO? PONTOS: ureia 18,2–22,3 mg/dL = 2; 22,4–27,9 = 3; 28–69,9 = 4; ≥70 = 6. Hemoglobina masculina 12–12,9 g/dL = 1; 10–11,9 = 3; <10 = 6. Hemoglobina feminina 10–11,9 = 1; <10 = 6. PAS 100–109 mmHg = 2; 90–99 = 2; <90 = 3. Pulso >100 = 1; melena = 1; síncope = 2; hepatopatia = 2; cardiopatia = 2. Para cada item não enquadrado, somar zero.', [['8 pontos ou mais','hd-high'],['2 a 7 pontos','hd-medium'],['0 ou 1 ponto','hd-low']]);
 T('hd-high','GLASGOW-BLATCHFORD ≥8: discutir encaminhamento com regulação do SAMU 3360-4980, com avaliação e tratamento de suporte conforme situação clínica.');
 T('hd-medium','GLASGOW-BLATCHFORD 2 A 7: encaminhar para avaliação hospitalar e endoscopia.');
 T('hd-low','GLASGOW-BLATCHFORD ≤1: referenciar à APS e alta domiciliar apenas se a avaliação clínica confirmar segurança. O documento municipal descreve omeprazol 20 mg, dois comprimidos pela manhã em jejum, mediante prescrição.');
 p.entries=[{to:'hd-start',page:1,label:'Avaliação da hemorragia digestiva'}];
})();
