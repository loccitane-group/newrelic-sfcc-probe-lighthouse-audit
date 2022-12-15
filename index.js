// ----------------------------  SETTINGS --------------------------------

/*
  The URL of your web page you want to audit.
*/
const URL = 'https://fr.loccitane.com/';

/*
  Google PageSpeed API key
  See here to get an API key: https://developers.google.com/speed/docs/insights/v5/get-started#APIKey
  
  Note: You can store the key safely in the secret vault of NewRelic to not expose it
  (https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/using-monitors/store-secure-credentials-scripted-browsers-api-tests/)
*/
const GOOGLE_PAGESPEED_API_KEY = $secure.PAGESPEED_INSIGHTS_API_KEY;

/*
  The list of audit category to run.
  Available values are:
  - accessibility
  - best_practices
  - performance
  - pwa
  - seo
*/
const CATEGORIES = [
  'performance',
  'seo',
  'accessibility'
];

/*
  Audit strategy (one of those):
  - mobile
  - desktop
*/
const STRATEGY = 'mobile';

// ----------------------------  PROGRAM --------------------------------

if (https == null) {
    var https = require('https');
}
  
if (querystring == null) {
  var querystring = require('querystring');
}

var settings = {
    url: URL,
    strategy: STRATEGY,
    key: GOOGLE_PAGESPEED_API_KEY
};

const options = {
  hostname: 'www.googleapis.com',
  port: 443,
  path: '/pagespeedonline/v5/runPagespeed?' + querystring.stringify(settings) + CATEGORIES.map(c => "&category="+c).join(''),
  method: 'GET'
}

const addInsight = function (key, value) {
  console.log(key, value);
  $util.insights.set(key, value);
}

const req = https.request(options, response => {
    if (response.statusCode == 200) {
        var body = '';

        response.on('data', function(chunk){
            body += chunk;
        });

        response.on('end', function(){
            var jsonBody = JSON.parse(body);

            var lighthouseMetrics = jsonBody.lighthouseResult.audits.metrics.details.items[0];
            addInsight('url', settings.url);
            addInsight('deviceType', settings.strategy);

            for (var category of CATEGORIES) {
              addInsight(category+'Score', jsonBody.lighthouseResult.categories[category].score);
            }
        });
    } else {
        console.log('Non-200 HTTP response: ' + response.statusCode);
    }
})

req.on('error', error => {
  console.error(error)
})

req.end()
