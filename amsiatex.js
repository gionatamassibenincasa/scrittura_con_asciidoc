/*jslint browser: true */
/* jslint var: Asciidoctor, AsciidoctorKroki */
var asciidoctor = Asciidoctor();
var registry = asciidoctor.Extensions.create();

var kroki = AsciidoctorKroki;
var chart = AsciidoctorChart;

kroki.register(registry);
chart.register(registry);

var aggiorna;

var generaPaginaHtml = function (innnetHTML) {
    'use strict';
    var source = '<html>\r\n' +
        '\t<head>\r\n' +
        // MathJax 3
        '\t\t<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>\r\n' +
        '\t\t<script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>\r\n' +
        // Font-awesome
        '\t\t<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" media="all">' +
        // AsciiDoctor style
        '\t\t<link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@asciidoctor/core@2.0.3/dist/css/asciidoctor.css" media="all">\r\n' +
        // Highlight
        // '\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"></script>\r\n' +
        // Chartist style
        '\t\t<link rel="stylesheet" href="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">\r\n' +
        '\t\t<script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>\r\n' +
        '\t</head>\r\n' +
        '\t<body>\r\n' +
        innnetHTML + '\r\n' +
        '\t\t<script>\r\n' +
        '      document.body.querySelectorAll(\'div.ct-chart\').forEach(function(node) {\r\n' +
        '        var options = {\r\n' +
        '          height: node.dataset[\'chartHeight\'],\r\n' +
        '          width: node.dataset[\'chartWidth\'],\r\n' +
        '          colors: node.dataset[\'chartColors\'].split(\',\')\r\n' +
        '        };\r\n' +
        '        var dataset = Object.assign({}, node.dataset);\r\n' +
        '        var series = Object.values(Object.keys(dataset)\r\n' +
        '          .filter(function(key) {return  key.startsWith(\'chartSeries-\')})\r\n' +
        '          .reduce(function(obj, key) {\r\n' +
        '            obj[key] = dataset[key];\r\n' +
        '            return obj;\r\n' +
        '          }, {})).map(function(value) {return value.split(\',\'); });\r\n' +
        '        var data = {\r\n' +
        '          labels: node.dataset[\'chartLabels\'].split(\',\'),\r\n' +
        '          series: series\r\n' +
        '        };\r\n' +
        '        Chartist[node.dataset[\'chartType\']](node, data, options);\r\n' +
        '      });\r\n' +
        '\t\t</script>' +
        "\t</body>\r\n" +
        "</html>";

    return source;
};

var converti = function () {
    'use strict';
    var traverse = function (node, level) {
        level = level || 0;
        var txt = "";
        if (node.isBlock()) {
            for (var i = 0; i < level; i++) {
                txt += " ";
            }
            txt += node.context;
            switch (node.context) {
                case "document":
                    break;
                case "section":
                    txt += " (livello " + node.level + ", titolo: " + node.title + ")";
                    break;
                case "paragraph":
                    txt += " (prima riga: " + node.lines[0].substring(0, 80) + ")";
            }
        }
        txt += "\n";
        if (node.hasBlocks()) {
            node.blocks.forEach(b => {
                txt += traverse(b, level + 1);
            });
        }

        return txt;
    };
    var contenuto = editor.getValue();
    var doc = asciidoctor.load(contenuto, {
        header_footer: false,
        'safe': 'unsafe',
        runtime: {
            platform: 'browser'
        },
        attributes: {
            'showtitle': true,
            'linkcss': true,
            'icons': 'font',
            'lang': 'it',
            'backend': 'html5',
            'sectnums': true,
            'toc-title': 'Indice',
            'front-matter': '',
            'toc': 'auto',
            'toclevels': 3,
            'doctype': 'article',
            'stem': true,
            'iconfont-name': 'font-awersome',
            'iconfont-remote': true,
            'source-highlighter': 'highlightjs',
            'header_footer': true,
            'sourcemap': true,
            'plantuml-server-url': 'http://www.plantuml.com/plantuml'
        },
        'extension_registry': registry
    });
    var conversione_html = doc.convert();
    // console.log(conversione_html);
    var r = document.getElementById("render");
    r.setAttribute("display", "none");
    var html = generaPaginaHtml(conversione_html);
    var iframe = document.querySelector('#render');
    iframe.srcdoc = html;
    console.log(traverse(doc));
    //document.getElementById("ast").innerHTML = traverse(doc);
};

var editor = ace.edit("editor", {
    theme: "ace/theme/monokai",
    mode: "ace/mode/asciidoc",
    autoScrollEditorIntoView: true,
    minLines: 30
});
editor.session.on('change', function (delta) {
    if (delta.lines.length === 1 && delta.lines[0].length < 4) {
        if (aggiorna) {
            clearTimeout(aggiorna);
        }
        aggiorna = setTimeout(converti, 2000);
    } else {
        converti();
    }

});

document.getElementById("srcSave").addEventListener("click", function (evt) {
    'use strict';
    var e = document.createElement('a');
    e.href = URL.createObjectURL(new Blob([editor.session.getValue()], {
        type: "text/plain"
    }));
    e.download = asciidoctor.load(editor.getValue()).getDocumentTitle() + ".adoc.txt";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
});
document.getElementById("srcLoad").addEventListener("click", function (evt) {
    'use strict';
    var e = document.createElement('input');
    e.type = 'file';
    document.body.appendChild(e);
    e.onchange = function () {
        console.log("e", e);
        var fileToLoad = e.files[0];
        console.log("fileToLoad", fileToLoad);
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            editor.session.setValue(textFromFileLoaded);
        };
        fileReader.readAsText(fileToLoad, "UTF-8");
        document.body.removeChild(e);
    }
    e.click();
});
document.getElementById("dstSave").addEventListener("click", function (evt) {
    'use strict';
    document.getElementById('render').contentWindow.print();
});
document.getElementById("dstFullPage").addEventListener("click", function (evt) {
    'use strict';
    var nuovaFinestra = window.open("");
    nuovaFinestra.document.write(document.querySelector("#render").srcdoc);
    nuovaFinestra.document.close();
    nuovaFinestra.focus();
});

var txtBenvenuto = `= Benvenuto su AmSiaTex!
Gionata Massi <gionata.massi@savoiabenincasa.it>
Rev. 1, 2019-11-04: Prima release

**AmSiaTex** è un **editor online http://www.methods.co.nz/asciidoc/[AsciiDoc^]** ispirato da https://asciidoclive.com/edit/scratch/1[AsciiDocLIVE].

Permette di scrivere:

* formule matematiche in latexmath:[\LaTeX]
* diagrammi, statici e animati, di vario tipo con:
** https://kroki.io/[Kroki]
**  https://gionkunz.github.io/chartist-js/[Chartist]

Usarlo è davvero semplice:

. Scrivi il codice AsciiDoc nel pannello di *sinistra*,
. ...e, dopo un paio di secondi, il tuo documento appare nel pannello di *destra*!

== Cos'è AsciiDoc?

AsciiDoc è un formato di rappresentazione del testo creato per prendere appunti, scrivere documentazione tecnica, articoli, libri, ebooks, slide, pagine web, pagine di manuale, blog, documentazione in linea e altro ancora. Per saperne di più, visita

* https://asciidoctor.org/docs/asciidoc-writers-guide/[AsciiDoc Writer’s Guide]
* https://asciidoctor.org/docs/user-manual/[Asciidoctor User Manual]
* https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/[AsciiDoc Syntax Reference]


[[cheat-sheet]]
== AsciiDoc Mini Cheat Sheet

Per iniziare, eccoti qualche frammento da http://powerman.name/doc/asciidoc[AsciiDoc Cheet Sheet^]

=== Stile del testo

* normal, _italic_, *bold*, +mono+.
* \`\`double quoted'', \`single quoted'.
* normal, ^super^ , ~sub~.
* \`passthru *bold*

=== Elenchi

* Q: How did the programmer die in the shower?
  A: He read the shampoo instructions:

  . Lather, rinse.
  . Repeat.

* There are only 10 kinds of people in this world:
  - Those who understand binary.
  - Those who don't.

=== Collegamenti

Let's view the raw HTML of the link:view-source:asciidoctor.org[Asciidoctor homepage,window=_blank]. 

=== Immagini

[#img-sunset]
.A mountain sunset
[link=https://www.flickr.com/photos/javh/5448336655]
image::sunset.jpg[Sunset,300,200]

=== Tabelle

.Una tabella di esempio
[options="header,footer"]
|=======================
|Col 1|Col 2      |Col 3
|1    |Item 1     |a
|2    |Item 2     |b
|3    |Item 3     |c
|6    |Three items|d
|=======================


=== Citazioni

[quote, Michael R. Fellows, 1991]
____
L’informatica non riguarda i computer più di quanto l’astronomia riguardi i telescopi.
____

[quote, Gregory Chaitin, Alla ricerca di Omega, Adelphi Edizioni]
____
Il calcolatore era (ed è ancora) un nuovo e meraviglioso concetto filosofico e matematico. Il calcolatore è ancora più rivoluzionario come idea che come congegno pratico che modifica la società - e tutti sappiamo quanto abbia cambiato la nostra vita. Perché lo dico? Perché il calcolatore cambia l'epistemologia, modifica il significato del verbo «comprendere». A mio giudizio, si capisce qualcosa solo se si è capaci - noi, non altri! - di scriverne il programma. Altrimenti non si ha una vera comprensione, si crede soltanto di capire.
____

==== Ammonimenti

Ci sono frasi che si vogliono inserie fuori dal flusso del contenuto e che si vogliono etichettare. Queste frasi possono essere chiamate __ammonimenti__. Lo stile dipende dall'etichetta dell'intestazione.  Ci sono 5 ammonimenti predefinite:

* NOTE
* TIP
* IMPORTANT
* CAUTION
* WARNING

Per usarle si usa l'etichetta, in stampatello maiuscolo, seguita dai (:) e da uno spazio.

.Note
NOTE: Nota.

.Tip
TIP: Suggerimento, consiglio.

.Important
IMPORTANT: Importante.

.Caution
CAUTION: Cautela, attenzione.

.Warning
WARNING: Attenzione, avviso.

=== Code listings

[source,python]
-----------------
#!/usr/bin/env python
import antigravity
try:
  antigravity.fly()
except FlytimeError as e:
  # um...not sure what to do now.
  pass
-----------------

* Quotes:
+
[quote,"Charles Dickens","A Tale of Two Cities"]
It was the best of times, it was the worst of times, it was the age of wisdom,
it was the age of foolishness...

* Videos:
+
video::th_H1gixMEE[youtube]

* Pass-through: pass:[<div align="center"><b>pass through content</b></div>]
`;

editor.session.setValue(txtBenvenuto);