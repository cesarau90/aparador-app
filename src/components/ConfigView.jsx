import { Plus, Check, X } from "lucide-react";
import { METODOS_PAGO_DEFAULT } from "../constants";

export default function ConfigView({ config, setConfig, agregarMetodo, quitarMetodo, toggleMetodoDefault }) {
  return (
    <div className="conf">
      <section className="conf-sec">
        <h2 className="conf-h">Nombre de la tienda</h2>
        <input
          value={config.nombre}
          placeholder="Nombre de tu tienda"
          onChange={(e) => setConfig((c) => ({ ...c, nombre: e.target.value }))}
        />
      </section>

      <section className="conf-sec">
        <h2 className="conf-h">Métodos de pago aceptados</h2>
        <p className="conf-sub">El chatbot informará a los clientes sobre estos métodos.</p>

        <div className="metodos-default">
          {METODOS_PAGO_DEFAULT.map((m) => (
            <button
              key={m}
              type="button"
              className={"metodo-chip" + (config.metodosPago.includes(m) ? " activo" : "")}
              onClick={() => toggleMetodoDefault(m)}
            >
              {config.metodosPago.includes(m) && <Check size={11} />} {m}
            </button>
          ))}
        </div>

        <div className="metodo-nuevo">
          <input
            value={config.nuevoMetodo}
            placeholder="Otro método (ej. Clip, depósito bancario…)"
            onChange={(e) => setConfig((c) => ({ ...c, nuevoMetodo: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && agregarMetodo()}
          />
          <button className="btn oscuro" onClick={agregarMetodo}>
            <Plus size={14} /> Agregar
          </button>
        </div>

        <ul className="metodos-lista">
          {config.metodosPago.map((m, i) => (
            <li key={i} className="metodo-item">
              <Check size={13} className="check-verde" /> {m}
              <button className="ico" onClick={() => quitarMetodo(i)} aria-label="Quitar">
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="conf-sec">
        <h2 className="conf-h">Vista previa del chat</h2>
        <p className="conf-sub">Así responderá el asistente cuando un cliente pregunte por métodos de pago:</p>
        <div className="preview-chat">
          <div className="burbuja user" style={{ alignSelf: "flex-end" }}>
            ¿Cómo puedo pagar?
          </div>
          <div className="burbuja bot" style={{ alignSelf: "flex-start" }}>
            En <b>{config.nombre || "nuestra tienda"}</b> aceptamos:{" "}
            {config.metodosPago.join(", ") || "métodos de pago no configurados"}. ¡Elige el que más te convenga!
          </div>
        </div>
      </section>
    </div>
  );
}
