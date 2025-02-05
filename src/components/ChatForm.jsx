import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";


        // atualização do chat com a msg do usuário
        setChatHistory((history) => [...history, {role: "user", text: userMessage }]);

        // dps de 600ms mostrando "digitando" mostra a resposta do bot
        setTimeout(() => {
            //Resposta do bot no lugar de digitando
            setChatHistory((history) => [...history, {role: "model", text: "Digitando..." }]);
        
            //chamando a função q vai gerar a resposta do bot
            generateBotResponse([...chatHistory, {role: "user", text: userMessage }]);
        }, 600);

    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Digite sua dúvida" className="message-input" required />
            <button className="material-symbols-outlined">arrow_upward</button>
        </form>
    );
};

export default ChatForm;