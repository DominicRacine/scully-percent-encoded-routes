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
        { "route": "/Page2" },
    ]);
}

const validator = async (conf: any) => [];
registerPlugin('router', 'dataPaths', dataPathPlugin, validator);
```

---
## Troubleshooting

### Server Side Solution

This is not a scully bug but instead a normal server behavior.

- [Space in URL %20 is decoded](https://trac.nginx.org/nginx/ticket/1930)

Web static servers (nginx) treats the URI as escaped. A discussion on the nginx websites states that `"Locations are matched on unescaped URIs"`. This means that if you enter `http://www.mysite.com/foo%20bar` in your browser it will look for `/foo bar` by default to find a matching file.

In our case, will the static server is running, `./dist/static/Page%201/` is not found because it tries to look for the folder `Page 1`.
I temporally fix the issue by adding this to my `nginx.conf`:

```nginx
server {
  ...
  index index.html index.htm;
  ...
  location / {
    try_files $uri $uri/ $request_uri/index.html /index.html;
  }                         ^       ^       ^
                            |       |       |
                         [      Solution       ]
  ...
}
```

The `index index.html index.htm` directive tells to look for a `index.html` file if the user request a directory path.

The `try_files` within the `location` directives tries each path to see if it exist and if not, will re-evaluate with `/index.html`.

In our example of `http://localhost/Page%201`
- `$uri` is `/Page 1` and doesn't exist. Then,
- `$uri/` is `/Page 1/` and doesn't exist. Then,
- `$request_uri/index.html` is `/Page%201` and does exist. So it will serve the `/Page%201/index.html` file.

### Scully Side Solution

You maybe wondering, why just change the scully generated folder to `/Page 1` by changing `./scully.scully-routes-space.config.ts` configuration file like so:

```ts
return Promise.resolve([
    { "route": "/Page%201" }, ---> { "route": "/Page 1" }
    { "route": "/Page2" },
]);
```

I did and this showed up.
```
  ⚠ handleUnknownRoute: "/Page%201", 404:""
  ⚠ Route "/Page 1" not provided by angular app
  ✔ Route "/Page 1" rendered into "./dist/static/Page 1/index.html"
  ✔ Route "/" rendered into "./dist/static/index.html"
  ✔ Route "/Page2" rendered into "./dist/static/Page2/index.html"
```

My guest is that angular seems to provide escaped routes and scully require the routes to fit perfectly those used from the angular app.
Coming back to the old approach,
```ts
return Promise.resolve([
    { "route": "/Page%201" },
    { "route": "/Page2" },
]);
ts
```

At least the scully renders was successful.
```
  ✔ Route "/Page%201" rendered into "./dist/static/Page%201/index.html"
  ✔ Route "/" rendered into "./dist/static/index.html"
  ✔ Route "/Page2" rendered into "./dist/static/Page2/index.html"
```

In this case, my best shot was to built it this way, and then remove the `%20` from the folders name.

### Conclusion

To me, to avoid this whole headache of escaped space or non escaped space I
would say to never use space in a URI in the first place.

---
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

