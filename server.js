const path = require('path');

const webpack = require('webpack');
const express = require('express');

const { config } = require('./webpack.config.dev');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (_, rsp) => {
  rsp.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8083, 'localhost', (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  // eslint-disable-next-line no-console
  console.log('Listening on localhost:8083');
});
