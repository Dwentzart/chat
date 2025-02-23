import { useState } from "react";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);

        const response = await fetch("https://dwentz.gaia.domains/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3.2",
                messages: [{ role: "user", content: input }],
                max_tokens: 512
            })
        });

        const data = await response.json();
        setMessages([...newMessages, { role: "assistant", content: data.choices[0].message.content }]);
        setInput("");
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-lg">
            <div className="h-96 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`p-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
                    </div>
                ))}
            </div>
            <div className="flex mt-4">
                <input 
                    type="text" 
                    className="flex-1 border p-2" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                />
                <button className="bg-blue-500 text-white p-2 ml-2" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}
