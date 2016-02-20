# hexo-genstubs

Generate Hexo stub posts for memory and performance tuning.

## Installation

```sh
git clone https://github.com/leesei/hexo-genstubs
npm i
```

## Usage

```sh
genstubs.js [options]
genstubs.js -N 1000 -P 10  # Generate 1000 posts, with 10 paragraphs each
genstubs.js --help         # see help
```

Posts will be generated in `./source/_posts`, copy to a Hexo site folder and run `hexo generate` for testing.

Run `npm run clean` to clean `md`s in `./source/_posts`.
