const poorlyFormattedCode = `(define (poorly-formatted-function) (displayln "Hello,")
    (displayln "world!") )
( define (bad-indentation)  (add1 
      2) )
(define (unindented-function)
(println "This function"
"is unindented."))    (define (nested-indents) (define (nested-function) (+ 1 2))
  (define (another-nested) (list 1 2 3))
  (define (yet-another) (vector 1 2 3 4)))`;

const regexSeparateParentheses = /(\))\s*(\()|\((\s*)(\))/g;
const formattedCode1 = poorlyFormattedCode.replace(regexSeparateParentheses, "$1\n$2$3\n$4");

const regexSeparateNumbersOrLetters = /([a-zA-Z0-9])\s*(\))/g;
const formattedCode2 = formattedCode1.replace(regexSeparateNumbersOrLetters, "$1\n$2");

console.log(formattedCode2);
