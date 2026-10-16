export const expertises = [
  { title: "Architecture d'intérieur", text: "Plans, volumes, matières et lumière, pensés pour la vie quotidienne.", tags: ["Plans", "Matériaux", "Éclairage", "Rendus 3D"], image: "/expertises/architecture.jpg" },
  { title: "Design & Mobilier", text: "Pièces sur mesure qui allient savoir-faire tunisien et lignes contemporaines.", tags: ["Sur mesure", "Cuisines", "Décoration", "Artisans"], image: "/expertises/mobilier.jpg" },
  { title: "Résidentiel", text: "Villas, appartements, rénovations : des intérieurs qui vous ressemblent.", tags: ["Villas", "Rénovation", "Petits espaces"], image: "/expertises/residentiel.jpg" },
  { title: "Commercial", text: "Restaurants, boutiques, bureaux : des lieux qui racontent votre marque.", tags: ["Restaurants", "Boutiques", "Bureaux"], image: "/expertises/commercial.jpg" },
  { title: "Suivi de chantier", text: "Un accompagnement de A à Z : projet, délais et budget respectés.", tags: ["Coordination", "Qualité", "Budget"], image: "/expertises/chantier.jpg" },
];

export const projects = [
  { name: "Villa Sfax", type: "Résidentiel", year: "2024", image: "/projets/p1.jpg" },
  { name: "Café Medina", type: "Commercial", year: "2023", image: "/projets/p2.jpg" },
  { name: "Appartement La Marsa", type: "Résidentiel", year: "2023", image: "/projets/p3.jpg" },
  { name: "Showroom Tunis", type: "Commercial", year: "2022", image: "/projets/p4.jpg" },
  { name: "Maison Mahdia", type: "Rénovation", year: "2021", image: "/projets/p5.jpg" },
  { name: "Bureaux Lac 2", type: "Commercial", year: "2020", image: "/projets/p6.jpg" },
];

export const stats = [
  { value: 20, suffix: "+", label: "ans d'expérience" },
  { value: 150, suffix: "+", label: "projets réalisés" },
  { value: 12, suffix: "", label: "salons et événements" },
];

/* image + dégradé de secours tant que tes photos ne sont pas dans /public */
export const bg = (src, i = 0) => {
  const g = [["#0a0a0a", "#c9a24b"], ["#c9a24b", "#0a0a0a"], ["#f7f4ec", "#c9a24b"], ["#1a1a1a", "#c9a24b"]][i % 4];
  return { backgroundImage: `url(${src}), linear-gradient(135deg, ${g[0]}, ${g[1]})` };
};

export const process = [
  { n: "01", title: "Écoute", text: "Un premier rendez-vous pour comprendre vos habitudes, votre budget et l'esprit que vous recherchez." },
  { n: "02", title: "Conception", text: "Plans, ambiances, matières et rendus 3D : vous visualisez l'espace avant qu'il existe." },
  { n: "03", title: "Réalisation", text: "Choix des artisans, coordination des corps de métier et suivi de chantier au quotidien." },
  { n: "04", title: "Livraison", text: "Finitions, décoration et remise des clés : un espace prêt à vivre, fidèle au projet." },
];

export const values = [
  { title: "Savoir-faire local", text: "Nous travaillons avec des artisans tunisiens pour des pièces durables et singulières." },
  { title: "Sur mesure", text: "Chaque espace est unique : aucune solution toute faite, tout est dessiné pour vous." },
  { title: "Rigueur", text: "Délais, budget et qualité d'exécution tenus du premier plan à la livraison." },
  { title: "Lumière & matière", text: "Nous partons de la lumière naturelle et des matières nobles pour créer l'atmosphère." },
];

export const faq = [
  { q: "Comment se déroule un premier contact ?", a: "Vous nous écrivez via le formulaire. Nous revenons vers vous rapidement pour fixer un rendez-vous, sur place ou à distance." },
  { q: "Intervenez-vous dans toute la Tunisie ?", a: "Oui, l'agence est basée à Sfax et se déplace pour des projets dans tout le pays." },
  { q: "Proposez-vous un suivi de chantier ?", a: "Oui, c'est une de nos expertises : coordination des artisans, respect des délais et du budget." },
  { q: "Puis-je ne faire appel à vous que pour la conception ?", a: "Bien sûr. Vous pouvez choisir une mission de conception seule, ou un accompagnement complet jusqu'à la livraison." },
];
