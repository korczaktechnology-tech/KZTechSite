import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Logo() {
  return <Link className="brand" to="/" aria-label="Korczak Technologies - inicio"><span className="brand-mark">K</span><span>Korczak <strong>Technologies</strong></span></Link>;
}

export function Button({ children, to, variant = 'primary', ...props }) {
  if (to) return <Link className={`button button-${variant}`} to={to} {...props}>{children}</Link>;
  return <button className={`button button-${variant}`} {...props}>{children}</button>;
}

const nav = [['Institucional', '/institucional'], ['Solucoes', '/solucoes'], ['KOS', '/kos'], ['Portfolio', '/portfolio'], ['Contato', '/contato']];

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner"><Logo /><button className="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button><nav className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Navegacao principal">{nav.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>{label}</NavLink>)}</nav><Button to="/contato">Falar com a Korczak</Button></div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Logo /><p className="muted">Tecnologia construida para transformar operacoes, decisoes e negocios.</p></div><div><h3>Institucional</h3><Link to="/sobre">Sobre</Link><Link to="/equipe">Equipe</Link><Link to="/parcerias">Parcerias</Link></div><div><h3>Solucoes</h3><Link to="/solucoes">Catalogo</Link><Link to="/kos">KOS</Link><Link to="/portfolio">Portfolio</Link></div><div><h3>Contato</h3><Link to="/contato">Fale conosco</Link><Link to="/oportunidades">Oportunidades</Link><Link to="/faq">FAQ</Link></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Korczak Technologies.</span><span>Estrutura preparada para evolucao continua.</span></div></footer>;
}

export function PageShell({ eyebrow, title, description, children }) {
  return <><Header /><main><section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section>{children}</main><Footer /></>;
}

export function Card({ title, label, children, to }) {
  const content = <><span className="card-label">{label}</span><h3>{title}</h3><p>{children}</p>{to && <span className="card-link">Conhecer -&gt;</span>}</>;
  return to ? <Link className="card" to={to}>{content}</Link> : <article className="card">{content}</article>;
}
