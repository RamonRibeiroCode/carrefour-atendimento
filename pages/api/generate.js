import OpenAI from "openai";
import { context } from "../mocks/context";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });

    return;
  }

  const animal = req.body.animal || "";

  try {
    const completion = await openai.c({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0,
      max_tokens: 300,
    });

    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);

      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(question) {
  return `Answer the question based on the context below, 
          and if the question can't be answered based on the context, 
          say \"I don't know\"\n\n\"\n\n
          Context: ${context}\n\n---\n\n
          Question: ${question}\n
          Answer:`;
}
