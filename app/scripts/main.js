/*global Stem, $*/

// Main JavaScript file for STEM Incubator site. Code in
// this file mostly just sets things up for the app and
// then launches it. This file also includes configuration
// information.

// Everything in the application is namespaced under the
// global variable `Stem`. Invidual components (e.g. models,
// views, collections, etc.) add themselves to this
// namespace as part of their definition.

window.Stem = {
    Collections: {},
    Models: {},
    Routers: {},
    Views: {},

    // Global configuration items are defined in the
    // `config` property. Sensitive data (e.g. production
    // API keys) should not be specified here, but,
    // rather, set in the `keys.js` file which is
    // excluded from the public repository.

    config: {

        // Demo key for DonorsChoose; replaced by
        // production key in `keys.js`.

        donorsChooseApiKey: 'DONORSCHOOSE',

        // OAE configuration. Host and protocol are
        // split to allow easy switching between
        // secure and non-secure (i.e. demo) version.

        oae: {
            groups: {
                businesses:   'g%3Asi%3A7Ji6H8sI',
                courses:      'g%3Asi%3A7Ji6H8sI',
                partnerships: 'g%3Asi%3A7Ji6H8sI',
                schools:      'g%3Asi%3A7Ji6H8sI'
            },
            host: 'stemincubator.oaeproject.org',
            protocol: 'https:'
        },

        // Default geographic coordinates are the
        // center of the state.

        geo: {
            latitude: 32.9605,
            longitude: -83.1132,
            northwestCorner: [35.000659, -85.605165],
            southeastCorner: [30.355757, -80.751429]
        }

    },

    // General user information shared by multiple
    // components.

    user: {

        // Geolocation information for the user.

        geo: {

        }

    },

    // The `init()` function is called when it's time
    // to start the application.

    init: function () {
        'use strict';

        // Make sure the App object is defined. If it is,
        // create one. It handles everything from there.

        if (this.Routers && this.Routers.App) {
            Stem.app = new this.Routers.App();
        }

    }

};

// Wait for jQuery's `ready` event to start the application.

$(document).ready(function () {
    'use strict';
    Stem.init();
});

