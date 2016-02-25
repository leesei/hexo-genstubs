#!/usr/bin/env node
'use strict';

const _range = require('lodash.range');
const Chance = require('chance');
const chance = new Chance();
const Fs = require('fs');
const ProgressBar = require('progress');

const Pkg = require('./package.json');
const Chalk = require('chalk');
var Program = require('yargs')
  .usage('$0 [options]')
  .example('$0 -N 1000 -P 10', 'Generate 1000 posts, with 10 paragraphs each')
  .option('posts', {
    alias: 'N',
    describe: 'number of posts to generate',
    default: 5000
  })
  .option('paragraphs', {
    alias: 'P',
    describe: 'number of paragraphs to generate per post',
    default: 100
  })
  .option('tags', {
    alias: 't',
    describe: 'number of tags to be added (from tagPool) per post',
    default: 0
  })
  .option('tag-pool', {
    alias: 'T',
    describe: 'size of tagPool',
    default: 50
  })
  .option('cats', {
    alias: 'c',
    describe: 'number of categories to be added (from catPool) per post',
    default: 0
  })
  .option('cat-pool', {
    alias: 'C',
    describe: 'size of catPool',
    default: 20
  })
  .epilogue(
    Chalk.bold('  Author: ') +
    Chalk.underline('leesei@gmail.com') + '       ' +
    Chalk.bold('Licence: ') + Pkg.license
  )
  .help()
  .alias('h', 'help')
  .strict()
  .argv;

genStubs(Program);

function genStubs (opts) {
  console.log(`Generating ${opts.posts} posts, with ${opts.paragraphs} paragraphs each (${opts.tags} tags, ${opts.cats} categories)`);

  // init progress bar
  const bar = new ProgressBar(
    '  [:bar]   :current/:total   :percent   Remaining: :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: opts.posts
    }
  );

  // init pools
  const catPool = _range(opts.catPool).map(() => chance.word({syllables: 3}));
  const tagPool = _range(opts.tagPool).map(() => chance.word({syllables: 2}));

  _range(opts.posts).map(
    (N) => {
      N = N + 1; // 0-based => 1-based
      const categories = chance.pickset(catPool, opts.cats).map((s) => `- ${s}`).join('\n');
      const tags = chance.pickset(tagPool, opts.tags).map((s) => `- ${s}`).join('\n');
      const paragraphs =
        _range(opts.paragraphs)
         .map((j) => chance.paragraph())
         .join('\n\n');

      // note the multiline string is not indented as indentations are kept intact
      // first new line is escaped with '\'
      let content =
`\
---
title: Post ${N}
date: 1970-01-01
categories:
${categories}
tags:
${tags}
---

${paragraphs}
`;
      // console.log(`[\n${content}]\n\n`);

      Fs.writeFileSync(`./source/_posts/post-${N}.md`, content);
      bar.tick(1);
    }
  );
}
