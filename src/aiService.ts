import OpenAI, { Configuration } from 'openai';

// Set up the OpenAI configuration with your API key
const configuration = new Configuration({
  apiKey: 'YOUR_OPENAI_API_KEY',  // Replace with your actual OpenAI API key
});

// Create an instance of OpenAI
const openai = new OpenAI(configuration);

// Function to analyze email content
export const analyzeEmailContent = async (content: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Analyze this email content and categorize it.' },
        { role: 'user', content },
      ],
    });

    const result = response.data.choices[0].message.content.trim().toLowerCase();
    return result;
  } catch (error) {
    console.error('Error analyzing email content:', error);
    throw error;
  }
};

// Function to generate email reply
export const generateEmailReply = async (category: string, content: string) => {
  try {
    let prompt = '';
    if (category === 'interested') {
      prompt = 'Write a response inviting the sender to a demo call.';
    } else if (category === 'not interested') {
      prompt = 'Write a polite response acknowledging their lack of interest.';
    } else if (category === 'more information') {
      prompt = 'Write a response asking for more information.';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content },
      ],
    });

    const reply = response.data.choices[0].message.content.trim();
    return reply;
  } catch (error) {
    console.error('Error generating email reply:', error);
    throw error;
  }
};
