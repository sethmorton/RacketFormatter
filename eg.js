const inputString = `     
      #lang racket
      #| This is a comment block.
   It can span multiple lines.
   |#

This is some regular code.

     #| Another comment block.
   This is inside the block.
   |#
   
      (define add 1 2)     
      
      (define (add x y)
(+ x y))

(define (subtract x y) (+ x (* -1 y)))


#lang    racket

  
  
(define      (whitespace)
  
  (let     ([x 1] [y 2])
   
    ( + x y)
  
))


#lang racket

#lang    racket ;unindented
;comment 

(define (weird-comments)
  ;inline comment ;should be above
  (displayln "hi"))
  (define (fibonacci-sequence n)
  (letrec ([f (lambda (x)
               (if (< x 2)
                   x
                   (+ (f (- x 1)) (f (- x 2)))))])
    (map f (range n))))

(module apple racket
  (provide banana)
  
  (define banana 
    (lambda(cherry)
      (cond
        [(> cherry 10) 'large]
        [(< cherry 5) 'small] 
        [else 'medium])))
        
  (define durian 
    (lambda (elderberry) 
      (for/list ([fig (in-range 10 elderberry)])
        fig)))
  
  (require typed/racket)
  
  (: grape -> Number)
  (define grape
    (ann (λ (hummus) 
      (if (even? hummus) 
           (* 2 hummus)
           (error "not even")))
      Number))
  
  (module banana racket
    (require apple)
    
    (define juice 
      (grape 4))
    
    (provide juice))
)

`;

const newInput = `    

   #lang racket
    #| This is a comment block.
It can span multiple lines.
|#

This is some regular code.

#| Another comment block.
This is inside the block.
|#

(define add 1 2)     
      
(define (add x y)
(+ x y))

(define (subtract x y) (println "This function")    (+ x (* -1 y)))(println "This function") (println "This function") ; hello ; hello!



`;
// open open close open close  open open close open
// 1 2 1 2 1 2 3 2 3 2 1

// 1 2 1 2 0 1 2 1 2
// on zero, push indent level to up one

// if we hit the open paren
// subindent vlaue = subindent value two indices prior, indent

/**
 *
 * @param {string} unformattedText
 */
const formatRacket = (unformattedText) => {
  // define all variable trackers

  let indentLevel = 0;
  let openParen = 0;
  let openBracket = 0;
  let charInSingleLineComment = false;
  let charInMultiLineComment = false;
  let charInString = false;
  let newLine = false;
  let openParenBool = false;
  let lineSplit = false;

  // 1 2 1 2 0 1 2 1 2
  // on zero, push indent level to up one

  // if we hit subindent 2 and
  let subIndentArray = [];
  let subIndent = 0;

  // declare result string
  let result = "";

  for (let index = 0; index < unformattedText.length; index++) {
    const char = unformattedText.charAt(index);
    // get the previous and next characters
    const lastChar = unformattedText.charAt(Math.max(0, index - 1));
    const nextChar = unformattedText.charAt(
      Math.min(index + 1, unformattedText.length - 1)
    );
    // we need to check for comments, strings, and escape characters
    // we need to keep indentation level for each line
    switch (char) {
      case "#":
        // #| |#
        if (!charInString) {
          if (lastChar == "|") {
            result += char;
            result += "\n";
            charInMultiLineComment = false;
            break;
          } else if (nextChar == "|") {
            result += "\n";
            result += char;
            charInMultiLineComment = true;
            break;
          } else {
            charInSingleLineComment = true;
          }
        }
        result += char;
        break;
      case "|":
        if (!charInString) {
          if (lastChar == "#") {
            result += char;
            result += "\n";
          } else if (nextChar == "#") {
            result += char;
          }
          break;
        }
        result += char;

      case ";":
        if (!charInString && !charInMultiLineComment) {
          result += "h"
          result += indentLevel
          charInSingleLineComment = true;
          result += "\n";
          if (indentLevel == 0) {
            result += " ".repeat(openParen);
          } else {
            result += " ".repeat(indentLevel);
          }
          
          result += char;
          break;
        }
        result += char;
        break;
      case '"':
        if (!charInMultiLineComment && !charInSingleLineComment) {
          charInString = !charInString;
        }
        result += char;
        break;
      case " ":
      case "\t":
        if (charInString || charInSingleLineComment || charInMultiLineComment) {
          if (charInMultiLineComment) {
            const previousNewLine = () => {
              let i = index - 1;
              console.log(index);
              while (i >= 0) {
                console.log(i);
                if (unformattedText.charAt(i) == " ") {
                  i--;
                } else {
                  if (unformattedText.charAt(i) !== "\n") {
                    return false;
                  } else {
                    return true;
                  }
                }
              }
              return true;
            };
            let newLineHit = previousNewLine();
            if (newLineHit) {
              break;
            }
          }
          result += char;
        } else {
          if (lastChar == " " || lastChar == "\t" || nextChar == " ") {
            // skip this space or tab
            break;
          }
          // make sure the subindenting process isn't going on:

          if (newLine) {
            result += " ".repeat(indentLevel);
            newLine = false;
            break;
          }
          result += char;
        }
        break;
      case "(":
        openParen += 1;
        subIndent += 1;
        subIndentArray = [...subIndentArray, subIndent];
        console.log(subIndentArray);
        if (
          subIndent == 2 &&
          subIndentArray[1] == 2 &&
          subIndentArray.length == 4
        ) {
          lineSplit = true;
          subIndentArray = [];
          subIndent = 0;
          console.log(subIndentArray, "ARRAY RESET?");
          indentLevel += 1;
          result += indentLevel;
          result += "\n";
          result += " ".repeat(indentLevel);
          result += char;
          break;
        }

        const findPreviousParentheses = () => {
          // loop through the string backwards until we find the previous parentheses, if we find a non-whitespace character, then we return false
          // if we find a parentheses, then we return true
          let i = index - 1;
          console.log(index);

          while (i >= 0) {
            console.log(i);
            if (unformattedText.charAt(i).match(/\s/)) {
              i--;
            } else {
              if (unformattedText.charAt(i) !== ")") {
                return false;
              } else {
                return true;
              }
            }
          }
          // for (let i = index; i < 0; i--) {
          //   console.log(i);
          //   if (unformattedText.charAt(i).match(/\s/)) {
          //     whitespaceHit = true;
          //   } else {
          //     if (whitespaceHit) {
          //       whitespaceHit = false;
          //     } else if (unformattedText.charAt(i) !== ")") {
          //       result += "not found"
          //       return false;
          //     } else {
          //       result += "found"
          //       return true;
          //     }
          //   }
          // }
        };

        if (findPreviousParentheses()) {
          result += "\n";
          result += " ".repeat(indentLevel);
          result += char;
          break;
        }

        result += char;
        break;
      case ")":
        if (subIndent >= 1) {
          subIndent -= 1;
          subIndentArray = [...subIndentArray, subIndent];
        }
        if (subIndent == 0) {
          console.log("SUB INDENT 0");
          subIndentArray = [];
        }
        openParen -= 1;
        if (openParen == 0) {
          indentLevel = 0;
          result += char;
          result += "\n";
          break;
        }

        result += char;
        break;
      case "[":
        const findPreviousCond = () => {
          let i = index - 1;
          while (i >= 0) {
            console.log(i);
            if (unformattedText.charAt(i).match(/\s/)) {
              i--;
            } else {
              if (!(unformattedText.charAt(i) == "d" && unformattedText.charAt(i - 1) == "n" && unformattedText.charAt(i - 2) == "o" && unformattedText.charAt(i - 3) == "c")) {
                return false;
              } else {
                return true;
              }
            }
          }
        };
        openBracket += 1;
        if (findPreviousCond()) { 
          result += "\n";
        
          result += " ".repeat(openBracket + indentLevel);
        }

        result += char;
        break;
      case "]":
        openBracket -= 1;
        result += char;
        break;
      case "\\":
        break;
      case "\n":
      case "\r":
        newLine = true;
        if (charInMultiLineComment) {
          result += char;
        }
        if (charInSingleLineComment) {
          charInSingleLineComment = false;
          result += "\n";
        }
        break;
      default:
        newLine = false;
        result += char;
    }
  }
  console.log(result);
};

formatRacket(inputString);

const formatLispCode = (unformattedText, options) => {
  // Initialization code from question

  const linesArray = unformattedText.split("\n");

  // Filter out empty lines and remove whitespace from multi-line comments
  const fullLines = linesArray.filter((line) => !line.match(/^\s*$/));

  let trimmedLines = fullLines.map((line) => line.trim());

  let open = false;

  let cleanedLines = [];

  trimmedLines.forEach((line, I) => {
    // loop through line characters
    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);
      if (char === "(") {
        open = true;
      } else if (char === ")") {
        open = false;
      }

      if (open === false) {
        console.log(line);
        const match = line
          .slice(i)
          .match(/(\s+"([^"]*)"\)+)|(\s+[\w]\)+)|(\n\)+)/);
        if (match) {
          const previousLine = trimmedLines[I - 1] + match;
          cleanedLines[I - 1] = previousLine;
          cleanedLines[I] = line.replace(match, "");
          break;
        } else {
          cleanedLines = [...cleanedLines, line];
          break;
        }
      }
    }
  });

  // console.log(cleanedLines, "HELLO CLEANED LINES");

  // console.log(cleanedLines);

  //   const cleanedLines = trimmedLines.reduce((accumulator, line, i) => {
  //     let openParenCount = 0;
  //     for (let j = 0; j < line.length; j++) {
  //         const char = line.charAt(j);
  //         if (char === '(') {
  //             openParenCount++;
  //         } else if (char === ')') {
  //             openParenCount--;
  //         } else {
  //             // Find a match if no open parentheses currently exist
  //             if (openParenCount === 0) {
  //                 const match = line.slice(j).match(/(?<!\()(\d+\)\)|"[\w\s]*"\)\))(?!\))/);
  //                 if (match) {
  //                     const previousLine = accumulator[i - 1] + match;
  //                     accumulator[i - 1] = previousLine;
  //                     accumulator.push(line.replace(match, ""));
  //                 }
  //             }
  //         }
  //     }

  //     if (line.match(/^\s*(\#\|)/) || line.match(/^\s*(\|\#)/) || line.match(/^\s*(\#lang)/)) {
  //         accumulator.push(line.trim());
  //     }

  //     if (line.match(/^\s*\)+\s*$/) || line.match(/^\s*\]+\s*$/)) {
  //         const previousLine = accumulator[i - 1] + line.trim();
  //         accumulator[i - 1] = previousLine;
  //     }

  //     return [...accumulator, line.trim()];
  // }, []);

  // trimmedLines.forEach((line, I) => {

  //   for (let i = 0; i < line.length; i++) {
  //     const char = line.charAt(i);
  //     let openParenCount = 0;
  //     if (char === '(') {
  //         openParenCount++;
  //     } else if (char === ')') {
  //         openParenCount--;
  //     } else {
  //         // Find a match if no open parentheses currently exist
  //         if (openParenCount === 0) {
  //             const match = line.slice(i).match(/(?<!\()(\d+\)\)|"[\w\s]*"\)\))(?!\))/);
  //             if (match) {
  //               let previousLine = cleanedLines[I - 1] + match;
  //               cleanedLines[I - 1] = previousLine;
  //              cleanedLines = [...cleanedLines, line.replace(match, "")];

  //             }
  //         }
  //     }
  // }

  //   if (line.match(/^\s*(\#\|)/) || line.match(/^\s*(\|\#)/)) {
  //     cleanedLines = [...cleanedLines, line.trim()];
  //   } else if (line.match(/^\s*(\#lang)/)) {
  //     cleanedLines = [...cleanedLines, line.trim()];
  //   }

  //    if (line.match( /^\s*\)+\s*$/) || line.match( /^\s*\]+\s*$/)) {
  //     console.log("HELLO");
  //     let previousLine = cleanedLines[I - 1] + line.trim();
  //     cleanedLines[I - 1] = previousLine;

  //   }

  //   cleanedLines = [...cleanedLines, line.trim()];
  // });

  const fullLinesAgain = cleanedLines.filter((line) => !line.match(/^\s*$/));
  const nonEmpty = fullLinesAgain.filter((item) => item !== "");

  const cleanedLinesString = nonEmpty.join("\n");

  console.log(nonEmpty, "HELLO CLEANED LINED");

  let result = "";
  const formatConfig = {
    indentString: "  ",
    newLineString: "\n",
  };
  let charInString = false;
  let charInComment = false;
  let openParen = 0;
  let openBracket = 0;
  let newLine = false;
  let indentLevel = 0;
  let subIndent = false;
  let subIndentTracker = 0;

  for (let i = 0; i < cleanedLinesString.length; i++) {
    // character at current index
    const CHAR = cleanedLinesString.charAt(i);
    switch (CHAR) {
      case "[":
        if (!charInString && !charInComment) {
          openBracket++;
          newLine = false;
        }
        result += CHAR;
        break;

      case "]":
        if (!charInString && openBracket > 0 && !charInComment) {
          openBracket--;
        }

        result += CHAR;
        break;

      case "(":
        if (!charInString && !charInComment) {
          openParen++;
          indentLevel++;
          subIndentTracker += 1;
          if (subIndentTracker > 2) {
            subIndent = true;
          }
        }
        // if (!charInString && !charInComment) {
        //   openParen++;
        //   indentLevel++;
        //   newLine = false;
        //   cantIndentTillClosedTracker += 1;

        //   console.log(cantIndentTillClosedTracker);

        //   if (cantIndentTillClosedTracker > 2) {
        //     cantIndentTillClosed = true;
        //   }

        //   if (cantIndentTillClosed == true) {
        //     cantIndentTillClosed = false;
        //     result += formatConfig.newLineString;
        //     result += formatConfig.indentString.repeat(indentLevel);
        //     cantIndentTillClosedTracker = 0;
        //     result += CHAR;

        //     break;
        //   }
        //   // if (!newLine) {
        //   //   result += formatConfig.newLineString;
        //   // }
        //   // result += formatConfig.indentString.repeat(openList);

        // }

        result += CHAR;
        break;

      case ")":
        if (!charInString && openParen > 0 && !charInComment) {
          openParen--;
          indentLevel--;
          if (subIndent == true) {
            subIndent = false;
            result += CHAR;
            if (
              cleanedLinesString.charAt(i + 1) !== ")" &&
              cleanedLinesString.charAt(i + 1) !== "]"
            ) {
              if (cleanedLinesString.charAt(i + 1) !== "\n") {
                result += formatConfig.newLineString;
              }
              result += formatConfig.indentString.repeat(indentLevel);
              subIndentTracker = 0;
              break;
            }
          }
        }
        result += CHAR;
        break;

      case '"':
        charInString = !charInString;
        result += CHAR;
        break;

      case ";":
        if (!charInString) {
          if (charInComment) {
            result += formatConfig.newLineString;
            result += formatConfig.indentString.repeat(indentLevel);
          }
          charInComment = true;
        }
        result += CHAR;
        break;

      case "|":
        if (cleanedLinesString.charAt(i - 1) === "#") {
          charInComment = true;
        }
        if (cleanedLinesString.charAt(i + 1) === "#") {
          charInComment = false;
        }
        result += CHAR;
        break;

      case "\\":
        // Handle escape character
        break;

      case "\n":
      case "\r":
        newLine = true;
        if (charInComment) {
          charInComment = false;
        }
        result += CHAR;
        result += formatConfig.indentString.repeat(indentLevel);
        break;

      case " ":
      case "\t":
        let lastChar = cleanedLinesString.charAt(i - 1);
        let nextChar = cleanedLinesString.charAt(i + 1);

        if (lastChar === "(" || lastChar === "[" || lastChar === "\n") {
          break;
        }
        if (nextChar === ")" || nextChar === "]" || nextChar === "\n") {
          break;
        }

        if (cleanedLinesString.charAt(i - 1) === " ") {
          break;
        }
        // if (indentLevel > 1 && !charInString && !charInComment) {
        //   function findPreviousBracket() {
        //     for (let j = i - 1; j >= 0; j--) {
        //       if (cleanedLinesString.charAt(j) === "[") {
        //         return true;
        //       }
        //       if (cleanedLinesString.charAt(j) === "\n") {
        //         return false;
        //       }
        //     }
        //   }
        //   if (findPreviousBracket()) {
        //     result += CHAR;
        //     break;
        //   }
        //   result += formatConfig.newLineString;
        //   result += formatConfig.indentString.repeat(indentLevel);
        // }
        result += CHAR;

        // } else if {
        //   result += CHAR;
        // }
        // result += CHAR;

        break;

      default:
        result += CHAR;
        newLine = false;
      // lastChar = CHAR;
    }
  }
  console.log(result);
  return result;
};

// const linesArray = inputString.split("\n");

// // Filter out empty lines
// const linesWithoutEmpty = linesArray.filter((line) => !line.match(/^\s*$/));

// // Loop through lines to detect comments and language specifier
// const cleanedLines = linesWithoutEmpty.map((line) => {
//   line = line.replace(/\(\s+/g, "("); // Remove spaces after open parenthesis
//   line = line.replace(/\s+\)/g, ")");
//   // Return #lang directive
//   if (line.match(/^\s*(\#lang)/)) {
//     return line.trim();
//   }

//   // Return multiline comment blocks
//   if (line.match(/^\s*(\#\|)/) || line.match(/^\s*(\|\#)/)) {
//     return line.trim();
//   }

//   let charInString = false;
//   let charInComment = false;

//   // Return other lines unchanged
//   return line;
// });

// // loop through characters of line
// for (let i = 0; i < line.length; i++) {
//   const CHAR = line[i];

//   // Check if character is in string
//   if (CHAR === '"') {
//     charInString = !charInString;
//   }
//   // check if character is in comment but not in string
//   if (CHAR === ";" && !charInString) {
//     charInComment = true;
//   }

//   if (CHAR === "\n") {
//     charInComment = false;
//   }

//   if (CHAR === "(") {
//     if (!charInString && !charInComment) {
//       if (!newLine) {
//         result += formatConfig.newLineString;
//       }
//       inArray = true;
//       result += formatConfig.indentString.repeat(openLists);
//       openLists += 1;
//       newLine = false;
//     }
//   }
// }
