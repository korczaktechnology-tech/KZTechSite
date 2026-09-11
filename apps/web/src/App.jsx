import { Routes, Route, Link } from 'react-router-dom';
import { Button, Card, PageShell } from './components.jsx';
import { products, independentProducts } from './catalog.js';

const sections = [
  ['Sobre', '/sobre', 'Conheca a empresa, sua visao e sua forma de construir tecnologia.'],
  ['Equipe', '/equipe', 'Pessoas, competencias e cultura por tras dos produtos.'],
  ['Parcerias', '/parcerias', 'Conecte sua empresa ao ecossistema Korczak.'],
  ['Oportunidades', '/oportunidades', 'Espaco para oportunidades profissionais e colaboracoes.'],
  ['FAQ', '/faq', 'Respostas para as perguntas mais frequentes.'],
  ['Tecnologias', '/tecnologias', 'Fundamentos tecnicos e capacidades utilizadas nos projetos.'],
  ['Mentoria', '/mentoria', 'Conheca a frente de mentoria e apoio tecnico.'],
];

function Home() {
  return <><PageShell eyebrow="Korczak Technologies" title="Tecnologia para construir o próximo passo." description="Uma plataforma institucional e comercial preparada para apresentar produtos, soluções, portfólio e oportunidades de relacionamento."><section className="section"><div className="container hero-grid"><div><span className="eyebrow">Tecnologia • Produto • Operacao</span><h2>Um ecossistema pensado para empresas que querem evoluir.</h2><p className="lead">A arquitetura do site foi criada para crescer junto com a Korczak Technologies, conectando presença institucional, catálogo de soluções e jornadas comerciais.</p><div className="actions"><Button to="/solucoes">Explorar soluções</Button><Button to="/contato" variant="secondary">Entrar em contato</Button></div></div><div className="hero-panel"><span className="panel-kicker">KOS</span><strong>Korczak Operations System</strong><p>Uma plataforma B2B preparada para operações, gestão, integração e evolução modular.</p><Link to="/kos">Conhecer a plataforma →</Link></div></div></section></PageShell></>;
}

function Institutional() { return <PageShell eyebrow="Institucional" title="A Korczak Technologies" description="A base institucional para apresentar empresa, pessoas, tecnologias, parcerias e oportunidades."><section className="section"><div className="container card-grid">{sections.map(([t,p,d]) => <Card key={p} title={t} label="Institucional" to={p}>{d}</Card>)}</div></section></PageShell>; }
function Solutions() { return <PageShell eyebrow="Soluções" title="Um catálogo organizado para crescer." description="Produtos apresentados por função, sem misturar o KOS com as demais soluções independentes."><section className="section"><div className="container"><div className="catalog-grid">{products.map(p => <Card key={p.slug} title={p.name} label={p.label} to={`/solucoes/${p.slug}`}>{p.description}</Card>)}</div></div></section></PageShell>; }
function Product({ slug }) { const p = products.find(x => x.slug === slug) || independentProducts.find(x => x.slug === slug); return <PageShell eyebrow="Produto" title={p?.name || 'Produto'} description={p?.description || 'Detalhes do produto serão apresentados nesta página.'}><section className="section"><div className="container detail-panel"><span className="card-label">Estrutura de produto</span><h2>{p?.label || 'Korczak Technologies'}</h2><p>Esta rota já está preparada para receber conteúdo detalhado, informações comerciais, documentação e futuras integrações sem alterar a navegação principal.</p><Button to="/contato">Solicitar informações</Button></div></section></PageShell>; }
function Portfolio() { return <PageShell eyebrow="Portfólio" title="Projetos e capacidades." description="Área preparada para apresentar trabalhos, soluções implementadas e resultados selecionados."><section className="section"><div className="container empty-panel"><span className="eyebrow">Próxima camada</span><h2>Portfólio estruturado.</h2><p>O espaço está criado para receber os projetos definidos na próxima etapa, mantendo estados vazios claros e sem botões sem destino.</p></div></section></PageShell>; }
function Contact() { return <PageShell eyebrow="Contato" title="Vamos conversar." description="Canal preparado para futuras jornadas comerciais e institucionais."><section className="section"><div className="container form-shell"><label>Nome<input placeholder="Seu nome" /></label><label>E-mail<input type="email" placeholder="seu@email.com" /></label><label>Mensagem<textarea placeholder="Como podemos ajudar?" /></label><Button type="button">Enviar mensagem</Button></div></section></PageShell>; }
function Generic({ title, description }) { return <PageShell eyebrow="Korczak Technologies" title={title} description={description}><section className="section"><div className="container empty-panel"><h2>Estrutura pronta.</h2><p>Esta página recebeu sua rota e estrutura visual na Etapa 2. O conteúdo funcional será implementado nas etapas seguintes.</p><Button to="/contato">Falar com a Korczak</Button></div></section></PageShell>; }
function NotFound() { return <PageShell eyebrow="404" title="Página não encontrada" description="A rota solicitada não existe."><section className="section"><div className="container empty-panel"><Button to="/">Voltar ao início</Button></div></section></PageShell>; }

export default function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/institucional" element={<Institutional />} /><Route path="/solucoes" element={<Solutions />} /><Route path="/solucoes/:slug" element={<ProductRoute />} /><Route path="/kos" element={<Product slug="kos" />} /><Route path="/portfolio" element={<Portfolio />} /><Route path="/contato" element={<Contact />} /><Route path="/sobre" element={<Generic title="Sobre" description="A história, posicionamento e visão da Korczak Technologies." />} /><Route path="/equipe" element={<Generic title="Equipe" description="Pessoas e competências que constroem a Korczak Technologies." />} /><Route path="/parcerias" element={<Generic title="Parcerias" description="Relacionamentos estratégicos para ampliar capacidades e alcance." />} /><Route path="/oportunidades" element={<Generic title="Oportunidades" description="Oportunidades profissionais e de colaboração." />} /><Route path="/faq" element={<Generic title="FAQ" description="Perguntas frequentes sobre a empresa e suas soluções." />} /><Route path="/tecnologias" element={<Generic title="Tecnologias" description="Tecnologias e fundamentos utilizados pela Korczak Technologies." />} /><Route path="/mentoria" element={<Generic title="Mentoria" description="Mentoria e apoio para evolução técnica e de produto." />} /><Route path="*" element={<NotFound />} /></Routes>;
}

function ProductRoute() {
  const path = window.location.pathname.split('/').filter(Boolean);
  return <Product slug={path[path.length - 1]} />;
}
