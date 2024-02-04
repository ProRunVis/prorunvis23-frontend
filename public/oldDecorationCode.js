/* static readJsonAndHighlightFirstLine(editor, jsonData) {
    // Prüft, ob jsonData ein gültiges Objekt ist und mindestens einen Child hat
    if (!jsonData || !jsonData.childs || jsonData.childs.length === 0) {
      console.error('Invalid JSON data');
      return;
    }
  
    // Nimmt die Range des ersten Child-Elements
    const firstChild = jsonData.childs[0];
    const { start, end } = firstChild.range;
  
    // Erzeugt eine grüne Hinterlegung für die erste Zeile
    const decorations = [{
      range: new monaco.Range(1,1,4,4),
      options: {
        isWholeLine: true,
        className: 'my-green-background-class' // Diese Klasse muss in Ihrem CSS definiert sein
      }
    }];
  
    // Aktualisiert die Dekorationen im Editor
    editor.deltaDecorations([], decorations);
  }




  static addDecorationsBasedOnJsonData(editor, jsonData) {
   
    // Ermittle die abgedeckten Zeilen
    const coveredLines = this.getCoveredLines(jsonData);

    // Erzeuge Dekorationen für die abgedeckten und nicht abgedeckten Zeilen
    let decorations = [];
    const lineCount = editor.getModel().getLineCount();

    for (let line = 1; line <= lineCount; line++) {
      let colorClass = coveredLines.has(line) ? 'solid-green-line-decoration' : 'solid-red-line-decoration';

      decorations.push({
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          linesDecorationsClassName: colorClass
        }
      });
    }

    // Aktualisiere alle Dekorationen auf einmal
    editor.deltaDecorations([], decorations);
  }



  static getLineDecoration(editor, lineIndex) {
    let prevDecoration = null;
    const decorations = editor.getModel().getLineDecorations(lineIndex + 1);
    for (let i = 0; i < decorations.length; i++) {
      const dec = decorations[i];
      // Prüfe ob eine vernestung vorliegt
      if (prevDecoration &&
        dec.range.startLineNumber > prevDecoration.range.startLineNumber &&
        dec.range.endLineNumber < prevDecoration.range.endLineNumber) {
        // Prüfe,ob davor rot war
        if (prevDecoration.options.linesDecorationsClassName.includes('solid-red-line-decoration')) {
          // wenn beides zutrifft -> rot
          return 'red';
        }
      }
      // Hier speichern wir das aktuelle und verwenden es als previous
      prevDecoration = dec;
    }

    for (const dec of decorations) {
      if (dec.range.startLineNumber === lineIndex + 1) {
        if (dec.options.linesDecorationsClassName.includes('solid-green-line-decoration')) {
          return 'green';
        } else if (dec.options.linesDecorationsClassName.includes('solid-red-line-decoration')) {
          return 'red';
        }
      }
    }
    return null;
  }

  // Definieren Sie die getCoveredLines Methode ebenfalls als statische Methode
  static getCoveredLines(jsonData) {
    let coveredLines = new Set();

    jsonData.forEach(item => {
      // Gehe durch jede Zeile von 'start' bis 'end' in jedem JSON-Element
      for (let line = item.start; line <= item.end; line++) {
        coveredLines.add(line);
      }
    });

    return coveredLines;
  } */
