import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react({ jsxRuntime: "classic" })],
  oxc: {
    jsx: {
      runtime: "classic",
      pragma: "React.createElement",
      pragmaFrag: "React.Fragment"
    },
    jsxInject: 'import React from "react"'
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true
  }
});
