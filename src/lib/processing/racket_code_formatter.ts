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
  /**
   * This is the indent level of each line - tracking based on parens and brackets
   */
  let indentLevel = 0;
  /**
   * # of Open Parentheses
   */
  let openParen = 0;
  /**
   * # of Open Brackets
   */
  let openBracket = 0;

  let charInSingleLineComment = false;
  let charInMultiLineComment = false;
  let charInString = false;
  let newLine = false;

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
            if (nextChar !== "\n") {
              result += "\n";
            }
            
          } else if (nextChar == "#") {
            result += char;
          }
          break;
        }
        result += char;

      case ";":
        if (!charInString && !charInMultiLineComment) {
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
            // check if the previous character is a new line
            const previousNewLine = () => {
              // loop through the string backwards until we find the previous parentheses, if we find a non-whitespace character, then we return false
              let i = index - 1;
              while (i >= 0) {
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
            // if the previous character is a new line, then we need to add the indentation
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
          if ((lastChar == ")" || lastChar == "]") && (nextChar == "(" || nextChar == "[")) {
            break;
          }
          if ((lastChar == ")" || lastChar == "]") && (nextChar == ")" || nextChar == "]")) {
            break;
          }
          if ((lastChar == "(" || lastChar == "(") && (nextChar == "(" || nextChar == "(")) {
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
        if (
          subIndent == 2 &&
          subIndentArray[1] == 2 &&
          subIndentArray.length == 4
        ) {
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
        };

        if (findPreviousParentheses()) {
          result += "\n";
          result += " ".repeat(formatConfig.tabSize).repeat(indentLevel);
          result += char;
          break;
        }

        if (lastChar.match(/\w|\d/)) {
          result += " ";
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