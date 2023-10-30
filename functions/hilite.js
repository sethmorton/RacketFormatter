import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    // Parse input from the client
    const { codeToFormat } = JSON.parse(event.body);
    const lexer = 'racket';
    const style = 'colorful';

    const codeToFormatSplit = codeToFormat.split('\n');
    let result = '';
    let i = 0;

    for await (const line of codeToFormatSplit) {
      i += 1;

      if (codeToFormatSplit.length > 50) {
        if (i % 10 === 0) {
          // run function every 50 iterations
          console.log(`Reached iteration ${i}`); 

          const code = codeToFormatSplit.slice(i - 10, i).join('\n');
          const response = await fetch(`http://hilite.me/api?code=${encodeURIComponent(code)}&lexer=${lexer}&style=${style}`);
          result += await response.text();
        }
      } else {
        const response = await fetch(`http://hilite.me/api?code=${encodeURIComponent(codeToFormat)}&lexer=${lexer}&style=${style}`);
        result += await response.text();
        break;
      }
    }

    return {
      statusCode: 200, 
      body: result,
      headers: { 'Content-Type': 'text/html' }
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Error fetching data from API'  
    };
  } finally {
    console.log('Done');
  }
};