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

**AmSiaTex** è un **editor online http://www.methods.co.nz/asciidoc/[AsciiDoc^]**
ispirato da https://asciidoclive.com/edit/scratch/1[AsciiDocLIVE].

Permette di scrivere:

* formule matematiche in latexmath:[\LaTeX]
* diagrammi, statici e animati, di vario tipo con:
** https://kroki.io/[Kroki]
**  https://gionkunz.github.io/chartist-js/[Chartist]

Usarlo è davvero semplice:

. Scrivi il codice AsciiDoc nel pannello di *sinistra*,
. ...e, dopo un paio di secondi, il tuo documento appare nel pannello di *destra*!

== Cos'è AsciiDoc?

AsciiDoc è un formato di rappresentazione del testo creato per prendere appunti,
scrivere documentazione tecnica, articoli, libri, ebooks, slide, pagine web,
pagine di manuale, blog, documentazione in linea e altro ancora.

Per saperne di più, visita

* https://asciidoctor.org/docs/asciidoc-writers-guide/[AsciiDoc Writer’s Guide]
* https://asciidoctor.org/docs/user-manual/[Asciidoctor User Manual]
* https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/[AsciiDoc Syntax Reference]


[[cheat-sheet]]
== AsciiDoc Mini Cheat Sheet

==== Capoverso

Linee di testo adiacenti formano un capoverso.
Per iniziare un nuovo capoverso digitare \`Invio\` due volte per ottenere una riga bianca,
poi  digitare il nuovo contenuto.

NOTE: I ritorni a capo non sono conservati.

==== Scrivere in versi

Il capoverso non mantiene le informazioni sui ritorni a capo.
Si possono mantenere i versi in un capoverso, basta terminare la riga di testo
in cui si presenta un verso con uno spazio seguito da un segno più (+).

.Soldati
[quote, G. Ungaretti, Bosco di Courton luglio 1918]
____
Si sta come +
d'autunno +
sugli alberi +
le foglie
____

==== Testo in enfasi

In un testo, per mettere in risalto una parola o una frase, si ricorre a variazioni
del tipo di carattere in uso.
AsciiDoc ci consente di farlo racchiudendo parole o frasi tra simboli di punteggiatura,
ma l'obiettivo di chi scrive un documento resta quello di concentrarsi sul contenuto
e non sull'aspetto grafico dei caratteri.

Per ottenere del testo in neretto, lo si racchiude tra asterischi (\`*\`),
se lo si vuole in corsivo si racchiude tra trattini bassi (\`_\`) e,
se lo si vuole a spaziatura fissa, lo si racchiude tra accenti gravi (\`\`\`).

* tondo,
* _corsivo_,
* *neretto*,
* +a spaziatura fissa+.

In alcune circostanze si usano varie forme di virgolette (__curved quotes__):

* \`\`double quoted'',
* \`single quoted'.

In altre, il testo può essere in centrato sulla linea di base (normale),
oppure scritto, in piccolo, più in alto (apice) o più in basso (pedice).

* normale,
* ^apice^,
* ~pedice~.

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
image::src="https://live.staticflickr.com/5293/5448336655_bcafaeebf0_k.jpg[Sunset,300,200]

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

==== Codice sorgente

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

=== Matematica e scienze

==== Linguaggio matematico

Le regole per la scrittura delle espressioni matematiche sono molto diverse da quelle usate nella composizione del testo.
Un linguaggio per la scrittura di documenti dovrebbe fornire un modo semplice per l'inserimento di formule, anche complesse, e garantire una buona resa tipografica.

Esiste un lingaggio di composizione tipografica, il latexmath:[\TeX] che è stato progettato per lavorare con espressioni matematiche complesse in modo che esse siano semplici da inserire. L'idea di base è che le formule complicate sono composte da formule meno complicate da comporre insieme. Se si sanno comporre formule semplici e si sanno combinare allora si sarà in grado di scrivere formule di complessità arbitraria.

latexmath:[\sqrt{4} = 2]

latexmath:[E = m \cdot c^2]

latexmath:[\tan \alpha =\displaystyle
              \frac{\sin \alpha}
                   {\cos \alpha}]

latexmath:[\displaystyle
           \sin \ 15^\circ =
           \sqrt
           \frac{1 - \cos \ 30^\circ}
                {2}]
				
latexmath:[\sum_{i=1}^n i = 1 + 2 + \cdots n = \frac{n \cdot (n+1)}{2}]

latexmath:[(d_{n-1}\cdots d_2 d_1 d_0 , d_{-1} d_{-2} \cdots d_{-m})_b = 
           \sum_{i = -m}^{n-1} d_i \cdot b^i =
		   d_{n-1} \cdot b^{n-1} + \cdots + d_2 \cdot b^2 + d_1 \cdot b + d_0 + d_{-1} \cdot b^{-1} + d_{-2} \cdot b^{-2} + \cdots + b_{-m} \cdot b^{-m}]

NOTE: Scrivere formule matematiche usando la sintassi di latexmath:[\LaTeX{}] permette al tempo stesso una grande rapidità di scrittura e una resa tipografica superba.

==== Scienze

Acqua (stem:[H_2O]).


* Videos:
+
video::th_H1gixMEE[youtube]

* Pass-through: pass:[<div align="center"><b>pass through content</b></div>]

== Struttura di un documento AsciiDoc e sintassi

Un compilatore di AsciiDoc elabora documenti scritti secondo la grammatica del linguaggio AsciiDoc per costruire il documento nel formato di uscita. Gli informatici usano le grammatiche per descrivere un linguaggio. Nel paragrafo viene usata una versione semplificata della descrizione EBNF.

=== Documento

Un documento è formato da:

. un intestazione, che può essere omessa;
. un preambolo, che può essere omesso;
. e una sequenza di zero o più sezioni.

.Sintassi
----
documento ::= (intestazione?, preambolo?, sezione*)
----

NOTE: Le parentesi tonde aperate (\`\`(\`\`) e chiuse (\`\`)\`\`) indicano una sequenza ordinata.

NOTE: Il punto di domanda (\`\`?\`\`) nella descrizione della sintassi indica zero o una occorrenza della categoria sintattica.

NOTE: L'asterisco (\`\`*\`\`) nella descrizione della sintassi indica zero o più occorrenze della categoria sintattica.

=== Intestazione

Un'intestazione è formata da:

. un titolo;
. le informazioni dell'autore, che possono essere omesse;
. e le informazioni della revisione, che possono essere omesse.

.Sintassi
----
intestazione ::= (titolo_documento (linea_autore linea_revisione?)? attributo* a_capo)

----

NOTE: Non si possono inserire le informazioni di revisione senza le informazioni sull'autore.

==== Titolo

Il titolo è un testo che deve essere scritto nella *prima riga* del documento. Questa deve iniziare con il simbolo uguale (\`\`=\`\`) cui devono seguire uno o più spazi (\`\` \`\`) e il testo del titolo.

Un titolo può essere costituito da due parti:
. il titolo vero e proprio;
. e il sotto-titolo.

Il titolo e il sottotitolo sono separati dal simbolo dei due punti (\`\`:\`\`) e da uno o più spazi (\`\` \`\`).

CAUTION: Il titolo non può essere scritto su più di una riga.

.Attributi del titolo di questo documento
[options=header]
|===
|Elemento|Attributo|Valore

// Intestazione

// Titolo

|Titolo
|\{doctitle}
|{doctitle}

|===


==== Autore

Le informazioni dell'autore sono composte da:

. il primo nome;
. un secondo nome, se presente;
. un cognome, che può essere omesso se non è presente il secondo nome;
. e un indirizzo email, che può essere omesso.

.Sintassi
----
autore ::= (nome, (secondoNome?,cognome)?,email?)
----

NOTE: Il secondo nome può essere scritto solo se si scrive anche il cognome.

Le informazioni dell'autore, se le presenti, devono essere scritte nella *seconda riga*.

Il nome è separato dall'eventuale secondo nome e dal cognome con uno o più simboli di spazio (\`\` \`\`). L'indirizzo email deve essere scritto tra parentesi angolari, ossia il simbolo di minore (\`\`<\`\`) e il simbolo maggiore (\`\`>\`\`).

NOTE: Se uno dei nomi o il cognome sono composto da più parole allora queste devono essere separate dal trattino basso (\`\`_\`\`) e non dallo spazio (\`\` \`\`). Nella presentazione del documento il trattino basso è sostituito dallo spazio.

CAUTION: Le informazioni sull'autore non possono essere scritte su più di una riga.

.Attributi dell'autore di questo documento
[options=header]
|===
|Elemento|Attributo|Valore

// Autore

|Nome
|\{firstname}
|{firstname}

|Secondo nome
|\{middlename}
|{middlename}

|Cognome
|\{lastname}
|{lastname}

|Email
|\{email}
|{email}

|===


==== Revisione

Le informazioni della revisione sono costituite da:

. un numero di revisione, opzionale;
. una data di revisione;
. un commento, opzionale.

.Sintassi
----
revisione ::= (numeroRev?, dataRev, commentoRev?)
----

Il numero di revisione, che può essere preceduto da un testo, è separato dalla data di revisone con una virgola (\`\`,\`\`) e zero o più spazi (\`\` \`\`).
Il commento della revisione è un testo che è separato dalla data di revisione con i due punti (\`\`:\`\`).

Le informazione della revisione devono essere scritte nella *terza riga*.

.Attributi della revisione di questo documento
[options=header]
|===
|Elemento|Attributo|Valore

// Revisione

|Numero di revisione
|\{revnumber}
|{revnumber}

|Data di revisione
|\{revdate}
|{revdate}

|Commento di revisione
|\{revremark}
|{revremark}

|===

=== Preambolo

----
preambolo ::= (corpo)
----

=== Sezione

----
sezione ::= (titolo, corpo?, (sezione)*)
----

Il titolo...

==== Corpo

----
corpo ::= (titoletto?,blocco)|macro)+
----

NOTE: + rappresenta una o più occorrenze della categoria sintattica.

NOTE: | rappresenta la scelta tra una delle occorrenze.

Il titoletto...

=== Blocco

----
blocco ::= (capoverso|bloccoDelimitato|elenco|tabella)
----

=== Elenco

----
elenco ::= (elencoNonOrdinato|elencoOrdinato,elencoDescrittivo,elencoConRichiami)
----

==== Elenco non ordinato

----
elencoNonOrdinato ::= (elementoElenco)+
----

Un elemento dell'elenco...

==== Elenco ordinato

----
elencoOrdinato ::= (elementoElenco)+
----

==== Elenco descrittivo

----
elencoDescrittivo ::= (voceElenco)+
----

==== Elenco con richiami

----
elencoConRichiami ::= (elementoElenco)+
----

==== Voce elenco

----
voceElenco ::= (etichiettaElenco, elementoElenco)
----

==== EtichiettaElenco

----
etichettaElenco ::= (termine+)
----

==== Elemento elenco

----
elementoElenco ::= (elementoTesto,(elenco|paragrafoElenco|continuazioneElenco)*)
----

`;

editor.session.setValue(txtBenvenuto);