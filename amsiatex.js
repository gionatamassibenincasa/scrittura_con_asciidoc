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
        '\t\t<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"></script>\r\n' +
        // Chartist style
        '\t\t<link rel="stylesheet" href="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">\r\n' +
        '\t\t<script src="https://cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>\r\n' +
        '\t\t<base target="_self">\r\n' +
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
        if (node.hasOwnProperty("isBlock") && node.isBlock()) {
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
        if (node.hasOwnProperty("isBlock") && node.hasBlocks()) {
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
            'stem': 'latexmath',
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
        editor.renderer.updateFontSize();
    };
    e.click();
});
document.getElementById("srcClean").addEventListener("click", function (evt) {
    'use strict';
    editor.session.setValue("");
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
txtBenvenuto = txtBenvenuto || "Ciao";
editor.session.setValue(txtBenvenuto);
editor.renderer.on('afterRender', function () {
    var config = editor.renderer.layerConfig;
    console.log("afterRender triggered " + JSON.stringify(config));
    editor.renderer.updateFontSize();
});