import { ModelSettings, QueryResponse } from '../types';

// Configuration for Ollama
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
export const processQuery = async (query: string, settings: ModelSettings): Promise<QueryResponse> => {
    try {

        // Call Ollama API
        let response;
        try {
            response = await fetch(OLLAMA_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-r1:7b',
                    prompt: query,
                    temperature: settings.temperature,
                    max_tokens: settings.maxTokens,
                    stream: false
                }),
            });
        } catch (networkError) {
            console.error('Network error:', networkError);
            throw new Error('Network error: Unable to connect to Ollama API. Please check your network or server status.');
        }

    if (!response.ok) {
        throw new Error('Failed to connect to Ollama');
    }

    const result = await response.json();
    
    // Check if query is simple based on settings
    const isSimpleQuery = checkIfSimpleQuery(query, settings.simplifyThreshold);
    const isVerySimpleQuery = isSimpleQuery && settings.simplifyThreshold !== 'low';
    
    if (isVerySimpleQuery) {
        const googleSearchUrl = `https://letmegooglethat.com/?q=${encodeURIComponent(query)}`;
        return {
            content: "This question is very simple and can be easily found on the internet. Let me help you search for it:",
            isRedirect: true,
            redirectUrl: googleSearchUrl
        };
        } else if (isSimpleQuery) {
        return {
            content: "This question could be easily answered by searching on the internet. I'd recommend checking there first for basic information like this.",
            isRedirect: false
        };
    }

    return {
        content: result.response,
        isRedirect: false
        };  
    } catch (error) {
        console.error('Error calling Ollama:', error);
        return {
        content: "Sorry, I couldn't connect to Ollama. Please ensure Ollama is running and the DeepSeek model is loaded (`ollama run deepseek`).",
        isRedirect: false
        };
    }
};

// Helper function to determine if a query is "simple"
const checkIfSimpleQuery = (query: string, threshold: string): boolean => {
    const simpleIndicators = [
        'what is', 'who is', 'where is', 'when is', 'how to', 
        'define', 'meaning of', 'weather in', 'capital of', 'population of',
        'explain', 'example of', 'list of', 'steps to', 'why is', 
        'history of', 'facts about', 'distance to', 'time in', 'recipe for',
        'benefits of', 'uses of', 'difference between', 'symptoms of', 
        'causes of', 'treatment for', 'how does', 'how much', 'how many',
        'types of', 'advantages of', 'disadvantages of', 'origin of', 
        'purpose of', 'importance of', 'process of', 'function of'
    ];
    
    const wordCount = query.split(' ').length;
    const hasSimpleIndicator = simpleIndicators.some(indicator => 
        query.toLowerCase().includes(indicator)
    );
    
    const thresholdMultiplier = threshold === 'high' ? 1.5 : 
                                threshold === 'medium' ? 1 : 0.5;
    
    return (wordCount < 6 * thresholdMultiplier) && hasSimpleIndicator;
};