try {
  require('./main');
} catch(e) {
  $('body').addClass('unsupported');
}

$('body').addClass('ready');
