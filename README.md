#Optimizely Marketing Website

![Optimizely logo](http://styleguide.optimizely.com/img/logos/optimizely/blue/optimizely_logo_BLUE.svg)

##Overview

This is the repository for the Optimizely marketing website.

The website is built on static architecture, meaning that there is no backend component to the production environment. Every URL is just a static `.html` file. The `.html` files are generated very similar to how many websites compile `.js` and `.css` files. The `.html` files are compiled once on a machine and then transferred to the origin server. In production the origin server will be S3.

The entire website is built on top of [Grunt](http://gruntjs.com), the JavaScript task runner for [Node](http://nodejs.org).

See the [wiki](https://github.com/optimizely/marketing-website/wiki) for more information.
