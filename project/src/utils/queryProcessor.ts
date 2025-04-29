import { ModelSettings, QueryResponse } from '../types';

// Configuration for Ollama
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
// const BASH_COMMAND_PATTERN = "\b[a-zA-Z0-9_]+\b";
const NON_TECHNICAL_KEYWORDS = [
    'weather', 'sport', 'movie', 'music', 'food', 'restaurant', 'travel',
    'holiday', 'vacation', 'shopping', 'news', 'politics'
];

let HISTORY_PATTERN: string[] = [];

export const processQuery = async (query: string, settings: ModelSettings): Promise<QueryResponse> => {

    const normalizedQuery = query.toLowerCase();

    
    if (NON_TECHNICAL_KEYWORDS.some(keyword => normalizedQuery.includes(keyword))) {
        return {
            content: "Je ne réponds qu'aux questions techniques liées à l'informatique.",
            isRedirect: false,
        };
    }

    HISTORY_PATTERN.push(query);

    if (isRepeatedQuery(query, HISTORY_PATTERN)) {
        return {
            content: "Cette question a déjà été posée. Veuillez consulter l'historique de la conversation.",
            isRedirect: false,
        };
    }

    if (isBashCommand(normalizedQuery)) {
        return {
            content: `Consultez le manuel avec: man ${normalizedQuery}`,
            isRedirect: false,
        };
    }   

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
    
    try {

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
    const { response: raw } = await response.json();

    const cleanedContent = raw.replace(/<\/?think>/gi, '').trim();
    return {
        content: cleanedContent,
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

const checkIfSimpleQuery = (query: string, threshold: string): boolean => {
    const simpleIndicators = [
        'what is', 'who is', 'where is', 'when is', 'how to', 
        'define', 'meaning of', 'weather in', 'capital of', 'population of',
        'explain', 'example of', 'list of', 'steps to', 'why is', 
        'history of', 'facts about', 'distance to', 'time in', 'recipe for',
        'benefits of', 'uses of', 'difference between', 'symptoms of', 
        'causes of', 'treatment for', 'how does', 'how much', 'how many',
        'types of', 'advantages of', 'disadvantages of', 'origin of', 
        'purpose of', 'importance of', 'process of', 'function of',
    ];

    const wordCount = query.split(' ').length;
    const hasSimpleIndicator = simpleIndicators.some(indicator => 
        query.toLowerCase().includes(indicator)
    );
    
    const thresholdMultiplier = threshold === 'high' ? 1.5 : 
                                threshold === 'medium' ? 1 : 0.5;
    
    return (wordCount < 6 * thresholdMultiplier) && hasSimpleIndicator;
};



// Immediately handle very simple queries without calling DeepSeek
function isBashCommand(cmdName: string): boolean {
    if (/\s/.test(cmdName.trim())) return false;

    // Accept typical patterns for CLI commands
    const pattern = /^[a-z0-9._-]+$/;
    if (!pattern.test(cmdName)) return false;

    // Quick lookup against a list of common Unix commands
    const COMMON_COMMANDS = new Set<string>([
        'ls', 'cd', 'pwd', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch',
        'cat', 'echo', 'grep', 'find', 'chmod', 'chown', 'curl', 'wget',
        'tar', 'zip', 'unzip', 'head', 'tail', 'less', 'more', 'du', 'df',
        'ps', 'top', 'kill', 'ssh', 'scp', 'sed', 'awk', 'nano', 'vim',
        'git', 'docker', 'systemctl', 'service', 'apt', 'yum', 'pip',
        'npm', 'node'
    ]);

    return COMMON_COMMANDS.has(cmdName);
}

function isRepeatedQuery(query: string, history: ChatHistoryItem[]): boolean {
    return history.some(item => 
        item.query.toLowerCase().trim() === query.toLowerCase().trim()
    );
}
  
