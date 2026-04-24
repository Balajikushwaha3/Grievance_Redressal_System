import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";

const UserHistory = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // API se data fetch karne ka logic
    fetch("http://localhost:8000/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.log("Error:", err));
  }, []);

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Registration History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserHistory;