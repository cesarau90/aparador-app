import { TALLAS } from "../constants";

export default function ProductForm({ nuevo, setNuevo, onAgregar }) {
  const toggleTalla = (t) =>
    setNuevo((prev) => ({ ...prev, tallas: { ...prev.tallas, [t]: !prev.tallas[t] } }));

  return (
    <div className="alta">
      <input
        placeholder="Nombre del producto"
        value={nuevo.nombre}
        onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onAgregar()}
      />
      <input
        placeholder="Categoría"
        value={nuevo.categoria}
        onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
      />
      <input
        placeholder="Precio regular"
        inputMode="decimal"
        value={nuevo.precio}
        onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value.replace(/[^0-9.]/g, "") })}
      />
      <input
        placeholder="Precio en oferta (opcional)"
        inputMode="decimal"
        value={nuevo.oferta}
        onChange={(e) => setNuevo({ ...nuevo, oferta: e.target.value.replace(/[^0-9.]/g, "") })}
      />
      <div className="tallas-sel">
        <span className="tallas-lbl">Tallas disponibles</span>
        <div className="tallas-row">
          {TALLAS.map((t) => (
            <button
              key={t}
              type="button"
              className={"talla-btn" + (nuevo.tallas[t] ? " activa" : "")}
              onClick={() => toggleTalla(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <input
        placeholder="Notas (color, material, ingredientes…)"
        value={nuevo.notas}
        onChange={(e) => setNuevo({ ...nuevo, notas: e.target.value })}
        onKeyDown={(e) => e.key === "Enter" && onAgregar()}
      />
      <button className="btn oscuro" onClick={onAgregar}>
        Guardar
      </button>
    </div>
  );
}
