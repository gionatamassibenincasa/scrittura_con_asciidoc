/**
 * /*jslint browser: true
 *
 * @format
 */

/* jslint var: Asciidoctor, AsciidoctorKroki */
var asciidoctor = Asciidoctor();
var registry = asciidoctor.Extensions.create();

var kroki = AsciidoctorKroki;
var chart = AsciidoctorChart;

kroki.register(registry);
chart.register(registry);

var asciidoctorOptions = {
    header_footer: true,
    safe: "unsafe",
    runtime: {
        platform: "browser"
    },
    attributes: {
        showtitle: true,
        linkcss: true,
        stylesDir: "https://cdn.jsdelivr.net/npm/@asciidoctor/core/dist/css/",
        styleSheetName: "asciidoctor.min.css",
        icons: "font",
        backend: "html5",
        sectnums: true,
        "front-matter": true,
        doctype: "article",
        stem: "latexmath",
        "iconfont-name": "font-awersome",
        "iconfont-remote": true,
        "source-highlighter": "highlightjs",
        sourcemap: true,
        "autofit-option": true,
        experimental: true,
        reproducible: true,
        sectanchors: true,
        "source-linenums-option": true,
        lang: "it",
        toc: "auto",
        "toc-title": "Indice",
        toclevels: 3,
        "part-caption": "Parte",
        "part-label": "Parte",
        "part-refsig": "parte",
        "page-layout": "docs",
        "pdf-page-size": "A4",
        "appendix-refsig": "appendice",
        "chapter-caption": "Capitolo",
        "chapter-label": "Capitolo",
        "chapter-refsig": "capitolo",
        "sect-label": "Paragrafo",
        "section-refsig": "paragrafo",
        "table-caption": "Tabella",
        "table-refsig": "tabella",
        "figure-caption": "Figura",
        "figure-refsig": "figura",
        'example-caption': "Esempio",
        "example-refsig": "esempio",
        "appendix-caption": "Appendice",
        "caution-caption": "Attenzione",
        "important-caption": "Importante",
        "last-update-label": "Ultimo aggiornamento",
        "listing-caption": "Listato",
        "manname-title": "NOME",
        "note-caption": "Nota",
        "preface-title": "Prefazione",
        "tip-caption": "Suggerimento",
        "untitled-label": "Senza titolo",
        "version-label": "Versione",
        "warning-caption": "Attenzione",
        "awestruct-layout": "base",
        xrefstyle: "short"
    },
    extension_registry: registry
};

var aggiorna;
var html;
var doc;

var generaPaginaHtml = function (innnerHTML) {
    "use strict";
    var source =
        "<html>\r\n" +
        "\t<head>\r\n" +
        // MathJax 3
        '\t\t<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>\r\n' +
        '\t\t<script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>\r\n' +
        // Font-awesome
        '\t\t<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" media="all">' +
        // AsciiDoctor style
        '\t\t<link type="text/css" rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@asciidoctor/core@2.0.3/dist/css/asciidoctor.css" media="all">\r\n' +
        // Highlight
        '\t\t<script src="https://cdn.jsdelivr.net/npm/highlight.js@9.16.2/lib/highlight.js"></script>\r\n' +
        // Chartist style
        '\t\t<link rel="stylesheet" href="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">\r\n' +
        '\t\t<script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>\r\n' +
        '\t\t<base target="_self">\r\n' +
        "\t</head>\r\n" +
        "\t<body>\r\n" +
        innnerHTML +
        "\r\n" +
        "\t\t<script>\r\n" +
        "      document.body.querySelectorAll('div.ct-chart').forEach(function(node) {\r\n" +
        "        var options = {\r\n" +
        "          height: node.dataset['chartHeight'],\r\n" +
        "          width: node.dataset['chartWidth'],\r\n" +
        "          colors: node.dataset['chartColors'].split(',')\r\n" +
        "        };\r\n" +
        "        var dataset = Object.assign({}, node.dataset);\r\n" +
        "        var series = Object.values(Object.keys(dataset)\r\n" +
        "          .filter(function(key) {return  key.startsWith('chartSeries-')})\r\n" +
        "          .reduce(function(obj, key) {\r\n" +
        "            obj[key] = dataset[key];\r\n" +
        "            return obj;\r\n" +
        "          }, {})).map(function(value) {return value.split(','); });\r\n" +
        "        var data = {\r\n" +
        "          labels: node.dataset['chartLabels'].split(','),\r\n" +
        "          series: series\r\n" +
        "        };\r\n" +
        "        Chartist[node.dataset['chartType']](node, data, options);\r\n" +
        "      });\r\n" +
        "\t\t</script>" +
        "\t</body>\r\n" +
        "</html>";

    return source;
};

var converti = function () {
    "use strict";
    var contenuto = editor.getValue();
    // globale
    doc = asciidoctor.load(contenuto, asciidoctorOptions);
    //console.log(Date.now() + " Concrete Syntax Tree!");

    var conversione_html = doc.convert();
    // console.log(conversione_html);
    var r = document.getElementById("render");
    r.setAttribute("display", "none");
    // globale
    html = generaPaginaHtml(conversione_html);
    //console.log(Date.now() + " HTML Code!");
    var iframe = document.querySelector("#render");
    //iframe.srcdoc = html;
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
};

var editor = ace.edit("editor", {
    theme: "ace/theme/eclipse",
    mode: "ace/mode/asciidoc",
    autoScrollEditorIntoView: true,
    wrap: true,
    minLines: 30
});
editor.session.on("change", function (delta) {
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
    "use strict";
    var e = document.createElement("a");
    e.href = URL.createObjectURL(
        new Blob([editor.session.getValue()], {
            type: "text/plain"
        })
    );
    e.download =
        asciidoctor.load(editor.getValue()).getDocumentTitle() + ".adoc.txt";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
});
document.getElementById("srcLoad").addEventListener("click", function (evt) {
    "use strict";
    var e = document.createElement("input");
    e.type = "file";
    document.body.appendChild(e);
    e.onchange = function () {
        var fileToLoad = e.files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var textFromFileLoaded = fileLoadedEvent.target.result;
            editor.session.setValue(textFromFileLoaded);
        };
        fileReader.readAsText(fileToLoad, "UTF-8");
        document.body.removeChild(e);
        editor.renderer.updateFontSize();
    };
    e.click();
});
document.getElementById("srcClean").addEventListener("click", function (evt) {
    "use strict";
    editor.session.setValue("");
});

document.getElementById("dstSave").addEventListener("click", function (evt) {
    "use strict";
    document.getElementById("render").contentWindow.print();
});
document.getElementById("dstFullPage").addEventListener("click", function (evt) {
    "use strict";
    var nuovaFinestra = window.open("");
    nuovaFinestra.document.write(html);
    nuovaFinestra.document.close();
    nuovaFinestra.focus();
});
var ASTtraverse = function (node, level) {
    level = level || 0;
    var txt = "";
    for (var i = 0; i < level; i++) {
        txt += " ";
    }
    txt += node.context;
    switch (node.context) {
        case "document":
            /* This is always the root of the document. It owns the blocks and sections that make up the document and holds the document attributes. */
            //txt += '<code title="' + node.lines.join(" ") + '">';
            txt += " [documento]";
            //txt += "</code>";
            break;
        case "section":
            /* This class model sections in the document. The member level indicates the nesting level of this section, that is if level is 1 the section is a section, with level 2 it is a subsection etc. */
            //txt += '<code title="' + node.lines.join(" ") + '">';
            txt += " [sezione]";
            txt += " (livello " + node.getLevel() + ", titolo: " + node.getTitle() + ", indice " + node.getIndex() + ") ";
            //txt += "</code>";
            break;
        /* Blocks are content in a section, like paragraphs, source listings, images, etc. The concrete form of the block is available in the field context. Among the possible values are:
+ paragraph
+ listing
+ literal
+ open
+ example
+ pass
        */
        case "paragraph":
            txt += '<code title="' + node.lines.join(" ") + '">';
            txt += " [capoverso]";
            txt += " (prima riga: " + node.lines[0].substring(0, 80) + ")";
            txt += "</code>";
            break;
        case "listing":
            txt += '<code title="' + node.lines.join(" ") + '">';
            txt += " [listato]";
            txt += "</code>";
            break;
        case "literal":
            txt += '<code title="' + node.lines.join(" ") + '">';
            txt += " []";
            txt += "</code>";
            break;
        case "open":
            txt += '<code title="' + node.lines.join(" ") + '">';
            txt += " []";
            txt += "</code>";
            break;
        case "example":
            txt += '<code title="' + node.lines.join(" ") + '">';
            txt += "[]";
            txt += "</code>";
            break;
        case "pass": txt += "[]";
            txt += '<code title="' + node.lines.join(" ") + '">';
            txt += "</code>";
            break;
    }
    txt += "\n";

    if (node instanceof asciidoctor.AbstractBlock) {
        node.blocks.forEach(b => {
            txt += ASTtraverse(b, level + 1);
        });
    }
    return txt;
};
document.getElementById("dstAST").addEventListener("click", function (evt) {
    "use strict";
    //console.log(doc);
    var ast = "<pre>" + ASTtraverse(doc, 0) + "</pre>";
    //console.log(ast);
    var nuovaFinestra = window.open("");
    nuovaFinestra.document.write(ast);
    nuovaFinestra.document.close();
    nuovaFinestra.focus();
});
txtBenvenuto = txtBenvenuto || "Ciao";
editor.session.setValue(txtBenvenuto);
editor.renderer.on("afterRender", function () {
    //var config = editor.renderer.layerConfig;
    editor.renderer.updateFontSize();
});
