const path = require('path');
const chalk = require('react-dev-utils/chalk');
const { paths } = require('react-app-rewired');
const configFactory = require(paths.scriptVersion + '/config/webpack.config');
const { NormalModuleReplacementPlugin } = require('webpack');
const createDevServerConfig = require(paths.scriptVersion + '/config/webpackDevServer.config');
const override = require('../config-overrides');
const { run } = require('./try-value');
const { isReplacement, isArray } = require('./is');


let packageJson = require(resolveApp('react.json'));

let apps = packageJson.projects;

const argvs = process.argv.slice(2);
let currentApp = null;
argvs.some(arg => {
  if (arg.startsWith('--app=')) {
    const currentStr = arg.split('=')[1];
    if (!apps[currentStr]) {
      console.log(chalk.yellow(`${currentStr} is not in apps`));
      process.exit(1);
    } else {
      currentApp = { currentStr: apps[currentStr] };
      return true;
    }
  }
  return false;
});

const bpObj = currentApp ? currentApp : apps;
const buildApps = [];
for(let key in bpObj){
  const config =configFactory(process.env.NODE_ENV);
  override(config);
  setAppConfig(config,bpObj[key]);
  bpObj[key]['config']=config;
  buildApps.push(bpObj[key]);
}



function setAppConfig(config, app) {
  config.entry[config.entry.length - 1] = resolveApp(app.main);
  paths.appIndexJs = resolveApp(app.main);
  if (app.path) {
    config.output.path = path.join(paths.appBuild, app.path);
  }
  if (app.publicPath && process.env.NODE_ENV !== "development") {
    config.output.publicPath = `${app.publicPath}/`;
  }
  const replacements = run(app, `${process.env.NODE_ENV}.fileReplacements`);
  if (isArray(replacements)) {
    const replacementPlugins = replacements.filter(isReplacement)
      .map(r => new NormalModuleReplacementPlugin(RegExp(r['from']), resolveApp(r['with'])));
    config.plugins.unshift(...replacementPlugins);
  }
}

function resolveApp(name, relative=null) {
  return path.join(relative || paths.appPath, name);
}



module.exports = {
  buildApps,
  createDevServerConfig,
  paths
};