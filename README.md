# typed-oax [![npm version](https://badge.fury.io/js/typed-oax.svg)](https://badge.fury.io/js/typed-oax)

typed-oax generates declaration file from Open API spec for Express.js handlers.

## Motivation

I used to manually assign all request/response types for my Express application.
However, as the project gets bigger and bigger, that solution couldn't hold "type-safetiness" of my app.

So I came up with this codegen solution where all req/res pairs (a.k.a handlers!) are automatically typed and binded to unique request uri.

## Install

```sh
$ yarn add -D typed-oax
```

## How to use

```sh
$ oax generate ./petstore.yml -d src
```

This command will give you `express.d.ts` file inside `src/`.

Check out the running example [here](./example).

## CLI Options

```
Usage: oax generate [options] [command]

Generate declaration file from Open API targeting for Express usecase

Options:
  -V, --version              output the version number
  -h, --help                 output usage information

Commands:
  generate [options] <file>

  Options:
    -d, --dist <dist>        output directory
    -w, --watch              watch your spec file change
```
