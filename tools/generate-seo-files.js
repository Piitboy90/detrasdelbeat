#!/usr/bin/env node

/**
 * Genera public/robots.txt y public/sitemap.xml a partir de VITE_SITE_URL.
 *
 * Por que existe: un .txt y un .xml no admiten variables, asi que la URL
 * quedaba escrita a mano en dos sitios mas. Cambiar de dominio obligaba a
 * acordarse de editarlos. Generandolos en cada build, la URL sigue viviendo
 * en un unico lugar (VITE_SITE_URL) y estos archivos la heredan.
 *
 * Se ejecuta antes de 'vite build' (ver el script build de package.json).
 * Mismo patron que tools/generate-llms.js.
 */

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const FALLBACK_SITE_URL = 'https://detrasdelbeat-production.up.railway.app';

/**
 * Rutas publicas. Verificadas en src/App.jsx: el resto van envueltas en
 * ProtectedRoute y para un rastreador anonimo solo son un redirect a /login.
 * Las URLs de posts (/post/:id) son una fase posterior.
 */
const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'weekly' },
  { path: '/solicitar', changefreq: 'monthly' },
];

/** Rutas que no deben rastrearse: privadas o con sesion obligatoria. */
const DISALLOWED = {
  'Zonas privadas o de administracion': [
    '/admin',
    '/settings',
    '/buzon',
    '/profile',
    '/create',
  ],
  'Rutas que exigen sesion iniciada: para un rastreador anonimo\n# solo son un redirect a /login, no vale la pena rastrearlas': [
    '/feed',
    '/normas',
    '/sesiones',
    '/saved',
    '/mis-pedidos',
    '/mis-solicitudes',
    '/requests',
  ],
};

/**
 * Lee VITE_SITE_URL. En Railway llega por process.env; en local vive en un
 * archivo .env que Node no carga solo (a diferencia de Vite), asi que se
 * parsea a mano para no anadir una dependencia como dotenv.
 */
function getSiteUrl(rootDir) {
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL.replace(/\/+$/, '');
  }

  // .env.local pisa a .env, igual que hace Vite.
  for (const file of ['.env.local', '.env']) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;

    const match = fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .find(line => line.trim().startsWith('VITE_SITE_URL='));

    if (match) {
      const value = match.slice(match.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
      if (value) return value.replace(/\/+$/, '');
    }
  }

  console.warn(
    `AVISO: VITE_SITE_URL no definida. Se usa ${FALLBACK_SITE_URL}.\n` +
    '       En Railway debe estar en Settings -> Variables.'
  );
  return FALLBACK_SITE_URL;
}

function buildRobotsTxt(siteUrl) {
  const bloques = Object.entries(DISALLOWED)
    .map(([titulo, rutas]) =>
      `# ${titulo}\n${rutas.map(r => `Disallow: ${r}`).join('\n')}`
    )
    .join('\n\n');

  return `# Generado por tools/generate-seo-files.js. No editar a mano:
# se regenera en cada build a partir de VITE_SITE_URL.

User-agent: *
Allow: /

${bloques}

Sitemap: ${siteUrl}/sitemap.xml
`;
}

function buildSitemapXml(siteUrl) {
  const lastmod = new Date().toISOString().slice(0, 10);

  const urls = PUBLIC_ROUTES.map(({ path: ruta, changefreq }) =>
    [
      '  <url>',
      `    <loc>${siteUrl}${ruta}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      '  </url>',
    ].join('\n')
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Generado por tools/generate-seo-files.js. No editar a mano:
  se regenera en cada build a partir de VITE_SITE_URL.

  Solo rutas publicas verificadas en src/App.jsx.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function main() {
  const rootDir = process.cwd();
  const siteUrl = getSiteUrl(rootDir);
  const publicDir = path.join(rootDir, 'public');

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), buildRobotsTxt(siteUrl), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), buildSitemapXml(siteUrl), 'utf8');

  console.log(`OK  robots.txt y sitemap.xml generados para ${siteUrl}`);
}

const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main();
}
