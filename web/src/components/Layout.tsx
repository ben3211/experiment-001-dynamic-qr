import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showHomeLink?: boolean;
}

export function Layout({ children, showHomeLink = false }: LayoutProps) {
  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="brand">
          Dynamic QR
        </Link>
        {showHomeLink ? (
          <Link to="/" className="header-link">
            Create a QR
          </Link>
        ) : null}
      </header>
      <main className="page">{children}</main>
      <footer className="site-footer">
        <p>Permanent QR codes you can update later — without a subscription.</p>
      </footer>
    </div>
  );
}
