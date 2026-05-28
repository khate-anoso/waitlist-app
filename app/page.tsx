"use client";
import { useState } from "react";

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

const sampleData: User[] = [
  {
    id: 1,
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@example.com",
    location: "Manila",
    social: "@juandelacruz",
    background: "Web Developer",
    website: "https://juan.dev",
    vetting: "Initial Review"
  },
  {
    id: 2,
    firstName: "Maria",
    lastName: "Santos",
    email: "maria@example.com",
    location: "Cebu",
    social: "@mariasantos",
    background: "UX Designer",
    website: "https://maria.design",
    vetting: "Interview Stage"
  }
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Waitlist Members</h1>

      <div className="space-y-3">
        {sampleData.map((user) => (
          <div
            key={user.id}
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