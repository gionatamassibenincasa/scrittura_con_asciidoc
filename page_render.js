var page = require('webpage').create();
page.open('file://./scrittura_ts_asciidoc.html', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('example.pdf');
  }
  phantom.exit();
});
