var asciidoctor = require('asciidoctor.js')(); 
const fileName = 'scrittura_ts_asciidoc.adoc';
// var doc = asciidoctor.loadFile(fileName);
var html = asciidoctor.convertFile(fileName); 

