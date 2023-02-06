const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  name: "instagram-puppeteer",
  description: "Instagram API SDK for Node.js",
  repository: "https://github.com/InstaSales/instagram-puppeteer.git",
  homepage: "https://instasales.github.io/instagram-puppeteer/",
  keywords: ["instagram", "api", "sdk", "puppeteer"],

  docgen: true,
  prettier: true,

  deps: [
    "tslog",
    "puppeteer-core@19.6.0",
    "@sparticuz/chromium@110.0",
    "user-agents",
  ],
  devDeps: ["@types/user-agents"],

  defaultReleaseBranch: "main",
  release: true,
  releaseToNpm: true,

  minNodeVersion: "14.18.0",
  tsconfig: {
    compilerOptions: {
      target: "ES2020",
      lib: ["ES2020", "dom"],
    },
  },
  jestOptions: {
    jestConfig: {
      testTimeout: 60000,
      coverageProvider: "v8",
    },
  },

  codeCov: true,
  workflowNodeVersion: "18",

  autoMerge: true,
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ["dependabot[bot]", "edelwud"],
  },
});

project.npmignore.exclude("/docs/", "cookies.json");

project.synth();
