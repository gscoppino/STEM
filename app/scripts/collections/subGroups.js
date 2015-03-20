/*global Stem, _, Backbone*/

// Backbone collection for groups that are members of
// a common parent group.

Stem.Collections = Stem.Collections || {};

(function () {
    'use strict';

    Stem.Collections.SubGroups = Backbone.Collection.extend({

        model: Stem.Models.Group,

        // Default values for collection options.

        defaults: {
            parentId: ''
        },

        // Since we're accepting options for the collection,
        // we need an `initialize` method to handle them.

        initialize: function(models, options) {

            // We store the processed values in an
            // `options` property of the collection.

            this._options = _.extend({}, this.defaults, options);

        },

        // Since we're using a OAE endpoint instead of Rails CRUD
        // conventions to retrieve the collection, we have to define
        // our own function that returns the URL for the collection.

        url: function() {

            return Stem.config.oae.protocol + '//' + Stem.config.oae.host +
                '/api/group/' + this._options.parentId + '/members' +
                (this._options.limit ? ('?' + 'limit=' + this._options.limit) : '');

        },

        // Since we're using an OAE endpoint instead of Rails, we
        // supply a parse function to extract the actual model
        // information from the response. We also have to account
        // for the possibility of a collection being created
        // directly from an array of models. In the latter case,
        // we _won't_ have to parse anything.

        parse: function(response)  {

            // The OAE API returns models in the `results`
            // property of the response. If that property
            // exists, return the models it contains. Otherwise
            // we assume that the "response" is already an
            // array of models and return it directly.

            return response.results ?

                _(response.results).map(function(result) {
                    if (!result.profile.thumbnailUrl && result.profile.picture.small) {
                        result.profile.thumbnailUrl = result.profile.picture.small;
                    }
                    return result.profile;
                }) :

                response;

        }

    });

})();
