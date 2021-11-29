# ScullyRoutesSpace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.11.

This project was design to reproduce a bug related to routes containing spaces
used with the scully SSG.

# Reproducing the problem

Run `npm install`.

Run `ng build`.

Run `npx scully`.

Now visit `http://localhost:1668/Page%201`.

You should see that the page is not loading.

Now visit `http://localhost:1668/Page2`.

You should see that this page is loading.

# General Setup

The app retrieve information from the route to locate the data used to display
the contents.

```json
{
  {
    "name": "Page 1",
    "content": "The route has a space in it."
  },
  {
    "name": "Page2",
    "content": "The route has no space in it."
  }
}
```


## Scully Setup
Steps done to install scully.

Run `ng add @scullyio/init`.
```txt
OUTPUT:
ℹ Using package manager: npm
✔ Found compatible package version: @scullyio/init@2.0.5.
✔ Package information loaded.

The package @scullyio/init@2.0.5 will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.
    Installing ng-lib
    Installing Puppeteer plugin
UPDATE src/app/app.module.ts (540 bytes)
UPDATE src/polyfills.ts (3013 bytes)
UPDATE package.json (1233 bytes)
✔ Packages installed successfully.
CREATE scully.scully-routes-space.config.ts (326 bytes)
UPDATE package.json (1307 bytes)
CREATE scully/tsconfig.json (450 bytes)
CREATE scully/plugins/plugin.ts (305 bytes)
```

Add this to your `scully.<project-name>.config.ts`.
```
export const config: ScullyConfig = {
  puppeteerLaunchOptions: {
      executablePath: '/usr/local/bin/chromium'
  },
  ...
}
```

### Route Discovery

How to teach scully how to find all the different routes:

To do this open your `scully.<project-name>.config.js` and add the following config in the routes section:

```ts
exports.config = {
    ...
    routes: {
        '/:name': {   <-- This must be exactly the path that the angular router uses.
            type: 'dataPaths'
        }
    }
}
```

This is using the JSON plugin that is doing a lot of stuff for you.

### Plugin

This plugin will help scully know about all the dynamic path manually.

Just paste this at the top of your `./scully.<project-name>.config.ts`:

```ts
import { registerPlugin, HandledRoute } from '@scullyio/scully';

function dataPathPlugin(route: string, config = {}): Promise<HandledRoute[]> {

    return Promise.resolve([
        { "route": "/Page%201" },
        { "route": "/Page%202" },
    ]);
}

const validator = async (conf: any) => [];
registerPlugin('router', 'dataPaths', dataPathPlugin, validator);
```



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
