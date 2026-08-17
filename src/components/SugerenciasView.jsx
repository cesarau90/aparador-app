import { Lightbulb, LoaderCircle } from "lucide-react";

export default function SugerenciasView({ tips, generarTips, cargandoTips, totalProductos }) {
  return (
    <div className="tips">
      <div className="acciones">
        <button className="btn limon" onClick={generarTips} disabled={cargandoTips || !totalProductos}>
          {cargandoTips ? <LoaderCircle size={15} className="gira" /> : <Lightbulb size={15} />}
          {cargandoTips ? "Revisando catálogo" : tips.length ? "Revisar otra vez" : "Revisar mi catálogo"}
        </button>
      </div>

      {!totalProductos && (
        <div className="vacio">
          <p className="vacio-t">Nada que revisar todavía</p>
          <p className="vacio-d">
            Carga tu catálogo y aquí aparecen las recomendaciones para presentar y vender mejor.
          </p>
        </div>
      )}

      <ul className="tarjetas">
        {tips.map((t, i) => (
          <li key={i} className="tarjeta">
            <div className="tags">
              <span className={"impacto " + (t.impacto || "medio")}>impacto {t.impacto}</span>
              <span className="area">{t.area}</span>
            </div>
            <h4>{t.titulo}</h4>
            <p>{t.detalle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
