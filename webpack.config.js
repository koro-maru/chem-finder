// entry -> output
const path = require('path');
module.exports = {
    entry: './src/app.js',
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module : {
        rules: [
            {
            loader: 'babel-loader',
            query: {presets: ['react']},
            test: /\.js$/,
            exclude: /node_modules/
            },
        {
            test: /\.s?css$/,
            //allows for arr of loaders
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        },
    ]
    },
    node: {
        dns: 'mock',
        net: 'mock'
        },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'public')
    }
};



// (`_` ]])