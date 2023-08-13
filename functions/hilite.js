const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  try {
    const { codeToFormat } = JSON.parse(event.body); // Parse input from the client
    const lexer = 'python';
    const style = 'colorful';

    const response = await fetch(`http://hilite.me/api?code=${encodeURIComponent(codeToFormat)}&lexer=${lexer}&style=${style}`);
    const htmlContent = await response.text();

    return {
      statusCode: 200,
      body: htmlContent,
      headers: {
        'Content-Type': 'text/html',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error fetching data from the API',
    };
  }
};
