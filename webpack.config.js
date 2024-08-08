const path = require('path');
/**
 * do not commit devtool, and cache to CICD!
 */
module.exports = [
  {
    name: "DiffWorker",
    target: "webworker",
    entry: "./src/common/DiffWorker.ts",
    output: { 
      filename: "DiffWorker.js",
      path: path.resolve(__dirname, 'static'),
    },
    devtool: 'source-map',
    cache: {
      type: 'filesystem'
    },
    module: {
      rules: [
        {
          test: /(\.js|\.jsx|\.tsx|\.ts)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /(\.css|\.scss)$/,
          use: ['style-loader', 
                'css-loader', 
                {
                  loader: "sass-loader",
                  options: {
                    // Prefer `dart-sass`
                    implementation: require.resolve("sass"),
                    sassOptions: {
                      fiber: false,
                    },
                  },
                },  
              ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx','.ts' ,'.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname,'src'),
        "react/jsx-runtime.js":"react/jsx-runtime",
        "react/jsx-dev-runtime.js":"react/jsx-dev-runtime"
      }

    }
  },
  {
    name: "HistoryMonitor",
    target: "webworker",
    entry: "./src/common/HistoryMonitor.ts",
    output: { 
      filename: "HistoryMonitor.js",
      path: path.resolve(__dirname, 'static'),
    },
    devtool: 'source-map',
    cache: {
      type: 'filesystem'
    },
    module: {
      rules: [
        {
          test: /(\.js|\.jsx|\.tsx|\.ts)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /(\.css|\.scss)$/,
          use: ['style-loader', 
                'css-loader', 
                {
                  loader: "sass-loader",
                  options: {
                    // Prefer `dart-sass`
                    implementation: require.resolve("sass"),
                    sassOptions: {
                      fiber: false,
                    },
                  },
                },  
              ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx','.ts' ,'.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname,'src'),
        "react/jsx-runtime.js":"react/jsx-runtime",
        "react/jsx-dev-runtime.js":"react/jsx-dev-runtime"
      }

    }
  },
  {
    name: "UploadWorker",
    target: "webworker",
    entry: "./src/common/UploadWorker.ts",
    output: { 
      filename: "UploadWorker.js",
      path: path.resolve(__dirname, 'static'),
    },
    devtool: 'source-map',
    cache: {
      type: 'filesystem'
    },
    module: {
      rules: [
        {
          test: /(\.js|\.jsx|\.tsx|\.ts)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /(\.css|\.scss)$/,
          use: ['style-loader', 
                'css-loader', 
                {
                  loader: "sass-loader",
                  options: {
                    // Prefer `dart-sass`
                    implementation: require.resolve("sass"),
                    sassOptions: {
                      fiber: false,
                    },
                  },
                },  
              ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx','.ts' ,'.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname,'src'),
        "react/jsx-runtime.js":"react/jsx-runtime",
        "react/jsx-dev-runtime.js":"react/jsx-dev-runtime"
      }

    }
  }
  ,{
  dependencies: ["DiffWorker","HistoryMonitor","UploadWorker"],
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static'),
  },
  devtool: 'source-map',
  cache: {
    type: 'filesystem'
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx|\.tsx|\.ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /(\.css|\.scss)$/,
        use: ['style-loader', 
              'css-loader', 
              {
                loader: "sass-loader",
                options: {
                  // Prefer `dart-sass`
                  implementation: require.resolve("sass"),
                  sassOptions: {
                    fiber: false,
                  },
                },
              },  
            ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx','.ts' ,'.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname,'src'),
      "react/jsx-runtime.js":"react/jsx-runtime",
      "react/jsx-dev-runtime.js":"react/jsx-dev-runtime"
    }

  }
}];
