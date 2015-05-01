Package.describe({
  name: '3stack:embox-value',
  version: '0.1.1',
  summary: 'A tool to cache & recompute the value of a reactive computation',
  git: 'https://github.com/3stack-software/meteor-embox-value',
  documentation: 'README.md'
});

Package.onUse(function(api){
  api.versionsFrom('METEOR@0.9.2');

  api.export('emboxValue', 'client');

  api.use([
    'tracker'
  ], 'client');
  api.use('blaze', {weak: true});
  api.addFiles([
    'embox-value.js',
    'template-hooks.js'
  ], 'client');

});
