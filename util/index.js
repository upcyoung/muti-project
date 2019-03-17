const path = require('path');
const chalk = require('react-dev-utils/chalk');
const { paths } = require('react-app-rewired');
const configFactory = require(paths.scriptVersion + '/config/webpack.config');
const createDevServerConfig = require(paths.scriptVersion + '/config/webpackDevServer.config');
const override = require('../config-overrides');


let packageJson = require(path.join(paths.appPath,'react.json'));

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
      currentApp = {currentStr:apps[currentStr]};
      return true;
    }
  }
  return false;
});

const bpObj = currentApp?currentApp:apps;
const buildApps = [];
for(let key in bpObj){
  const config =configFactory(process.env.NODE_ENV);
  override(config);
  setAppConfig(config,bpObj[key]);
  bpObj[key]['config']=config;
  buildApps.push(bpObj[key]);
}



function setAppConfig(config, app) {
  config.entry[config.entry.length - 1] = path.join(paths.appPath, app.main);
  paths.appIndexJs = path.join(paths.appPath, app.main);
  if(app.path){
    config.output.path = path.join(paths.appBuild, app.path);
  }
  if(app.publicPath&&process.env.NODE_ENV!=="development"){
    config.output.publicPath = `${app.publicPath}/`;
  }
}



module.exports = {
  buildApps,
  createDevServerConfig,
  paths
};
