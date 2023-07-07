import styled from "styled-components";
import { FormEvent, useCallback, useState } from "react";
import { ArrowRight, X } from "react-feather";
import { useMutation } from "react-query";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import * as React from "react";

const AssistantWrapper = styled.div`
  position: fixed;
  bottom: 66px;
  right: 2px;
  z-index: 1000;
`;

const AssistantButton = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 5px 10px 50px #007bff;
  scale: 70%;
`;

const Chat = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  border-radius: 10px 10px 4px 4px;
  min-height: calc(60vh + 32px);
  box-shadow: 5px 10px 50px #007bff55;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 20px;
  padding: 5px 10px;
  background-color: #007bff;
  border-radius: 10px 10px 0 0;
  color: white;
`;

const ChatWindow = styled.form`
  border: solid #007bff;
  border-width: 0 2px 2px;
  border-radius: 0 0 4px 4px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const ChatConversation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 2;
  background-color: #eee;
  padding: 10px 10px;
  max-height: 50vh;
  overflow: scroll;
`;

const ChatTextArea = styled.textarea`
  display: flex;
  flex-grow: 1;
  margin: 0;
  outline: 0;
  font-family: Verdana, serif;
  font-size: 14px;
`;

const Exit = styled(X)`
  cursor: pointer;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #007bff44;
  border-radius: 10px;
`;

const AssistantMessage = styled.div`
  text-align: left;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  line-height: 18px;
`;

const ClientMessage = styled.div`
  text-align: right;
  background-color: lightblue;
  border-radius: 10px;
  padding: 10px;
  line-height: 18px;
`;

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversation, setConversation] = useState<any>([]);
  const [conversationId, setConversationId] = useState("");

  const toggleChat = useCallback(() => {
    setIsChatOpen(!isChatOpen);
  }, [isChatOpen]);

  const [prompt, setPrompt] = useState("");

  const mutation = useMutation<{ message: string }, {}, { prompt: string }>({
    mutationFn: ({ prompt }) => {
      return axios.post("https://assistant.ageras.com/api/assistant", { prompt });
    },
  });

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (prompt) {
        const result = (await mutation.mutateAsync({
          prompt,
        })) as any;
        window.localStorage.setItem(
          "conversation_id",
          result?.data?.conversation_id || ""
        );
        setConversationId(result?.data?.conversation_id);
      }
    },
    [prompt]
  );

  React.useEffect(() => {
    const getMessages = async () => {
      const conversation_id = window.localStorage.getItem("conversation_id");
      if (conversation_id) {
        const messages = (await axios.get(
          `https://assistant.ageras.com/api/assistant/?conversation_id=${conversation_id}`
        )) as any;
        setConversation(messages?.conversation || []);

        return messages;
      }
    };
    getMessages();
  }, [conversationId]);

  return (
    <AssistantWrapper>
      {isChatOpen && (
        <Chat>
          <ChatHeader>
            <div>Chat with Billy</div>
            <div onClick={toggleChat}>
              <Exit />
            </div>
          </ChatHeader>
          <ChatWindow onSubmit={onSubmit}>
            <ChatConversation>
              <AssistantMessage>Hey! How can I help?</AssistantMessage>
              {conversation
                .sort((a: any, b: any) => a.created.localeCompare(b.created))
                .map((message: any) => {
                  return (
                    <div style={{ display: "flex" }}>
                      {message.role === "assistant" && (
                        <AssistantMessage>{message.content}</AssistantMessage>
                      )}
                      {message.role === "client" && (
                        <ClientMessage>{message.content}</ClientMessage>
                      )}
                    </div>
                  );
                })}
            </ChatConversation>
            <div style={{ width: "100%" }}>
              <p>Microphone: {listening ? "on" : "off"}</p>
              <button
                onClick={() =>
                  SpeechRecognition.startListening({ continuous: true })
                }
              >
                Start
              </button>
              <button
                onClick={() => {
                  SpeechRecognition.stopListening();
                  setPrompt(transcript ?? "");
                }}
              >
                Send
              </button>
              <button onClick={resetTranscript}>Reset</button>
              <ChatTextArea
                style={{ width: "340px", height: "90px" }}
                placeholder="Click 'start' and speak. Click 'send' when ready."
                value={transcript}
              />
            </div>
            <ChatTextArea
              placeholder="I want to ..."
              onChange={(e: any) => setPrompt(e.target.value ?? "")}
            />
            <Button>
              Send
              <ArrowRight size={16} />
            </Button>
          </ChatWindow>
        </Chat>
      )}
      {isChatOpen || (
        <AssistantButton
          src="data:image/png;base64,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"
          onClick={toggleChat}
        />
      )}
    </AssistantWrapper>
  );
}

export default App;
