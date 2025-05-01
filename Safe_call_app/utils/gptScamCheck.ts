export const checkForScam = async (text: string): Promise<string> => {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Is the following message a scam? Respond with "Scam" or "Safe". Message: "${text}"`,
          },
        ],
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? 'Unknown';
  } catch (err) {
    console.error('GPT Scam Check Error:', err);
    return 'Unknown';
  }
};
