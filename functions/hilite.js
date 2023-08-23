import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { codeToFormat } = JSON.parse(event.body); // Parse input from the client
    const lexer = 'racket';
    const style = 'colorful';

    const codeToFormatSplit = codeToFormat.split('\n');
    let result = '';
    let i = 0;
    for (const line of codeToFormatSplit) {
      i += 1;
      if (i % 50 === 0) {
        // run function every 50 iterations
        console.log(`Reached iteration ${i}`); 

       const code = codeToFormatSplit.slice(i - 50, i).join('\n');

        const response = await fetch(`http://hilite.me/api?code=${encodeURIComponent(code)}&lexer=${lexer}&style=${style}`);
        result += await response.text();
      }
    }
    try {

    
      return {
        statusCode: 200, 
        body: result,
        headers: { 'Content-Type': 'text/html' }
      };
    
    } catch (error) {
    
      return {
        statusCode: 500,
        body: 'Error fetching data from API'  
      };
    
    }
    finally {
      console.log('Done');
    }
}
catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};


