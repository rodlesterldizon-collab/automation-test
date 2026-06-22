const { Groq } = require('groq-sdk');

class GroqCustomProvider {
  constructor(options) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set.");
    }
    // Initialize the Groq client
    this.groq = new Groq({ apiKey });
    // Use the model provided in config or fallback to groq/compound-mini
    this.modelName = options.config?.model || "groq/compound-mini";
  }

  id() {
    return `groq-custom:${this.modelName}`;
  }

  async callApi(prompt, context) {
    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        model: this.modelName,
        temperature: 0, // Set to 0 for deterministic testing
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false, // Promptfoo expects the full result returned
        compound_custom: {
          tools: {
            enabled_tools: [
              "web_search",
              "code_interpreter",
              "visit_website"
            ]
          }
        }
      });

      const content = chatCompletion.choices[0]?.message?.content || "";
      
      return {
        output: content,
        tokenUsage: {
          total: chatCompletion.usage?.total_tokens,
          prompt: chatCompletion.usage?.prompt_tokens,
          completion: chatCompletion.usage?.completion_tokens,
        }
      };
    } catch (error) {
      console.error("Groq API Error:", error);
      return {
        error: `Groq API call error: ${error.message}`
      };
    }
  }
}

module.exports = GroqCustomProvider;
