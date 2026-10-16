/* Délai avant les animations d'entrée d'une page : attend le préloader (1er chargement) */
export const introDelay = () => (typeof window !== "undefined" && window.__loaded ? 0.3 : 2.1);
