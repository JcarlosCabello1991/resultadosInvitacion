const webpack = require('webpack');

module.exports = function override(config, env) {
  // Modifica la configuración aquí
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer/'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    querystring: require.resolve('querystring-es3'),
    os: require.resolve('os-browserify/browser'),
    fs: false, // Usar false para fs si no es necesario en el navegador
    child_process: false, // Usar false para child_process si no es necesario en el navegador
    zlib: require.resolve('browserify-zlib'),
    net: require.resolve('stream'),
    tls: require.resolve('tls-browserify'),
    http2: false,//require.resolve('http2')
    vm: require.resolve("vm-browserify"),
    http: false,
  };

  config.module.rules.push({
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      },
    },
  });

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]);

  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    use: ['source-map-loader'],
    exclude: [
     /node_modules\/tls-browserify/,
    /node_modules\/node-forge/,
    /node_modules\/gaxios/,
    /node_modules\/https-proxy-agent/,
    /node_modules\/googleapis-common/,
    /node_modules\/gtoken/,
    /node_modules\/gcp-metadata/,
    ],
  });

  return config;
};