/* jslint browser: true, esversion: 6*/
var txtBenvenuto = `= Benvenuto su AmSiaTex!
Gionata Massi <gionata.massi@savoiabenincasa.it>
Rev. 1, 2019-11-04: Prima release

**AmSiaTex** è un **editor online http://www.methods.co.nz/asciidoc/[AsciiDoc^]**
ispirato da https://asciidoclive.com/edit/scratch/1[AsciiDocLIVE].

Permette di scrivere:

* formule matematiche in latexmath:[\\LaTeX]
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

* https://asciidoctor.org/docs/asciidoc-writers-guide/[
AsciiDoc Writer’s Guide]
* https://asciidoctor.org/docs/user-manual/[Asciidoctor
User Manual]
* https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/[
AsciiDoc Syntax Reference]
* https://github.com/nofluffjuststuff/nfjsmag-docs/blob/master/author-writing-style-and-syntax-guide.adoc[Writing Style and Syntax Guide]
* http://docs.atlas.oreilly.com/writing_in_asciidoc.html[Writing in AsciiDoc (O’Reilly Atlas)]

== Perché questo sistema di videoscrittura?

// Motivazione AmSiaTeX
Questo progetto nasce per fini didattici con lo scopo di avvicinare lo studente alla produzione di documenti scritti a carattere tecnico-scientifico. Considerata l'importanza della strutturazione logica del testo e la richiesta una resa tipografica di qualità, si propone lo strumento **AsciiDoc** per la redazione e per la composizione del testo tecnico-scientifico al computer, corredato, almeno per la composizione delle formule, dalla possibilità di includere parti in linguaggio latexmath:[\\LaTeX] e diagrammi di vario genere (quelli supportati da https://kroki.io/[kroki.io]). L'uso di un linguaggio quale AsciiDoc avvicina lo studente al rigore dell'informatica e ai linguaggi di descrizione dei documenti elettronici. Lo studio della linguaggio AsciiDoc basato sulla grammatica espone lo studente alle prime nozioni sulle grammatiche formali e sulle strutture ricorsive.

// Prerequisiti
Il lettore dovrebbe avere familiarità con gli aspetti generali della produzione scritta di tipo tecnico-scientifica, per i quali si consiglia _Saper comunicare: cenni di scrittura tecnico-scientifica_ <<sapercomunicare>>, in modo da poter produrre un testo con un contenuto informativo chiaro, non ambiguo e che risulti piacevole da consultare.

// Strutturazione e indicizzazione
Un testo tecnico non viene letto per diletto ma per soddifare un'esigenza informativa. Questa spesso è circoscritta a poche informazioni e il lettore vuole trovarle concentrate nello spazio di qualche capoverso. Lo scrittore deve, quindi, organizzare l'esposizione dei concetti in parti che spiegano un solo argomento e che siano facili da ricercare. Il testo dovrà essere suddiviso in capoversi che concernono uno stesso argomento e i capoversi dovranno essere raggruppati in strutture contenitrici che prendono i nomi di _sezioni_ (_parti_, _capitoli_, __paragrafi__...). Un indice generale permetterà una rapida ricerca dei contenuti e i temini più importanti saranno indicizzati e presentati in un indice analitico che rimanda al capoverso di definizione.

// Motivazione AsciiDoc
Il linguaggio AsciiDoc stesso forzerà la strutturazione del contenuto e fornirà gli strumenti automatici per la sua indicizzazione; aiuterà lo scrittore nell'uso corretto delle tabelle e delle illustrazioni; faciliterà la scrittura delle formule matematiche; renderà più proficua la stesura del documento. L'uso del linguaggio AsciiDoc footnote:[L'uso di strumenti WYMIWYG pone l'attenzione sulla strutturazione del contenuto.] migliora la qualità del prodotto in sposta la concentrazione dello scrittore sul contenuto e non sulla forma footnote:[L'uso di strumenti WYSIWYG può far distrarre dal contenuto.].

// Obiettivi specifici di apprendimento
Il lettore troverà in questo documento quel materiale che lo porterà a:

- creare un documento con AsciiDoc;
- strutturare un documento AsciiDoc;
- usare gli elementi strutturali di tipo elencho, citazione e listato di programma;
- produrre pagine web con AsciiDoc.

[[cheat-sheet]]
== AsciiDoc Mini Cheat Sheet

=== Elementi di base

==== Capoverso

Linee di testo adiacenti formano un capoverso.
Per iniziare un nuovo capoverso digitare \`Invio\` due volte per ottenere
una riga bianca, poi  digitare il nuovo contenuto.

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

In un testo, per mettere in risalto una parola o una frase, si ricorre a
variazioni del tipo di carattere in uso.
AsciiDoc ci consente di farlo racchiudendo parole o frasi tra simboli di
punteggiatura, ma l'obiettivo di chi scrive un documento resta quello di
concentrarsi sul contenuto e non sull'aspetto grafico dei caratteri.

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

==== Elenchi ordinati

. Protons
. Electrons
. Neutrons

==== Elenchi non ordinati

.Kizmet's Favorite Authors
* Edgar Allen Poe
* Sheri S. Tepper
* Bill Bryson

==== Elenchi descrittivi

CPU:: The brain of the computer.
Hard drive:: Permanent storage for operating system and/or user files.
RAM:: Temporarily stores information the CPU uses during operation.
Keyboard:: Used to enter text or control items on the screen.
Mouse:: Used to point to and select items on your computer screen.
Monitor:: Displays information in visual form using text and graphics.

==== Elenchi ibridi

Operating Systems::
  Linux:::
    . Fedora
      * Desktop
    . Ubuntu
      * Desktop
      * Server
  BSD:::
    . FreeBSD
    . NetBSD

Cloud Providers::
  PaaS:::
    . OpenShift
    . CloudBees
  IaaS:::
    . Amazon EC2
    . Rackspace

//-

* Q: How did the programmer die in the shower?
  A: He read the shampoo instructions:

  . Lather, rinse.
  . Repeat.

* There are only 10 kinds of people in this world:
  - Those who understand binary.
  - Those who don't.

=== Figure, tabelle, listati e collegamenti

==== Figure

[#img-sunset]
.Un tramonto in montagna
[link=https://www.flickr.com/photos/javh/5448336655]
image::https://live.staticflickr.com/5293/5448336655_bcafaeebf0_k.jpg[Sunset,300,200]

==== Tabelle

.Una tabella di esempio
[options="header,footer"]
|=======================
|Col 1|Col 2      |Col 3
|1    |Item 1     |a
|2    |Item 2     |b
|3    |Item 3     |c
|6    |Three items|d
|=======================

==== Listati

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

.Un analizzatore lessicale per AsciiDoc
[source,javascript]
----
const DoctitleRx = /^= \S/
const AuthorLineRx = /^[A-Za-z0-9_][A-Za-z0-9_\-'.]*(?: +[A-Za-z0-9_[A-Za-z0-9_\-'.]*)?(?: +[A-Za-z0-9_][A-Za-z0-9_\-'.]*)?(?: +<([^>]+)>)?$/
const RevisionLineRx = /^(?:\D*.*?,)? *(?!:).*?(?: *(?!^): *.*)?$/
const SectionTitleRx = /^=(={0,5}) \S/
const AttributeEntryRx = /^:([^:\s]+):(?:[ \t]+(.+))?$/
const BlockAttributeLineRx = /^\[(?:|[A-Za-z0-9_.#%{,"'].*|\[(?:|[A-Za-z_:][A-Za-z0-9_:.-]*(?:, *.+)?)\])\]$/
const BlockMacroRx = /^[A-Za-z0-9_]+::(?:|\S|\S.*?\S)\[.*\]$/
// FIXME DelimiterInfo should probably be a type managed by DelimiterRegistry
const BlockDelimiterMap = {
  '--':   ['open', undefined, true],
  '----': ['listing', '-', false],
  '....': ['literal', '.', false],
  '====': ['example', '=', true],
  '|===': ['table', '=', true],
  '!===': ['table', '=', true],
  '////': ['comment', '/', false],
  '****': ['sidebar', '*', true],
  '____': ['quote', '_', true],
  '++++': ['pass', '+', false]
}
----

==== Collegamenti

Visualizza
link:https://asciidoctor.org[Asciidoctor homepage,window=_blank]. 

=== Miscellanea

==== Commenti

I commenti sono per gli esseri umani, non per i compilatori!

////
Un blocco di commento
////

// Un commento in linea

==== Testo pre-formattato

.Questo è un testo pre-formattato
 Attenzione! Il primo simbolo della linea è uno spazio.

.Questo è un blocco di testo pre-formattato
....
Questo è
un blocco di testo
preformattato

123456789
iiimmmxxx
mmmiiiXXX
....

==== Esempi

Esemplificare aiuta a comprendere i concetti.

.Esempio
====
Questo è un esempio
====

==== Video

video::th_H1gixMEE[youtube]

==== Citazioni

[quote, Michael R. Fellows, 1991]
____
L’informatica non riguarda i computer più di quanto l’astronomia riguardi
i telescopi.
____

[quote, Gregory Chaitin, Alla ricerca di Omega, Adelphi Edizioni]
____
Il calcolatore era (ed è ancora) un nuovo e meraviglioso concetto filosofico
e matematico. Il calcolatore è ancora più rivoluzionario come idea che come
congegno pratico che modifica la società -- e tutti sappiamo quanto abbia
cambiato la nostra vita.
Perché lo dico? Perché il calcolatore cambia l'epistemologia, modifica il
significato del verbo «comprendere».
A mio giudizio, si capisce qualcosa solo se si è capaci -- noi, non altri! --
di scriverne il programma.
Altrimenti non si ha una vera comprensione, si crede soltanto di capire.
____


[[leggeDiHofstadter]]
.Legge di Hofstadter
[quote, Douglas Hofstadter, "Gödel, Escher, Bach: Un'Eterna Ghirlanda Brillante", Adelphi Edizioni]
____
Per fare una cosa ci vuole sempre più tempo di quanto si pensi, anche tenendo conto della <<leggeDiHofstadter, Legge di Hofstadter>>
____

==== Ammonimenti

Ci sono frasi che si vogliono inserie fuori dal flusso del contenuto e che
si vogliono etichettare. Queste frasi possono essere chiamate
__ammonimenti__. Lo stile dipende dall'etichetta dell'intestazione.
Ci sono 5 ammonimenti predefiniti:

* NOTE
* TIP
* IMPORTANT
* CAUTION
* WARNING

Per usarle si usa l'etichetta, in stampatello maiuscolo, seguita dai (:)
e da uno spazio.

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

==== Barre laterali

Una barra laterale si usa per aggiungere contenuti aggiuntivi che non si adattano al flusso della narrazione del documento.

.Una barra laterale
****
Questo testo è in una barra laterale
****

==== Simboli dei tasti

.Scorciatoie da tastiera
|===
|Shortcut |Purpose

|kbd:[F11]
|Toggle fullscreen

|kbd:[Ctrl+T]
|Open a new tab

|kbd:[Ctrl+Shift+N]
|New incognito window

|kbd:[\\ ]
|Used to escape characters

|kbd:[Ctrl+\\]]
|Jump to keyword

|kbd:[Ctrl + +]
|Increase zoom
|===

==== Interfacce grafiche con menù e bottoni

.Come interagire con l'interfaccia grafica
====
To save the file, select menu:File[Save].

Select menu:View[Zoom > Reset] to reset the zoom level to the default setting.

Press the btn:[OK] button when you are finished.

Select a file in the file navigator and click btn:[Open].
====

==== Icone

icon:tags[] ruby, asciidoctor

icon:fire[]

icon:bulb[]

icon:heart[size=2x]

[%hardbreaks]
icon:bolt[fw] bolt
icon:heart[fw] heart

icon:shield[rotate=90, flip=vertical]

icon:download[]

icon:save[]

icon:print[]



=== Matematica e scienze

==== Linguaggio matematico

Le regole per la scrittura delle espressioni matematiche sono molto
diverse da quelle usate nella composizione del testo.
Un linguaggio per la scrittura di documenti dovrebbe fornire un modo
semplice per l'inserimento di formule, anche complesse, e garantire
una buona resa tipografica.

Esiste un linguggio di composizione tipografica, il latexmath:[\\TeX]
che è stato progettato per lavorare con espressioni matematiche
complesse in modo che esse siano semplici da inserire.
L'idea di base è che le formule complicate sono composte da formule
meno complicate che si possono combinare insieme.

Se si sanno comporre formule semplici e si impara a combinarle,
allora si sarà in grado di scrivere formule di complessità arbitraria.

latexmath:[\\sqrt{4} = 2]

latexmath:[E = m \\cdot c^2]

latexmath:[\\tan \\alpha =\\displaystyle
              \\frac{\\sin \\alpha}
                   {\\cos \\alpha}]

latexmath:[\\displaystyle
           \\sin \ 15^\\circ =
           \\sqrt
           \\frac{1 - \\cos \\ 30^\\circ}
                {2}]
				
latexmath:[\\sum_{i=1}^n i = 1 + 2 + \\cdots n = \\frac{n \\cdot (n+1)}{2}]

latexmath:[(d_{n-1}\\cdots d_2 d_1 d_0 , d_{-1} d_{-2} \\cdots d_{-m})_b = 
           \\sum_{i = -m}^{n-1} d_i \\cdot b^i =
           d_{n-1} \\cdot b^{n-1} + \\cdots + d_2 \\cdot b^2 + d_1 \\cdot b +
           d_0 + d_{-1} \\cdot b^{-1} + d_{-2} \\cdot b^{-2} + \\cdots +
           b_{-m} \\cdot b^{-m}]
           
latexmath:[a^1 = a]

latexmath:[a^0 = 1] se latexmath:[a \\neq 0]
           
latexmath:[0^0] non ha significato
           
latexmath:[\\begin{equation*}a^n\\cdot a^m=a^{n+m}\\end{equation*}]
           
latexmath:[a^n\\cdot a^m =
     \\underbrace{(a\\cdot a\\cdot\\ldots\\cdot a)}_{n\\text{ volte}} \\cdot
     \\underbrace{(a\\cdot a\\cdot a\\cdot\\ldots\\cdot a)}_{m\\text{ volte}} =
     \\underbrace{(a\\cdot a\\cdot a\\cdot a\\cdot a\\cdot\\ldots\\cdot a\\cdot a)}_{n+m\\text{ volte}} =
     a^{n+m}]
           
latexmath:[A \\alpha B \\beta \\Gamma \\gamma \\Delta \\delta E \\epsilon \\varepsilon Z \\zeta E \\eta \\Theta \\theta \\vartheta I \\iota K \\kappa \\Lambda \\lambda M \\mu N \\nu O \\omicron \\Pi \\pi R \\rho \\Sigma \\sigma T \\tau \\Upsilon \\upsilon \\Phi \\phi \\varphi X \\chi \\Psi \\psi \\Omega \\omega]

.Teorema di Pitagora
Il Teorema di Pitagora si esprime come: latexmath:[\(a^2 + b^2 = c^2\)].
           

[latexmath]
.Radici di un equazione di secondo grado
++++
\\begin{equation}
{x = \\frac{{ - b \\pm \\sqrt {b^2 - 4ac} }}{{2a}}}
\\end{equation}
++++

NOTE: Scrivere formule matematiche usando la sintassi di
latexmath:[\\LaTeX{}] permette al tempo stesso una grande
rapidità di scrittura e una resa tipografica superba.

==== Scienze

Acqua (stem:[H_2O]).

=== Diagrammi 

==== Linee (Chartist)

[chart,line]
....
January,February,March
28,48,40
65,59,80
....

==== Linee a barre (Chartist)

[chart,bar]
....
January,February,March
28,48,40
65,59,80
....


==== Diagrammi a torta (Kroki -- mermaid)

[mermaid]
....
pie title "Animali"
"Cani": 386
"Gatti": 85
"Topi": 15
....

==== Grafi (Kroki -- GraphViz)
[graphviz]
----
digraph G {
    Hello->World
  }
----

==== Diagrammi UML (PlantUML)
[plantuml,alice-bob,svg,role=sequence]
....
alice -> bob
....

[plantuml,usecase,svg]
....
User -> (Start)
User --> (Use the application) : A small label

:Main Admin: ---> (Use the application) : This is\\nyet another\\nlabel
....

[plantuml,activity,svg]
....
start

repeat
  :read data;
  :generate diagrams;
repeat while (more data?) is (yes)
->no;
stop
....

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


:numbered!:
[bibliography]
== Riferimenti bibliografici

- [[[sapercomunicare]]] Beccari, C.; Canavero, F.; Rossetti, U. & Valabrega, P. https://www.guitex.org/home/images/doc/sapercomunicare.pdf[Saper comunicare: cenni di scrittura tecnico-scientifica]. Politecnico di Torino. v.2.7. 2017.
`;