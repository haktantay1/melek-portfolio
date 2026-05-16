export const owner = {
  name:      "Melek Karlankuş",
  nameShort: "Melek",
  studio:    "YULA Design Studio",
  title:     "Interior Architect",
  tagline:   "Designing spaces where silence speaks",
  bio: `I am an interior architect based in İstanbul, crafting environments
        that emerge from the dialogue between material honesty and poetic form.
        My work spans private residences, hospitality destinations, and
        institutional spaces — each shaped by a conviction that great interiors
        do not decorate a space, they complete it.`,
  location:  "İstanbul, Turkey",
  email:     "melekkarlankus@gmail.com",
  phone:     "+90 533 969 3961",
  available: true,
  instagram: "https://www.instagram.com/yula.designstudio",
  stats: { projects: 7, years: 3, countries: 3 },
};

export const projects = [
  {
    id: "minimalist-living",
    num: "01",
    title: "Minimalist Living Space",
    subtitle: null,
    category: "Residential Interior",
    year: "2024",
    role: "Interior Design & Visualization",
    featured: true,
    coverGradient: "linear-gradient(135deg, #D4C4B0 0%, #8B6E5A 100%)",
    description: "A sophisticated residential space where organic forms meet contemporary luxury.",
    overview: `A sophisticated residential space where organic forms meet contemporary luxury.
               The project is defined by a custom-designed, fluid metallic fireplace that serves
               as a sculptural focal point. The design achieves a harmony between warm timber
               textures and minimalist Zen aesthetics, utilizing curved furniture and a carefully
               curated material palette to enhance the serene and refined atmosphere.`,
    challenge: "Creating a space that feels simultaneously warm and minimal — avoiding coldness without sacrificing clarity.",
    solution:  "A fluid metallic fireplace as the sculptural anchor, surrounded by organic terrazzo volumes and warm timber wall paneling.",
    outcome:   "A residence that breathes — every element earns its place through material honesty and spatial poetry.",
    tools:     ["AutoCAD", "3ds Max", "V-Ray", "Photoshop", "SketchUp"],
    tags:      ["Residential", "Minimalist", "Zen", "Material Study"],
    slug:      "minimalist-living",
    next:      "private-nook",
  },
  {
    id: "private-nook",
    num: "02",
    title: "Private Nook",
    subtitle: "Interior Atmosphere",
    category: "Residential Interior",
    year: "2024",
    role: "Interior Design & Visualization",
    featured: true,
    coverGradient: "linear-gradient(135deg, #C4A882 0%, #6B4E35 100%)",
    description: "A tranquil sanctuary designed for contemplation and comfort.",
    overview: `A tranquil sanctuary designed for contemplation and comfort. This private corner
               focuses on the poetic interplay of light and shadow, created by wooden blinds
               that animate the textures of the bespoke patterned seating. The design frames
               a breathtaking mountain vista, bridging the gap between the cozy, high-textured
               interior and the expansive serenity of the natural landscape.`,
    challenge: "Bridging a dramatic mountain landscape with an intimate interior without losing the sense of shelter.",
    solution:  "Wooden blinds as mediators — they animate light, texture the seating surfaces, and frame the view as a living painting.",
    outcome:   "A corner that invites stillness; a space where one comes to think, to read, to simply be.",
    tools:     ["AutoCAD", "3ds Max", "V-Ray", "Photoshop"],
    tags:      ["Residential", "Atmospheric", "Light & Shadow", "Mountain"],
    slug:      "private-nook",
    next:      "villa-ida",
  },
  {
    id: "villa-ida",
    num: "03",
    title: "Villa İDA",
    subtitle: "Holistic Architecture & Interior Design",
    category: "Architecture + Interior",
    year: "2024",
    role: "Architectural & Interior Design",
    featured: true,
    coverGradient: "linear-gradient(135deg, #B8A89A 0%, #5C4A3A 100%)",
    description: "A holistic design approach where architecture and interior were developed simultaneously.",
    overview: `A holistic design approach where the architectural shell and the interior experience
               were developed simultaneously to ensure a seamless narrative between form and function.
               Located in the serene landscape of the Ida Mountains, the project is characterized by
               a deliberate selection of materials and a sculptural form-finding process, ensuring that
               the architectural language remains in constant dialogue with its natural context.

               In ancient narratives, Mount Ida is described as a geography associated with retreat,
               observation, and contemplation. This approach forms the foundation for creating spaces
               where the user's attention is redirected from external stimuli toward their own thought
               process. The central courtyard and the adjacent workspace serve as the spatial
               manifestation of this idea.`,
    challenge: "Translating the philosophical concept of Mount Ida — retreat, observation, contemplation — into built form.",
    solution:  "A central courtyard with a water feature as the spatial heart; curved library walls that hold knowledge and frame silence.",
    outcome:   "A villa that doesn't compete with the mountain — it listens to it.",
    tools:     ["AutoCAD", "3ds Max", "V-Ray", "Photoshop", "SketchUp", "Rhino"],
    tags:      ["Architecture", "Holistic Design", "Courtyard", "Nature", "Villa"],
    slug:      "villa-ida",
    next:      "sarot-thermal",
  },
  {
    id: "sarot-thermal",
    num: "04",
    title: "Sarot Thermal Palace",
    subtitle: "Presidential Suite — Master Bedroom",
    category: "Hospitality Interior",
    year: "2023",
    role: "Interior Design & Visualization",
    featured: true,
    coverGradient: "linear-gradient(135deg, #C4B090 0%, #7A5C40 100%)",
    description: "A presidential suite that redefines 'thermal luxury' by harmonizing classical heritage with modern sophistication.",
    overview: `This project features the Master Bedroom design of the Presidential Suite at Sarot
               Thermal Palace. The space redefines 'thermal luxury' by harmonizing classical heritage
               with modern sophistication. The design is characterized by a deliberate contrast between
               ornate, gold-leaf motifs and the clean, rhythmic lines of contemporary fluted wood
               paneling. Every detail — from the bespoke vanity area to the rich material palette —
               has been curated to create an exclusive, high-end sanctuary.`,
    challenge: "Reconciling baroque grandeur with contemporary restraint in a single coherent space.",
    solution:  "Gold-leaf ornament as accent, not pattern — isolated against clean fluted wood surfaces to create controlled contrast.",
    outcome:   "A suite that feels both timeless and fresh; heritage without nostalgia.",
    tools:     ["AutoCAD", "3ds Max", "V-Ray", "Photoshop"],
    tags:      ["Hospitality", "Luxury", "Hotel", "Presidential Suite"],
    slug:      "sarot-thermal",
    next:      "tubitak-tusside",
  },
  {
    id: "tubitak-tusside",
    num: "05",
    title: "TÜBİTAK TÜSSİDE",
    subtitle: "Innovation & Collaboration Hub",
    category: "Corporate Interior",
    year: "2023",
    role: "Comprehensive Corporate Interior Design",
    featured: false,
    coverGradient: "linear-gradient(135deg, #B8C4A0 0%, #4A5C3A 100%)",
    description: "A comprehensive interior design for Turkey's leading scientific research institution.",
    overview: `A comprehensive interior design project for TÜBİTAK, focused on creating a
               high-performance environment that fosters innovation and scientific collaboration.
               The design integrates various functional zones — ranging from formal conference halls
               and meeting rooms to flexible workspaces and vibrant social areas. By prioritizing
               ergonomic solutions, acoustic comfort, and a modern aesthetic, the project provides
               a dynamic ecosystem where productivity meets social interaction.`,
    challenge: "Designing a space that serves both rigorous scientific focus and spontaneous creative collaboration.",
    solution:  "Modular 'village' zones — distinct character per zone while maintaining visual cohesion through a shared material vocabulary.",
    outcome:   "A workplace that scientists want to return to — one that makes thinking feel like an adventure.",
    tools:     ["AutoCAD", "3ds Max", "V-Ray", "Photoshop", "Revit"],
    tags:      ["Corporate", "Research", "Institutional", "Workplace"],
    slug:      "tubitak-tusside",
    next:      "healthcare-iraq",
  },
  {
    id: "healthcare-iraq",
    num: "06",
    title: "Mixed-Use Healthcare Center",
    subtitle: "Iraq",
    category: "Architectural Execution Drawings",
    year: "2023",
    role: "Architectural Documentation",
    featured: false,
    coverGradient: "linear-gradient(135deg, #A8B8C4 0%, #3A4A5C 100%)",
    description: "An extensive five-story healthcare complex with exhaustive technical documentation.",
    overview: `An extensive five-story healthcare complex where high-level medical functions are
               integrated with diverse social and commercial units. The architectural program manages
               the complex coordination of operating theaters, a hair transplant center, doctor offices,
               patient rooms, conference halls, a pharmacy, and a beauty salon. Every single unit
               within this five-story structure was developed with an exhaustive level of technical
               detail and a full-scale set of execution drawings.`,
    challenge: "Coordinating a complex multi-function medical program across five floors while maintaining clarity in technical documentation.",
    solution:  "Systematic floor-by-floor documentation with coordinated electrical, mechanical, and architectural drawings.",
    outcome:   "A complete construction document set ready for contractor handover — precision at every scale.",
    tools:     ["AutoCAD", "Revit", "Photoshop"],
    tags:      ["Healthcare", "Execution Drawings", "Technical", "Iraq"],
    slug:      "healthcare-iraq",
    next:      "candyzoo-izmir",
  },
  {
    id: "candyzoo-izmir",
    num: "07",
    title: "CandyZoo",
    subtitle: "İzmir Branch — Implementation Project",
    category: "Architectural Execution Drawings",
    year: "2022",
    role: "Implementation Project Documentation",
    featured: false,
    coverGradient: "linear-gradient(135deg, #D4A0B0 0%, #8B3A5A 100%)",
    description: "A high-energy retail space designed to turn candy shopping into a fun and memorable experience.",
    overview: `CandyZoo is a high-energy retail space designed to turn candy shopping into a fun
               and memorable experience. The design focuses on high-capacity and systematic display
               walls that keep the colorful products as the main focus. A complete set of professional
               construction drawings — covering every technical detail of the İzmir branch — was
               developed. By combining playful aesthetics with a clean, modern layout, CandyZoo
               creates an inviting atmosphere that perfectly captures the brand's energetic and sweet identity.`,
    challenge: "Translating a playful brand identity into precise, buildable construction documentation.",
    solution:  "Color-coded drawing sets where brand palette informs the documentation itself — technical clarity with visual energy.",
    outcome:   "A fully built İzmir branch, delivered on time and on brand.",
    tools:     ["AutoCAD", "Photoshop"],
    tags:      ["Retail", "Execution Drawings", "Commercial", "Brand"],
    slug:      "candyzoo-izmir",
    next:      "minimalist-living",
  },
];

export const skills = [
  "Interior Architecture", "Space Planning", "3D Visualization",
  "Material Specification", "AutoCAD", "3ds Max", "V-Ray",
  "SketchUp", "Revit", "Photoshop", "Rhino",
  "Execution Drawings", "Construction Documentation",
  "Hospitality Design", "Residential Design", "Corporate Interiors",
  "Digital Illustration", "Fashion Illustration", "Concept Development",
];

export const services = [
  {
    num: "01",
    title: "Interior Design",
    desc: "From concept to completion — residential, hospitality, and commercial spaces designed with material precision and spatial poetry.",
  },
  {
    num: "02",
    title: "3D Visualization",
    desc: "Photorealistic renders that communicate the atmosphere of a space before a single wall is built.",
  },
  {
    num: "03",
    title: "Execution Drawings",
    desc: "Technical documentation — floor plans, sections, elevations, and details — to the standard required for construction.",
  },
  {
    num: "04",
    title: "Digital Illustration",
    desc: "Architectural and fashion illustrations that tell the story of a space or a style with an artist's hand.",
  },
];
