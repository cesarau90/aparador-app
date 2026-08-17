export const TALLAS = ["XS", "S", "M", "L", "XL"];

export const METODOS_PAGO_DEFAULT = [
  "Efectivo",
  "Tarjeta crédito/débito",
  "Transferencia SPEI",
  "OXXO Pay",
  "PayPal",
  "Mercado Pago",
];

export const uid = () => Math.random().toString(36).slice(2, 9);

export const DEMOS = {
  papeleria: [
    { nombre: "Cuaderno profesional cuadro chico 100 hojas", categoria: "Cuadernos", precio: "32", oferta: "", notas: "Pasta dura, colores surtidos", tallas: {} },
    { nombre: "Paquete 12 plumas gel 0.5 mm negras", categoria: "Escritura", precio: "68", oferta: "", notas: "Punta metálica, tinta de secado rápido", tallas: {} },
    { nombre: "Mochila escolar 3 compartimentos", categoria: "Mochilas", precio: "349", oferta: "299", notas: "Poliéster reforzado, porta laptop 14\"", tallas: {} },
    { nombre: "Set de 24 colores de madera", categoria: "Arte", precio: "95", oferta: "", notas: "Hexagonales, madera de cedro", tallas: {} },
    { nombre: "Engrapadora metálica media", categoria: "Oficina", precio: "119", oferta: "", notas: "Usa grapa 26/6, capacidad 20 hojas", tallas: {} },
  ],
  taqueria: [
    { nombre: "Orden de tacos de pastor (5 pzas)", categoria: "Tacos", precio: "85", oferta: "", notas: "Con piña, cilantro y cebolla", tallas: {} },
    { nombre: "Gringa de pastor", categoria: "Especialidades", precio: "72", oferta: "", notas: "Tortilla de harina con queso gratinado", tallas: {} },
    { nombre: "Volcán de bistec", categoria: "Especialidades", precio: "65", oferta: "", notas: "Tostada de maíz con queso fundido", tallas: {} },
    { nombre: "Agua fresca de horchata 1 L", categoria: "Bebidas", precio: "45", oferta: "", notas: "Hecha en casa, con canela", tallas: {} },
    { nombre: "Kilo de pastor para llevar", categoria: "Para llevar", precio: "290", oferta: "", notas: "Incluye 30 tortillas, salsas y guarnición", tallas: {} },
  ],
  tienda: [
    { nombre: "Blusa floral manga corta", categoria: "Blusas", precio: "299", oferta: "199", notas: "Tela ligera poliéster, colores: rosa, blanco, azul", tallas: { XS: true, S: true, M: true, L: false, XL: false } },
    { nombre: "Jeans skinny tiro alto mujer", categoria: "Pantalones", precio: "599", oferta: "", notas: "Mezclilla stretch, color azul oscuro y negro", tallas: { XS: false, S: true, M: true, L: true, XL: false } },
    { nombre: "Vestido casual midi rayas", categoria: "Vestidos", precio: "450", oferta: "350", notas: "Algodón, manga 3/4, ideal para oficina o salida", tallas: { XS: true, S: true, M: false, L: false, XL: true } },
    { nombre: "Chamarra de mezclilla oversize", categoria: "Chamarras", precio: "799", oferta: "", notas: "Denim grueso, bolsillos laterales, unisex", tallas: { XS: false, S: true, M: true, L: true, XL: true } },
    { nombre: "Falda plisada mini", categoria: "Faldas", precio: "349", oferta: "280", notas: "Tela satinada, colores: negro, vino, beige", tallas: { XS: true, S: true, M: true, L: false, XL: false } },
  ],
};
