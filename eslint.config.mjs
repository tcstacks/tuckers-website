import nextVitals from "eslint-config-next/core-web-vitals";
import { globalIgnores } from "eslint/config";

const eslintConfig = [
  globalIgnores([".next/**", "static-site/.next/**", "static-site/out/**"]),
  ...nextVitals,
];

export default eslintConfig;
