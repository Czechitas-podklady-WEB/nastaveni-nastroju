import simpleGit from 'simple-git';
import os from 'os';
import prompts from 'prompts';

const git = simpleGit();

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

console.log(`Operační systém: ${os.type()} ${os.arch()} ${os.release()}`);

const response = await prompts(questions);

git.addConfig('user.email', response.email, false, 'global');
git.addConfig('user.name', response.name, false, 'global');
git.addConfig('core.edtor', 'code --wait', false, 'global');

console.log('Výborně, vše je správně nastaveno.');
