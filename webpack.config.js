exports.modifyWebpackConfig = ({ config, _stage }) => {
    console.log("*********config._config.context: ", config._config.context)
  return config.merge({
    resolve: {
      alias: {
        shared: path.resolve(config._config.context, '../shared'),
      },
    },
  })
}