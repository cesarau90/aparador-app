export function fichaTexto(p) {
  const tallasInfo =
    p.tallas && Object.keys(p.tallas).length > 0
      ? `tallas disponibles: ${Object.entries(p.tallas).filter(([, v]) => v).map(([k]) => k).join(", ") || "ninguna"} | tallas agotadas: ${Object.entries(p.tallas).filter(([, v]) => !v).map(([k]) => k).join(", ") || "ninguna"}`
      : "sin manejo de tallas";
  const precioInfo = p.oferta
    ? `precio regular: $${p.precio} | precio oferta: $${p.oferta} MXN`
    : `precio: $${p.precio || "?"} MXN`;
  return `- ${p.nombre} | categoría: ${p.categoria || "sin categoría"} | ${precioInfo} | ${tallasInfo} | notas: ${p.notas || "ninguna"}${p.ia ? ` | descripción: ${p.ia.corta}` : ""}`;
}
