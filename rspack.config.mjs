import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error('Unknown bundler');
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: 'development',
  devtool: false,
  entry: {
    main: './src/index',
  },
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, 'webpack-dist')
      : path.resolve(__dirname, 'rspack-dist'),
    filename: '[name].js',
  },
  module: {
    /**
     * After merge, the generator will be:
     * {
     *   "asset/resource": {
     *     emit: true,
     *     outputPath: 'assets/',
     *     filename: '[name][ext]',
     *     publicPath: 'https://cdn/assets/'
     *   }
     * }
     */
    generator: {
      asset: {
        emit: false,
        outputPath: 'assets/',
      },
      'asset/resource': {
        emit: true,
        filename: '[name][ext]',
      },
    },
    rules: [
      {
        test: /\.txt$/,
        type: 'asset/resource',
        generator: {
          publicPath: 'https://cdn/assets/',
        },
      },
    ],
  },
};

export default config;
