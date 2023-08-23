// Interface to hold formatting configuration
interface FormatConfig {
  insertSpaces: boolean;
  tabSize: number;
}

/**
 *
 * @param {string} unformattedText
 */
export function formatRacket (unformattedText: string, formatConfig: FormatConfig): string {
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
  let subIndentArray: number[] = [];
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

          //result += indentLevel
          charInSingleLineComment = true;
          result += "\n";
          if (indentLevel == 0) {
            result += " ".repeat(formatConfig.tabSize).repeat(openParen);
          } else {
            result += " ".repeat(formatConfig.tabSize).repeat(indentLevel);
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
              //console.log(index);
              while (i >= 0) {
                //console.log(i);
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
            result += " ".repeat(formatConfig.tabSize).repeat(indentLevel);
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
        //console.log(subIndentArray);
        if (
          subIndent == 2 &&
          subIndentArray[1] == 2 &&
          subIndentArray.length == 4
        ) {
          lineSplit = true;
          subIndentArray = [];
          subIndent = 0;
          //console.log(subIndentArray, "ARRAY RESET?");
          indentLevel += 1;
          //result += indentLevel;
          result += "\n";
          result += " ".repeat(formatConfig.tabSize).repeat(indentLevel);
          result += char;
          break;
        }

        const findPreviousParentheses = () => {
          // loop through the string backwards until we find the previous parentheses, if we find a non-whitespace character, then we return false
          // if we find a parentheses, then we return true
          let i = index - 1;
          //console.log(index);

          while (i >= 0) {
            //console.log(i);
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
          //   //console.log(i);
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
          result += " ".repeat(formatConfig.tabSize).repeat(indentLevel);
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
          //console.log("SUB INDENT 0");
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
            //console.log(i);
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
  };
  return result;
};
// // Function to format Lisp code
// export function formatLispCode(
//   unformattedText: string,
//   options: { insertSpaces: boolean; tabSize: number; endOfLine: string }
// ): string {
//   //console.log(unformattedText); // Log the unformatted text

//   // Initialize formatting configuration
//   const formatConfig: FormatConfig = { indentString: "", newLineString: "" };

//   // Set indentation and new line characters based on options
//   if (options.insertSpaces) {
//     formatConfig.indentString = " ".repeat(options.tabSize);
//   } else {
//     formatConfig.indentString = "\t";
//   }
//   formatConfig.newLineString = options.endOfLine === "CRLF" ? "\r\n" : "\n";

//   // Initialize variables for formatting
//   let openLists = 0;
//   let result = "";
//   let newLine = true;
//   let inArray = false;
//   let commentActive = false;
//   let charInString = false;
//   let charEscaped = false;

//   // Check for '#lang racketscript' and process if found
//   const linesArray = unformattedText.split('\n'); 

//   // Filter out empty lines
//   const linesWithoutEmpty = linesArray.filter((line) => !line.match(/^\s*$/));
  
//   // Loop through lines to detect comments and language specifier
//   const cleanedLines = linesWithoutEmpty.map((line) => {

//     line = line.replace(/\(\s+/g, "("); // Remove spaces after open parenthesis
//     line = line.replace(/\s+\)/g, ")"); 
//     // Return #lang directive
//     if (line.match(/^\s*(\#lang)/)) {
//       return line.trim();
//     }
    
//     // Return multiline comment blocks and trim initial whitespace
//     if (line.match(/^\s*(\#\|)/) || line.match(/^\s*(\|\#)/)) {
//       return line.trim(); 
//     }
//     // if there is white space after the opening parenthesis
//     if (line.match(/\(\s+/)) {
//       return line.replace(/\(\s+/g, "("); // Remove spaces after open parenthesis
//     }

  
//     // Return other lines unchanged
//     return line;
//   });

//   result += cleanedLines.join('\n');
//   //console.log(result);
  


//   //console.log(unformattedText);

//   // Iterate through each character in the unformatted text
//   for (let i = 0; i < unformattedText.length; i++) {
//     switch (unformattedText.charAt(i)) {
//       case "[": // Add handling for '[' characters
//         if (!charInString && !commentActive) {
//           if (!newLine) {
//             result += formatConfig.newLineString;
//           }
//           inArray = true;
//           result += formatConfig.indentString.repeat(openLists);
//           openLists += 1;
//           newLine = false;
//         }
//         result += unformattedText.charAt(i);
//         break;
//       case "]": // Add handling for ']' characters
//         if (!charInString && openLists > 0) {
//           openLists -= 1;
//         }
//         result += unformattedText.charAt(i);
//         break;
//       case "#":
//         if (
//           !charInString &&
//           !commentActive &&
//           i + 1 < unformattedText.length &&
//           unformattedText.charAt(i + 1) === ":"
//         ) {
//           // Handle '#:' (such as #:when)
//           result += formatConfig.newLineString;
//           result += formatConfig.indentString.repeat(openLists);
//           result += "#:";
//           i++; // Skip the next character (':')
//           newLine = false;
//           break;
//         }
//       case "(":
//         if (charEscaped) {
//           charEscaped = false;
//         } else if (!charInString && !commentActive) {
//           if (!newLine) {
//             result += formatConfig.newLineString;
//           }
//           inArray = true;
//           result += formatConfig.indentString.repeat(openLists);
//           openLists += 1;
//           newLine = false;
//         }
//         result += unformattedText.charAt(i);
//         break;
//       case ")":
//         if (charEscaped) {
//           charEscaped = false;
//         } else if (!charInString && openLists > 0) {
//           // Reduce openLists count
//           openLists -= 1;
//         }
//         result += unformattedText.charAt(i);
//         break;
//       case "\n":
//       case "\r":
//         newLine = true;
//         result += unformattedText.charAt(i);
//         inArray = false;
//         commentActive = false;
//         break;
//       case " ":

//       case "\t":
//         if (
//           i > 0 &&
//           i < unformattedText.length - 1 &&
//           (unformattedText.charAt(i - 1) === "(" ||
//             unformattedText.charAt(i - 1) === ")") &&
//           (unformattedText.charAt(i + 1) === "(" ||
//             unformattedText.charAt(i + 1) === ")")
//         ) {
//           // Remove the space character
//         } else if (inArray || commentActive || charInString) {
//           result += unformattedText.charAt(i);
//         }
//         break;

//       case ";":
//         if (charEscaped) {
//           charEscaped = false;
//         } else if (!charInString) {
//           commentActive = true;
//         }
//         result += unformattedText.charAt(i);
//         break;
//       case '"':
//         if (charEscaped) {
//           charEscaped = false;
//         } else {
//           charInString = !charInString;
//         }
//         result += unformattedText.charAt(i);
//         break;
//       case "\\":
//         charEscaped = !charEscaped;
//         result += unformattedText.charAt(i);
//         break;

//       default:
//         if (charEscaped) {
//           charEscaped = false;
//         }
//         result += unformattedText.charAt(i);
//         newLine = false;
//     }
//   }
//   //console.log(result);

//   return result; // Return the formatted code
// }
