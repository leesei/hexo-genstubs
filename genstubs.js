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
  .epilogue(
    Chalk.bold('  Author: ') +
    Chalk.underline('leesei@gmail.com') + '       ' +
    Chalk.bold('Licence: ') + Pkg.license
  )
  .help()
  .alias('h', 'help')
  .strict()
  .argv;

genStubs();

function genStubs () {
  const NUM_POSTS = Program.posts;
  const PARAGRAPHS_PER_POST = Program.paragraphs;

  console.log(`Generating ${NUM_POSTS} posts, with ${PARAGRAPHS_PER_POST} paragraphs each`);
  const bar = new ProgressBar(
    '  [:bar]   :current/:total   :percent   Remaining: :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: NUM_POSTS
    }
  );
  _range(1, NUM_POSTS + 1).map(
    (N) => {
      const paragraphs =
        _range(PARAGRAPHS_PER_POST)
         .map((j) => chance.paragraph())
         .join('\n\n');

      // note the multiline string is not indented as indentations are kept intact
      // first new line is escaped with '\'
      let content =
`\
---
title: Post ${N}
date: 2016-02-21
tags:
---

${paragraphs}
`;
      // console.log(`[\n${content}]\n\n`);

      Fs.writeFileSync(`./source/_posts/post-${N}.md`, content);
      bar.tick(1);
    }
  );
}
