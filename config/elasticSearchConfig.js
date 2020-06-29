'use strict';

var elasticsearch = require('elasticsearch');

//var log = console.log.bind(console);

var client = new elasticsearch.Client({
    //  host: '40.115.13.239:9200',
    host: 'localhost:9200',
    log: 'trace'
});


client.ping({ requestTimeout: 30000 }, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok into => ..  elasticSearch : ');
        console.log("************************************************************* YOU CAN TEST NOW ************************************************************************");
    }
});


module.exports = { client };
