var http = require('http'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('http-proxy-rules');

var proxyRules = new HttpProxyRules({
    rules: {
        'http://psearcy.com' : 'http://localhost:81',
        '.*/stream' : 'http://psearcy.com:4321/stream',
        '.*/normal' : 'http://psearcy.com:4321/normal'
    },
    default: 'http://psearcy.com:81'
});

var proxy = httpProxy.createProxy();
http.createServer(function (req, res) {
    
    // a match method is exposed on the proxy rules instance
    // to test a request to see if it matches against one of the specified rules
    var target = proxyRules.match(req);
    if (target) {
        return proxy.web(req, res, {
            target: target
        });
    }
    
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('The request url and path did not match any of the listed rules!');
}).listen(80);