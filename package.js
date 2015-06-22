Package.describe({
  name: '3stack:embox-value',
  version: '0.2.3',
  summary: 'A tool to cache & recompute the value of a reactive computation',
  git: 'https://github.com/3stack-software/meteor-embox-value',
  documentation: 'README.md'
});

Package.onUse(function(api){
  api.versionsFrom('METEOR@1.1.0.2');

  api.export('emboxValue', 'client');

  api.use([
    'underscore',
    'tracker'
  ], 'client');
  api.use('blaze', {weak: true});
  api.addFiles([
    'box.js',
    'lazy-box.js',
    'embox-value.js',
    'template-hooks.js'
  ], 'client');

});
