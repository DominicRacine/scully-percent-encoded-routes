import { ScullyConfig } from '@scullyio/scully';


/** my plugin **/
import { registerPlugin, HandledRoute } from '@scullyio/scully';
function dataPathPlugin(route: string, config = {}): Promise<HandledRoute[]> {
    return Promise.resolve([
        { "route": "/Page%201" },
        { "route": "/Page2" },
    ]);
}
const validator = async (conf: any) => [];
registerPlugin('router', 'dataPaths', dataPathPlugin, validator);


/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer';

export const config: ScullyConfig = {
  puppeteerLaunchOptions: {
      executablePath: '/usr/local/bin/chromium'
  },
  projectRoot: "./src",
  projectName: "scully-routes-space",
  outDir: './dist/static',
  routes: {
    '/:name': {
      type: 'dataPaths'
    }
  }
};
