import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Ally1.0!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "curie:ft-personal-2023-03-09-17-11-32",
      prompt: `${prompt}`,
      temperature: 0.2,
      max_tokens: 100,
      top_p: 1,
      n: 1,
      frequency_penalty: 0.65,
      presence_penalty: 0.2,
      stop: ["You:"],
    });
    
    const allyResponse = response.data.choices[0].text;
    const allyResponseLines = allyResponse.split('\n');

    res.status(200).send({
      Ally: allyResponseLines[1]
    });    

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))