export interface MentorshipColleague {
  id: string
  name: string
  role: string
  institution: string
  period: string
  photo: string
  projectTitle: string
  projectScope: string
  frameworkTags: string[]
  jointOutputs?: string[]
}

export interface MentoringPillar {
  title: string
  subtitle: string
  description: string
  iconType: 'flask' | 'microscope' | 'book'
}

export const mentoringPillars: MentoringPillar[] = [
  {
    title: 'Framework Synthesis & Design',
    subtitle: 'Reticular Architecture',
    description: 'Guiding junior researchers through solvothermal, microwave, and mechanochemical synthetic routes to produce highly crystalline MOFs and COFs.',
    iconType: 'flask',
  },
  {
    title: 'Advanced Characterization',
    subtitle: 'Structure & Nanoscale Morphology',
    description: 'Hands-on training in gas sorption isotherms (BET), powder XRD crystallography, FT-IR/NMR spectroscopy, and electron microscopy (TEM & FESEM).',
    iconType: 'microscope',
  },
  {
    title: 'Scientific Communication',
    subtitle: 'Publishing & Cover Art',
    description: 'Coaching on high-impact manuscript preparation, rigorous data presentation, scientific cover art design, and international conference talks.',
    iconType: 'book',
  },
]

export const mentorshipColleagues: MentorshipColleague[] = [
  {
    id: 'pooja-rathi',
    name: 'Dr. Pooja Rathi',
    role: 'Doctoral Researcher / Research Scholar',
    institution: 'School of Chemical Science · IIT Mandi',
    period: '2021 — 2025',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    projectTitle: 'NanoCOFs for Targeted Drug Delivery & Precision Cancer Therapy',
    projectScope: 'Collaborative development of imine- and triazine-linked nanoscale covalent organic frameworks tailored for high-capacity doxorubicin loading, biocompatible surface engineering, and stimuli-responsive intracellular drug release.',
    frameworkTags: ['NanoCOF Drug Delivery', 'Doxorubicin Loading', 'Triazine COFs', 'TEM & Cell Uptake'],
    jointOutputs: [
      'Small · 2025 · Review on COF Nanocarriers (e05835)',
      'Materials Advances · 2024 · Pore-Interface Engineering (5, 136)',
      'Inorganic Chemistry · 2023 · Systematic Thiol Decoration in UiO-66 (62, 3875)',
    ],
  },
  {
    id: 'abul-hasnat',
    name: 'Abul Hasnat',
    role: 'Research Colleague & Nanomaterials Specialist',
    institution: 'IIT Mandi / Collaborating Labs',
    period: '2022 — 2024',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    projectTitle: 'Electrospun Nanofiber–COF Composites for Volatile Radioiodine Capture',
    projectScope: 'Engineering flexible, continuous electrospun polymeric nanofiber scaffolds integrated with nano/mesoscale covalent organic frameworks for high-efficiency capture and storage of volatile radioactive iodine.',
    frameworkTags: ['Electrospun Nanofibers', 'Volatile Iodine Sorption', 'Porous Sorbents', 'FESEM Analysis'],
    jointOutputs: [
      'Small · 2024 · Electrospun Nanofiber Supported COFs (21, 2409495)',
      'French MOFs 2025 · Invited Oral Presentation',
    ],
  },
  {
    id: 'ankita-sharma',
    name: 'Ankita Sharma',
    role: 'Graduate Researcher & Materials Chemist',
    institution: 'School of Chemical Science · IIT Mandi',
    period: '2022 — 2024',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    projectTitle: 'Pore-Microenvironment Tuning for Structure–Activity Correlation in Catalysis',
    projectScope: 'Investigating post-synthetic microenvironment modifications in isoreticular frameworks to establish fundamental structure-property relationships across gas adsorption and catalytic conversions.',
    frameworkTags: ['Pore Functionalization', 'Structure–Activity Correlation', 'Heterogeneous Catalysis', 'Gas Adsorption'],
    jointOutputs: [
      'Journal of Colloid and Interface Science · 2024 (665, 988)',
      'EuroMOF2025 · Poster Presentation',
    ],
  },
  {
    id: 'manoj-kumar',
    name: 'Manoj Kumar',
    role: 'Research Associate & Membrane Technologist',
    institution: 'IIT Mandi',
    period: '2021 — 2024',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    projectTitle: 'Reticular Porous Membranes for Wastewater Decontamination',
    projectScope: 'Designing advanced separation membranes combining electrospun matrices and reticular porous adsorbents for hazardous industrial dye rejection, heavy metal separation, and environmental water remediation.',
    frameworkTags: ['Membrane Separation', 'Wastewater Treatment', 'Reticular Adsorbents', 'Inside Cover Art'],
    jointOutputs: [
      'Environ. Sci.: Water Res. Technol. · 2024 (10, 29) — Featured Inside Cover Art',
      'Journal of Cleaner Production · 2022 (345, 131180)',
    ],
  },
  {
    id: 'rupjyoti-gogoi',
    name: 'Dr. Rupjyoti Gogoi',
    role: 'Doctoral Researcher in Environmental Nanomaterials',
    institution: 'IIT Mandi',
    period: '2022 — 2024',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    projectTitle: 'Mechanochemically Activated COFs for Organic Pollutant Degradation',
    projectScope: 'Developing solvent-free mechanical pulverization routes for metal-free covalent organic frameworks serving as robust heterogeneous photocatalysts for Fenton-like oxidative degradation and chromium reduction.',
    frameworkTags: ['Fenton-Like Catalysis', 'Metal-Free COFs', 'Chromium Reduction', 'Green Synthesis'],
    jointOutputs: [
      'Journal of Environmental Chemical Engineering · 2024 (12, 112006)',
      'ACS Applied Energy Materials · 2021 (4, 6082)',
    ],
  },
  {
    id: 'kavita-sharma',
    name: 'Dr. Kavita Sharma',
    role: 'Postdoctoral Fellow & Photochemistry Specialist',
    institution: 'CEISAM · University of Nantes',
    period: '2024 — Present',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    projectTitle: 'Solar-Driven CO₂ Reduction with Conjugated MOF & COF Hybrids',
    projectScope: 'Co-investigating light-harvesting porphyrinic frameworks and charge-transfer pathways under the PEPR-SPLEEN POWER-CO₂ project to achieve selective photocatalytic conversion of carbon dioxide to solar fuels.',
    frameworkTags: ['CO₂ Conversion', 'Solar Photocatalysis', 'POWER-CO₂ Project', 'Porphyrin Hybrids'],
    jointOutputs: [
      'PEPR-SPLEEN POWER-CO₂ Days · 2025 · Invited Oral Talk',
      'EuroMOF2025 · Research Poster',
    ],
  },
]

