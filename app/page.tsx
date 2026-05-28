"use client";
import { useState, useEffect } from "react";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  social: string;
  background: string;
  website: string;
  vetting: string;
};

export default function Home() {

const [users, setUsers] = useState<any[]>([]);
const [selectedUser, setSelectedUser] = useState<any>(null);

useEffect(() => {
  fetch("https://sheetdb.io/api/v1/axmaxulx9jy0s")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    });
}, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Waitlist Members</h1>

      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="p-4 border rounded cursor-pointer"
            onClick={() => setSelectedUser(user)}
          >
            {user.firstName} {user.lastName}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-2">
              {selectedUser.firstName} {selectedUser.lastName}
            </h2>

            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Location:</strong> {selectedUser.location}</p>
            <p><strong>Social:</strong> {selectedUser.social}</p>
            <p><strong>Background:</strong> {selectedUser.background}</p>
            <p><strong>Website:</strong> {selectedUser.website}</p>
            <p><strong>Next Step:</strong> {selectedUser.vetting}</p>

            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}