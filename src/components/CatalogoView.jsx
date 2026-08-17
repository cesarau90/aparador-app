import { useRef } from "react";
import { Plus, Upload, Sparkles, Download, LoaderCircle } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductForm from "./ProductForm";

export default function CatalogoView({
  productos, nuevo, setNuevo, mostrarAlta, setMostrarAlta,
  agregar, importarCSV, optimizar, optimizarTodo, lote, optimizados,
  exportar, abierto, setAbierto, copiado, copiar, eliminar,
  toggleTallaProducto, cargarDemo,
}) {
  const archivoRef = useRef(null);

  return (
    <>
      <div className="acciones">
        <button className="btn oscuro" onClick={() => setMostrarAlta((v) => !v)}>
          <Plus size={15} /> Agregar producto
        </button>
        <button className="btn" onClick={() => archivoRef.current?.click()}>
          <Upload size={15} /> Subir CSV
        </button>
        <input ref={archivoRef} type="file" accept=".csv,text/csv" onChange={importarCSV} hidden />

        {productos.length > 0 && (
          <>
            <button
              className="btn limon"
              onClick={optimizarTodo}
              disabled={!!lote || optimizados === productos.length}
            >
              {lote ? <LoaderCircle size={15} className="gira" /> : <Sparkles size={15} />}
              {lote ? `Generando ${lote.hecho + 1} de ${lote.total}` : "Generar todo"}
            </button>
            <button className="btn" onClick={exportar}>
              <Download size={15} /> Exportar CSV
            </button>
          </>
        )}
      </div>

      {mostrarAlta && <ProductForm nuevo={nuevo} setNuevo={setNuevo} onAgregar={agregar} />}

      {productos.length === 0 ? (
        <div className="vacio">
          <p className="vacio-t">Tu aparador está vacío</p>
          <p className="vacio-d">
            Sube el CSV de tu catálogo, captura un producto a mano o abre uno de los ejemplos.
          </p>
          <div className="vacio-b">
            <button className="btn" onClick={() => cargarDemo("tienda")}>Ejemplo: tienda de ropa</button>
            <button className="btn" onClick={() => cargarDemo("papeleria")}>Ejemplo: papelería</button>
            <button className="btn" onClick={() => cargarDemo("taqueria")}>Ejemplo: taquería</button>
          </div>
        </div>
      ) : (
        <ul className="lista">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              abierto={abierto}
              setAbierto={setAbierto}
              copiado={copiado}
              copiar={copiar}
              onEliminar={eliminar}
              onOptimizar={optimizar}
              onToggleTalla={toggleTallaProducto}
            />
          ))}
        </ul>
      )}
    </>
  );
}
