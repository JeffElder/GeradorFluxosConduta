'use strict';
(()=>{
const definitions={
  "malinas": {
    "title": "Malinas",
    "protocol": "adulto-assistencia-ao-trabalho-de-parto-na-upa",
    "nodes": [
      "ob-score"
    ],
    "fields": [
      {
        "key": "births",
        "label": "Número de partos prévios",
        "options": [
          {
            "label": "1",
            "points": 0
          },
          {
            "label": "2",
            "points": 1
          },
          {
            "label": "Mais de 2",
            "points": 2
          },
          {
            "label": "Nenhum — não definido na tabela",
            "points": null
          }
        ]
      },
      {
        "key": "labor",
        "label": "Duração do trabalho de parto",
        "options": [
          {
            "label": "Menos de 3 horas",
            "points": 0
          },
          {
            "label": "3 a 5 horas",
            "points": 1
          },
          {
            "label": "Mais de 6 horas",
            "points": 2
          },
          {
            "label": "Mais de 5 até 6 horas — não definido",
            "points": null
          }
        ]
      },
      {
        "key": "duration",
        "label": "Duração das contrações",
        "options": [
          {
            "label": "Menos de 1 minuto",
            "points": 0
          },
          {
            "label": "1 minuto",
            "points": 1
          },
          {
            "label": "Mais de 1 minuto",
            "points": 2
          }
        ]
      },
      {
        "key": "interval",
        "label": "Intervalo entre duas contrações",
        "options": [
          {
            "label": "Mais de 5 minutos",
            "points": 0
          },
          {
            "label": "3 a 5 minutos",
            "points": 1
          },
          {
            "label": "Menos de 3 minutos (ao menos 2 em 5 min)",
            "points": 2
          }
        ]
      },
      {
        "key": "rupture",
        "label": "Tempo de amniorrexe",
        "options": [
          {
            "label": "Nega",
            "points": 0
          },
          {
            "label": "Menos de 1 hora",
            "points": 1
          },
          {
            "label": "Mais de 1 hora",
            "points": 2
          },
          {
            "label": "Exatamente 1 hora — não definido",
            "points": null
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Assistência ao trabalho de parto, v.4, 24/06/2024, p.1.",
    "note": "Zero partos prévios, trabalho de parto >5 até 6 h e amniorrexe exatamente 1 h não recebem pontos na tabela municipal. Nesses casos a soma fica pendente; validar com maternidade/regulação."
  },
  "gds": {
    "title": "Escala de depressão geriátrica",
    "protocol": "adulto-delirium",
    "nodes": [
      "p2n23"
    ],
    "fields": [
      {
        "key": "q1",
        "label": "1. Está satisfeito com sua vida?",
        "options": [
          {
            "label": "Sim",
            "points": 0
          },
          {
            "label": "Não",
            "points": 1
          }
        ]
      },
      {
        "key": "q2",
        "label": "2. Deixou muitos interesses e atividades?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q3",
        "label": "3. Sente que sua vida está vazia?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q4",
        "label": "4. Aborrece-se com frequência?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q5",
        "label": "5. Está de bom humor a maior parte do tempo?",
        "options": [
          {
            "label": "Sim",
            "points": 0
          },
          {
            "label": "Não",
            "points": 1
          }
        ]
      },
      {
        "key": "q6",
        "label": "6. Tem medo de que algo de mal vá acontecer?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q7",
        "label": "7. Sente-se feliz a maior parte do tempo?",
        "options": [
          {
            "label": "Sim",
            "points": 0
          },
          {
            "label": "Não",
            "points": 1
          }
        ]
      },
      {
        "key": "q8",
        "label": "8. Sente que sua situação não tem saída?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q9",
        "label": "9. Prefere ficar em casa a sair e fazer coisas novas?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q10",
        "label": "10. Sente mais problemas de memória que a maioria?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q11",
        "label": "11. Acha maravilhoso estar vivo?",
        "options": [
          {
            "label": "Sim",
            "points": 0
          },
          {
            "label": "Não",
            "points": 1
          }
        ]
      },
      {
        "key": "q12",
        "label": "12. Sente-se inútil nas atuais circunstâncias?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q13",
        "label": "13. Sente-se cheio de energia?",
        "options": [
          {
            "label": "Sim",
            "points": 0
          },
          {
            "label": "Não",
            "points": 1
          }
        ]
      },
      {
        "key": "q14",
        "label": "14. Sente que sua situação é sem esperança?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      },
      {
        "key": "q15",
        "label": "15. Sente que a maioria das pessoas está melhor que você?",
        "options": [
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Não",
            "points": 0
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Delirium, v.2, 25/06/2024, p.3.",
    "note": "Triagem: 0–5 normal/sem depressão; 6–10 possível depressão/leve; 11–15 severa. A aplicação durante confusão aguda exige avaliação clínica; a opção de escala não aplicável permanece disponível.",
    "bypass": [
      3
    ]
  },
  "qsofa": {
    "title": "qSOFA",
    "protocol": "adulto-sepse-em-adultos",
    "nodes": [
      "sp-qsofa"
    ],
    "fields": [
      {
        "key": "pressure",
        "label": "PAS menor que 100 mmHg?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "resp",
        "label": "Frequência respiratória ≥22 irpm?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "mental",
        "label": "Alteração mental (Glasgow <15)?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Sepse em adultos, v.2, 25/06/2024, p.1.",
    "note": "Critérios municipais: PAS <100 (limite estrito), FR ≥22 e Glasgow <15. A soma não substitui a suspeita de infecção nem a avaliação de disfunção orgânica."
  },
  "wells_pe": {
    "title": "Wells para TEP",
    "protocol": "adulto-tromboembolismo-pulmonar",
    "nodes": [
      "p1n63",
      "p1n7"
    ],
    "fields": [
      {
        "key": "dvt",
        "label": "Sinais clínicos de TVP?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 3
          }
        ]
      },
      {
        "key": "likely",
        "label": "TEP é o diagnóstico mais provável?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 3
          }
        ]
      },
      {
        "key": "pulse",
        "label": "FC >100 bpm?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1.5
          }
        ]
      },
      {
        "key": "immob",
        "label": "Imobilização >3 dias ou cirurgia nas últimas 4 semanas?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1.5
          }
        ]
      },
      {
        "key": "previous",
        "label": "TEP ou TVP prévios?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1.5
          }
        ]
      },
      {
        "key": "blood",
        "label": "Hemoptise?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "cancer",
        "label": "Neoplasia?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Tromboembolismo pulmonar, v.2, 25/06/2024, p.1.",
    "note": "Faixas municipais: <2; 2–6; >6. Na etapa de manejo, os sinais de gravidade continuam sendo avaliados independentemente da soma."
  },
  "wells_dvt": {
    "title": "Wells para TVP",
    "protocol": "adulto-evento-vascular-periferico-agudo",
    "nodes": [
      "p1n40"
    ],
    "fields": [
      {
        "key": "cancer",
        "label": "Neoplasia ativa?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "paresis",
        "label": "Paresia ou imobilização de extremidades?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "bed",
        "label": "Restrito ao leito >3 dias ou grande cirurgia há menos de 4 semanas?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "tender",
        "label": "Hipersensibilidade no trajeto venoso?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "swelling",
        "label": "Edema assimétrico de todo membro inferior?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "calf",
        "label": "Diâmetro da panturrilha 3 cm maior que o outro membro?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "edema",
        "label": "Edema depressível confinado ao membro sintomático?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "veins",
        "label": "Veias superficiais colaterais não varicosas?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "alternative",
        "label": "Diagnóstico alternativo mais provável (erisipela/celulite)?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": -2
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Evento vascular periférico agudo, v.2, 25/06/2024, p.1.",
    "note": "Wells ≥3 é um dos sinais apresentados na fonte. A pergunta considera também dor, hiperemia, Homans, empastamento, temperatura e diâmetro; a soma isolada não decide esse ramo."
  },
  "twist": {
    "title": "TWIST",
    "protocol": "infantil-escroto-agudo",
    "nodes": [
      "p2n29"
    ],
    "fields": [
      {
        "key": "volume",
        "label": "Aumento do volume testicular?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          }
        ]
      },
      {
        "key": "hard",
        "label": "Endurecimento testicular?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          }
        ]
      },
      {
        "key": "nausea",
        "label": "Náuseas ou vômitos?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "high",
        "label": "Testículo mais alto que o contralateral?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "reflex",
        "label": "Reflexo cremastérico ausente?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Escroto agudo, v.2, 25/06/2024, p.2.",
    "note": "Faixas: 0–2, 3–4 e 5–7. Mesmo a faixa 0–2 mantém o encaminhamento hospitalar indicado no documento."
  },
  "stridor": {
    "title": "Escore clínico do estridor",
    "protocol": "infantil-estridor",
    "nodes": [
      "p1n15",
      "p1n17"
    ],
    "fields": [
      {
        "key": "stridor",
        "label": "Estridor",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Com agitação",
            "points": 1
          },
          {
            "label": "Leve em repouso",
            "points": 2
          },
          {
            "label": "Grave em repouso",
            "points": 3
          }
        ]
      },
      {
        "key": "retraction",
        "label": "Retração",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Leve",
            "points": 1
          },
          {
            "label": "Moderada",
            "points": 2
          },
          {
            "label": "Grave",
            "points": 3
          }
        ]
      },
      {
        "key": "air",
        "label": "Entrada de ar",
        "options": [
          {
            "label": "Normal — aparece nas colunas 0 e 1",
            "points": null,
            "range": [
              0,
              1
            ]
          },
          {
            "label": "Diminuída",
            "points": 2
          },
          {
            "label": "Muito diminuída",
            "points": 3
          }
        ]
      },
      {
        "key": "color",
        "label": "Cor",
        "options": [
          {
            "label": "Normal — aparece nas colunas 0 e 1",
            "points": null,
            "range": [
              0,
              1
            ]
          },
          {
            "label": "Cianótica com agitação",
            "points": 2
          },
          {
            "label": "Cianótica em repouso",
            "points": 3
          }
        ]
      },
      {
        "key": "mental",
        "label": "Nível de consciência",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Agitação sob estímulo",
            "points": 1
          },
          {
            "label": "Agitação",
            "points": 2
          },
          {
            "label": "Letárgico",
            "points": 3
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Estridor, v.2, 25/06/2024, p.2.",
    "note": "A fonte repete entrada de ar normal e cor normal nas colunas 0 e 1; o resultado mostra intervalo, sem escolher uma coluna arbitrariamente. Também omite a classificação de 6 pontos (<6 leve; 7–8 moderada; >8 grave). Resultados sem classificação inequívoca exigem validação clínica."
  },
  "bps": {
    "title": "BPS — pneumonia bacteriana pediátrica",
    "protocol": "infantil-pneumonia-em-pediatria",
    "nodes": [
      "p2n35",
      "p2n47"
    ],
    "fields": [
      {
        "key": "temperature",
        "label": "Temperatura axilar ≥39 °C?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 3
          }
        ]
      },
      {
        "key": "age",
        "label": "Idade ≥9 meses?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          }
        ]
      },
      {
        "key": "neutrophils",
        "label": "Neutrófilos ≥8.000/mm³?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          },
          {
            "label": "Exame ainda não disponível",
            "points": null
          }
        ]
      },
      {
        "key": "immature",
        "label": "Granulócitos imaturos ≥5%?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          },
          {
            "label": "Exame ainda não disponível",
            "points": null
          }
        ]
      },
      {
        "key": "infiltrate",
        "label": "RX: infiltrado",
        "options": [
          {
            "label": "Bem definido, lobular, segmentar ou subsegmentar arredondado",
            "points": 2
          },
          {
            "label": "Mal definido, borrado",
            "points": 1
          },
          {
            "label": "Intersticial, peribrônquico",
            "points": -1
          }
        ]
      },
      {
        "key": "location",
        "label": "RX: localização",
        "options": [
          {
            "label": "Lobo único",
            "points": 1
          },
          {
            "label": "Lobos múltiplos, infiltrado bem definido",
            "points": 1
          },
          {
            "label": "Múltiplos sítios, peri-hilar, mal definido",
            "points": -1
          }
        ]
      },
      {
        "key": "fluid",
        "label": "RX: fluido pleural",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Atenuação mínima no ângulo costofrênico",
            "points": 1
          },
          {
            "label": "Fluido evidente",
            "points": 2
          }
        ]
      },
      {
        "key": "abscess",
        "label": "RX: abscesso, bolha ou pneumatocele",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Duvidoso",
            "points": 1
          },
          {
            "label": "Evidente",
            "points": 2
          }
        ]
      },
      {
        "key": "atelectasis",
        "label": "RX: atelectasia",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Subsegmentar, em múltiplos sítios",
            "points": -1
          },
          {
            "label": "Lobar no lobo médio ou superior direito",
            "points": -1
          },
          {
            "label": "Lobar envolvendo outros lobos",
            "points": 0
          }
        ]
      }
    ],
    "source": "SMS Curitiba, Pneumonia em pediatria, v.2, 25/06/2024, pp.2–3.",
    "note": "Na primeira etapa, a fonte permite calcular antes do hemograma: escolha exame ainda não disponível para obter subtotal clínico/radiológico, sem declarar exame normal. Na reavaliação após hemograma os dois resultados são obrigatórios. Ausência dos achados radiológicos adicionais acrescenta zero; escolha apenas uma alternativa em cada grupo."
  },
  "gcs": {
    "title": "Escala de coma de Glasgow",
    "protocol": null,
    "nodes": [],
    "fields": [
      {
        "key": "eyes",
        "label": "Abertura ocular (melhor resposta)",
        "options": [
          {
            "label": "Espontânea",
            "points": 4
          },
          {
            "label": "Ao som",
            "points": 3
          },
          {
            "label": "À pressão",
            "points": 2
          },
          {
            "label": "Ausente, sem interferência",
            "points": 1
          },
          {
            "label": "Não testável: fator local",
            "points": null
          }
        ]
      },
      {
        "key": "verbal",
        "label": "Resposta verbal (melhor resposta)",
        "options": [
          {
            "label": "Orientada: nome, local e data",
            "points": 5
          },
          {
            "label": "Confusa, mas coerente",
            "points": 4
          },
          {
            "label": "Palavras isoladas",
            "points": 3
          },
          {
            "label": "Sons/gemidos",
            "points": 2
          },
          {
            "label": "Ausente, sem interferência",
            "points": 1
          },
          {
            "label": "Não testável: comunicação impedida",
            "points": null
          }
        ]
      },
      {
        "key": "motor",
        "label": "Resposta motora (melhor resposta)",
        "options": [
          {
            "label": "Obedece a ordens com duas ações",
            "points": 6
          },
          {
            "label": "Localiza estímulo: mão acima da clavícula",
            "points": 5
          },
          {
            "label": "Flexão normal: rápida, não estereotipada",
            "points": 4
          },
          {
            "label": "Flexão anormal: lenta, estereotipada",
            "points": 3
          },
          {
            "label": "Extensão",
            "points": 2
          },
          {
            "label": "Ausente, sem interferência",
            "points": 1
          },
          {
            "label": "Não testável: fator limitante",
            "points": null
          }
        ]
      }
    ],
    "source": "Glasgow Coma Scale, auxílio oficial em português, Sir Graham Teasdale / NHS (2015).",
    "note": "Verificar fatores de interferência, observar e pontuar a melhor resposta em cada componente. Não testável (NT) não equivale a 1 nem a zero; não há total válido quando um componente não é testável. Esta escala não inclui ajuste pupilar.",
    "url": "https://www.glasgowcomascale.org/downloads/GCS-Assessment-Aid-Portuguese.pdf"
  },
  "gbs": {
    "title": "Glasgow-Blatchford (referência NHS)",
    "protocol": "adulto-hemorragia-digestiva",
    "nodes": [
      "hd-score"
    ],
    "fields": [
      {
        "key": "urea",
        "label": "Ureia em mmol/L (não BUN; não mg/dL)",
        "options": [
          {
            "label": "Menos de 6,5",
            "points": 0
          },
          {
            "label": "6,5 a menos de 8",
            "points": 2
          },
          {
            "label": "8 a menos de 10",
            "points": 3
          },
          {
            "label": "10 a menos de 25",
            "points": 4
          },
          {
            "label": "25 ou mais",
            "points": 6
          }
        ]
      },
      {
        "key": "hb",
        "label": "Hemoglobina em g/L — escolher a faixa e sexo aplicáveis",
        "options": [
          {
            "label": "Homem ≥130 ou mulher ≥120",
            "points": 0
          },
          {
            "label": "Homem 120 a menos de 130",
            "points": 1
          },
          {
            "label": "Homem 100 a menos de 120",
            "points": 3
          },
          {
            "label": "Mulher 100 a menos de 120",
            "points": 1
          },
          {
            "label": "Menos de 100, ambos",
            "points": 6
          }
        ]
      },
      {
        "key": "sbp",
        "label": "PAS em mmHg",
        "options": [
          {
            "label": "110 ou mais",
            "points": 0
          },
          {
            "label": "100 a 109",
            "points": 1
          },
          {
            "label": "90 a 99",
            "points": 2
          },
          {
            "label": "Menos de 90",
            "points": 3
          }
        ]
      },
      {
        "key": "pulse",
        "label": "Pulso ≥100/min?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "melena",
        "label": "Melena?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 1
          }
        ]
      },
      {
        "key": "syncope",
        "label": "Síncope?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          }
        ]
      },
      {
        "key": "liver",
        "label": "Doença hepática?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          }
        ]
      },
      {
        "key": "cardiac",
        "label": "Insuficiência cardíaca?",
        "options": [
          {
            "label": "Não",
            "points": 0
          },
          {
            "label": "Sim",
            "points": 2
          }
        ]
      }
    ],
    "source": "NHS Greater Glasgow and Clyde, Glasgow Blatchford score (tabela oficial consultada em 16/10/2026).",
    "note": "Divergência municipal pendente: SMS rotula ureia em mg/dL com faixas distintas, atribui 2 à PAS 100–109 e usa pulso >100 e cardiopatia. Esta calculadora usa a tabela NHS identificada acima: ureia em mmol/L, PAS 100–109 =1, pulso ≥100 e insuficiência cardíaca. O resultado não valida automaticamente o encaminhamento municipal; confirme a aplicabilidade e use a opção de pontuação não validada quando necessário.",
    "url": "https://handbook.ggcmedicines.org.uk/guidelines/gastrointestinal-system/glasgow-blatchford-score/"
  },
  "maddrey": {
    "title": "Função discriminante de Maddrey",
    "protocol": "adulto-ictericia-no-adulto",
    "nodes": [
      "ict-maddrey"
    ],
    "fields": [],
    "source": "Fórmula: SMS Curitiba, Icterícia no adulto, p.2; unidade de bilirrubina mg/dL confirmada pela AASLD.",
    "note": "FDM = 4,6 × (TAP do paciente − TAP controle), ambos em segundos, + bilirrubina total em mg/dL. Não usar INR no lugar de TAP. SMS classifica como grave >32; AASLD usa ≥32: o valor exatamente 32 permanece divergente e requer validação clínica. Cálculo não confirma indicação de corticoide.",
    "url": "https://www.aasld.org/liver-fellow-network/core-series/why-series/why-do-we-use-steroids-maddreys-discriminant-function",
    "numeric": [
      {
        "key": "patient",
        "label": "TAP do paciente (segundos)",
        "min": 0.01,
        "max": 300
      },
      {
        "key": "control",
        "label": "TAP controle do laboratório (segundos)",
        "min": 0.01,
        "max": 300
      },
      {
        "key": "bilirubin",
        "label": "Bilirrubina total (mg/dL)",
        "min": 0,
        "max": 100
      }
    ]
  },
  "nihss": {
    "title": "NIHSS (padrão NIH/ASA)",
    "protocol": "adulto-deficit-focal-agudo",
    "nodes": [
      "p1n4",
      "p2n4"
    ],
    "fields": [
      {
        "key": "1a",
        "label": "Nível de consciência",
        "options": [
          {
            "label": "Alerta",
            "points": 0
          },
          {
            "label": "Desperta com estímulo leve",
            "points": 1
          },
          {
            "label": "Requer estímulo repetido ou forte",
            "points": 2
          },
          {
            "label": "Apenas resposta reflexa ou nenhuma resposta",
            "points": 3
          }
        ]
      },
      {
        "key": "1b",
        "label": "Mês e idade",
        "options": [
          {
            "label": "Ambas corretas",
            "points": 0
          },
          {
            "label": "Uma correta",
            "points": 1
          },
          {
            "label": "Nenhuma correta",
            "points": 2
          }
        ]
      },
      {
        "key": "1c",
        "label": "Abrir/fechar olhos e apertar/soltar mão",
        "options": [
          {
            "label": "Ambos os comandos",
            "points": 0
          },
          {
            "label": "Um comando",
            "points": 1
          },
          {
            "label": "Nenhum comando",
            "points": 2
          }
        ]
      },
      {
        "key": "2",
        "label": "Olhar horizontal",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Paralisia parcial",
            "points": 1
          },
          {
            "label": "Desvio forçado ou paralisia total",
            "points": 2
          }
        ]
      },
      {
        "key": "3",
        "label": "Campo visual",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Hemianopsia parcial",
            "points": 1
          },
          {
            "label": "Hemianopsia completa",
            "points": 2
          },
          {
            "label": "Hemianopsia bilateral",
            "points": 3
          }
        ]
      },
      {
        "key": "4",
        "label": "Face",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Assimetria leve",
            "points": 1
          },
          {
            "label": "Paralisia parcial (porção inferior)",
            "points": 2
          },
          {
            "label": "Paralisia completa superior e inferior",
            "points": 3
          }
        ]
      },
      {
        "key": "5a",
        "label": "Braço esquerdo (10 s, 90° sentado ou 45° deitado)",
        "options": [
          {
            "label": "Sustenta sem queda",
            "points": 0
          },
          {
            "label": "Queda sem tocar o apoio antes do tempo",
            "points": 1
          },
          {
            "label": "Algum esforço contra gravidade; cai no apoio",
            "points": 2
          },
          {
            "label": "Sem esforço contra gravidade",
            "points": 3
          },
          {
            "label": "Sem movimento",
            "points": 4
          },
          {
            "label": "Não testável: amputação ou fusão articular",
            "points": null
          }
        ]
      },
      {
        "key": "5b",
        "label": "Braço direito (10 s, 90° sentado ou 45° deitado)",
        "options": [
          {
            "label": "Sustenta sem queda",
            "points": 0
          },
          {
            "label": "Queda sem tocar o apoio antes do tempo",
            "points": 1
          },
          {
            "label": "Algum esforço contra gravidade; cai no apoio",
            "points": 2
          },
          {
            "label": "Sem esforço contra gravidade",
            "points": 3
          },
          {
            "label": "Sem movimento",
            "points": 4
          },
          {
            "label": "Não testável: amputação ou fusão articular",
            "points": null
          }
        ]
      },
      {
        "key": "6a",
        "label": "Perna esquerda (5 s, 30° deitado)",
        "options": [
          {
            "label": "Sustenta sem queda",
            "points": 0
          },
          {
            "label": "Queda sem tocar o apoio antes do tempo",
            "points": 1
          },
          {
            "label": "Algum esforço contra gravidade; cai no apoio",
            "points": 2
          },
          {
            "label": "Sem esforço contra gravidade",
            "points": 3
          },
          {
            "label": "Sem movimento",
            "points": 4
          },
          {
            "label": "Não testável: amputação ou fusão articular",
            "points": null
          }
        ]
      },
      {
        "key": "6b",
        "label": "Perna direita (5 s, 30° deitado)",
        "options": [
          {
            "label": "Sustenta sem queda",
            "points": 0
          },
          {
            "label": "Queda sem tocar o apoio antes do tempo",
            "points": 1
          },
          {
            "label": "Algum esforço contra gravidade; cai no apoio",
            "points": 2
          },
          {
            "label": "Sem esforço contra gravidade",
            "points": 3
          },
          {
            "label": "Sem movimento",
            "points": 4
          },
          {
            "label": "Não testável: amputação ou fusão articular",
            "points": null
          }
        ]
      },
      {
        "key": "7",
        "label": "Ataxia de membros",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Em um membro",
            "points": 1
          },
          {
            "label": "Em dois membros",
            "points": 2
          },
          {
            "label": "Não testável: amputação ou fusão articular",
            "points": null
          }
        ]
      },
      {
        "key": "8",
        "label": "Sensibilidade",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Perda leve/moderada",
            "points": 1
          },
          {
            "label": "Perda grave/total",
            "points": 2
          }
        ]
      },
      {
        "key": "9",
        "label": "Linguagem",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Afasia leve/moderada",
            "points": 1
          },
          {
            "label": "Afasia grave",
            "points": 2
          },
          {
            "label": "Mudez/afasia global",
            "points": 3
          }
        ]
      },
      {
        "key": "10",
        "label": "Disartria",
        "options": [
          {
            "label": "Normal",
            "points": 0
          },
          {
            "label": "Leve/moderada, compreensível",
            "points": 1
          },
          {
            "label": "Grave, ininteligível ou anartria",
            "points": 2
          },
          {
            "label": "Não testável: intubação ou barreira física",
            "points": null
          }
        ]
      },
      {
        "key": "11",
        "label": "Extinção/inatenção",
        "options": [
          {
            "label": "Ausente",
            "points": 0
          },
          {
            "label": "Uma modalidade sensorial",
            "points": 1
          },
          {
            "label": "Profunda ou mais de uma modalidade",
            "points": 2
          }
        ]
      }
    ],
    "source": "NIH Stroke Scale, formulário NIH disponibilizado pela American Stroke Association.",
    "note": "Pontuar o desempenho observado, seguindo a técnica padronizada, sem treinar a resposta. Ausência de colaboração não equivale automaticamente a NT. NT fica sem soma total. Divergências municipais: disartria intubado/barreira aparece como 3 (o formulário NIH usa NT); extinção/inatenção aparece 0/2/3 (NIH: 0/1/2); a faixa municipal de gravidade sobrepõe 17. A calculadora soma o padrão NIH, sem classificar gravidade nem alterar encaminhamentos; discrepâncias aguardam validação.",
    "url": "https://www.stroke.org/-/media/Data-Import/downloadables/5/2/3/NIH-Stroke-Scale-UCM_490144.pdf"
  },
  "sofa": {
    "title": "SOFA (tabela de Ferreira et al.)",
    "protocol": "adulto-sepse-em-adultos",
    "nodes": [
      "p1n23"
    ],
    "fields": [
      {
        "key": "resp",
        "label": "Respiração: PaO₂/FiO₂ (mmHg); escolher a maior pontuação aplicável",
        "options": [
          {
            "label": "Maior que 400",
            "points": 0
          },
          {
            "label": "Maior que 300 e até 400",
            "points": 1
          },
          {
            "label": "Até 300, sem preencher faixa de 3 ou 4 pontos",
            "points": 2
          },
          {
            "label": "Maior que 100 e até 200 COM suporte respiratório",
            "points": 3
          },
          {
            "label": "Até 100 COM suporte respiratório",
            "points": 4
          }
        ]
      },
      {
        "key": "platelets",
        "label": "Plaquetas (mil/µL); escolher a maior pontuação aplicável",
        "options": [
          {
            "label": "Mais de 150",
            "points": 0
          },
          {
            "label": "Maior que 100 e até 150",
            "points": 1
          },
          {
            "label": "Maior que 50 e até 100",
            "points": 2
          },
          {
            "label": "Maior que 20 e até 50",
            "points": 3
          },
          {
            "label": "Até 20",
            "points": 4
          }
        ]
      },
      {
        "key": "liver",
        "label": "Bilirrubina (mg/dL)",
        "options": [
          {
            "label": "Menos de 1,2",
            "points": 0
          },
          {
            "label": "1,2 a 1,9",
            "points": 1
          },
          {
            "label": "2,0 a 5,9",
            "points": 2
          },
          {
            "label": "6,0 a 11,9",
            "points": 3
          },
          {
            "label": "Mais de 12",
            "points": 4
          },
          {
            "label": "Valor em lacuna dos intervalos impressos, incluindo 12 exato",
            "points": null
          }
        ]
      },
      {
        "key": "cardio",
        "label": "Cardiovascular — maior pontuação aplicável; drogas em µg/kg/min por ≥1 hora",
        "options": [
          {
            "label": "PAM ≥70 mmHg e sem vasoativo",
            "points": 0
          },
          {
            "label": "PAM <70 mmHg, sem critério maior",
            "points": 1
          },
          {
            "label": "Dopamina ≤5 ou dobutamina em qualquer dose",
            "points": 2
          },
          {
            "label": "Dopamina >5 até 15, ou adrenalina/noradrenalina ≤0,1",
            "points": 3
          },
          {
            "label": "Dopamina >15, ou adrenalina/noradrenalina >0,1",
            "points": 4
          }
        ]
      },
      {
        "key": "gcs",
        "label": "Glasgow",
        "options": [
          {
            "label": "15",
            "points": 0
          },
          {
            "label": "13–14",
            "points": 1
          },
          {
            "label": "10–12",
            "points": 2
          },
          {
            "label": "6–9",
            "points": 3
          },
          {
            "label": "Menos de 6",
            "points": 4
          },
          {
            "label": "Não testável",
            "points": null
          }
        ]
      },
      {
        "key": "renal",
        "label": "Renal — maior pontuação aplicável; creatinina mg/dL, diurese mL/dia",
        "options": [
          {
            "label": "Creatinina <1,2, sem critério de diurese maior",
            "points": 0
          },
          {
            "label": "Creatinina 1,2–1,9, sem critério maior",
            "points": 1
          },
          {
            "label": "Creatinina 2–3,4, sem critério maior",
            "points": 2
          },
          {
            "label": "Creatinina 3,5–4,9 OU diurese <500",
            "points": 3
          },
          {
            "label": "Creatinina >5 OU diurese <200",
            "points": 4
          },
          {
            "label": "Creatinina em lacuna impressa e sem critério de diurese que resolva",
            "points": null
          }
        ]
      }
    ],
    "source": "Ferreira et al., JAMA 2001;286:1754–1758, tabela 1 (SOFA).",
    "note": "Escolher a pior faixa aplicável de cada sistema. Divergências da SMS: bilirrubina 0 pontos impressa >1,2; dopamina 5–5,1 sem faixa; limiares respiratórios/plaquetários diferem. Calculadora usa a tabela publicada indicada, sem substituir as condutas municipais. Lacunas numéricas do próprio artigo ficam pendentes. Unidade e duração dos vasoativos são explícitas.",
    "url": "https://jamanetwork.com/journals/jama/fullarticle/194262"
  }
};
definitions.sofa.nodes.push('sp-pulm','sp-urine','sp-abdom','sp-skin','sp-cns','sp-undefined');
function matches(protocol,node){
 return Object.entries(definitions).filter(([key,d])=>key==='gcs'?protocol.startsWith('adulto-')&&/glasgow/i.test((node.text||'')+' '+(node.criteria||''))&&!/blatchford/i.test(node.text):d.protocol===protocol&&d.nodes.includes(node.id)).map(([key])=>key);
}
function calculate(key,v,node){
 const d=definitions[key],parts=[],missing=[],uncertain=[];let min=0,max=0;
 if(key==='maddrey'){const nums={};for(const f of d.numeric){const raw=String(v[f.key]??'').trim().replace(',','.');const value=Number(raw);if(!/^\d+(?:\.\d+)?$/.test(raw)||!Number.isFinite(value)||value<f.min||value>f.max)missing.push(f.label);else nums[f.key]=value;}const complete=missing.length===0,score=complete?4.6*(nums.patient-nums.control)+nums.bilirubin:null;return {complete,score,min:score,max:score,missing,uncertain:[],parts:complete?[['4,6 × diferença de TAP',4.6*(nums.patient-nums.control)],['Bilirrubina total',nums.bilirubin]]:[],answer:null};}
 let partial=false;
 for(const f of d.fields){const raw=v[f.key];const option=raw!==undefined&&raw!==''?f.options[Number(raw)]:null;
  if(!option||!/^\d+$/.test(String(raw))){missing.push(f.label);continue;}
  if(option.range){min+=option.range[0];max+=option.range[1];uncertain.push(f.label);parts.push([f.label,option.range.join('–')]);}
  else if(option.points===null){if(key==='bps'&&node==='p2n35'&&['neutrophils','immature'].includes(f.key)){partial=true;}else missing.push(f.label);}
  else {min+=option.points;max+=option.points;parts.push([f.label,option.points]);}
 }
 const complete=missing.length===0;let answer=null;
 const band=s=>key==='malinas'?(s<5?0:s<=7?1:2):key==='gds'?(s<=5?0:s<=10?1:2):key==='qsofa'?(s>=2?0:1):key==='wells_pe'&&node==='p1n63'?(s<2?0:s<=6?1:2):key==='twist'?(s<=2?2:s<=4?0:1):key==='stridor'?(s<6?0:s===6?null:s<=8?1:2):key==='bps'?(node==='p2n47'?(s>=4?0:1):(s>=4?2:s<=0?1:0)):null;
 if(complete&&min===max)answer=band(min);
 if(complete&&min!==max){const bands=Array.from({length:max-min+1},(_,i)=>band(min+i));if(bands.every(b=>b!==null&&b===bands[0]))answer=bands[0];}
 return {complete,score:min===max?min:null,min,max,missing,uncertain,parts,answer,partial};
}
function gated(key,node){return ['malinas','gds','qsofa','twist','stridor'].includes(key)||(key==='wells_pe'&&node==='p1n63')||key==='bps';}
function allowed(key,node,v,index){if(!gated(key,node))return true;if(definitions[key].bypass?.includes(index))return true;const r=calculate(key,v,node);return r.complete&&r.answer===index;}
function resultHTML(key,r,esc){const display=Number.isFinite(r.score)?Number(r.score.toFixed(3)).toLocaleString('pt-BR'):'—';return `<strong>${esc(definitions[key].title)}: ${r.complete?(r.score===null?`${r.min}–${r.max} pontos (intervalo documental)`:`${display} pontos${r.partial?' (subtotal antes do hemograma)':''}`):'cálculo pendente'}</strong>`+(r.missing.length?`<p>Faltam dados válidos: ${esc(r.missing.join('; '))}. Nenhum campo vazio vale zero.</p>`:'')+(r.complete&&gated(key,definitions[key].nodes[0])&&r.answer===null?'<p>A tabela não permite definir uma única faixa para esse resultado. Validar o ponto específico descrito abaixo antes de escolher a conduta.</p>':'')+`<details><summary>Contribuição de cada componente</summary><ul>${r.parts.map(([label,points])=>`<li>${esc(label)}: ${esc(points)}</li>`).join('')}</ul></details>`;}
function render(key,v,node,esc){const d=definitions[key];return `<section class="psi-calculator score-calculator" aria-labelledby="score-title-${key}"><h3 id="score-title-${key}">Calculadora ${esc(d.title)}</h3><div class="psi-fields">`+d.fields.map(f=>`<label>${esc(f.label)}<select data-score="${key}" data-field="${f.key}"><option value="">Selecione</option>`+f.options.map((o,i)=>`<option value="${i}" ${v[f.key]===String(i)?'selected':''}>${esc(o.label)}${o.points!==null?' — '+o.points+' ponto(s)':''}</option>`).join('')+'</select></label>').join('')+(d.numeric||[]).map(f=>`<label>${esc(f.label)}<input type="text" inputmode="decimal" step="any" min="${f.min}" max="${f.max}" data-score="${key}" data-field="${f.key}" value="${esc(v[f.key]||'')}"></label>`).join('')+`</div><div class="psi-result" data-score-result="${key}" role="status" aria-live="polite">${resultHTML(key,calculate(key,v,node),esc)}</div><p class="psi-help">${esc(d.note)}</p><small>${esc(d.source)}${d.url?' <a href="'+esc(d.url)+'" target="_blank" rel="noopener noreferrer">Fonte complementar</a>':''}</small></section>`;}
// Reconstruct the three score alternatives shown in the original estridor diagram.
const stridor=window.PROTOCOLS?.['infantil-estridor'];
if(stridor){const n=stridor.nodes.p1n15;n.question=true;n.text='Qual a classificação do escore clínico do estridor?';n.choices=[{label:'Leve — menos de 6',to:'p1n22'},{label:'Moderada — 7 a 8',to:'p1n24'},{label:'Grave — mais de 8',to:'p1n28'}];definitions.stridor.nodes=['p1n15'];}
for(const [id,node]of [['adulto-tromboembolismo-pulmonar','p1n63'],['infantil-escroto-agudo','p2n29'],['infantil-pneumonia-em-pediatria','p2n35']]){const n=window.PROTOCOLS?.[id]?.nodes[node];if(n)n.question=true;}
const hd=window.PROTOCOLS?.['adulto-hemorragia-digestiva']?.nodes['hd-score'];if(hd)hd.criteria=hd.criteria.replace('Não foi criada calculadora que confirme automaticamente esse escore.','A calculadora abaixo usa a tabela NHS como referência complementar, explicitando as divergências; não valida automaticamente a aplicação das faixas municipais.');
const md=window.PROTOCOLS?.['adulto-ictericia-no-adulto']?.nodes['ict-maddrey'];if(md)md.criteria='FDM = 4,6 × (TAP do paciente − TAP controle), em segundos, + bilirrubina total. Unidade mg/dL confirmada na AASLD. SMS: grave se >32; AASLD: ≥32. Em exatamente 32, validar divergência antes da conduta. O cálculo não determina sozinho indicação de corticoide.';
window.SCORE_CALCULATORS={definitions,matches,calculate,gated,allowed,render,resultHTML};
})();
