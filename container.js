const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependencies = [
    ['_', 'lodash'],
    ['passport', 'passport'],
    ['formidable', 'formidable'],
    ['async', 'async'],
    ['validator', 'express-validator'],
    ['Club', './models/clubs'],
    ['Users', './models/users']
];



simpleDependencies.forEach(function(dependency) {
    container.register(dependency[0], function(){
        return require(dependency[1]);
    })
});


container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function() {
    return container;
});

module.exports = container;