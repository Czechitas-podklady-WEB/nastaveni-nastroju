import simpleGit from 'simple-git';
import os from 'os';
import prompts from 'prompts';

const questions = [
  {
    type: 'text',
    name: 'email',
    message: 'Zadejte svůj email',
  },
  {
    type: 'text',
    name: 'name',
    message: 'Zadejte své celé jméno',
  },
];

console.info(`Operační systém: ${os.type()} ${os.arch()} ${os.release()}`);

const response = await prompts(questions);

const git = simpleGit();
git.addConfig('user.email', response.email, false, 'global');
git.addConfig('user.name', response.name, false, 'global');
git.addConfig('core.editor', 'code --wait', false, 'global');

console.info('Výborně, vše je správně nastaveno.');
