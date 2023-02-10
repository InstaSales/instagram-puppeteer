const { typescript, TextFile } = require("projen");

const project = new typescript.TypeScriptProject({
  name: "instagram-puppeteer",
  description: "Instagram API SDK for Node.js",
  repository: "https://github.com/InstaSales/instagram-puppeteer.git",
  homepage: "https://instasales.github.io/instagram-puppeteer/",
  keywords: ["instagram", "api", "sdk", "puppeteer"],

  docgen: true,
  prettier: true,

  deps: ["tslog", "puppeteer-core", "user-agents", "@sparticuz/chromium"],
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
      testTimeout: 120000,
      coverageProvider: "v8",
    },
  },
  workflowBootstrapSteps: [
    {
      name: "Set environment Instagram username",
      run: 'echo "IG_USERNAME=${{ secrets.IG_USERNAME }}" >> $GITHUB_ENV',
    },
    {
      name: "Set environment Instagram password",
      run: 'echo "IG_PASSWORD=${{ secrets.IG_PASSWORD }}" >> $GITHUB_ENV',
    },
  ],

  codeCov: true,
  codeCovTokenSecret: "CODECOV_TOKEN",
  workflowNodeVersion: "18",

  autoMerge: true,
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ["dependabot[bot]", "edelwud"],
  },
});

project.npmignore.exclude("/docs/", "cookies.json");
project.gitignore.exclude("cookies.json");

new TextFile(project, ".nvmrc", {
  marker: false,
  lines: ["v18"],
});

new TextFile(project, ".editorconfig", {
  marker: false,
  lines: `root = true

[*]
charset = utf-8
insert_final_newline = true
trim_trailing_whitespace = true
indent_size = 2
tab_width = 2
`.split("\n"),
});

project.synth();
