var asciidoctor = Asciidoctor();
/*
var plantuml = AsciidoctorPlantuml;
plantuml.register(asciidoctor.Extensions);
var registry = asciidoctor.Extensions.create();
plantuml.register(registry);
*/
var kroki = AsciidoctorKroki;
var registry = asciidoctor.Extensions.create();
kroki.register(registry);

var aggiorna;

var generaPaginaHtml = function (innnetHTML) {
    var source = "<html>\r\n" +
        "\t<head>\r\n" +
        // MathJax 3
        "\t\t<script src=\"https://polyfill.io/v3/polyfill.min.js?features=es6\"></script>\r\n" +
        "\t\t<script type=\"text/javascript\" id=\"MathJax-script\" async src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js\"></script>\r\n" +
        // Font-awesome
        "\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css\" media=\"all\">" +
        // AsciiDoctor style
        "\t\t<link type=\"text/css\" rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@asciidoctor/core@2.0.3/dist/css/asciidoctor.css\" media=\"all\">\r\n" +
        // Highlight
        "\t\t<script src=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js\"></script>\r\n" +
        "\t</head>\r\n" +
        "\t<body>" + "\r\n" +
        innnetHTML + "\r\n" +
        "\t</body>\r\n" +
        "</html>";

    return source;
}

var converti = function () {
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
    var ast = asciidoctor.load(contenuto, {
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
            'icons': 'font',
            'source-highlighter': 'highlightjs',
            'header_footer': true,
            'sourcemap': true,
            'plantuml-server-url': 'http://www.plantuml.com/plantuml'
        },
        'extension_registry': registry
    });
    var conversione_html = ast.convert();
    // console.log(conversione_html);
    var r = document.getElementById("render");
    r.setAttribute("display", "none");
    var html = generaPaginaHtml(conversione_html);
    var iframe = document.querySelector('#render');
    iframe.srcdoc = html;
    console.log(html);
    document.getElementById("ast").innerHTML = traverse(ast);
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
    document.getElementById('render').contentWindow.print();
});
document.getElementById("dstFullPage").addEventListener("click", function (evt) {
    var nuovaFinestra = window.open("");
    nuovaFinestra.document.write(document.querySelector("#render").srcdoc);
    nuovaFinestra.document.close();
    nuovaFinestra.focus();
});