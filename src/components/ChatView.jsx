import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatView({ mensajes, pregunta, setPregunta, preguntar, pensando, totalProductos, nombreTienda }) {
  const finChat = useRef(null);

  useEffect(() => {
    finChat.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, pensando]);

  return (
    <div className="chat">
      <div className="hilo">
        {mensajes.length === 0 && (
          <div className="pistas">
            <p className="vacio-t">Asistente de {nombreTienda}</p>
            <p className="vacio-d">
              Respondo preguntas sobre disponibilidad, tallas, ofertas y métodos de pago con base en los{" "}
              {totalProductos} productos cargados.
            </p>
            <div className="vacio-b">
              {[
                "¿Tienen talla M en blusas?",
                "¿Qué productos están en oferta?",
                "¿Cuáles son sus métodos de pago?",
                "¿Qué tallas hay disponibles en jeans?",
              ].map((s) => (
                <button key={s} className="btn" onClick={() => setPregunta(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensajes.map((m, i) => (
          <div key={i} className={"burbuja " + m.rol}>
            {m.texto}
          </div>
        ))}

        {pensando && <div className="burbuja bot esperando">Consultando inventario…</div>}
        <div ref={finChat} />
      </div>

      <div className="entrada">
        <input
          value={pregunta}
          placeholder={
            totalProductos
              ? "¿Tienen talla S? ¿Qué hay en oferta? ¿Cómo pago?"
              : "Primero carga productos en el catálogo"
          }
          disabled={!totalProductos}
          onChange={(e) => setPregunta(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && preguntar()}
        />
        <button className="btn oscuro" onClick={preguntar} disabled={!totalProductos || pensando}>
          <Send size={15} /> Enviar
        </button>
      </div>
    </div>
  );
}
