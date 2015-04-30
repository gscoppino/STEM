/* jshint sub: true */
/*global before, describe, it, sinon, $, Stem  */

describe('MemberGroups Collection', function () {
    'use strict';

    var oaeResponse = { "results": [
        {
          "profile": {
            "id": "g:gatech:XkcBsFRK",
            "description": "Simple group. To be deleted soon.",
            "resourceType": "group",
            "picture": {
              "small": "/api/download/signed?uri=local%3Au%2Fgatech%2Flk%2Fnv%2FFk%2FQk%2FlknvFkQkb%2Fprofilepictures%2F1406724198397%2Fsmall.jpg&expires=1427932800000&signature=225e10bfa0c33c02a22d18b31626807d5726dfb1",
              "large": "/api/download/signed?uri=local%3Au%2Fgatech%2Flk%2Fnv%2FFk%2FQk%2FlknvFkQkb%2Fprofilepictures%2F1406724190852%2Flarge.jpg&expires=1427932800000&signature=58fbe47d36cc415006d748c54458607d012bdc1d",
              "medium": "/api/download/signed?uri=local%3Au%2Fgatech%2Flk%2Fnv%2FFk%2FQk%2FlknvFkQkb%2Fprofilepictures%2F1406724198397%2Fmedium.jpg&expires=1427932800000&signature=202cf2b1b8c5d3d8e8eabc7a6293162a17c4517b"
            },
            "profilePath": "/group/gatech/XkcBsFRK",
            "joinable": "no",
            "tenant": {
              "alias": "gatech",
              "displayName": "Georgia Institute of Technology"
            },
            "lastModified": "1426871171399",
            "createdBy": "u:gatech:lknvFkQkb",
            "visibility": "public",
            "created": "2015-03-20T17:04:16.564Z",
            "displayName": "Child Group"
          },
          "role": "member"
        },
        {
          "profile": {
            "id": "u:gatech:lknvFkQkb",
            "resourceType": "user",
            "picture": {
              "small": "/api/download/signed?uri=local%3Au%2Fgatech%2Flk%2Fnv%2FFk%2FQk%2FlknvFkQkb%2Fprofilepictures%2F1406724198397%2Fsmall.jpg&expires=1427932800000&signature=225e10bfa0c33c02a22d18b31626807d5726dfb1",
              "large": "/api/download/signed?uri=local%3Au%2Fgatech%2Flk%2Fnv%2FFk%2FQk%2FlknvFkQkb%2Fprofilepictures%2F1406724190852%2Flarge.jpg&expires=1427932800000&signature=58fbe47d36cc415006d748c54458607d012bdc1d",
              "medium": "/api/download/signed?uri=local%3Au%2Fgatech%2Flk%2Fnv%2FFk%2FQk%2FlknvFkQkb%2Fprofilepictures%2F1406724198397%2Fmedium.jpg&expires=1427932800000&signature=202cf2b1b8c5d3d8e8eabc7a6293162a17c4517b"
            },
            "profilePath": "/user/gatech/lknvFkQkb",
            "notificationsUnread": 0,
            "locale": "en_US",
            "publicAlias": "Stephen Anthony Thomas",
            "tenant": {
              "alias": "gatech",
              "displayName": "Georgia Institute of Technology"
            },
            "notificationsLastRead": 1426796595298,
            "acceptedTC": 0,
            "visibility": "public",
            "lastModified": 1426796595300,
            "email": "stephen.thomas@et.gatech.edu",
            "displayName": "Stephen Thomas",
            "emailPreference": "daily"
          },
          "role": "manager"
        }],
        "nextToken": null
    };

    // Convenience function to parse URLs by taking
    // advantage of the browser.

    var parseURL = function(url) {

        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substr(1);
        var queries = {};
        query.split('&').forEach(function(part) {
            var item = part.split('=');
            queries[item[0]] = decodeURIComponent(item[1]);
        });

        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            queries: queries,
            hash: parser.hash
        };
    };

    before(function () {
        var ajaxStub = sinon.stub($, 'ajax').yieldsTo('success', oaeResponse);
        this.MemberGroupsCollection = new Stem.Collections.MemberGroups([],{parentId: 'ParentId'});
        this.MemberGroupsCollection.fetch({validate:true});
        ajaxStub.restore();
    });

    it('should generate the correct default URL to access the OAE', function() {
        parseURL(this.MemberGroupsCollection.url())['protocol'].should.equal(Stem.config.oae.protocol);
        parseURL(this.MemberGroupsCollection.url())['host'].should.equal(Stem.config.oae.host);
        parseURL(this.MemberGroupsCollection.url())['pathname'].should.equal('/api/search/members-library/ParentId');
    });

    it('should include specified size limit in the request URL', function() {
        parseURL((new Stem.Collections.MemberGroups([], {limit: 5})).url()).queries['limit'].should.equal('5');
    });

    it('should parse the response from the OAE', function() {
        this.MemberGroupsCollection.length.should.equal(1);
    });

    it('should not parse directly created models', function() {
        var MemberGroupsCollection = new Stem.Collections.MemberGroups(
            oaeResponse.results.map(function(result) {
                return result.profile;
            })
        );
        MemberGroupsCollection.length.should.equal(2);
    });

    it('should create models from the OAE response', function() {
        this.MemberGroupsCollection.at(0).get('description').should.equal(oaeResponse.results[0].profile.description);
    });

    it('should set the thumbnail from the small picture', function() {
        this.MemberGroupsCollection.at(0).get('thumbnailUrl').should.equal(oaeResponse.results[0].profile.picture.small);
    });

    it('should return current options when requested', function() {
        var MemberGroupsCollection = new Stem.Collections.MemberGroups([], {limit: 5});
        MemberGroupsCollection.options().limit.should.equal(5);
    });

    it('should set options dynamically', function() {
        this.MemberGroupsCollection.options({limit: 10});
        this.MemberGroupsCollection.options().limit.should.equal(10);
    });

    it('should abort in-flight requests on new request', function() {
        var xhrStub = sinon.useFakeXMLHttpRequest();
        var xhrs = [];
        xhrStub.onCreate = function (xhr) { xhrs.push(xhr); };
        this.MemberGroupsCollection.fetch();
        xhrs.length.should.equal(1);
        this.MemberGroupsCollection.fetch();
        xhrs.length.should.equal(2);
        xhrs[0].aborted.should.be.true();
        xhrStub.restore();
    });

});
