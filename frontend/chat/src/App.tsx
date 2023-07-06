import styled from "styled-components";
import billy from "./assets/billy.png";
import {FormEvent, useCallback, useState} from "react";
import {ArrowRight, X} from "react-feather";
import {useMutation} from "react-query";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


const AssistantWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
`

const AssistantButton = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 5px 10px 50px #007bff;
  scale: 70%;
`

const Chat = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  border-radius: 10px 10px 4px 4px;
  min-height: calc(60vh + 32px);
  box-shadow: 5px 10px 50px #007bff55;
`

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 20px;
  padding: 5px 10px;
  background-color: #007bff;
  border-radius: 10px 10px 0 0;
  color: white;
`

const ChatWindow = styled.form`
  border: solid #007bff;
  border-width: 0 2px 2px;
  border-radius: 0 0 4px 4px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`

const ChatConversation = styled.div`
  display: flex;
  flex-grow: 2;
  background-color: #eee;
  padding: 10px 10px;
`

const ChatTextArea = styled.textarea`
  display: flex;
  flex-grow: 1;
  margin: 0;
  outline: 0;
  font-family: Verdana, serif;
  font-size: 14px;
`

const Exit = styled(X)`
  cursor: pointer;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #007bff44;
  border-radius: 10px;
`

function App() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const toggleChat = useCallback(() => {
        setIsChatOpen(!isChatOpen)
    }, [isChatOpen])

    const [prompt, setPrompt] = useState('')

    const mutation = useMutation<{ message: string }, {}, { prompt: string }>({
        mutationFn: ({ prompt }) => {
            return axios.post('http://localhost/api/assistant', { prompt })
        },
    })

    const {
        transcript,
        listening,
        resetTranscript,
    } = useSpeechRecognition();

    const onSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault()
        await mutation.mutateAsync({
            prompt,
        })
    }, [prompt])

    return (
        <AssistantWrapper>
            {isChatOpen &&
                <Chat>
                    <ChatHeader>
                        <div>Chat with Billy</div>
                        <div onClick={toggleChat}><Exit/></div>
                    </ChatHeader>
                    <ChatWindow onSubmit={onSubmit}>
                        <ChatConversation>
                            Hey! How can I help?
                        </ChatConversation>
                        <div style={{width: '100%'}}>
                            <p>Microphone: {listening ? 'on' : 'off'}</p>
                            <button onClick={() => SpeechRecognition.startListening({continuous: true})}>Start</button>
                            <button onClick={() => {
                                SpeechRecognition.stopListening();
                                setPrompt(transcript ?? '');
                            }}>Send</button>
                            <button onClick={resetTranscript}>Reset</button>
                            <ChatTextArea style={{width: '340px', height: '90px'}}
                              placeholder="Click 'start' and speak. Click 'send' when ready."
                              value={transcript}
                            />
                        </div>
                        <ChatTextArea
                            placeholder="I want to ..."
                            onChange={(e: any) => setPrompt(e.target.value ?? '')}
                        />
                        <Button>Send<ArrowRight size={16}/></Button>
                    </ChatWindow>
                </Chat>
            }
            {isChatOpen ||
                <AssistantButton src={billy} onClick={toggleChat}/>
            }
        </AssistantWrapper>
    )
}

export default App
