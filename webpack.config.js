const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require( 'path' );

module.exports = {

    // bundling mode
    mode: 'production',

    // entry files
    entry: './src/ts/index.ts',

    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'root' ),
        filename: 'main.js',
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/index.html',
      inject: true,
      filename: 'index.html'
    }
        
    )],

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
              },
        ]
    }
};