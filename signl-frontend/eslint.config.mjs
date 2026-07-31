import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Downgraded from error → warning. This React-Compiler-era rule flags the
      // standard data-fetch-on-mount pattern used across the admin pages:
      //   const fetchX = useCallback(async () => { setLoading(true); … }, [deps])
      //   useEffect(() => { fetchX() }, [fetchX])
      // The synchronous setLoading(true) triggers at most one extra render — an
      // advisory perf note, not a correctness bug. Keeping it as a warning lets
      // `npm run lint` pass CI while the signal remains visible. Revisit if the
      // team adopts a data-fetching library (React Query / SWR).
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
