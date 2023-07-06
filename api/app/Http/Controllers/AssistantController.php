<?php

namespace App\Http\Controllers;

use App\Http\Requests\AssistantRequest;
use App\Services\OpenAI;

class AssistantController extends Controller
{
    private OpenAI $openai;

    public function __construct(OpenAI $openai)
    {
        $this->openai = $openai;
    }

    public function store(AssistantRequest $request)
    {
        $response = $this->openai->sendPrompt($request->validated('prompt'));

        // return json_decode($response->json('choices.0.message.content'));
        return $response->json('choices.0.message.content');
    }
}
