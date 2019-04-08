# hawtio-cellar-demo

A basic demonstration to build a simple plugin for hawtio.

[Note]: This is for demonstration purposes.

## Install development tools

* [Node.js](http://nodejs.org)
* [Yarn](https://yarnpkg.com)
* [gulp](http://gulpjs.com/)

### Install project dependencies

```
yarn install
```

### Run the web application

```
yarn start
```

The hawtio console will be available at: <http://localhost:2772/hawtio>

The cellar plugin is available at: <http://localhost:2772/hawtio/cellar>

Also, a demo sub-page is available at: <http://localhost:2772/hawtio/cellar/config>

### Turn on source maps generation for debugging TypeScript

If you want to debug `.ts` using a browser developer tool such as Chrome DevTools, pass the `--sourcemap` flag:

```
yarn start --sourcemap
```

Do not use this flag when you are committing the compiled `.js` file, as it embeds source maps to the output file. Use this flag only during development.