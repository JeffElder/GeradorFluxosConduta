'use strict';
// Fotos ilustrativas de espécimes, com fonte e autoria explícitas.
// Não substituem identificação taxonômica nem classificação clínica.
// Fontes: Wikimedia Commons; o protocolo municipal continua sendo a fonte clínica.
(() => {
  function entry(file,hash,description,author,license) {
    const safeName = encodeURIComponent(file.replace(/ /g,'_'));
    return {
      src:'https://upload.wikimedia.org/wikipedia/commons/thumb/'+hash[0]+'/'+hash+'/'+safeName+'/420px-'+safeName,
      source:'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file.replace(/ /g,'_')),
      alt:'Fotografia ilustrativa: '+description,
      name:description,
      author,
      license
    };
  }
  const files={
    loxosceles:entry('Loxosceles Romulo2.jpg','55','Aranha-marrom (Loxosceles intermedia)','Romulo','CC BY-SA 4.0'),
    phoneutria:entry('Phoneutria nigriventer.jpg','99','Aranha-armadeira (Phoneutria nigriventer)','João P. Burini','CC BY-SA 3.0'),
    escorpiao:entry('Tityus Serrulatus.jpg','3b','Escorpião-amarelo (Tityus serrulatus)','Rsismoreira','CC BY-SA 4.0'),
    lonomia:entry('Lonomia-obliqua-citsc-1.jpg','e3','Taturana (Lonomia obliqua)','CIT/SC','Domínio público'),
    lycosa:entry('Aranha Lycosa erythrognatha.jpg','5c','Aranha-de-jardim (Lycosa erythrognatha)','Luiz Henrique Ostrovski','Domínio público'),
    lagarta:entry('Megalopyge lanata (Megalopygidae) (16311000497).jpg','77','Outra lagarta urticante (Megalopyge lanata)','José Roberto Peruca','CC BY 2.0'),
    abelha:entry('Apis Mellifera Weston Honey Bee.jpg','48','Abelha (Apis mellifera)','Photoabc','CC0'),
    vespa:entry('Vespula Wasp (48756803817).jpg','87','Vespa (Vespula sp.)','Wikimedia Commons','Ver licença na fonte'),
    formiga:entry('Soldado Atta.jpg','ab','Formiga (Atta laevigata)','Wikimedia Commons','Ver licença na fonte'),
    jararaca:entry('Bothrops jararaca.jpg','e8','Jararaca (Bothrops jararaca)','Leandro Avelar','CC BY-SA 4.0'),
    cascavel:entry('Cascavel - crotalus durissus.jpg','be','Cascavel (Crotalus durissus)','Renato Augusto Martins','Ver licença na fonte'),
    coral:entry('Instituto Butantan 2016 072 - Coral-verdadeira (micrurus corallinus).jpg','af','Coral verdadeira (Micrurus corallinus)','Mike Peel','CC BY-SA 4.0')
  };
  window.ANIMAL_PHOTOS=Object.freeze({
    files,
    byEntry:{
      'af-marrom':['loxosceles'],
      'af-armadeira':['phoneutria'],
      'af-escorpiao':['escorpiao'],
      'af-lonomia':['lonomia'],
      'af-outros':['lycosa','lagarta','abelha','vespa','formiga'],
      'af-jararaca':['jararaca'],
      'af-cascavel':['cascavel'],
      'af-coral':['coral']
    },
    byPage:{
      1:['loxosceles'],2:['phoneutria'],3:['escorpiao'],4:['lonomia'],
      5:['lycosa','lagarta','abelha','vespa','formiga'],
      6:['jararaca'],7:['cascavel'],8:['coral']
    },
    byChoice:{
      'af-outros':['lycosa','lagarta','abelha']
    }
  });
})();