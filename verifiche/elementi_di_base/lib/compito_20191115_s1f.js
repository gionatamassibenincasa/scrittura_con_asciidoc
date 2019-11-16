(function () {
  'use strict';

  var aggiornaValutazione;

  var editor = ace.edit("editor", {
    theme: "ace/theme/monokai",
    mode: "ace/mode/asciidoc",
    autoScrollEditorIntoView: true,
    minLines: 30
  });

  carica();
  setTimeout(converti, 500);

  setInterval(function () {
    console.log("Aggiorno la matematica - per sicurezza");
    var r = document.getElementById("tests-descr");
    r.setAttribute("display", "none");
    MathJax.Hub.Typeset(r);
  }, 10000);

  editor.session.on('change', function () {
    clearTimeout(aggiornaValutazione);
    aggiornaValutazione = setTimeout(function () {
      converti();
    }, 1500);
  });
  var tests = [];
  var modelli = {};
  var punteggio = {};
  var invio = false;

  function salva() {
    localStorage[window.location.href.split("#")[0]] = editor.getValue();
  }

  function carica() {
    var urlParams = new URLSearchParams(window.location.search);
    var src = urlParams.get('src');
    if (src) {
      editor.setValue(src);
    } else {
      var address = window.location.href.split("#")[0];
      var persisted = localStorage[address] || editor.getValue();
      editor.setValue(persisted);
    }
  }

  function converti() {
    console.log("\n\nCONVERTI\n\n");
    salva();
    var inLocale = false;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === "")
      inLocale = true;
    if (!inLocale && (document.getElementById("nome").value === "" ||
        document.getElementById("cognome").value === "")) {
      alert("Inserisci il nome e il cognome!");
      return;
    }
    var content = editor.getValue();
    if (content === "") {
      alert("Aggiungere del testo");
      return 0;
    }
    var asciidoctor = Asciidoctor();
    modelli.asciidoc_dom = asciidoctor.load(content);
    var conversione_html = asciidoctor.convert(content, {
      header_footer: true,
      safe: 'server',
      attributes: {
        showtitle: true,
        icons: 'font',
        linkcss: true,
        stylesDir: 'https://cdnjs.cloudflare.com/ajax/libs/asciidoctor.js/1.5.7/css/',
        styleSheetName: 'asciidoctor.min.css'
      }
    });
    modelli.asciidoc = content;
    //console.log(conversione_html);
    var r = document.getElementById("render");
    r.setAttribute("display", "none");
    r.innerHTML = conversione_html;
    MathJax.Hub.Typeset(r, valuta);
  }

  function aggiungiTest(test) {
    tests.push(test);

    var aggiungiSpecifica = function (elenco) {
      // crea la voce d'elenco come specifica
      var item = document.createElement("li");
      item.setAttribute("id", ("item-" + tests.length));
      item.setAttribute("class", "fail");
      item.innerHTML = test.text;
      elenco.appendChild(item);
    };

    var aggiungiRigaTabellaValutazione = function (tabella) {
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

  var aggiornaTabellaConSomma = function (punti, puntiTotali) {
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
      var tfoot = document.createElement("tfoot");
      var tr = document.createElement("tr");
      tr.append(document.createElement("td"));
      tr.append(
        document.createElement("td")
        .appendChild(
          document.createTextNode("Punteggio")));
      tr.append(document.createElement("td"));
      tr.append(tdPoints);
      tr.append(tdMaxPoint);
      tfoot.append(tr);
      var table = document.getElementById("tab_test");
      table.append(tfoot);
    }
  }

  var cercaPrimoBloccoPerTipo = function (doc, context) {
    if (doc.context == context) {
      return doc;
    }
    if (doc.blocks == null) {
      return false;
    }
    var trovato = false;
    var j;
    for (j = 0; !trovato && j < doc.blocks.length; j += 1) {
      trovato = trovato || cercaPrimoBloccoPerTipo(doc.blocks[j],
        context);
    }

    return trovato;
  };

  var creaFunzioneValutazione = function (lhs, rhs, points) {
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
          // console.log(JSON.stringify(l), JSON.stringify(r));
          return 0;
        }
      }
      if (l === r) {
        return points;
      }
      return 0;
    };
  }

  var creaTest = function (shortText, text, points, assertionLhs,
    assertionRhs) {
    var test = {
      shortText: shortText,
      text: text,
      points: points,
      passed: false
    };
    test.evaluate = creaFunzioneValutazione(assertionLhs,
      assertionRhs,
      points);
    aggiungiTest(test);
  }

  var invia = function () {
    var prova = {
      classe: document.getElementById("classe").value,
      nome: document.getElementById("nome").value,
      cognome: document.getElementById("cognome").value,
      quesiti: tests,
      punteggio: punteggio,
      artefatto: editor.getValue()
    };

    var json = JSON.stringify(prova);
    document.getElementById("json").value = json;
    document.getElementById("punti").value = 10 * punteggio.punti / punteggio.scala;
    //console.log(JSON.stringify(prova, null, 4));
    document.getElementById("form").action = "https://script.google.com/a/savoiabenincasa.it/macros/s/AKfycbwCadXpofT_08X9n0O-CXqLvm08EvZ9M0BcbplgwQjimBYAwVn1/exec";
    document.getElementById("form").submit();
  }

  // 1 - Titolo
  creaTest("Titolo",
    "Inserisci il titolo: <code>Prova di <em>Nome</em> " +
    "<em>Cognome</em>.", 3,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return "";
      var titolo = d.getDocumentTitle().replace(/\s\s+/g, ' ').toLowerCase().substr(0, 9);
      console.log("Titolo: " + titolo);
      return titolo;
    },
    "prova di ");
  // 2 - Autore
  creaTest("Nome autore", "Inserisci il nome dell'autore: <code><em>Nome</em></code>", 1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return false;
      var nome = d.getAttribute("firstname");
      console.log("Nome: " + nome);
      return nome !== undefined;
    },
    true);
  creaTest("Cognome autore",
    "Inserisci il cognome dell'autore (nel giusto ordine!): <code><em>Cognome</em></code>", 1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return false;
      var cognome = d.getAttribute("lastname");
      console.log("Cognome: " + cognome);
      return cognome !== undefined;
    },
    true);
  creaTest("Email autore", "Inserisci l'email dell'autore: <code><em>nome</em>.<em>cognome</em>@savoiabenincasa.it</code>", 1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return false;
      var email = d.getAttribute("email");
      console.log("Email: " + email);
      return email !== undefined;
    },
    true);
  // 3 - Revisione
  creaTest("Data", "Inserisci la data di revisione: <code>13/11/2018</code>", 1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return "";
      var revdate = d.getAttribute("revdate");
      console.log("RevDate: " + revdate);
      if (revdate == null)
        return "";
      return revdate;
    },
    "13/11/2018");
  creaTest("Numero revisione", "Inserisci il numero di revisione: <code>1</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
      var revnumber = d.getAttribute("revnumber");
      if (!d.hasHeader())
        return "";
      console.log("RevNumber: " + '"' + revnumber + '"');
      if (revnumber == null) return "";
      return revnumber;
    },
    "1");
  creaTest("Commento revisione", "Inserisci la nota di revisione: <code>1F</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return "";
      var revremark = d.getAttribute("revremark");
      console.log("RevRemark: " + '"' + revremark + '"');
      if (revremark == null) return false;
      var regex = /1\s*F\s*/m;
      return regex.test(revremark);
    },
    true);
  // Attributo
  creaTest("Attributo <code>safe</code>", "Inserisci l'attributo <code>safe</code> con valore <code>unsafe</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return "";
      var safe = d.getAttribute("safe");
      console.log("Safe: " + safe);
      return safe;
    },
    "unsafe");
  creaTest("Matematica: stem", "Inserisci l'attributo <code>stem</code> per abilitare la scrittura di formule",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
      if (!d.hasHeader())
        return "";
      var stem = d.getAttribute("stem");
      console.log("Stem: " + (typeof stem === "string"));
      return stem === "";
    },
    true);
  // 4 - Paragrafi e sotto paragrafi
  creaTest("Paragrafo",
    "Inserisci un paragrafo dal titolo: <code>Paragrafo</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
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
    "Inserisci un sotto-paragrafo dal titolo: <code>Sotto-paragrafo</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
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
    "Inserisci un sotto-sotto-paragrafo dal titolo: <code>Sotto-sotto-paragrafo</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
      cercaPrimoBloccoPerTipo(d, "ulist");
      try {
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
      } catch (error) {
        console.log(error);
        return "";
      }
      return "";
    },
    "sotto-sotto-paragrafo");

  creaTest("Matematica: apici",
    "Inserisci la formula: \\( a^2\\)",
    1,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*a\^2\s*\]/m;
      console.log("$a al quadrato$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: apici annidati",
    "Inserisci la formula: \\( {b^3}^4\\)",
    1,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*((\{b\^3}\^4)|(\{\{b\^3}\^4\})|(b^\{3\^4\})|(\{b^\{3\^4\}\}))\s*\]/m;
      console.log("$b al cubo alla quarta$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: pedici",
    "Inserisci la formula: \\( c_M\\)",
    1,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*((c_M)|(c_\{M\}))\s*\]/m;
      console.log("$c con M$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: radice quadrata",
    "Inserisci la formula: \\( \\sqrt{3}\\)",
    1,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*\\sqrt\{3\}s*\]/m;
      console.log("$radice quadrata di 3$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: lettere greche",
    "Inserisci la formula: \\( \\pi\\)",
    1,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*\\pis*\]/m;
      console.log("$pi greco$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: frazioni",
    "Inserisci la formula: \\( \\frac{1}{2}\\)",
    1,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*\\frac\{1\}\{2\}s*\]/m;
      console.log("$un mezzo$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: formula complessa 1",
    "Inserisci la formula: \\( \\sqrt{x_2^2 - x_1^2}\\)",
    2,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*\\sqrt\{\s*(x(_2\^2)|(\^2_2))\s*-\s*x((_1\^2)|(\^2_1))\s*\}\s*\]/m;
      console.log("$radq (x2 quadro - x1 quadro)$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  creaTest("Matematica: formula complessa 2",
    "Inserisci la formula: \\( v_m = \\frac{\\Delta s}{\\Delta t}\\)",
    2,
    function (doms) {
      var d = doms.asciidoc;
      var regex = /^latexmath:\[\s*v_m\s*=\s*\\frac\{\s*\\Delta\s+s\s*\}\{\s*\\Delta\s+t\s*\}\s*\]/m;
      console.log("$velocità media$: " + regex.exec(d));
      return regex.test(d);
    },
    true);
  // 5 - Elenchi
  creaTest("Elenco non ordinato",
    "Inserisci un elenco non ordinato con primo elemento: <code>Primo</code>",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
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
    "Inserisci un elenco ordinato con secondo elemento: <code>due</code>.<br><i class=\"fa icon-tip\" title=\"Tip\"></i>Se l'elenco ordinato è annidato in quello precedente, allora anteponi un commento oppure una nuova sezione.",
    1,
    function (doms) {
      var d = doms.asciidoc_dom;
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
    function (doms) {
      try {
        var d = doms.asciidoc_dom;
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

      } catch (error) {
        console.log(error);
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
    function (doms) {
      var d = doms.html_dom;
      // Cerca nel DOM HTML
      var testo = d.getElementsByTagName("strong");
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
    function (doms) {
      var d = doms.html_dom;
      // Cerca nel DOM HTML
      var testo = d.getElementsByTagName("em");
      if (!testo || testo.length < 1) {
        return "";
      }
      return testo[0].innerText;
    },
    "corsivo");
  // Corsivo
  creaTest("Testo a spaziatura fissa",
    "Inserisci un capoverso con la frase <code>a spaziatura fissa</code> a spaziatura fissa",
    1,
    function (doms) {
      var d = doms.html_dom;
      // Cerca nel DOM HTML
      var testo = d.getElementsByTagName("code");
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
    function (doms) {
      var d = doms.html_dom;
      // Cerca nel DOM HTML
      var testo = d.getElementsByTagName("br");
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
    function (doms) {
      var d = doms.html_dom;
      var collegamenti = d.getElementsByTagName("a");
      if (collegamenti.length === 0) {
        return {};
      }
      for (var j = 0; j < collegamenti.length; j++) {
        var collegamento = collegamenti[j];
        if (collegamento.innerText.toLowerCase() == "progetto gnu") {
          var ret = {
            href: collegamento.href,
            innerText: collegamento.innerText.toLowerCase()
          };
          console.log("collegamento: " + JSON.stringify(ret));
          return ret;

        }
      }
      return {};
    }, {
      href: "http://www.gnu.org/",
      innerText: "progetto gnu"
    });
  // Immagine
  creaTest("Immagine",
    "Inserisci un'immagine il cui indirizzo sia <code>http://www.gnu.org/graphics/gnu-head.jpg<code>",
    1,
    function (doms) {
      var d = doms.html_dom;
      var img = d.getElementsByTagName("img")[0];
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
    function (doms) {
      var d = doms.html_dom;
      var tabella = d.getElementsByTagName("table")[0];
      if (!tabella) {
        return false;
      }
      return true;
    },
    true);

  document.getElementById("fonts").disabled = true;
  document.getElementById("cambiafont").onclick = function () {
    var sheet = document.getElementById("fonts");
    if (sheet.disabled) {
      sheet.disabled = false;
    } else {
      sheet.disabled = true;
    }
  };
  document.getElementById("converti_e_valuta").addEventListener('click', converti);

  function valuta() {
    console.log("\n\nVALUTA\n\n");
    modelli.html_dom = document.getElementById("render");
    //console.log(modelli);
    var punti = 0,
      puntiTotali = 0,
      j, parziale, statusId, pointsId, itemId;
    for (j = 0; j < tests.length; j += 1) {
      puntiTotali += tests[j].points;
      parziale = tests[j].evaluate(modelli);
      statusId = "status-row-" + (j + 1);
      pointsId = "points-row-" + (j + 1);
      itemId = "item-" + (j + 1);
      if (parziale !== 0) {
        punti += parziale;
        document.getElementById(statusId).textContent = "PASS";
        document.getElementById(statusId).setAttribute("class", "pass");
        document.getElementById(itemId).setAttribute("class", "pass");
        document.getElementById(pointsId).textContent = parziale;
        tests[j].passed = true;
      } else {
        document.getElementById(statusId).textContent = "FAIL";
        document.getElementById(statusId).setAttribute("class", "fail");
        document.getElementById(itemId).setAttribute("class", "fail");
        document.getElementById(pointsId).textContent = 0;
        tests[j].passed = false;
      }
    }
    punteggio.punti = punti;
    punteggio.scala = puntiTotali;
    console.log(punteggio);
    aggiornaTabellaConSomma(punteggio.punti, punteggio.scala);
    if (invio) {
      invio = false;
      invia();
    }
  }

  document.getElementById("invia").addEventListener('click', function () {
    invio = true;
    converti();
  });

})();
