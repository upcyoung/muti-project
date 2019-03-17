const { addBabelPlugin, addLessLoader } = require('customize-cra');
const path = require('path');
const { paths } = require('react-app-rewired');

const fixBabelImports = (libraryName, options) => {
    return [
        "import",
        Object.assign(
            {},
            {
                libraryName
            },
            options
        ),
        `fix-${libraryName}-imports`
    ];
};

module.exports = (config) => {


    // // 开发环境加入mock
    // if (process.env.NODE_ENV === 'development') {
    //     config.entry.unshift(path.join(paths.appPath, 'src/mock/index.ts'));
    // }
    // // babel-polyfill替换react-app-polyfill/ie9解决LocalPrivoder报错
    // config.entry.unshift(require.resolve('babel-polyfill'));
    // const plugin = fixBabelImports('import', {
    //     libraryName: 'antd',
    //     libraryDirectory: 'es',
    //     style: true,
    // });
    // config = addBabelPlugin(plugin)(config);
    // addLessLoader({
    //     javascriptEnabled: true,
    //     localIdentName: '[folder]__[local]--[hash:base64:5]',
    //     modifyVars: { '@primary-color': '#1DA57A' },
    // })(config);
    return config;
}