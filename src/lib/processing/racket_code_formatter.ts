// Interface to hold formatting configuration
interface FormatConfig {
  indentString: string;
  newLineString: string;
}

// Function to format Lisp code
export function formatLispCode(
  unformattedText: string,
  options: { insertSpaces: boolean; tabSize: number; endOfLine: string }
): string {
  console.log(unformattedText); // Log the unformatted text

  // Initialize formatting configuration
  const formatConfig: FormatConfig = { indentString: "", newLineString: "" };

  // Set indentation and new line characters based on options
  if (options.insertSpaces) {
    formatConfig.indentString = " ".repeat(options.tabSize);
  } else {
    formatConfig.indentString = "\t";
  }
  formatConfig.newLineString = options.endOfLine === "CRLF" ? "\r\n" : "\n";

  // Initialize variables for formatting
  let openLists = 0;
  let result = "";
  let newLine = true;
  let inArray = false;
  let commentActive = false;
  let stringActive = false;
  let charEscaped = false;

  // Check for '#lang racketscript' and process if found
  if (unformattedText.split("\n")[0].includes(" #lang racketscript")) {
    result += unformattedText.split("\n")[0].trim();
    unformattedText = unformattedText.substring(
      unformattedText.indexOf("\n") + 1
    );
  }

  const lines = unformattedText.split("\n");

  unformattedText = "";
  for (let line of lines) {
    line = line.replace(/\(\s+/g, "("); // Remove spaces after open parenthesis
    line = line.replace(/\s+\)/g, ")"); // Remove spaces before close parenthesis

    unformattedText += line;
  }

  console.log(unformattedText);

  // Iterate through each character in the unformatted text
  for (let i = 0; i < unformattedText.length; i++) {
    switch (unformattedText.charAt(i)) {
      case "[": // Add handling for '[' characters
        if (!stringActive && !commentActive) {
          if (!newLine) {
            result += formatConfig.newLineString;
          }
          inArray = true;
          result += formatConfig.indentString.repeat(openLists);
          openLists += 1;
          newLine = false;
        }
        result += unformattedText.charAt(i);
        break;
      case "]": // Add handling for ']' characters
        if (!stringActive && openLists > 0) {
          openLists -= 1;
        }
        result += unformattedText.charAt(i);
        break;
      case "#":
        if (
          !stringActive &&
          !commentActive &&
          i + 1 < unformattedText.length &&
          unformattedText.charAt(i + 1) === ":"
        ) {
          // Handle '#:' (such as #:when)
          result += formatConfig.newLineString;
          result += formatConfig.indentString.repeat(openLists);
          result += "#:";
          i++; // Skip the next character (':')
          newLine = false;
          break;
        }
      case "(":
        if (charEscaped) {
          charEscaped = false;
        } else if (!stringActive && !commentActive) {
          if (!newLine) {
            result += formatConfig.newLineString;
          }
          inArray = true;
          result += formatConfig.indentString.repeat(openLists);
          openLists += 1;
          newLine = false;
        }
        result += unformattedText.charAt(i);
        break;
      case ")":
        if (charEscaped) {
          charEscaped = false;
        } else if (!stringActive && openLists > 0) {
          // Reduce openLists count
          openLists -= 1;
        }
        result += unformattedText.charAt(i);
        break;
      case "\n":
      case "\r":
        newLine = true;
        result += unformattedText.charAt(i);
        inArray = false;
        commentActive = false;
        break;
      case " ":

      case "\t":
        if (
          i > 0 &&
          i < unformattedText.length - 1 &&
          (unformattedText.charAt(i - 1) === "(" ||
            unformattedText.charAt(i - 1) === ")") &&
          (unformattedText.charAt(i + 1) === "(" ||
            unformattedText.charAt(i + 1) === ")")
        ) {
          // Remove the space character
        } else if (inArray || commentActive || stringActive) {
          result += unformattedText.charAt(i);
        }
        break;

      case ";":
        if (charEscaped) {
          charEscaped = false;
        } else if (!stringActive) {
          commentActive = true;
        }
        result += unformattedText.charAt(i);
        break;
      case '"':
        if (charEscaped) {
          charEscaped = false;
        } else {
          stringActive = !stringActive;
        }
        result += unformattedText.charAt(i);
        break;
      case "\\":
        charEscaped = !charEscaped;
        result += unformattedText.charAt(i);
        break;

      default:
        if (charEscaped) {
          charEscaped = false;
        }
        result += unformattedText.charAt(i);
        newLine = false;
    }
  }
  console.log(result);

  return result; // Return the formatted code
}
