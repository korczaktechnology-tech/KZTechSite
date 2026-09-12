import { createServer } from "node:http";
import {
  randomUUID,
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { MongoClient } from "mongodb";
import { readFile } from "node:fs/promises";
import { extname, normalize, join } from "node:path";

const port = Number(process.env.PORT || 4000),
  mongoUri = process.env.MONGODB_URI,
  dbName = process.env.MONGODB_DB_NAME || "KZTechSite";
const client = mongoUri
  ? new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 })
  : null;
let db;
const startedAt = Date.now();
const rate = new Map();
const WINDOW = 60_000,
  LIMIT = 60;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};
function response(res, status, payload, id) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Request-Id": id,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy":
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self' http: https:; img-src 'self' data:; base-uri 'self'; form-action 'self'",
  });
  res.end(JSON.stringify({ ...payload, requestId: id }));
}
async function body(req) {
  let raw = "";
  for await (const c of req) {
    raw += c;
    if (raw.length > 1024 * 1024) throw Error("PAYLOAD_TOO_LARGE");
  }
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw Error("INVALID_JSON");
  }
}
const text = (v, max = 5000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const hash = (v) => createHash("sha256").update(v).digest("hex");
function passwordHash(password) {
  const salt = randomBytes(16).toString("hex");
  const key = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${key}`;
}
function passwordOk(password, stored) {
  try {
    const [salt, key] = stored.split(":");
    return timingSafeEqual(
      scryptSync(password, salt, 64),
      Buffer.from(key, "hex"),
    );
  } catch {
    return false;
  }
}
async function database() {
  if (!client) return null;
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    await Promise.all([
      db.collection("users").createIndex({ email: 1 }, { unique: true }),
      db
        .collection("sessions")
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      db.collection("contacts").createIndex({ createdAt: -1 }),
      db.collection("quotes").createIndex({ createdAt: -1 }),
    ]);
  }
  return db;
}
function token() {
  return randomBytes(32).toString("hex");
}
function allowed(req) {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown"
  )
    .toString()
    .split(",")[0];
  const now = Date.now();
  const old = rate.get(ip) || { at: now, n: 0 };
  if (now - old.at > WINDOW) {
    old.at = now;
    old.n = 0;
  }
  old.n++;
  rate.set(ip, old);
  return old.n <= LIMIT;
}
async function auth(req, ref) {
  const raw = req.headers.authorization || "";
  if (!raw.startsWith("Bearer ")) return null;
  const t = raw.slice(7);
  const session = await ref
    .collection("sessions")
    .findOne({ tokenHash: hash(t), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  return ref
    .collection("users")
    .findOne({ _id: session.userId }, { projection: { passwordHash: 0 } });
}
async function staticFile(pathname, res) {
  let path = pathname === "/" ? "/index.html" : pathname;
  if (path.includes("..") || path.includes("\\")) return false;
  const file = join(process.cwd(), normalize(path));
  if (!file.startsWith(process.cwd())) return false;
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}
async function handler(req, res) {
  const id = randomUUID();
  try {
    if (!allowed(req))
      return response(
        res,
        429,
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Muitas requisições. Tente novamente em instantes.",
          },
        },
        id,
      );
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      });
      return res.end();
    }
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/health")
      return response(
        res,
        200,
        {
          success: true,
          data: {
            status: "ok",
            uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
            databaseConfigured: Boolean(mongoUri),
          },
        },
        id,
      );
    if (req.method === "GET" && url.pathname === "/health/live")
      return response(
        res,
        200,
        { success: true, data: { status: "alive" } },
        id,
      );
    if (req.method === "GET" && url.pathname === "/health/ready") {
      if (!mongoUri)
        return response(
          res,
          503,
          {
            success: false,
            error: {
              code: "DATABASE_UNAVAILABLE",
              message: "Banco não configurado.",
            },
          },
          id,
        );
      const ref = await database();
      await ref.command({ ping: 1 });
      return response(
        res,
        200,
        { success: true, data: { status: "ready" } },
        id,
      );
    }
    if (req.method === "GET" && url.pathname === "/api/v1/catalog")
      return response(
        res,
        200,
        {
          success: true,
          data: {
            kos: [
              "ERP",
              "FLOW",
              "OPS",
              "VISION",
              "CONNECT",
              "MOBILE",
              "CRM",
              "SALES",
              "COMMERCE",
              "SCM",
              "STOCK",
              "LOGISTICS",
              "QUALITY",
              "MAINTENANCE",
              "PEOPLE",
              "FINANCE",
              "FISCAL",
              "BI",
              "ANALYTICS",
              "DOCUMENTS",
              "AUDIT",
            ],
            independent: ["Korczak AI", "Aurora IDE"],
          },
        },
        id,
      );
    if (req.method === "GET" && !url.pathname.startsWith("/api/")) {
      if (await staticFile(url.pathname, res)) return;
      return staticFile("/404.html", res)
        ? undefined
        : response(
            res,
            404,
            {
              success: false,
              error: { code: "NOT_FOUND", message: "Página não encontrada." },
            },
            id,
          );
    }
    const ref = await database();
    if (!ref)
      return response(
        res,
        503,
        {
          success: false,
          error: {
            code: "DATABASE_UNAVAILABLE",
            message: "Banco de dados não configurado neste ambiente.",
          },
        },
        id,
      );
    if (req.method === "POST" && url.pathname === "/api/v1/auth/register") {
      const x = await body(req),
        name = text(x.name, 120),
        email = text(x.email, 180).toLowerCase(),
        password = text(x.password, 128);
      if (!name || !validEmail(email) || password.length < 8)
        return response(
          res,
          400,
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message:
                "Nome, e-mail válido e senha de pelo menos 8 caracteres são obrigatórios.",
            },
          },
          id,
        );
      if (await ref.collection("users").findOne({ email }))
        return response(
          res,
          409,
          {
            success: false,
            error: {
              code: "EMAIL_EXISTS",
              message: "Este e-mail já possui uma conta.",
            },
          },
          id,
        );
      const r = await ref.collection("users").insertOne({
        name,
        email,
        passwordHash: passwordHash(password),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return response(
        res,
        201,
        { success: true, data: { id: r.insertedId.toString(), email } },
        id,
      );
    }
    if (req.method === "POST" && url.pathname === "/api/v1/auth/login") {
      const x = await body(req),
        email = text(x.email, 180).toLowerCase(),
        password = text(x.password, 128),
        user = await ref.collection("users").findOne({ email });
      if (!user || !passwordOk(password, user.passwordHash))
        return response(
          res,
          401,
          {
            success: false,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Credenciais inválidas.",
            },
          },
          id,
        );
      const raw = token();
      await ref.collection("sessions").insertOne({
        userId: user._id,
        tokenHash: hash(raw),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      return response(
        res,
        200,
        {
          success: true,
          data: {
            token: raw,
            user: {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
            },
          },
        },
        id,
      );
    }
    if (req.method === "GET" && url.pathname === "/api/v1/me") {
      const user = await auth(req, ref);
      if (!user)
        return response(
          res,
          401,
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Autenticação necessária.",
            },
          },
          id,
        );
      return response(
        res,
        200,
        {
          success: true,
          data: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        },
        id,
      );
    }
    if (req.method === "POST" && url.pathname === "/api/v1/contacts") {
      const x = await body(req),
        name = text(x.name, 120),
        email = text(x.email, 180).toLowerCase(),
        subject = text(x.subject, 180),
        message = text(x.message, 5000);
      if (!name || !validEmail(email) || !message)
        return response(
          res,
          400,
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Nome, e-mail válido e mensagem são obrigatórios.",
            },
          },
          id,
        );
      const r = await ref.collection("contacts").insertOne({
        name,
        email,
        subject,
        message,
        status: "new",
        createdAt: new Date(),
        requestId: id,
      });
      return response(
        res,
        201,
        {
          success: true,
          data: { id: r.insertedId.toString(), status: "received" },
        },
        id,
      );
    }
    if (req.method === "POST" && url.pathname === "/api/v1/quotes") {
      const x = await body(req),
        name = text(x.name, 120),
        email = text(x.email, 180).toLowerCase(),
        company = text(x.company, 180),
        product = text(x.product, 180),
        message = text(x.message, 5000);
      if (!name || !validEmail(email) || !product)
        return response(
          res,
          400,
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message:
                "Nome, e-mail válido e produto/solução são obrigatórios.",
            },
          },
          id,
        );
      const r = await ref.collection("quotes").insertOne({
        name,
        email,
        company,
        product,
        message,
        status: "new",
        createdAt: new Date(),
        requestId: id,
      });
      return response(
        res,
        201,
        {
          success: true,
          data: { id: r.insertedId.toString(), status: "received" },
        },
        id,
      );
    }
    if (req.method === "GET" && url.pathname === "/api/v1/health/database") {
      await ref.command({ ping: 1 });
      return response(
        res,
        200,
        { success: true, data: { status: "ok", database: dbName } },
        id,
      );
    }
    return response(
      res,
      404,
      {
        success: false,
        error: { code: "NOT_FOUND", message: "Rota não encontrada." },
      },
      id,
    );
  } catch (error) {
    console.error(
      JSON.stringify({ requestId: id, error: error?.message || "unknown" }),
    );
    const code =
      error.message === "INVALID_JSON"
        ? "INVALID_JSON"
        : error.message === "PAYLOAD_TOO_LARGE"
          ? "PAYLOAD_TOO_LARGE"
          : "INTERNAL_ERROR";
    return response(
      res,
      code === "INVALID_JSON" ? 400 : code === "PAYLOAD_TOO_LARGE" ? 413 : 500,
      {
        success: false,
        error: {
          code,
          message:
            code === "INTERNAL_ERROR"
              ? "Erro interno do servidor."
              : "Requisição inválida.",
        },
      },
      id,
    );
  }
}
createServer(handler).listen(port, () =>
  console.log(`Korczak Technologies site/API: http://localhost:${port}`),
);
