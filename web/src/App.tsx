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
        <h1>Create a QR code you can update anytime</h1>
        <p className="hero-subtitle">
          Change where your QR sends people without replacing or reprinting it.
          No subscription.
        </p>
      </section>

      <ProductPicker mode={mode} onChange={setMode} />

      {mode === "static" ? <StaticQrForm /> : <DynamicQrForm />}
    </Layout>
  );
}
