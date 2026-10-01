import json,re,unicodedata,urllib.request,urllib.parse,concurrent.futures,hashlib
from pathlib import Path
import fitz
ROOT=Path(__file__).resolve().parents[1]
def normal(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
def get(item):
 g,row=item
 title=re.split(r'\s+v\.',row['title'],flags=re.I)[0].rstrip(' -')
 slug=re.sub('[^a-z0-9]+','-',normal(title)).strip('-')
 url=urllib.parse.quote(urllib.parse.unquote(row['url'].strip()),safe=':/')
 data={'id':g+'-'+slug,'title':title.capitalize(),'originalTitle':row['title'],'population':g,'url':url,'source':'https://saude.curitiba.pr.gov.br/conteudo/atendimento-'+g+('/1470' if g=='adulto' else '/1472'),'version':None,'date':None}
 m=re.search(r'v\.\s*(\d+)\s*-',row['title'],re.I)
 if m:data['version']=m[1]
 m=re.search(r'\d{2}[/\.]\d{2}[/\.]\d{4}',row['title'])
 if m:data['date']=m[0].replace('.','/')
 try:
  raw=urllib.request.urlopen(url,timeout=40).read()
  assert raw[:5]==b'%PDF-', 'Not a PDF'
  path=ROOT.parent/'tmp'/'pdfs'/(data['id']+'.pdf');path.write_bytes(raw)
  doc=fitz.open(stream=raw,filetype='pdf');data['pages']=len(doc)
  txt='\n'.join(p.get_text() for p in doc)
  path.with_suffix('.txt').write_text(txt)
  data['verified']=True;data['sha256']=hashlib.sha256(raw).hexdigest()
 except Exception as e:data['verified']=False;data['error']=str(e);print('FAIL',data['id'],str(e),flush=True)
 return data
items=[]
for g in ['adulto','infantil']:
 for row in json.loads((ROOT/(g+'-source.json')).read_text()):
  if urllib.parse.urlparse(row['url']).hostname in ['saude.curitiba.pr.gov.br','mid.curitiba.pr.gov.br']:items.append((g,row))
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:data=list(pool.map(get,items))
(ROOT/'catalog-raw.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
print('Documents',len(data),'verified',sum(x['verified'] for x in data),flush=True)
