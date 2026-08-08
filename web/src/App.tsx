import { useState } from "react";
import { Layout } from "./components/Layout";
import { DynamicQrForm } from "./components/DynamicQrForm";
import { ProductPicker, ProductMode } from "./components/ProductPicker";
import { StaticQrForm } from "./components/StaticQrForm";

export function App() {
  const [mode, setMode] = useState<ProductMode>("dynamic");

  return (
    <Layout>
      <section className="hero">
        <h1>Create a QR code whose destination you can change later</h1>
        <p className="hero-subtitle">
          Print once, update anytime. No monthly subscription — just a simple
          one-time QR that keeps working when your link changes.
        </p>
      </section>

      <ProductPicker mode={mode} onChange={setMode} />

      {mode === "static" ? <StaticQrForm /> : <DynamicQrForm />}
    </Layout>
  );
}
