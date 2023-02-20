import simpleGit from "simple-git";
import os from "os";
import prompts from "prompts";
import { gte } from "semver";
import kleur from "kleur";
import { config } from "./config.js";
//import config from "./config.json" assert {type: "json"}; // Import JSONu je zatím v Node.js experimentální a hlásí při startu varování, což je v tomto případě zbytečně matoucí.

const git = simpleGit();

const println = (text) => {
  console.info(text ? text : "");
}

const printSymbol = (color, symbol, text) => {
  console.info(`${color(symbol)} ${text}`);
}

const printInfo = (text) => {
  printSymbol(kleur.blue, '>', kleur.white().bold(text));
}

const printOK = (text) => {
  printSymbol(kleur.green, '✔', text);
}

const printDone = (text) => {
  println()
  printSymbol(kleur.green, '☑', text);
  println()
}

const printError = (text) => {
  printSymbol(kleur.red, '❌', text);
}

const checkVersions = async () => {
  printInfo(`Ověření instalace nástrojů pro kurz Digitální akademie WEB\n`);
  printOK(`Operační systém: ${os.type()} ${os.arch()} ${os.release()}`);

  let error = false;
  const nodeVersion = process.version.substring(1);
  if (gte(nodeVersion, config.versions.node)) {
    printOK(`Node.js: ${nodeVersion}`);
  } else {
    printError(`Node.js: ${nodeVersion} – starší verze Node.js, doporučujeme aktualizaci.`);
    error = true;
  }

  const gitVersion = await git.version();
  if (!gitVersion.installed) {
    printError(`Git: Nepodařilo se najít nainstalovaný Git.`);
    error = true;
  } else if (gte(String(gitVersion), config.versions.git)) {
    printOK(`Git: ${String(gitVersion)}`);
  } else {
    printError(`Git: ${String(gitVersion)} – starší verze Gitu, doporučujeme aktualizaci.`);
    error = true;
  }

  console.info();

  if (!error) {
    printDone("Požadované aplikace jsou správně nainstalované.");
  } else {
    printError("Některá z kontrol selhala. Po opravě prosím skript spusťte znovu. Pokud si s opravou nevíte rady, napište o pomoc na Slack.");
    process.exit(1);
  }
};

const configureGit = async () => {
  const questions = [
    {
      type: "confirm",
      name: "modifyGitUser",
      message:
        "Přejete si nakonfigurovat jméno a e-mail do Gitu? Zadané údaje se budou zobrazovat u vašeho kódu na GitHubu. (Pokud si nejste jistí, zvolte Yes.)",
      initial: true,
    },
    {
      type: (prev, values) => (values.modifyGitUser ? "text" : null),
      name: "email",
      message: "Zadejte svůj email",
    },
    {
      type: (prev, values) => (values.modifyGitUser ? "text" : null),
      name: "name",
      message: "Zadejte své celé jméno (můžete použít háčky i čárky a mezery)",
    },
    {
      type: "confirm",
      name: "vscode",
      message: "Nastavit VS Code jako výchozí editor pro Git? (Pokud si nejste jistí, zvolte Yes.)",
      initial: true,
    },
  ];

  printInfo(`Nastavení Gitu\n`);
  const response = await prompts(questions);

  if (response) {
    if (response.modifyGitUser) {
      git.addConfig("user.email", response.email, false, "global");
      git.addConfig("user.name", response.name, false, "global");
      printOK("E-mail a jméno pro Git byly nakonfigurovány.");
    }
    if (response.vscode) {
      git.addConfig("core.editor", "code --wait", false, "global");
      printOK("VS Code pro Git byl nakonfigurován.");
    }
  }
};

await checkVersions();
await configureGit();
printDone("Výborně, vše je připraveno.");
