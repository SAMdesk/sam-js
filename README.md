# SAM JS

## Overview

This repo contains a JavaScript library to aid in interacting with our public API. This library was designed to work with our middleware library, which can be found [here](https://github.com/SAMdesk/sam-node).

## Installation

Install this via bower by running `bower install https://github.com/SAMdesk/sam-js.git` or include `sam.min.js` in your project.

## Usage

Instantiate a new SAMJS object somewhere in your project.

```
var sam = new SAMJS();
sam.stories.fetch(success, error);
```

## API Overview

**SAMJS(apiRoute)**

Main SAMJS constructor.

__Parameters__
* `apiRoute:<String>` - Optional: the local API route the library sends requests to.

- - -

**stories().fetch(options)**

Fetch a compact list of stories from the server.

__Parameters__
* `options:<Object>` - Object containing success and error callbacks.
* `options.success(data):<Function>` - Method to call on success.
* `options.error(statusCode, message):<Function>` - Optional: Method to call on error.

- - -

**stories().fetch(id, options)**

Fetch a story object by id from the server.

__Parameters__
* `id:<String>` - ID of the story to fetch.
* `options:<Object>` - Object containing success and error callbacks.
* `options.success(data):<Function>` - Method to call on success.
* `options.error(statusCode, message):<Function>` - Optional: Method to call on error.

- - -

**stories().get()**

Retrieve a list of story IDs from the local cache. Must fetch before you can call this, or it will return `-1`;

__Returns__
* `<Array>` An array of story IDs.

- - -

**stories().get(id)**

Retrieve a story by ID from the local cache. Must fetch before you can call this, or it will return `-1`.

__Parameters__
* `id:<String>` - ID of the story to get.

__Returns__
* `<Object>` Story object.

- - -

**stories().assets(storyId).get()**

Retrieve a list of assets in a story from the local cache. Must fetch before you can call this, or it will return `-1`;

__Parameters__
* `storyId:<String>` - ID of the story to fetch.

__Returns__
* `<Array>` An array of asset IDs.

- - -

**stories().assets(storyId, assetId).get()**

Retrieve a single assets by ID in a story from the local cache. If the asset does not exist, will return `-1`;

__Parameters__

* `storyId:<String>` - ID of the story to the asset belongs to.
* `assetId:<String>` - ID of the asset to get.

__Returns__
* `<Object>` Asset object.


## Author

Officially maintained by SAM.
