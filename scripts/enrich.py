import json,re,unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def n(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
rules=[
 ('Gestação e ginecologia',r'gestant|gestacao|parto|pelvica|genital'),
 ('Cardiovascular',r'arritmi|cardiaca|hipertensiva|toracica$|coronarian|vascular periferico|sincope'),
 ('Respiratório',r'respiratoria|pneumonia|pulmonar|sibilancia|estridor|aspiracao|toracica ventilatorio'),
 ('Neurologia',r'cefaleia|convulsiv|deficit|delirium|consciencia|tontura'),
 ('Infecções',r'hiv|tuberculose|sepse|leptospirose|febre|inflamatoria multissistemica'),
 ('Digestivo',r'diarreia|abdominal|anorretais|digestiva|ictericia|nauseas'),
 ('Renal e urologia',r'renal|urinario|hematuria|dialitica|escroto'),
 ('Trauma e toxicologia',r'traumatismo|intoxic|peconhent|lombalgia'),
 ('Outros atendimentos',r'psiquiatri|dermatose|exantemat|farmacodermi|garganta|ouvido|odontolog|oncologic|obesidade'),
 ('Apoio assistencial',r'desospitalizacao|raio-x'),
 ('Emergências gerais',r'choque|parada|hiperglicemica')]
alias_rules=[
(r'parada', 'PCR RCP reanimacao ressuscitacao parada cardiaca cardiorrespiratoria'),
(r'deficit focal','AVC AVE AIT derrame acidente vascular cerebral deficit neurologico fraqueza hemiparesia'),
(r'coronarian','SCA IAM infarto angina dor no peito dor toracica'),
(r'dor toracica','dor no peito torax'),(r'convulsiv','convulsao epilepsia crise epileptica estado de mal'),
(r'sepse','sepsis infeccao'),(r'choque','choque circulatorio hipotensao'),
(r'respiratoria','dispneia falta de ar dificuldade para respirar insuficiencia respiratoria'),
(r'sibilancia','chiado asma broncoespasmo'),(r'aspiracao','engasgo OVACE corpo estranho'),
(r'estridor','crupe laringite'),(r'hiperglicemica','CAD diabetes glicose alta glicemia cetoacidose estado hiperosmolar'),
(r'hipertensiva','pressao alta hipertensao PA'),(r'arritmi','taquicardia bradicardia palpitacao fibrilacao atrial FA TPSV'),
(r'cardiaca','ICC IC descompensada insuficiencia cardiaca edema agudo pulmonar'),
(r'cefaleia','dor de cabeca enxaqueca'),(r'sincope','desmaio perda de consciencia'),
(r'consciencia','coma sonolencia confusao RNC'),(r'delirium','confusao agitacao'),
(r'tontura','vertigem'),(r'urinario','ITU disuria dor ao urinar cistite pielonefrite'),
(r'colica renal','calculo pedra rim nefrolitiase'),(r'hematuria','sangue urina'),
(r'escroto','dor testiculo testicular torcao'),(r'dialitica','dialise renal uremia'),
(r'abdominal','dor na barriga abdomen'),(r'diarreia','diarreia desidratacao gastroenterite'),
(r'nauseas','enjoo vomito'),(r'hemorragia digestiva','HDA HDB melena hematemese sangue fezes'),
(r'ictericia','pele amarela'),(r'anorretais','hemorroida dor anal'),
(r'peconhent','picada cobra aranha escorpiao acidente ofidico'),
(r'intoxic','envenenamento overdose intoxicacao'),(r'cranio','TCE trauma craniano pancada cabeca'),
(r'ortopedico','fratura entorse luxacao trauma'),(r'lombalgia','dor lombar costas'),
(r'pulmonar','TEP embolia'),(r'exposicao','PEP profilaxia exposicao HIV'),
(r'inflamatoria multissistemica','SIM-P PIMS'),(r'hipertensiva na gestacao','DHEG pre eclampsia eclampsia'),
(r'parto','trabalho parto obstetricia'),(r'psiquiatri','agitacao psicose suicidio saude mental'),
(r'dermatos','pele lesao cutanea'),(r'exantemat','exantema manchas pele'),
(r'farmacodermi','reacao medicamento alergia pele'),(r'garganta','odinofagia faringite amigdalite'),
(r'ouvido','otalgia otite'),(r'odontolog','dor dente dental'),(r'oncologic','cancer oncologia'),
(r'febre','febril'),(r'raio-x','radiografia RX horario'),(r'desospital','saude em casa alta SAD')]
data=json.loads((ROOT/'catalog-raw.json').read_text())
for d in data:
 title=n(d['title']);d['category']=next((cat for cat,pattern in rules if re.search(pattern,title)),'Outros atendimentos')
 d['aliases']=' '.join(s for pat,s in alias_rules if re.search(pat,title))
 d['kind']='Apoio assistencial' if title.startswith('raio-x') else 'Protocolo'
 # Preserve standard acronym casing from the official titles.
 for a in ['upa','hiv','pcr','due','upas']:d['title']=re.sub(r'\b'+a+r'\b',a.upper(),d['title'],flags=re.I)
 for key in ['sha256','verified']:d.pop(key,None)
(ROOT/'site'/'catalog.js').write_text('window.CATALOG = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
print('Catalog generated:',len(data))
