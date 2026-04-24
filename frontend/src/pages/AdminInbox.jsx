import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";

function AdminInbox() {
  // Demo data (Baad mein ye Database se aayega)
  const messages = [
    { id: 1, name: "Balaji", email: "balaji@test.com", msg: "I need help with my grievance ticket." },
    { id: 2, name: "Student", email: "student@test.com", msg: "When will my issue be resolved?" }
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Admin Inbox - User Messages</h1>
      <div className="grid gap-4">
        {messages.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>{m.name} ({m.email})</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="bg-gray-100 p-3 rounded">{m.msg}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminInbox;