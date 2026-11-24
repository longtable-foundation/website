import type { NextConfig } from "next"
import path from "node:path"
import { fileURLToPath } from "node:url"

const crmRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  turbopack: {
    root: crmRoot,
  },
}

export default nextConfig
