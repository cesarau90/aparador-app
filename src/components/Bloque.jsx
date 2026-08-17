import { Copy, Check } from "lucide-react";

export default function Bloque({ titulo, texto, copiado, onCopiar }) {
  return (
    <div className="bloque">
      <div className="bh">
        <span>{titulo}</span>
        <button onClick={onCopiar} aria-label={"Copiar " + titulo}>
          {copiado ? <Check size={13} /> : <Copy size={13} />}
        </button>
      </div>
      <p>{texto}</p>
    </div>
  );
}
