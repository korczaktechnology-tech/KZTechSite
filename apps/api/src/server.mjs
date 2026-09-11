import { createServer } from 'node:http';

const port = Number(process.env.PORT || 4000);

const server = createServer((req, res) => {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, headers);
    res.end(JSON.stringify({ success: true, data: { status: 'ok' } }));
    return;
  }

  res.writeHead(404, headers);
  res.end(JSON.stringify({ success: false, error: { code: 'NOT_FOUND', message: 'Rota não encontrada.' } }));
});

server.listen(port, () => console.log(`Korczak Technologies API foundation: http://localhost:${port}`));
