"""Render original PDF panels, including vector arrows/captions (never redraw ECGs)."""
import hashlib
import json
from pathlib import Path
import sys
import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA = '93f01060d5b99ef4fddebc5f8c8749152bd642cca3615e8821ff8fdad4e51dcd'
PANELS = [
    ('bav-1', 4, (36, 120, 496, 255), 'BAV de 1º grau'),
    ('mobitz-1', 4, (36, 263, 496, 382), 'BAV de 2º grau — Mobitz I'),
    ('mobitz-2', 4, (36, 391, 496, 524), 'BAV de 2º grau — Mobitz II'),
    ('bav-total', 4, (36, 562, 496, 682), 'BAV de 3º grau ou total (BAVT)'),
    ('tsv', 5, (40, 116, 496, 245), 'Taquicardia supraventricular'),
    ('fa', 5, (40, 254, 496, 361), 'Fibrilação atrial'),
    ('flutter', 5, (40, 400, 496, 504), 'Flutter atrial'),
    ('wpw', 5, (40, 548, 496, 687), 'Pré-excitação / Wolff-Parkinson-White (ECG sem arritmia na fonte)'),
    ('tv-mono', 6, (40, 119, 496, 233), 'Taquicardia ventricular monomórfica'),
    ('tv-poli', 6, (40, 272, 496, 385), 'Taquicardia ventricular polimórfica'),
    ('torsades', 6, (40, 415, 496, 540), 'Torsades de pointes'),
]

def main():
    source = Path(sys.argv[1])
    assert hashlib.sha256(source.read_bytes()).hexdigest() == SOURCE_SHA, 'PDF changed: review crop coordinates before extraction'
    doc = fitz.open(source)
    dest = ROOT / 'site/assets/ecg/arritmias'
    dest.mkdir(parents=True, exist_ok=True)
    media = {}
    for key, page, box, title in PANELS:
        pix = doc[page - 1].get_pixmap(matrix=fitz.Matrix(3, 3), clip=fitz.Rect(box), alpha=False)
        pix.save(str(dest / (key + '.png')))
        media[key] = dict(src='./assets/ecg/arritmias/' + key + '.png', title=title, page=page,
                          width=pix.width, height=pix.height, crop=list(box),
                          alt=title + ' — painel original do PDF, incluindo traçado, legenda e marcações.')
    manifest = dict(url='https://saude.curitiba.pr.gov.br/images/DUE/ARRITMIAS.pdf',
                    version='v. 2 — 24/06/2024', sha256=SOURCE_SHA, retrieved='2026-10-09', files=media)
    (dest / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    (ROOT / 'site/arrhythmia-ecg.js').write_text("'use strict';\nwindow.ARRHYTHMIA_ECG = " + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n')
    print('Extracted', len(media), 'original ECG panels')

if __name__ == '__main__':
    main()
