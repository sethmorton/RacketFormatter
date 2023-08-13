interface FormatConfig {
    indentString: string;
    newLineString: string;
}

export function formatLispCode(unformattedText: string, options: { insertSpaces: boolean; tabSize: number; endOfLine: string }): string {

    console.log(unformattedText);
    
    const formatConfig: FormatConfig = { indentString: '', newLineString: '' };
    
    if (options.insertSpaces) {
        formatConfig.indentString = " ".repeat(options.tabSize);
    } else {
        formatConfig.indentString = "\t";
    }

    formatConfig.newLineString = options.endOfLine === 'CRLF' ? "\r\n" : "\n";

    let openLists = 0;
    let result = "";
    let newLine = true;
    let inArray = false;
    let commentActive = false;
    let stringActive = false;
    let charEscaped = false;

    for (let i = 0; i < unformattedText.length; i++) {
        switch (unformattedText.charAt(i)) {
            case '(':
                if (charEscaped) {
                    charEscaped = false;
                }
                else if (!stringActive && !commentActive) {
                    if (!newLine) {
                        result += formatConfig.newLineString;
                    }
                    inArray = true;
                    console.log(openLists);
                    
                    result += formatConfig.indentString.repeat(openLists);
                    openLists += 1;
                    newLine = false;
                }
                result += unformattedText.charAt(i);
                break;
                case ')':
                    if (charEscaped) {
                        charEscaped = false;
                    }
                    else if (!stringActive && openLists > 0) { // Add this check
                        openLists -= 1;
                    }
                    result += unformattedText.charAt(i);
                    break;
                
                
                
                
            case '\n':
            case '\r':
                newLine = true;
                result += unformattedText.charAt(i);
                inArray = false;
                commentActive = false;
                break;
            case ' ':
            case '\t':
                if (inArray || commentActive || stringActive) {
                    result += unformattedText.charAt(i);
                }
                break;
            case ';':
                if (charEscaped) {
                    charEscaped = false;
                }
                else if (!stringActive) {
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
            case '\\':
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

    return result;
}

