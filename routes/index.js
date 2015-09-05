var express = require('express');
var router = express.Router();
var cfenv = require('cfenv');
var request = require('request');
var fs = require('fs');

var conf = null;
var authUrl = null;
var authToken = null;

conf = cfenv.getAppEnv().getServiceCreds('Object Storage-oz');

var options = {
  url: conf.auth_uri + "/" + conf.username,
  headers: {
    'Authorization': "Basic " + new Buffer(conf.username + ":" + conf.password).toString('base64')
  }
};

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    authUrl = response.headers['x-storage-url'];
    authToken = response.headers['x-auth-token'];
    console.log(authUrl);
    console.log(authToken);
  } else {
    console.log('error: '+ response.statusCode);
  }
});

router.get('/', function(req, res, next) {
  var options = {
    url: authUrl,
    headers: {
      'X-Auth-Token': authToken
    }
  };
  request.get(options, function (error, response, body) {
    if(error) {
      console.log(error);
    }
    var containers = response.body.split("\n");
    containers.pop();
    res.render('index', { containers: containers });
  });
});

router.post('/', function(req, res) {
  var options = {
    url: authUrl + "/" + req.body.container,
    headers: {
      'X-Auth-Token': authToken
    }
  };
  request.put(options, function (error, response, body) {
    if(err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

router.post('/:container/delete', function(req, res) {
  var options = {
    url: authUrl + "/" + req.params.container,
    headers: {
      'X-Auth-Token': authToken
    }
  };
  request.del(options, function (error, response, body) {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

router.get('/:container', function(req, res) {
  var options = {
    url: authUrl + "/" + req.params.container,
    headers: {
      'X-Auth-Token': authToken
    }
  };
  request.get(options, function (error, response, body) {
    if (error) {
      console.log(err);
    }

    // Remove final object in array
    var objects =  response.body.split("\n");
    objects.pop();

    res.render('container', {
      objects: objects,
      container: req.params.container
    });
  });
});

router.post('/:container', function(req, res) {
  console.log(req.file);
  var options = {
    url: authUrl + "/" + req.params.container + '/' + req.file.originalname,
    headers: {
      'X-Auth-Token': authToken
    },
    formData: {
      value: fs.createReadStream(req.file.path),
      //options: {
        //filename: req.file.originalname
        //contentType: req.file.mimetype
        //knownLength:
      //}
    }
  };
  request.put(options, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    res.redirect('/' + req.params.container);
  });
});

router.post('/:container/:object/delete', function(req, res) {
  var options = {
    url: authUrl + "/" + req.params.container + '/' + req.params.object,
    headers: {
      'X-Auth-Token': authToken
    }
  };
  request.del(options, function (error, response, body) {
    res.redirect('/' + req.params.container);
  });
});

router.get('/:container/:object', function(req, res) {
  var options = {
    url: authUrl + "/" + req.params.container + '/' + req.params.object,
    headers: {
      'X-Auth-Token': authToken
    }
  };
  request.get(options, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    var object = response.body;
    res.sendFile("../tmp/0adb8969f0410369fa31ffe809c934b8");
  });
});

module.exports = router;
