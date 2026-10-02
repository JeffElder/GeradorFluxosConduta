import fitz,json,re,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT.parent
OUT=WORK/'tmp/graphs'; OUT.mkdir(parents=True,exist_ok=True); sources={}
def dist_rect(pt,r):
 x,y=pt;x0,y0,x1,y1=r
 # distance to boundary, not interior
 return min(abs(x-x0),abs(x-x1),abs(y-y0),abs(y-y1)) if x0<=x<=x1 and y0<=y<=y1 else math.hypot(max(x0-x,0,x-x1),max(y0-y,0,y-y1))
def tidy(t):
 t=re.sub(r'\n([•])\s*\n',r'\n\1 ',t);t=re.sub(r'\s+',' ',t).strip();return t
for f in sorted((WORK/'tmp/pdfs').glob('*.pdf')):
 doc=fitz.open(f);pages=[]
 for pn,page in enumerate(doc):
  drawings=page.get_drawings();nodes=[];arrows=[];tp=page.get_textpage()
  for i,d in enumerate(drawings):
   r=d['rect'];text=tidy(tp.extractTextbox(r))
   if d['type'] in ['s','fs'] and r.width>35 and r.height>14 and r.y0>85 and r.get_area()<page.rect.get_area()*.91 and len(text)>5:
    # closed rounded rectangles, diamonds, or plain rectangles
    if len(d['items']) in [1,4,8] or d.get('closePath'):
     nodes.append({'id':i,'rect':list(r),'text':text,'raw':tp.extractTextbox(r),'diamond':len(d['items'])==4 and all(x[0]=='l' for x in d['items']) and abs(d['items'][0][1].y-d['items'][0][2].y)>2,'dashes':d['dashes']})
   its=d['items']
   expanded=[]
   for it in its:
    if it[0]=='re':
     rr=it[1];expanded.extend([('l',rr.tl,rr.tr),('l',rr.tr,rr.br),('l',rr.br,rr.bl),('l',rr.bl,rr.tl)])
    else:expanded.append(it)
   its=expanded
   if d['type'] in ['f','fs'] and len(its)>=7 and all(x[0]=='l' for x in its) and len(its[-3:])==3:
    a,b,c=its[-3:]
    if a[1].distance_to(c[2])<.2 and a[2].distance_to(b[1])<.2 and b[2].distance_to(c[1])<.2:
     if a[1].distance_to(a[2])<20 and b[1].distance_to(b[2])<20 and c[1].distance_to(c[2])<20:
      arrows.append({'id':i,'start':list(its[0][1]),'end':list(a[2]),'path':[(list(x[1]),list(x[2])) for x in its]})
  # drop surrounding outer panels if they contain distinct nodes
  nodes=[n for n in nodes if not any(m['id']!=n['id'] and fitz.Rect(n['rect']).contains(fitz.Rect(m['rect'])) for m in nodes)]
  def near(pt):
   if not nodes:return None,10000
   scores=sorted((dist_rect(pt,n['rect']),n['id']) for n in nodes);return scores[0][1],scores[0][0]
  def segdist(p,a,b):
   dx=b[0]-a[0];dy=b[1]-a[1];u=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy or 1)));return math.hypot(p[0]-a[0]-u*dx,p[1]-a[1]-u*dy)
  def src(ar,seen=None):
   seen=(seen or set())|{ar['id']};node,d=near(ar['start'])
   if d<4:return node
   adj=sorted((min(segdist(ar['start'],a,b) for a,b in x['path']),x['id']) for x in arrows if x['id'] not in seen)
   if adj and adj[0][0]<3:return src(next(x for x in arrows if x['id']==adj[0][1]),seen)
   return None
  words=page.get_text('words');labels=[]
  for word in words:
   if word[4].upper() in ['SIM','NÃO','NAO']:
    pt=((word[0]+word[2])/2,(word[1]+word[3])/2)
    def inside(n):
     r=fitz.Rect(n['rect'])
     if n['diamond']:return abs(pt[0]-(r.x0+r.x1)/2)/(r.width/2)+abs(pt[1]-(r.y0+r.y1)/2)/(r.height/2)<=1
     return r.contains(fitz.Point(*pt))
    if not any(inside(n) for n in nodes):labels.append((pt,word[4].capitalize()))
  edges=[]
  for ar in arrows:
   to,d=near(ar['end']);fr=src(ar)
   if fr is not None and to is not None and fr!=to and d<5:
    ls=sorted((min(segdist(pt,a,b) for a,b in ar['path']),label) for pt,label in labels)
    edges.append({'from':fr,'to':to,'label':ls[0][1] if ls and ls[0][0]<16 else '', 'arrow':ar['id']})
  pages.append({'page':pn+1,'nodes':nodes,'edges':edges,'text':page.get_text(),'width':page.rect.width,'height':page.rect.height})
 sources[f.stem]=pages
 (OUT/(f.stem+'.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2))
 # Display graph and orphan notes as review material.
 lines=[]
 for p in pages:
  lines.append('\nPAGE '+str(p['page']))
  for n in p['nodes']:
   es=[e for e in p['edges'] if e['from']==n['id']]
   lines.append(f"{n['id']}{'?' if n['diamond'] else ''}: {n['text']}\n  -> "+', '.join(f"{e['label']}:{e['to']}" for e in es))
 (OUT/(f.stem+'.review.txt')).write_text('\n'.join(lines))
print('Extracted',len(sources),'documents,',sum(len(p['nodes']) for pages in sources.values() for p in pages),'panels')
