import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { codeToFormat } = JSON.parse(event.body); // Parse input from the client
    const lexer = 'racket';
    const style = 'colorful';

    const codeToFormatSplit = codeToFormat.split('\n');

    let resultPromises = [];

    for (let i = 0; i < codeToFormatSplit.length; i += 50) {
    
      let codeSplitJoined = (codeToFormatSplit.slice(i, i + 50)).join('\n');
      
      const response = await fetch(`http://hilite.me/api?code=${encodeURIComponent(codeSplitJoined)}&lexer=${lexer}&style=${style}`);
      
      resultPromises.push(response.text());
      
    }
    try {

      const results = await Promise.all(fetchPromises);
      
      const result = results.join('');
    
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


