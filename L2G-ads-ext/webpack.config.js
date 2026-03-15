const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? false : 'source-map',
        entry: {
            popup: './src/popup.ts',
            background: './src/background.ts',
            content: './src/content.ts',
            dashboard: './src/dashboard.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.ts', '.js', '.css']
        },
        module: {
            rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    outputPath: 'images/',
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
            ]
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: 'src/manifest.json', to: 'manifest.json' },
                    { from: 'src/popup.html', to: 'popup.html' },
                    { from: 'src/dashboard.html', to: 'dashboard.html' },
                    { from: 'src/img', to: 'img' },
                    { from: 'src/css', to: 'css' }
                ]
            }),
            // ...(isProduction ? [new WebpackObfuscator({ rotateStringArray: true })] : [])
        ],
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        },
                        format: {
                            comments: false
                        }
                    },
                    extractComments: false
                })
            ]
        },
        watch: !isProduction
    };
};