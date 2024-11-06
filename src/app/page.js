"use client"
import
 { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };
// Updated handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  if (isLoading || !userInput) return;

  setMessages([...messages, { text: userInput, sender: "user" }]);
  setUserInput("");
  setIsLoading(true);

  fetchResponse(); // Call a function to fetch response without setTimeout.
};

const fetchResponse = async () => {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Your 3s loading delay

  try {
    const res = await fetch("/api/chat", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: userInput }),
    });
    const data = await res.json();
    setMessages(prev => [...prev, { text: data.response, sender: "ai" }]);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-100">
      <div className="flex-1 overflow-auto mb-4">
        <div>
          {messages.map((message, index) => (
            <>
            <div
              key={index}
              className={`${
                message.sender === "user" ? "text-right" : "text-left"
              } p-2 rounded-lg max-w-md mx-auto`}
            >
              <div
                className={`${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                } p-2 rounded-lg shadow-md text-wrap overflow-hidden`} 
              >
               {message.text}
              </div>
            </div>
            </>
          ))}
          {isLoading && ( 
            <div className="text-center flex flex-col gap-2">    
              <div className="inline-block h-4 w-[450px] mx-auto animate-pulse bg-gray-300 rounded-md"></div>
              <div className="inline-block h-4 w-[450px] mx-auto animate-pulse bg-gray-300 rounded-md"></div>
              <div className="inline-block h-4 w-[450px] mx-auto animate-pulse bg-gray-300 rounded-md"></div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <textarea
          value={userInput}
          onChange={handleInputChange}
          className="flex-1 p-2 border rounded-l-lg text-gray-700" 
          placeholder="Ask a question..."
          disabled={isLoading}
          
        ></textarea>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg disabled:opacity-50" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send"}
        </button>
      </form>
    </div>
  );
}
