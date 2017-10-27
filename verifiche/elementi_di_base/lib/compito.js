var codemirror = CodeMirror.fromTextArea(document.getElementById(
  "editor"), {
  value: "\n",
  mode: "asciidoc",
  lineNumbers: true,
  lineWrapping: true
});

var tests = [];

function aggiungiTest(test) {
  tests.push(test);
  var item = document.createElement("li");
  item.innerHTML = test.text;
  var list = document.getElementById("tests-descr");
  list.appendChild(item);

  var tr = document.createElement("tr");
  var tdId = document.createElement("td");
  tdId.innerHTML = tests.length;
  tr.append(tdId);

  var tdDesc = document.createElement("td");
  tdDesc.innerHTML = test.shortText;
  tr.append(tdDesc);

  var tdStatus = document.createElement("td");
  tdStatus.innerHTML = "FAIL";
  var statusId = document.createAttribute("id");
  statusId.value = "status-row-" + tests.length;
  tdStatus.setAttributeNode(statusId);

  tr.append(tdStatus);

  var tdPoints = document.createElement("td");
  tdPoints.innerHTML = 0;
  var pointsId = document.createAttribute("id");
  pointsId.value = "points-row-" + tests.length;
  tdPoints.setAttributeNode(pointsId);
  tr.append(tdPoints);

  var tdMaxPoint = document.createElement("td");
  tdMaxPoint.innerHTML = test.points;
  tr.append(tdMaxPoint);

  var table = document.getElementById("points");
  table.append(tr);
}

var cercaPrimoBloccoPerTipo = function (doc, context) {
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

function converti() {
  if (document.getElementById("nome").value === "" ||
    document.getElementById("cognome").value === "") {
    alert("Inserisci il nome e il cognome!");
    return;
  }
  var asciidoctor = Asciidoctor();
  var content = codemirror.doc.getValue();
  var doc = asciidoctor.load(content);
  var html_doc = doc.convert(content);
  var div = document.getElementById("render");
  div.innerHTML = html_doc;
  var punti = 0;
  var j, parziale, statusId, pointsId;
  for (j = 0; j < tests.length; j += 1) {
    parziale = tests[j].evaluate(doc);
    statusId = "status-row-" + (j + 1);
    pointsId = "points-row-" + (j + 1);
    if (parziale !== 0) {
      punti += parziale;
      document.getElementById(statusId).innerHTML = "PASS";
      document.getElementById(pointsId).innerHTML = parziale;
    } else {
      document.getElementById(statusId).innerHTML = "FAIL";
      document.getElementById(pointsId).innerHTML = 0;
    }
  }
  return punti;
}

function invia() {
  var punti = converti();
  document.getElementById("asciidoc").value = codemirror.doc.getValue();
  document.getElementById("punti").value = punti;
  document.getElementById("form").submit();
}

//https://script.google.com/a/savoiabenincasa.it/macros/s/AKfycbw9oCoy8-XvhU1FaVCybHXRYZ0o316AaX2OWvx0KrnVMCr3soI/exec

// 1 - Titolo
creaTest("Titolo",
  "Inserisci il titolo: <strong>Prova di <em>Nome</em> " +
  "<em>Cognome</em>.", 3,
  function (d) {
    var titolo = d.getDocumentTitle().toLowerCase().substr(0, 9);
    console.log("Titolo: " + titolo);
    return titolo;
  },
  "prova di ");
// 2 - Autore
creaTest("Nome autore", "Inserisci il nome dell'autore", 1,
  function (d) {
    var nome = d.getAttribute("firstname");
    console.log("Nome: " + nome);
    return nome !== undefined;
  },
  true);
creaTest("Cognome autore",
  "Inserisci il cognome dell'autore (nel giusto ordine!)", 1,
  function (d) {
    var cognome = d.getAttribute("lastname");
    console.log("Cognome: " + cognome);
    return cognome !== undefined;
  },
  true);
creaTest("Email autore", "Inserisci l'email dell'autore", 1,
  function (d) {
    var email = d.getAttribute("email");
    console.log("Email: " + email);
    return email !== undefined;
  },
  true);
// 3 - Revisione
creaTest("Data", "Inserisci la data di revisione", 1, function (d) {
    var revdate = d.getAttribute("revdate");
    console.log("RevDate: " + revdate);
    return revdate !== undefined;
  },
  true);
creaTest("Numero revisione", "Inserisci il numero di revisione",
  1,
  function (d) {
    var revnumber = d.getAttribute("revnumber");
    console.log("RevNumber: " + revnumber);
    return revnumber !== undefined;
  },
  true);
creaTest("Commento revisione", "Inserisci la nota di revisione",
  1,
  function (d) {
    var revremark = d.getAttribute("revremark");
    console.log("RevRemark: " + revremark);
    return revremark !== undefined;
  },
  true);
// 4 - Paragrafi e sotto paragrafi
creaTest("Paragrafo",
  "Inserisci un paragrafo dat titolo <strong>Primo paragrafo</strong>",
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
  "primo paragrafo");
creaTest("Sotto-Paragrafo",
  "Inserisci un sotto-paragrafo dat titolo <strong>Primo sotto-paragrafo del primo paragrafo</strong>",
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
  "primo sotto-paragrafo del primo paragrafo");
creaTest("Sotto-Sotto-Paragrafo",
  "Inserisci un sotto-sotto-paragrafo dat titolo <strong>Primo sotto-sotto-paragrafo</strong>",
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
  "primo sotto-sotto-paragrafo");
// 5 - Elenchi
creaTest("Elenco non ordinato",
  "Inserisci un elenco non ordinato con primo elemento <strong>Primo</strong>",
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
  "Inserisci un elenco ordinato con secondo elemento <strong>due</strong>",
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
