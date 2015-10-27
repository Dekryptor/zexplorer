function routing(app) {
    var routes = {
        index: require('./'),
        api: require('./api'),
        test: require('./test')

    };

    app.use('/', routes.index);
    app.use('/api', routes.api);
    app.use('/test', routes.test);
}

module.exports = routing;