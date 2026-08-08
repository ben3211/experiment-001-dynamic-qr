export type ProductMode = "static" | "dynamic";

interface ProductPickerProps {
  mode: ProductMode;
  onChange: (mode: ProductMode) => void;
}

export function ProductPicker({ mode, onChange }: ProductPickerProps) {
  return (
    <div className="product-picker" role="tablist" aria-label="QR type">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "static"}
        className={`product-option ${mode === "static" ? "active" : ""}`}
        onClick={() => onChange("static")}
      >
        <span className="product-name">Static QR</span>
        <span className="product-price">Free</span>
        <span className="product-tagline">Fixed destination</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "dynamic"}
        className={`product-option ${mode === "dynamic" ? "active" : ""}`}
        onClick={() => onChange("dynamic")}
      >
        <span className="product-name">Dynamic QR</span>
        <span className="product-price">€4.90 one-time</span>
        <span className="product-tagline">Change destination later</span>
      </button>
    </div>
  );
}
