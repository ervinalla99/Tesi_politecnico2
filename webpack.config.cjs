const path = require('path');

module.exports = {
  mode: 'development', // or 'production' for production builds
  entry: './src/main.ts', // Path to your entry TypeScript file
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js' // Output filename
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'] // Resolve TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.jest.json', // Adjust the path accordingly
          }
        },
        exclude: /node_modules/
      },
    ],
  },
};
