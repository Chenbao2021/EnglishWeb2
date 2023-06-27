import { Configuration, OpenAIApi } from "openai";

const apiKey = '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';

const configuration = new Configuration({
    organization: "org-Ovu3qBCZD7NppxfJpDtbCggm",
    apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);
openai.api_key = apiKey

completion = openai.ChatCompletion.create(
  model = 'gpt-3.5-turbo',
  messages = [ 
    {'role': 'user', 'content': 'Tell me a joke!'}
  ],
  temperature = 0  
)

runPrompt();


