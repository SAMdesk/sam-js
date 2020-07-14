function SAMJS(apiRoute) {

    var self = this;

    this.apiRoute = apiRoute ? apiRoute : '/sam';

    // Local cache
    this._stories = [];
    this._story = {};

    // Perform a basic AJAX call
    function ajax(url, success, error) {

        var xmlhttp = window.XMLHttpRequest ?
            new XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    success(JSON.parse(xmlhttp.responseText));
                } else {
                    var msg = 'An error has occurred';

                    switch(xmlhttp.status) {
                        case 400:
                            msg = 'Bad request. Are you missing a required parameter?';
                            break;
                        case 401:
                            msg = 'Unauthorized. No valid API key provided.';
                            break;
                        case 404:
                            msg = 'Not found. The requested item does not exist.';
                            break;
                        case 500:
                        case 502:
                        case 503:
                        case 504:
                            msg = 'Server error. Something went wrong on our end.'
                            break;
                    }

                    if(error) error(xmlhttp.status, msg);
                    else if(console) console.error(xmlhttp.status, msg);
                }
            }
        }

        xmlhttp.open('GET', url, true);
        xmlhttp.setRequestHeader('Content-type','application/json');
        xmlhttp.send();

    };

    function fetchStories() {
        var id, options;

        // get a specific story
        if(arguments.length > 1) {
            id = arguments[0];
            options = arguments[1];

            fetchStory(id, options);
        }

        // get a compact list of stories
        else {
            options = arguments[0];

            ajax(self.apiRoute + '/stories', function(data) {
                self._stories = data;
                options.success(data);
            }, options.error);
        }
    }

    // recursive function for queuing calls
    function fetchStory(storyId, options) {
        var id = storyId;

        // Get first item in storyId array for recursion
        if(typeof storyId === 'object') {
            id = storyId[0];
            storyId.splice(0,1);
        }

        // go get 'em
        ajax(self.apiRoute + '/stories' + '/' + id, function(data) {
            self._story[id] = data;
            options.success(data);

            // Recurse
            if(typeof storyId === 'object') {

                // No more stories, call done callback
                if(storyId.length === 0) {
                    if(options.done) options.done();
                }

                // Still stories to fetch
                else {
                    fetchStory(storyIds, options);
                }
            }
        }, options.error);
    }

    function getStories(id) {

        // get a compact list of stories
        if(typeof id === 'undefined') {
            return self._stories;
        }

        // get a single story in full
        if(typeof id === 'string') {
            return self._story[id] === undefined ? -1 : self._story[id];
        }

        // get multiple specific stories
        if(typeof id === 'object') {
            var story, stories = [];
            for(var i = 0; i < id.length; i++) {
                story = self._story[ id[i] ];

                if(story !== undefined) {
                    stories.push(story);
                } else {
                    stories.push(-1);
                }
            }
            return stories;
        }
    }

    function getAssets(storyId, assetId) {
        var story = self._story[storyId];

        if(story === undefined) return -1; // story doesn't exist

        // get a list of social asset ids
        if(typeof assetId === 'undefined') {
            for(var i = 0; i < self._stories.length; i++) {

                // found story, return it's assets
                if(self._stories[i].id === storyId) {
                    var assets = [];
                    for(var x = 0; x < self._stories[i].socialAssets.length; x++) {
                        assets.push( self._stories[i].socialAssets[x].id );
                    }
                    return assets;
                }
            }

            return -1; // no results found
        }

        // get a specific social asset
        if(typeof assetId === 'string') {
            for(var i = 0; i < story.socialAssets.length; i++) {
                if(story.socialAssets[i].id === assetId) return story.socialAssets[i];
            }
            return -1;
        }

        // get multiple specific social assets
        if(typeof assetId === 'object') {
            var storyAssets = story.socialAssets[assetId],
                assets = [],
                asset;

            for(var i = 0; i < assetId.length; i++) {
                asset = storyAssets[ assetId[i] ];

                if(asset !== undefined) {
                    assets.push(asset);
                } else {
                    assets.push(-1);
                }
            }
            return assets;
        }
    }

    this.stories = {
        fetch: fetchStories,
        get: getStories,
        assets: {
            get: getAssets
        }
    }

}