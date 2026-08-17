import { Sparkles, LoaderCircle, ChevronDown, Trash2, Copy, Check } from "lucide-react";
import { TALLAS } from "../constants";
import Bloque from "./Bloque";

export default function ProductCard({ p, abierto, setAbierto, copiado, copiar, onEliminar, onOptimizar, onToggleTalla }) {
  const tieneTallas = Object.keys(p.tallas || {}).length > 0;

  return (
    <li className={"ficha" + (p.ia ? " lista-ok" : "") + (p.oferta ? " en-oferta" : "")}>
      <div className="etiqueta">
        <span className="hoyo" />
        {p.oferta ? (
          <>
            <span className="precio-tachado">${p.precio}</span>
            <span className="moneda">$</span>
            <span className="monto">{p.oferta}</span>
            <span className="badge-oferta">OFERTA</span>
          </>
        ) : (
          <>
            <span className="moneda">$</span>
            <span className="monto">{p.precio || "—"}</span>
          </>
        )}
      </div>

      <div className="cuerpo">
        <div className="fila-top">
          <div>
            <h3>{p.ia?.titulo || p.nombre}</h3>
            <p className="meta">
              {p.categoria || "sin categoría"}
              {p.ia && <span className="sello">contenido listo</span>}
            </p>
          </div>
          <div className="ctrl">
            {p.ia ? (
              <button
                className="ico"
                onClick={() => setAbierto(abierto === p.id ? null : p.id)}
                aria-label="Ver contenido"
              >
                <ChevronDown size={16} className={abierto === p.id ? "flip" : ""} />
              </button>
            ) : (
              <button className="btn chico limon" onClick={() => onOptimizar(p.id)} disabled={p.cargando}>
                {p.cargando ? <LoaderCircle size={13} className="gira" /> : <Sparkles size={13} />}
                {p.cargando ? "Escribiendo" : "Generar"}
              </button>
            )}
            <button className="ico" onClick={() => onEliminar(p.id)} aria-label="Quitar producto">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {p.ia && <p className="gancho">"{p.ia.gancho}"</p>}
        {!p.ia && p.notas && <p className="notas">{p.notas}</p>}

        {tieneTallas && (
          <div className="tallas-fila">
            {TALLAS.map((t) => {
              const estado = p.tallas[t];
              return (
                <button
                  key={t}
                  type="button"
                  className={"talla-tag" + (estado === true ? " disp" : estado === false ? " ago" : " nd")}
                  onClick={() => onToggleTalla(p.id, t)}
                  title={
                    estado === true
                      ? "Disponible — clic para agotar"
                      : estado === false
                      ? "Agotada — clic para reponer"
                      : "No aplica"
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

        {p.ia && abierto === p.id && (
          <div className="detalle">
            <Bloque
              titulo="Descripción corta"
              texto={p.ia.corta}
              copiado={copiado === p.id + "c"}
              onCopiar={() => copiar(p.ia.corta, p.id + "c")}
            />
            <Bloque
              titulo="Descripción larga"
              texto={p.ia.larga}
              copiado={copiado === p.id + "l"}
              onCopiar={() => copiar(p.ia.larga, p.id + "l")}
            />
            <div className="bloque">
              <div className="bh">
                <span>Palabras clave</span>
                <button onClick={() => copiar((p.ia.keywords || []).join(", "), p.id + "k")}>
                  {copiado === p.id + "k" ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <div className="chips">
                {(p.ia.keywords || []).map((k, i) => (
                  <span key={i} className="chip">{k}</span>
                ))}
              </div>
            </div>
            <button className="rehacer" onClick={() => onOptimizar(p.id)}>
              Volver a generar
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
