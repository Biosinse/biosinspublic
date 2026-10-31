import {ecologyA1,ecologyA2,ecologyA3} from './ecology.mjs';
export const notePath = '/academics/undergraduate/cell-biology/cell-membrane/';
export const examNotePath = '/exams/upessc/zoology/cell-membrane/';
export const storyPath = '/explore/visual-biology/a-cells-living-boundary/';
export const levels = [
  { slug: 'life-and-nature', name: 'Life & Nature', label: 'Classes 1–5', description: 'Life, plants, animals and the world around us.', status: 'planned' },
  { slug: 'foundation', name: 'Foundation Biology', label: 'Classes 6–8', description: 'A clear beginning for the Biology inside Science.', status: 'planned' },
  { slug: 'school', name: 'School Biology', label: 'Classes 9–10', description: 'Build strong concepts, one chapter at a time.', status: 'planned' },
  { slug: 'senior-secondary', name: 'Senior Secondary', label: 'Classes 11–12', description: 'From the living cell to organisms and ecosystems.', status: 'planned' },
  { slug: 'undergraduate', name: 'Undergraduate Biology', label: 'UG / BSc', description: 'Structures, mechanisms and the experiments behind them.', status: 'available' },
  { slug: 'postgraduate', name: 'Postgraduate Biology', label: 'PG / MSc', description: 'Deeper mechanisms, regulation and interpretation.', status: 'planned' },
  { slug: 'advanced', name: 'Advanced & Reference', label: 'Go deeper', description: 'Selected topics for a more detailed understanding.', status: 'planned' }
];
export const exams = [
  { slug: 'upessc', name: 'UPESSC / UPHESC', label: 'Assistant Professor · Zoology', description: 'A dedicated home for Zoology theory and focused revision.', active: true },
  { slug: 'neet-ug', name: 'NEET UG', label: 'Biology', description: 'School-level concepts with exam-focused emphasis.' },
  { slug: 'cuet', name: 'CUET', label: 'Biology / Life Sciences', description: 'Biology pathways for relevant entrance routes.' },
  { slug: 'csir-net', name: 'CSIR–UGC NET', label: 'Life Sciences', description: 'Mechanisms, evidence and analytical understanding.', active: true },
  { slug: 'gate-xl', name: 'GATE XL', label: 'Life Sciences', description: 'A structured Life Sciences preparation pathway.' },
  { slug: 'gate-bt', name: 'GATE BT', label: 'Biotechnology', description: 'Core biological concepts and biotechnology.' },
  { slug: 'iit-jam', name: 'IIT JAM', label: 'Relevant biological science routes', description: 'Concept-led preparation for relevant routes.' },
  { slug: 'set-slet', name: 'SET / SLET', label: 'Life Sciences', description: 'State eligibility pathways, organised by topic.' }
];
export const examSupport = [
  { slug: 'ugc-net-paper-1', name: 'UGC NET Paper I', label: 'General paper', topics: ['Teaching Aptitude','Research Aptitude','Comprehension','Communication','Mathematical Reasoning and Aptitude','Logical Reasoning','Data Interpretation','Information and Communication Technology','People, Development and Environment','Higher Education System'] },
  { slug: 'csir-net-part-a', name: 'CSIR NET Part A', label: 'General aptitude', topics: ['Numerical and quantitative ability','Logical and analytical reasoning','Graphical analysis','Data interpretation','Series, patterns and puzzles'] },
  { slug: 'static-gk', name: 'Static GK', label: 'Exam support', topics: ['History','Geography','Polity','Economy','General Science','Environment','Art & Culture','Institutions and organisations','Awards and honours','Books and authors','Important days','Scientific discoveries'] }
];
export const categories = [
  ['amazing-organisms','Amazing Organisms','Remarkable lives and adaptations.','organism'],
  ['human-biology','Human Biology','The science of being human.','heart'],
  ['evolution','Evolution','The history written into life.','branch'],
  ['genetics','Genetics','Inheritance, variation and the genetic code.','dna'],
  ['biotechnology','Biotechnology','How we work with living systems.','flask'],
  ['future-biology','Future Biology','Emerging ideas, carefully explained.','spark'],
  ['discoveries','Discoveries','The findings that change our understanding.','search'],
  ['big-questions','Big Questions','Stay with a question. Follow the evidence.','question'],
  ['scientists-and-experiments','Scientists & Experiments','How we came to know what we know.','flask'],
  ['visual-biology','Visual Biology','See a concept. Make it click.','cell'],
  ['nature-and-behaviour','Nature & Behaviour','Organisms in a connected world.','leaf'],
  ['weird-biology','Weird Biology','Life has some unexpected solutions.','organism']
].map(([slug,name,description,icon])=>({slug,name,description,icon}));
export const catalog = [
  { id: 'membrane-academic', conceptId: 'cell-membrane', title: 'Cell membrane', subtitle: 'Structure, fluidity and experimental evidence', mode: 'academics', scope: 'undergraduate', scopeLabel: 'Undergraduate · Cell Biology', type: 'Interactive note', url: notePath, keywords: ['plasma membrane','lipid bilayer','fluid mosaic','cholesterol','FRAP','Frye Edidin','lipids','proteins','asymmetry','A2'], available: true },
  { id: 'membrane-exam', conceptId: 'cell-membrane', title: 'Membrane structure: focused revision', subtitle: 'A concise concept review and original practice questions', mode: 'exams', scope: 'upessc', scopeLabel: 'UPESSC / UPHESC · Zoology', type: 'Revision & practice', url: examNotePath, keywords: ['membrane','assistant professor','zoology','phospholipid','FRAP','fluidity','A2'], available: true },
  { id: 'membrane-story', conceptId: 'cell-membrane', title: 'A cell’s living boundary', subtitle: 'How a flexible film makes a cell possible', mode: 'explore', scope: 'visual-biology', scopeLabel: 'Visual Biology', type: 'Visual explainer', url: storyPath, keywords: ['cell membrane','boundary','lipids','water','bilayer'], available: true },
  { id: 'csir-ecology-a1', conceptId: 'ecology-levels-of-organisation', title: 'Ecology and levels of organisation', subtitle: 'A1 · One pond, different ecological questions', mode: 'exams', scope: 'csir-net', scopeLabel: 'CSIR NET · Life Sciences · Ecology', type: 'Interactive note', url: ecologyA1.url, keywords: ['ecology','A1','environment','population','community','ecosystem','biosphere','biome','landscape','autecology','synecology','emergent properties','ecological organisation'], available: true },
  { id: 'csir-ecology-a2', conceptId: 'ecology-physical-environment', title: 'Physical environment', subtitle: 'A2 · Temperature, light, water, soil, salinity, pH and oxygen', mode: 'exams', scope: 'csir-net', scopeLabel: 'CSIR NET · Life Sciences · Ecology', type: 'Interactive note', url: ecologyA2.url, keywords: ['ecology','A2','abiotic','physical environment','temperature','thermal performance','Q10','Arrhenius','light','PAR','PPFD','photoperiod','water potential','VPD','soil','salinity','osmoregulation','pH','alkalinity','oxygen','BOD','COD'], available: true },
  { id: 'csir-ecology-a3', conceptId: 'ecology-factors-organism-responses', title: 'Ecological factors and organism responses', subtitle: 'A3 · Biotic influences, conditions, resources, plasticity and factor interactions', mode: 'exams', scope: 'csir-net', scopeLabel: 'CSIR NET · Life Sciences · Ecology', type: 'Interactive note', url: ecologyA3.url, keywords: ['ecology','A3','biotic factors','conditions','resources','competition','apparent competition','facilitation','ecosystem engineer','Monod','R*','acclimation','plasticity','reaction norms','genotype environment','factorial','nonadditivity','pseudoreplication'], available: true }
];
