import { useRef, useState, useEffect } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
const App = () => {
  
  // variáveis de ambiente
  const apiUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;
  const botId = import.meta.env.VITE_BOT_ID;
  const service = import.meta.env.VITE_SERVICE;
  
  // Variáveis de estado
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  // ajudar a função a atualizar o chat
  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Digitando..."), {role: "model", text, isError}]);
    }

    // Formato de histórico p requisição da API
    history = history.map(({role, text}) => ({role, parts: [{ text }]}))

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        prompt: history.length > 0 ? history[history.length - 1].parts[0].text : "", // Última mensagem do usuário
        projectid: botId,
        service: service,
        clientid: apiKey,
      })
    }

    try {
      // 1. Requisição para a API
      const response = await fetch(apiUrl, requestOptions);
      // 2. Processamento da resposta
      const data = await response.json();
      // 3. Verificação de erros na resposta
      if (!response.ok) {
        const errorText = data.error || data.message || "Erro na API da Stec";
        throw new Error(errorText);
      } 

      // 4. Atualização do histórico com a resposta do bot
      const botResponse = data.text || "Resposta da Stec nao encontrada.";
      updateHistory(botResponse);

      console.log(data)
      // 5. Se ocorrer um erro na requisição ou no processamento, 
      // este bloco é executado
    } catch (error) {
      updateHistory(error.message, true);
      console.error("Erro ao gerar resposta do bot:", error);
    }

  };

  // Atualizar o scroll da caixa de mensagens automaticamente
  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  }, [chatHistory]);

  return (
    <div className={`container ${ showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot(prev => !prev )} id="chatbot-toggler">
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon/>
            <h2 className="logo-text">TourGenius</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev )} className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon/>
            <p className="message-text">
              Oi, sou TourGenius! <br/> Como posso te ajudar hj?
            </p>
          </div>

          {/* Renderização dinâmica do histórico de msg */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}

        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>
      </div>
    </div>
  );
};

export default App;