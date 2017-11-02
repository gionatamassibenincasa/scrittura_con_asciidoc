function onChange(editor) {
  localStorage[window.location.href.split("#")[0]] = editor.getValue();
}

function addPersistence(editor) {
  var address = window.location.href.split("#")[0];
  var persisted = localStorage[address] || editor.getValue();
  editor.setValue(persisted);
  editor.on("change", onChange);
}

var codemirror = CodeMirror.fromTextArea(document.getElementById(
  "editor"), {
  value: "\n",
  mode: "asciidoc",
  lineNumbers: true,
  lineWrapping: true,
  viewportMargin : Infinity
});

addPersistence(codemirror);

var tests = [];

function aggiungiTest(test) {
  tests.push(test);

  var aggiungiSpecifica = function(elenco) {
    // crea la voce d'elenco come specifica
    var item = document.createElement("li");
    item.innerHTML = test.text;
    elenco.appendChild(item);
  };

  var aggiungiRigaTabellaValutazione = function(tabella) {
    // crea la nuova riga tabella
    var tr = document.createElement("tr");

    // Id della riga
    var tdId = document.createElement("td");
    tdId.innerHTML = tests.length;
    tr.append(tdId);

    // Descrizione breve
    var tdDesc = document.createElement("td");
    tdDesc.innerHTML = test.shortText;
    tr.append(tdDesc);

    // Status - inizialmente fail
    var tdStatus = document.createElement("td");
    tdStatus.innerHTML = "FAIL";
    tdStatus.setAttribute("id", ("status-row-" + tests.length));
    tdStatus.setAttribute("class", "fail");
    tr.append(tdStatus);

    // Punti conseguiti
    var tdPoints = document.createElement("td");
    tdPoints.innerHTML = 0;
    tdPoints.setAttribute("id", ("points-row-" + tests.length));
    tr.append(tdPoints);

    // Punti previsti per l'esercizio
    var tdMaxPoint = document.createElement("td");
    tdMaxPoint.innerHTML = test.points;
    tr.append(tdMaxPoint);

    // Aggiunge la riga
    tabella.append(tr);
   };
 
   aggiungiSpecifica(document.getElementById("tests-descr"));
   aggiungiRigaTabellaValutazione(document.getElementById("points"));
}

function aggiornaTabellaConSomma(punti, puntiTotali) {
  var tdPoints = document.getElementById("points-result");
  var tdMaxPoint = document.getElementById("total-points");
  var daAggiungere = false;
  if (!tdPoints) {
    daAggiungere = true;
    tdPoints = document.createElement("td");
    tdPoints.setAttribute("id", "points-result");
    tdMaxPoint = document.createElement("td");
    tdMaxPoint.setAttribute("id", "total-points");
  }
  tdPoints.innerHTML = punti;
  tdMaxPoint.innerHTML = puntiTotali;
  if (daAggiungere) {
    var tr = document.createElement("tr");
    tr.append(document.createElement("td"));
    tr.append(
      document.createElement("td")
      .appendChild(
        document.createTextNode("Punteggio")));
    tr.append(document.createElement("td"));
    tr.append(tdPoints);
    tr.append(tdMaxPoint);
    var table = document.getElementById("points");
    table.append(tr);
  }
}

function cercaPrimoBloccoPerTipo(doc, context) {
  if (doc.context == context) {
    return doc;
  }
  var trovato = false;
  var j;
  for (j = 0; !trovato && j < doc.blocks.length; j += 1) {
    trovato = trovato || cercaPrimoBloccoPerTipo(doc.blocks[j],
      context);
  }

  return trovato;
};

function creaFunzioneValutazione(lhs, rhs, points) {
  return function (d) {
    var l, r;
    if (typeof lhs === "function") {
      l = lhs(d);
    } else {
      l = lhs;
    }
    if (typeof rhs === "function") {
      rhs = rhs(d);
    } else {
      r = rhs;
    }
    if (typeof l === "object") {
      if (JSON.stringify(l) === JSON.stringify(r)) {
        return points;
      } else {
        console.log(JSON.stringify(l), JSON.stringify(r));
        return 0;
      }
    }
    if (l === r) {
      return points;
    }
    return 0;
  };
}

function creaTest(shortText, text, points, assertionLhs,
  assertionRhs) {
  var test = {
    shortText: shortText,
    text: text,
    points: points
  };
  test.evaluate = creaFunzioneValutazione(assertionLhs,
    assertionRhs,
    points);
  aggiungiTest(test);
}

function converti_e_valuta() {
  if (document.getElementById("nome").value === "" ||
    document.getElementById("cognome").value === "") {
    alert("Inserisci il nome e il cognome!");
    return;
  }
  var content = codemirror.doc.getValue();
  if (content === "") {
    alert("Aggiungere del testo");
    return 0;
  }
  var converti = function() {
    var asciidoctor = Asciidoctor();
  
    var doc = asciidoctor.load(content);
    var html_doc = doc.convert(content);
    var div = document.getElementById("render");
    div.innerHTML = html_doc;
    return {
      asciidoc_dom : doc,
      html_dom : html_doc
    };
  };
  var doms = converti();
  var doc = doms.asciidoc_dom;
  var punti = 0,
    puntiTotali = 0;
  var j, parziale, statusId, pointsId;
  for (j = 0; j < tests.length; j += 1) {
    puntiTotali += tests[j].points;
    parziale = tests[j].evaluate(doc);
    statusId = "status-row-" + (j + 1);
    pointsId = "points-row-" + (j + 1);
    if (parziale !== 0) {
      punti += parziale;
      document.getElementById(statusId).textContent = "PASS";
      document.getElementById(statusId).setAttribute("class", "pass");
      document.getElementById(pointsId).innerHTML = parziale;
    } else {
      document.getElementById(statusId).innerHTML = "FAIL";
      document.getElementById(statusId).setAttribute("class", "fail");
      document.getElementById(pointsId).innerHTML = 0;

    }
  }
  aggiornaTabellaConSomma(punti, puntiTotali);
  return punti;
}

function invia() {
  var punti = converti_e_valuta();
  document.getElementById("json").value = codemirror.doc.getValue();
  document.getElementById("punti").value = punti;
  document.getElementById("form").submit();
}

//https://script.google.com/a/savoiabenincasa.it/macros/s/AKfycbw9oCoy8-XvhU1FaVCybHXRYZ0o316AaX2OWvx0KrnVMCr3soI/exec

// 1 - Titolo
creaTest("Titolo",
  "Inserisci il titolo: <code>Prova di <em>Nome</em> " +
  "<em>Cognome</em>.", 3,
  function (d) {
    if (!d.hasHeader())
      return "";
    var titolo = d.getDocumentTitle().toLowerCase().substr(0, 9);
    console.log("Titolo: " + titolo);
    return titolo;
  },
  "prova di ");
// 2 - Autore
creaTest("Nome autore", "Inserisci il nome dell'autore", 1,
  function (d) {
    if (!d.hasHeader())
      return "";
    var nome = d.getAttribute("firstname");
    console.log("Nome: " + nome);
    return nome !== undefined;
  },
  true);
creaTest("Cognome autore",
  "Inserisci il cognome dell'autore (nel giusto ordine!)", 1,
  function (d) {
    if (!d.hasHeader())
      return "";
    var cognome = d.getAttribute("lastname");
    console.log("Cognome: " + cognome);
    return cognome !== undefined;
  },
  true);
creaTest("Email autore", "Inserisci l'email dell'autore", 1,
  function (d) {
    if (!d.hasHeader())
      return "";
    var email = d.getAttribute("email");
    console.log("Email: " + email);
    return email !== undefined;
  },
  true);
// 3 - Revisione
creaTest("Data", "Inserisci la data di revisione", 1, function (d) {
    if (!d.hasHeader())
      return "";
    var revdate = d.getAttribute("revdate");
    console.log("RevDate: " + revdate);
    return revdate !== undefined;
  },
  true);
creaTest("Numero revisione", "Inserisci il numero di revisione",
  1,
  function (d) {
    var revnumber = d.getAttribute("revnumber");
    if (!d.hasHeader())
      return "";
    console.log("RevNumber: " + revnumber);
    return revnumber !== undefined;
  },
  true);
creaTest("Commento revisione", "Inserisci la nota di revisione",
  1,
  function (d) {
    if (!d.hasHeader())
      return "";
    var revremark = d.getAttribute("revremark");
    console.log("RevRemark: " + revremark);
    return revremark !== undefined;
  },
  true);
// Attributo
creaTest("Attributo", "Inserisci l'attributo <code>safe</code> con valore <code>unsafe</code>",
  1,
  function (d) {
    if (!d.hasHeader())
      return "";
    var safe = d.getAttribute("safe");
    console.log("Safe: " + safe);
    return safe;
  },
  "unsafe");
// 4 - Paragrafi e sotto paragrafi
creaTest("Paragrafo",
  "Inserisci un paragrafo dat titolo <code>Paragrafo</code>",
  1,
  function (d) {
    if (d.getBlocks().length < 1 || !d.getBlocks()[0]) {
      return "";
    }
    var titoloParagrafo = d.getBlocks()[0].title;
    if (typeof titoloParagrafo == "string") {
      console.log("Titolo primo paragrafo: " + titoloParagrafo);
      return titoloParagrafo.toLowerCase();
    }
    return "";
  },
  "paragrafo");
creaTest("Sotto-Paragrafo",
  "Inserisci un sotto-paragrafo dal titolo <code>Sotto-paragrafo</code>",
  1,
  function (d) {
    if (!d.getBlocks()[0] || !d.getBlocks()[0].blocks[0]) {
      return "";
    }
    var titoloParagrafo = d.getBlocks()[0].blocks[0].title;
    if (typeof titoloParagrafo == "string") {
      console.log("Titolo primo sotto-paragrafo: " +
        titoloParagrafo);
      return titoloParagrafo.toLowerCase();
    }
    return "";
  },
  "sotto-paragrafo");
creaTest("Sotto-Sotto-Paragrafo",
  "Inserisci un sotto-sotto-paragrafo dal titolo <code>Sotto-sotto-paragrafo</code>",
  1,
  function (d) {
    if (!d.getBlocks()[0] || !d.getBlocks()[0].blocks[0] || !d.getBlocks()[
        0].blocks[0].blocks[0]) {
      return "";
    }
    var titoloParagrafo = d.getBlocks()[0].blocks[0].blocks[0].title;
    if (typeof titoloParagrafo == "string") {
      console.log("Titolo primo sotto-sotto-paragrafo: " +
        titoloParagrafo);
      return titoloParagrafo.toLowerCase();
    }
    return "";
  },
  "sotto-sotto-paragrafo");
// 5 - Elenchi
creaTest("Elenco non ordinato",
  "Inserisci un elenco non ordinato con primo elemento <code>Primo</code>",
  1,
  function (d) {
    var ulist = cercaPrimoBloccoPerTipo(d, "ulist");
    if (!ulist) {
      return "";
    }
    var ulistFirstItem = ulist.blocks[0];
    if (ulistFirstItem) {
      return ulistFirstItem.text.toLowerCase();
    } else {
      return "";
    }
  },
  "primo");
creaTest("Elenco ordinato",
  "Inserisci un elenco ordinato con secondo elemento <code>due</code>. Inseriscilo in una nuova sezione",
  1,
  function (d) {
    var olist = cercaPrimoBloccoPerTipo(d, "olist");
    if (!olist || olist.length < 2) {
      return "";
    }
    var olistSecondItem = olist.blocks[1];
    if (olistSecondItem) {
      return olistSecondItem.text.toLowerCase();
    } else {
      return "";
    }
  },
  "due");
creaTest("Elenco descrittivo",
  "Inserisci un elenco descrittivo con il termine <code>termine</code> e descrizione <code>descrizione</code>. Inseriscilo in una nuova sezione",
  1,
  function (d) {
    var dlist = cercaPrimoBloccoPerTipo(d, "dlist");
    if (!dlist || dlist.length < 1) {
      return {};
    }
    var dlistItem = dlist.blocks[0];
    if (dlistItem) {
      return {
        t: dlistItem[0][0].text.toLowerCase(),
        d: dlistItem[1].text.toLowerCase()
      };
    } else {
      return {};
    }
  }, {
    t: "termine",
    d: "descrizione"
  });
// Neretto
creaTest("Neretto",
  "Inserisci un capoverso con la parola <code>neretto</code> in neretto",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var testo = html.getElementsByTagName("strong");
    if (!testo || testo.length < 1) {
      return "";
    }
    return testo[0].innerText;
  },
  "neretto");
// Corsivo
creaTest("Corsivo",
  "Inserisci un capoverso con la parola <code>corsivo</code> in corsivo",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var testo = html.getElementsByTagName("em");
    if (!testo || testo.length < 1) {
      return "";
    }
    return testo[0].innerText;
  },
  "corsivo");
// Corsivo
creaTest("Testo a spaziatura fissa",
  "Inserisci un capoverso con la frase <code>testo a spaziatura fissa</code> a spaziatura fissa",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var testo = html.getElementsByTagName("code");
    if (!testo || testo.length < 1) {
      return "";
    }
    return testo[0].innerText;
  },
  "a spaziatura fissa");
// A capo
creaTest("A capo",
  "Inserisci un capoverso che va a capo",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var testo = html.getElementsByTagName("br");
    if (!testo || testo.length < 1) {
      return false;
    }
    return true;
  },
  true);
// Collegamento
creaTest("Collegamento",
  "Inserisci un collegamento il cui indirizzo sia <code>http://www.gnu.org/</code> e il cui testo visualizzato sia <code>progetto GNU</code>",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var collegamento = html.getElementsByTagName("a")[0];
    if (!collegamento) {
      return {};
    }
    return {
      href: collegamento.href,
      innerText: collegamento.innerText.toLowerCase()
    };
  }, {
    href: "http://www.gnu.org/",
    innerText: "progetto gnu"
  });
// Immagine
creaTest("Immagine",
  "Inserisci un'immagine il cui indirizzo sia <code>http://www.gnu.org/graphics/gnu-head.jpg<code>",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var img = html.getElementsByTagName("img")[0];
    if (!img) {
      return "";
    }
    return img.src;
  },
  "http://www.gnu.org/graphics/gnu-head.jpg");
// Tabella
creaTest("Tabella",
  "Inserisci una tabella; sei libero di scegliere il contenuto",
  1,
  function (d) {
    // Cerca nel DOM HTML
    var html = document.getElementById("render");
    var tabella = html.getElementsByTagName("table")[0];
    if (!tabella) {
      return false;
    }
    return true;
  },
  true);
