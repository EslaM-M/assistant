<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class OpenAI
{
    private PendingRequest $client;

    public function __construct(string $apiToken)
    {
        $this->client = Http::baseUrl('https://api.openai.com')
            ->withHeaders([
                'Authorization' => 'Bearer ' . $apiToken,
            ]);
    }

    public function sendPrompt(string $prompt)
    {
        $response = $this->client->post('/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => file_get_contents(resource_path('system-message.txt')),
                ],
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
            'temperature' => 0.7,
            'max_tokens' => 150,
            'top_p' => 1.0,
            'frequency_penalty' => 0.2,
            'presence_penalty' => 0.0,
            'stream' => false,
        ]);

        return $response;
    }
}
