import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";

function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Backend se saare messages lane ke liye
    fetch('http://127.0.0.1:8000/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Inbox - Received Messages</h1>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p>Abhi tak koi message nahi aaya hai.</p>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id}>
              <CardHeader>
                <CardTitle className="text-lg">{msg.name} ({msg.email})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{msg.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminMessages;