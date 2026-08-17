import { useState } from "react";
import Papa from "papaparse";
import { Tag, MessagesSquare, Lightbulb, Settings, X } from "lucide-react";

import { DEMOS, uid, TALLAS } from "./constants";
import { pedirAClaude, extraerJSON } from "./api";
import { fichaTexto } from "./utils";
import CatalogoView from "./components/CatalogoView";
import ChatView from "./components/ChatView";
import SugerenciasView from "./components/SugerenciasView";
import ConfigView from "./components/ConfigView";
import "./aparador.css";

export default function Aparador() {
  /* ---------- catálogo ---------- */
  const [productos, setProductos] = useState([]);
  const [abierto, setAbierto] = useState(null);
  const [copiado, setCopiado] = useState(null);
  const [lote, setLote] = useState(null);
  const [error, setError] = useState("");
  const [nuevo, setNuevo] = useState({ nombre: "", categoria: "", precio: "", oferta: "", notas: "", tallas: {} });
  const [mostrarAlta, setMostrarAlta] = useState(false);

  /* ---------- navegación ---------- */
  const [vista, setVista] = useState("catalogo");

  /* ---------- config tienda ---------- */
  const [config, setConfig] = useState({
    nombre: "Mi Tienda",
    metodosPago: ["Efectivo", "Tarjeta crédito/débito", "Transferencia SPEI"],
    nuevoMetodo: "",
  });

  /* ---------- chat ---------- */
  const [mensajes, setMensajes] = useState([]);
  const [pregunta, setPregunta] = useState("");
  const [pensando, setPensando] = useState(false);

  /* ---------- sugerencias ---------- */
  const [tips, setTips] = useState([]);
  const [cargandoTips, setCargandoTips] = useState(false);

  const optimizados = productos.filter((p) => p.ia).length;
  const enOferta = productos.filter((p) => p.oferta).length;

  /* -------- acciones de catálogo -------- */
  const cargarDemo = (clave) =>
    setProductos(DEMOS[clave].map((p) => ({ ...p, id: uid() })));

  const agregar = () => {
    if (!nuevo.nombre.trim()) return;
    setProductos((prev) => [...prev, { ...nuevo, id: uid() }]);
    setNuevo({ nombre: "", categoria: "", precio: "", oferta: "", notas: "", tallas: {} });
    setMostrarAlta(false);
  };

  const importarCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (r) => {
        const filas = r.data
          .map((f) => {
            const k = {};
            Object.keys(f).forEach((c) => (k[c.trim().toLowerCase()] = f[c]));
            return {
              id: uid(),
              nombre: k.nombre || k.producto || k.articulo || k.artículo || "",
              categoria: k.categoria || k.categoría || k.tipo || "",
              precio: (k.precio || k.costo || "").toString().replace(/[^0-9.]/g, ""),
              oferta: (k.oferta || k["precio oferta"] || "").toString().replace(/[^0-9.]/g, ""),
              notas: k.notas || k.descripcion || k.descripción || k.detalles || "",
              tallas: TALLAS.reduce((acc, t) => {
                const val = k[t.toLowerCase()] || k[t];
                if (val !== undefined) acc[t] = val === "1" || val === "true" || val === "sí" || val === "si";
                return acc;
              }, {}),
            };
          })
          .filter((p) => p.nombre.trim());
        if (!filas.length) {
          setError("El archivo no trae una columna llamada nombre o producto. Revísala y vuelve a subirlo.");
          return;
        }
        setProductos((prev) => [...prev, ...filas]);
        setError("");
      },
      error: () => setError("No se pudo leer el archivo. Guárdalo como CSV y vuelve a intentar."),
    });
    e.target.value = "";
  };

  const eliminar = (id) => setProductos((prev) => prev.filter((p) => p.id !== id));

  const toggleTallaProducto = (id, t) =>
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tallas: { ...p.tallas, [t]: !p.tallas[t] } } : p))
    );

  /* -------- generación IA -------- */
  const optimizar = async (id) => {
    const p = productos.find((x) => x.id === id);
    if (!p) return;
    setProductos((prev) => prev.map((x) => (x.id === id ? { ...x, cargando: true } : x)));
    try {
      const texto = await pedirAClaude(
        `Eres redactor de e-commerce para un negocio pequeño en México. Con estos datos crudos de un producto, escribe contenido listo para publicar en una tienda en línea o en redes.

Producto: ${p.nombre}
Categoría: ${p.categoria || "no especificada"}
Precio: $${p.precio || "no especificado"} MXN${p.oferta ? `\nPrecio en oferta: $${p.oferta} MXN` : ""}
Notas del dueño: ${p.notas || "ninguna"}

Responde SOLO con este JSON, sin texto antes ni después, sin markdown:
{
  "titulo": "título de venta de máximo 60 caracteres",
  "gancho": "una frase corta de máximo 12 palabras para redes",
  "corta": "descripción de 1 a 2 renglones para la ficha del producto",
  "larga": "descripción de 60 a 90 palabras con beneficios y uso, en segunda persona, español de México, sin exagerar ni inventar características",
  "keywords": ["8 palabras clave de búsqueda, en minúsculas, incluyendo términos locales"]
}`
      );
      const ia = extraerJSON(texto);
      setProductos((prev) => prev.map((x) => (x.id === id ? { ...x, ia, cargando: false } : x)));
      setAbierto(id);
      setError("");
    } catch {
      setProductos((prev) => prev.map((x) => (x.id === id ? { ...x, cargando: false } : x)));
      setError("No se pudo generar el contenido de " + p.nombre + ". Inténtalo otra vez.");
    }
  };

  const optimizarTodo = async () => {
    const faltantes = productos.filter((p) => !p.ia);
    for (let i = 0; i < faltantes.length; i++) {
      setLote({ hecho: i, total: faltantes.length });
      await optimizar(faltantes[i].id);
    }
    setLote(null);
    setAbierto(null);
  };

  /* -------- chat -------- */
  const preguntar = async () => {
    const q = pregunta.trim();
    if (!q || pensando) return;
    const historial = [...mensajes, { rol: "user", texto: q }];
    setMensajes(historial);
    setPregunta("");
    setPensando(true);
    try {
      const contexto = productos.map(fichaTexto).join("\n");
      const conversacion = historial
        .slice(-8)
        .map((m) => (m.rol === "user" ? "Cliente: " : "Asistente: ") + m.texto)
        .join("\n");
      const r = await pedirAClaude(
        `Eres el asistente de ventas de "${config.nombre}", una tienda en línea. Respondes preguntas sobre disponibilidad de productos, tallas, ofertas y métodos de pago. Contesta únicamente con información real del catálogo; si algo no está disponible, dilo con amabilidad y sugiere una alternativa si existe. Español de México, amigable, máximo 5 renglones.

MÉTODOS DE PAGO ACEPTADOS: ${config.metodosPago.join(", ") || "no especificados"}

INVENTARIO (${productos.length} productos):
${contexto || "vacío"}

CONVERSACIÓN:
${conversacion}
Asistente:`
      );
      setMensajes((prev) => [...prev, { rol: "bot", texto: r.trim() }]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        { rol: "bot", texto: "No se pudo consultar el catálogo en este momento. Intenta de nuevo." },
      ]);
    }
    setPensando(false);
  };

  /* -------- sugerencias -------- */
  const generarTips = async () => {
    if (!productos.length) return;
    setCargandoTips(true);
    try {
      const texto = await pedirAClaude(
        `Eres consultor de tiendas en línea para negocios pequeños en México. Revisa este catálogo y da recomendaciones concretas para vender más y presentar mejor los productos. Nada genérico: cada punto debe referirse a productos reales de la lista.

CATÁLOGO:
${productos.map(fichaTexto).join("\n")}

Responde SOLO con este JSON, sin markdown:
[
  {"titulo":"recomendación en máximo 8 palabras","detalle":"2 renglones explicando qué hacer y por qué","impacto":"alto|medio|bajo","area":"Precio|Presentación|Catálogo|Promoción|Inventario"}
]
Entre 4 y 6 recomendaciones, ordenadas de mayor a menor impacto.`,
        1200
      );
      setTips(extraerJSON(texto));
      setError("");
    } catch {
      setError("No se pudieron generar las sugerencias. Inténtalo otra vez.");
    }
    setCargandoTips(false);
  };

  /* -------- utilidades -------- */
  const copiar = (texto, id) => {
    try {
      navigator.clipboard.writeText(texto);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopiado(id);
    setTimeout(() => setCopiado(null), 1500);
  };

  const exportar = () => {
    const csv = Papa.unparse(
      productos.map((p) => ({
        nombre: p.nombre,
        categoria: p.categoria,
        precio: p.precio,
        oferta: p.oferta || "",
        ...TALLAS.reduce((acc, t) => ({ ...acc, [t]: p.tallas?.[t] ? "1" : "0" }), {}),
        titulo_seo: p.ia?.titulo || "",
        gancho: p.ia?.gancho || "",
        descripcion_corta: p.ia?.corta || "",
        descripcion_larga: p.ia?.larga || "",
        palabras_clave: (p.ia?.keywords || []).join(", "),
      }))
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "catalogo-optimizado.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* -------- config de tienda -------- */
  const agregarMetodo = () => {
    if (!config.nuevoMetodo.trim()) return;
    setConfig((c) => ({ ...c, metodosPago: [...c.metodosPago, c.nuevoMetodo.trim()], nuevoMetodo: "" }));
  };
  const quitarMetodo = (i) =>
    setConfig((c) => ({ ...c, metodosPago: c.metodosPago.filter((_, idx) => idx !== i) }));
  const toggleMetodoDefault = (m) =>
    setConfig((c) => ({
      ...c,
      metodosPago: c.metodosPago.includes(m)
        ? c.metodosPago.filter((x) => x !== m)
        : [...c.metodosPago, m],
    }));

  /* ================== render ================== */
  return (
    <div className="ap">
      <header className="barra">
        <div className="marca">
          <span className="logo">{config.nombre || "APARADOR"}</span>
          <span className="lema">asistente de productos · equipo 3</span>
        </div>
        <div className="conteo">
          <b>{productos.length}</b> productos
          <i />
          <b>{enOferta}</b> en oferta
          <i />
          <b>{optimizados}</b> con contenido
        </div>
      </header>

      <nav className="tabs">
        {[
          ["catalogo", "Catálogo", Tag],
          ["chat", "Chat", MessagesSquare],
          ["sugerencias", "Sugerencias", Lightbulb],
          ["config", "Tienda", Settings],
        ].map(([k, t, Icono]) => (
          <button key={k} className={"tab" + (vista === k ? " on" : "")} onClick={() => setVista(k)}>
            <Icono size={15} /> {t}
          </button>
        ))}
      </nav>

      {error && (
        <div className="alerta">
          {error}
          <button onClick={() => setError("")} aria-label="Cerrar aviso">
            <X size={14} />
          </button>
        </div>
      )}

      <main className="lienzo">
        {vista === "catalogo" && (
          <CatalogoView
            productos={productos}
            nuevo={nuevo}
            setNuevo={setNuevo}
            mostrarAlta={mostrarAlta}
            setMostrarAlta={setMostrarAlta}
            agregar={agregar}
            importarCSV={importarCSV}
            optimizar={optimizar}
            optimizarTodo={optimizarTodo}
            lote={lote}
            optimizados={optimizados}
            exportar={exportar}
            abierto={abierto}
            setAbierto={setAbierto}
            copiado={copiado}
            copiar={copiar}
            eliminar={eliminar}
            toggleTallaProducto={toggleTallaProducto}
            cargarDemo={cargarDemo}
          />
        )}

        {vista === "chat" && (
          <ChatView
            mensajes={mensajes}
            pregunta={pregunta}
            setPregunta={setPregunta}
            preguntar={preguntar}
            pensando={pensando}
            totalProductos={productos.length}
            nombreTienda={config.nombre}
          />
        )}

        {vista === "sugerencias" && (
          <SugerenciasView
            tips={tips}
            generarTips={generarTips}
            cargandoTips={cargandoTips}
            totalProductos={productos.length}
          />
        )}

        {vista === "config" && (
          <ConfigView
            config={config}
            setConfig={setConfig}
            agregarMetodo={agregarMetodo}
            quitarMetodo={quitarMetodo}
            toggleMetodoDefault={toggleMetodoDefault}
          />
        )}
      </main>
    </div>
  );
}
