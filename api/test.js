const { Ollama } = require('ollama'); // Or `import { Ollama } from 'ollama';`

const ollama = new Ollama();

(async () => {
  try {
    const response = await ollama.chat({
      model: 'llama3.2:1b',
      messages: [{ role: 'user', content: 'Hello!' }],
    });
    console.log(response.message.content);
  } catch (error) {
    console.error('Error:', error);
  }
})();
