const { typescript } = require("projen");

const project = new typescript.TypeScriptProject({
  name: "instagram-puppeteer",
  description: "Instagram API SDK for Node.js",
  homepage: "https://github.com/InstaSales/instagram-puppeteer",

  docgen: true,
  prettier: true,

  deps: ["puppeteer-core", "@sparticuz/chromium"],

  release: true,
  defaultReleaseBranch: "main",
  releaseToNpm: true,

  minNodeVersion: "14.18.0",
  workflowNodeVersion: "18",

  autoMerge: true,
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ["dependabot[bot]", "edelwud"],
  },
});

project.npmignore.exclude("/docs/");

project.synth();
