import React from 'react'
import ReactDOM from 'react-dom/client'
import 'regenerator-runtime'
import App from './App.tsx'
import './index.css'
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient({
})

ReactDOM.createRoot(document.getElementById('invoice-ai-container') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
        </QueryClientProvider>
    </React.StrictMode>,
)
