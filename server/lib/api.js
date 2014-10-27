/* global exports, require */

'use strict';

var koast = require('koast');
var koastRouter = koast.koastRouter;
var connection = koast.db.getConnectionNow();
var mapper = koast.mongoMapper.makeMapper(connection);

exports.defaults = {};

function isOwner(data, req) {
    // return data.owner === 'alice';
    //console.log(req.user.data.username,data.owner);
    return req.user && (data.owner === req.user.data.username);
}

function taskAnnotator(req, item, res) {
    item.meta.can = {
        edit: isOwner(item.data, req)
    };
}

var defaults = {
  authorization: function defaultAuthorization(req, res) {
    // var authHeader = req.headers.authorization;
    // if (authHeader) {
    //   return authHeader[0] === '3';
    // } else {
    //   return false;
    // }
    return true;
  }
};

mapper.options.useEnvelope = true;

function makeRoutes(options) {
  return [{
    method: 'get',
    route: 'tasks',
    handler: mapper.get({
      model: 'tasks',
      useEnvelope: options.useEnvelope,
      annotator: taskAnnotator
    })
  }, {
    method: 'post',
    route: 'tasks',
    handler: mapper.post({
      model: 'tasks',
      useEnvelope: options.useEnvelope
    })
  }, {
    method: ['get', 'put', 'delete'],
    route: 'tasks/:_id',
    handler: mapper.auto({
      model: 'tasks',
      useEnvelope: options.useEnvelope,
      queryDecorator: function(query, req) {
        // query.owner = req.user.data.username;
      }
    })
  }, {
    method: 'get',
    route: 'users',
    handler: mapper.get({
      model: 'users',
      useEnvelope: options.useEnvelope
    })
  }];
}

module.exports = exports = {
  makeKoastModule: function(options) {
    var routes = makeRoutes(options);
    return {
      defaults: defaults,
      router: koastRouter(routes, defaults)
    }
  }
};