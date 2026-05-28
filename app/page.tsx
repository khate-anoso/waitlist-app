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
const [search, setSearch] = useState("");
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
const filteredUsers = users.filter((user) =>
  `${user.firstName} ${user.lastName}`
    .toLowerCase()
    .includes(search.toLowerCase())
);
``
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#F3ECE2" }}>
  <div className="max-w-3xl mx-auto"></div>
      <h1
  className="text-3xl font-bold mb-6 text-center"
  style={{ color: "#1C132D" }}
>
  Waitlist Dashboard
</h1>
<input
  type="text"
  placeholder="🔍 Search name..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full p-3 mb-6 rounded-lg shadow-sm focus:outline-none"
  
style={{
    border: "2px solid #8C84D9",
    backgroundColor: "#fff",
  }}

/>
      <div className="space-y-4">
  {filteredUsers.map((user, index) => (
    <div
      key={index}
      className="p-5 rounded-2xl bg-white border transition cursor-pointer"
      
style={{
        
borderLeft: `6px solid ${
          user.vetting === "Approved"
            ? "#66C6C4"
            : user.vetting === "Interview"
            ? "#FFC774"
            : "#EF5D41"
        }`

      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 10px 25px rgba(0,0,0,0.08)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "none")
      }

      onClick={() => setSelectedUser(user)}
    >
      

{/* Name */}
      <p
        style={{
          color: "#1C132D",
          fontWeight: "600",
          fontSize: "18px"
        }}
      >
        {user.firstName} {user.lastName}
      </p>

      {/* Location */}
      <p
        style={{
          color: "#888",
          fontSize: "13px",
          marginTop: "4px"
        }}
      >
        {user.location || "No location"}
      </p>

      {/* Status badge */}
      <span
        className="inline-block mt-3 px-3 py-1 rounded-full text-xs"
        style={{
          backgroundColor:
            user.vetting === "Approved"
              ? "#66C6C4"
              : user.vetting === "Interview"
              ? "#FFC774"
              : "#EF5D41",
          color: "#1C132D",
          fontWeight: "500"
        }}
      >
        {user.vetting || "No Status"}
      </span>




    </div>
  ))}
</div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            
<h2 className="text-xl font-bold mb-3 text-center" style={{ color: "#1C132D" }}>

            


            <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Email:</strong> {selectedUser.email || "-"}</p>
            <p><strong>Location:</strong> {selectedUser.location || "-"}</p>
            <p><strong>Social:</strong> {selectedUser.social || "-"}</p>
            <p><strong>Background:</strong> {selectedUser.background || "-"}</p>
            <p><strong>Website:</strong> {selectedUser.website || "-"}</p>
            <p><strong>Status:</strong> {selectedUser.vetting || "-"}</p>
            </div>

            <button
              
className="mt-4 w-full p-2 rounded-lg text-white"
  style={{ backgroundColor: "#8C84D9" }}
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