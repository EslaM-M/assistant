<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Assistant</title>
    </head>
    <body>
        <form action="/api/assistant" method="post" style="display: flex; flex-direction: column; align-items: center; gap: 30px">
            <textarea
                name="prompt"
                placeholder="I want to ..."
                style="width: 800px; height: 200px"
            >Invoice Billy ApS for 10 hours of work and 4 liters of white paint with a total price of 1000 DKK</textarea>
            <button type="submit" style="width: 200px; height: 50px;">GO!</button>
            <div>
                <pre>
                    {!! Session::get('openai_response') !!}
                </pre>
            </div>
        </form>
    </body>
</html>
