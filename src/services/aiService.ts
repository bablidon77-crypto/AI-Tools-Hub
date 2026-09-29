export interface AIGenerateRequest {
  prompt: string;
  systemInstruction?: string;
  toolType?: string;
}

export interface AIGenerateResponse {
  success: boolean;
  result?: string;
  error?: string;
  message?: string;
  isConfigError?: boolean;
}

export async function requestAIGeneration(params: AIGenerateRequest): Promise<AIGenerateResponse> {
  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === 'API_KEY_NOT_CONFIGURED') {
        return {
          success: false,
          isConfigError: true,
          error: 'GEMINI_API_KEY is not configured on the server.',
          message: 'The AI generation feature requires a GEMINI_API_KEY environment variable. You can add it in your AI Studio Secrets or server environment.',
        };
      }
      return {
        success: false,
        error: data.error || 'Server error',
        message: data.message || 'An error occurred during AI processing.',
      };
    }

    return {
      success: true,
      result: data.result,
    };
  } catch (err: any) {
    // If backend is unreachable (e.g. static preview or network drop)
    return {
      success: false,
      isConfigError: false,
      error: 'NETWORK_ERROR',
      message: 'Could not communicate with the backend AI service. Please check your connection.',
    };
  }
}
