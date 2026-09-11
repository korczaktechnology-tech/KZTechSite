import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'KZTechSite';
const client = mongoUri ? new MongoClient(mongoUri) : null;
let db;
const startedAt = Date.now();

function response(res, status, payload, requestId) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Request-Id': requestId, 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
  res.end(JSON.stringify({ ...payload, requestId }));
}
async function body(req) {
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > 1024 * 1024) throw new Error('PAYLOAD_TOO_LARGE'); }
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { throw new Error('INVALID_JSON'); }
}
function text(value, max = 5000) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
async function database() { if (!client) return null; if (!db) { await client.connect(); db = client.db(dbName); } return db; }

async function handler(req, res) {
  const requestId = randomUUID();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-Id', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS' }); return res.end(); }
    if (req.method === 'GET' && url.pathname === '/health') return response(res, 200, { success: true, data: { status: 'ok', uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000), databaseConfigured: Boolean(mongoUri) } }, requestId);
    if (req.method === 'GET' && url.pathname === '/health/live') return response(res, 200, { success: true, data: { status: 'alive' } }, requestId);
    if (req.method === 'GET' && url.pathname === '/health/ready') { if (!mongoUri) return response(res, 503, { success: false, error: { code: 'DATABASE_UNAVAILABLE', message: 'Banco de dados não configurado.' } }, requestId); await database().then(ref => ref.command({ ping: 1 })); return response(res, 200, { success: true, data: { status: 'ready' } }, requestId); }
    if (req.method === 'GET' && url.pathname === '/api/v1/catalog') return response(res, 200, { success: true, data: { status: 'available' } }, requestId);
    const databaseRef = await database();
    if (!databaseRef) return response(res, 503, { success: false, error: { code: 'DATABASE_UNAVAILABLE', message: 'Banco de dados não configurado neste ambiente.' } }, requestId);
    if (req.method === 'POST' && url.pathname === '/api/v1/contacts') {
      const input = await body(req); const name = text(input.name, 120); const email = text(input.email, 180).toLowerCase(); const subject = text(input.subject, 180); const message = text(input.message, 5000);
      if (!name || !validEmail(email) || !message) return response(res, 400, { success: false, error: { code: 'VALIDATION_ERROR', message: 'Nome, e-mail válido e mensagem são obrigatórios.' } }, requestId);
      const result = await databaseRef.collection('contacts').insertOne({ name, email, subject, message, status: 'new', createdAt: new Date(), requestId });
      return response(res, 201, { success: true, data: { id: result.insertedId.toString(), status: 'received' } }, requestId);
    }
    if (req.method === 'POST' && url.pathname === '/api/v1/quotes') {
      const input = await body(req); const name = text(input.name, 120); const email = text(input.email, 180).toLowerCase(); const company = text(input.company, 180); const product = text(input.product, 180); const message = text(input.message, 5000);
      if (!name || !validEmail(email) || !product) return response(res, 400, { success: false, error: { code: 'VALIDATION_ERROR', message: 'Nome, e-mail válido e produto/solução são obrigatórios.' } }, requestId);
      const result = await databaseRef.collection('quotes').insertOne({ name, email, company, product, message, status: 'new', createdAt: new Date(), requestId });
      return response(res, 201, { success: true, data: { id: result.insertedId.toString(), status: 'received' } }, requestId);
    }
    if (req.method === 'GET' && url.pathname === '/api/v1/health/database') { await databaseRef.command({ ping: 1 }); return response(res, 200, { success: true, data: { status: 'ok', database: dbName } }, requestId); }
    return response(res, 404, { success: false, error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' } }, requestId);
  } catch (error) {
    console.error(JSON.stringify({ requestId, error: error?.message || 'unknown' }));
    const code = error.message === 'INVALID_JSON' ? 'INVALID_JSON' : error.message === 'PAYLOAD_TOO_LARGE' ? 'PAYLOAD_TOO_LARGE' : 'INTERNAL_ERROR';
    return response(res, code === 'INVALID_JSON' ? 400 : code === 'PAYLOAD_TOO_LARGE' ? 413 : 500, { success: false, error: { code, message: code === 'INTERNAL_ERROR' ? 'Erro interno do servidor.' : 'Requisição inválida.' } }, requestId);
  }
}

createServer(handler).listen(port, () => console.log(`Korczak Technologies API: http://localhost:${port}`));
