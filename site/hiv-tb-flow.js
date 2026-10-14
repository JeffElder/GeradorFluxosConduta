'use strict';
(() => {
 const p=window.PROTOCOLS?.['adulto-avaliacao-do-paciente-com-hiv-e-tuberculose-na-upa'];if(!p)return;
 const N=p.nodes,C=(label,to)=>({label,to});
 const q=(id,text,choices,page=1)=>N[id]={id,text,page,question:true,choices:choices.map(([label,to])=>C(label,to)),incomplete:false,contextNodes:[]};
 const a=(id,text,to,page=1)=>N[id]={id,text,page,question:false,choices:[C('Continuar',to)],incomplete:false,contextNodes:[]};
 const t=(id,text,page=1)=>N[id]={id,text,page,question:false,choices:[],incomplete:false,contextNodes:[]};
 q('tb-hiv-status','TESTE RÁPIDO MOLECULAR DE TUBERCULOSE DETECTÁVEL + TESTE RÁPIDO HIV POSITIVO: QUAL É A SITUAÇÃO DE TRATAMENTO ANTIRRETROVIRAL?',[
 ['HIV em uso de TARV','tb-hiv-current'],
 ['HIV com abandono de TARV','tb-hiv-abandoned'],
 ['Caso novo de HIV','tb-hiv-new']
 ]);
 a('tb-hiv-current','HIV EM USO DE TARV: referenciar à Atenção Primária à Saúde (APS) para ajuste de TARV durante tratamento da tuberculose. Avaliar interações medicamentosas, especialmente com rifampicina, e garantir a avaliação do tratamento de tuberculose e as notificações pertinentes.','tb-hiv-discharge');
 a('tb-hiv-abandoned','HIV COM ABANDONO DE TARV: iniciar esquema RHZE para tuberculose e referenciar à APS. Avaliar reinício de TARV conforme sinais de imunodeficiência e CD4, considerando a interação com rifampicina.','tb-hiv-cd4');
 a('tb-hiv-new','CASO NOVO DE HIV: iniciar esquema básico RHZE de acordo com o peso. Notificar casos de tuberculose e HIV e encaminhar as fichas ao distrito sanitário de abrangência. Referenciar à APS e avaliar início da TARV conforme imunodeficiência e CD4.','tb-hiv-cd4');
 q('tb-hiv-cd4','HÁ SINAIS DE IMUNODEFICIÊNCIA AVANÇADA OU CONTAGEM CD4 INFERIOR A 50 CÉLULAS/MM³?',[
 ['Sim','tb-hiv-early'],['Não — sem sinais e CD4 ≥ 50','tb-hiv-later'],
 ['CD4 desconhecido ou situação indeterminada','tb-hiv-review']
 ]);
 a('tb-hiv-early','A orientação municipal de 2024 prevê iniciar TARV duas semanas após o início do tratamento da tuberculose quando houver imunodeficiência avançada ou CD4 < 50 células/mm³. Esquema inicial registrado: tenofovir 300 mg + lamivudina 300 mg, um comprimido uma vez ao dia, e dolutegravir 50 mg duas vezes ao dia durante uso de rifampicina. Confirmar esquema e momento de início com equipe especializada e diretriz vigente.','tb-hiv-discharge');
 a('tb-hiv-later','A orientação municipal de 2024 prevê iniciar TARV na oitava semana após início do tratamento de tuberculose quando não houver sinais de imunodeficiência e CD4 ≥ 50 células/mm³. Esquema inicial registrado: tenofovir 300 mg + lamivudina 300 mg uma vez ao dia, e dolutegravir 50 mg duas vezes ao dia enquanto houver rifampicina. Confirmar com equipe especializada e diretriz vigente.','tb-hiv-discharge');
 a('tb-hiv-review','A classificação de CD4 ou imunodeficiência não foi estabelecida. Solicitar avaliação da APS ou serviço especializado para definir o início da TARV; não deduzir o momento de início a partir deste questionário.','tb-hiv-discharge');
 q('tb-hiv-discharge','QUAL A SITUAÇÃO PARA ENCAMINHAMENTO E CONTINUIDADE DO TRATAMENTO?',[
 ['Necessita internação hospitalar','tb-hiv-admit'],
 ['Alta para pessoa em situação de rua','tb-hiv-street'],
 ['Alta com acompanhamento pela unidade de saúde','tb-hiv-aps']
 ],2);
 t('tb-hiv-admit','NECESSITA INTERNAÇÃO: seguir encaminhamento pelo Complexo Regulador HT para vaga selecionada no Hospital Regional da Lapa. Manter manejo, precauções e comunicação com os serviços envolvidos.',2);
 t('tb-hiv-street','EM SITUAÇÃO DE RUA: acionar equipe Consultório na Rua antes da alta, liberar tratamento da tuberculose para cinco dias e organizar acompanhamento. Orientar tomar o RHZE no mesmo horário diariamente, preferencialmente em jejum, e medidas para reduzir transmissão.',2);
 t('tb-hiv-aps','ALTA: liberar tratamento de tuberculose para cinco dias e orientar seguimento na unidade de saúde de referência. Os comprimidos de RHZE devem ser tomados no mesmo horário, preferencialmente em jejum; se necessário, aguardar duas horas após alimentação. Repetir a pesagem em 15 dias para ajuste. Orientar ventilação, máscara e adesão diária.',2);
 p.entries=[{to:'tb-hiv-status',page:1,label:'Coinfecção HIV e tuberculose'}];
})();
