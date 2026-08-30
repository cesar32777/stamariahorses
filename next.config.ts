import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 escribe/reescribe un bloque en CLAUDE.md al arrancar `next
  // dev` (node_modules/next/dist/server/lib/generate-agent-files.js). Este
  // repo tiene su propio CLAUDE.md con reglas del proyecto: desactivado
  // para que `next dev` no lo toque. Medido en T-01, ver docs/gotchas.md.
  agentRules: false,
};

export default nextConfig;
