"use client";
import { useState, useEffect, useRef } from "react";



type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  social: string;
  background: string;
  website: string;
  nextStep: string;
};

export default function Home() {

const [users, setUsers] = useState<any[]>([]);
const [selectedUser, setSelectedUser] = useState<any>(null);
const [search, setSearch] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState<any>({});
const [activeFilterLetter, setActiveFilterLetter] = useState("All");
const letterRefs = useRef({});
useEffect(() => {
  const fetchData = () => {
    fetch("https://sheetdb.io/api/v1/axmaxulx9jy0s", {
      cache: "no-store"   // ✅ force fresh data
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      });
  };

  fetchData();

}, []);
``

const [activeFilter, setActiveFilter] = useState("All");

// FILTER LOGIC

const filteredUsers = users
  .filter((user) => {
    const matchesSearch = `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" || user.nextStep === activeFilter;

    const matchesLetter =
      activeFilterLetter === "All" ||
      user.firstName?.toLowerCase().startsWith(activeFilterLetter.toLowerCase());

    return matchesSearch && matchesFilter && matchesLetter;
  })
  .sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );



// RELOAD
const reloadData = () => {
  
fetch("https://sheetdb.io/api/v1/axmaxulx9jy0s", {
  cache: "no-store"
})

    .then(res => res.json())
    .then(data => setUsers(data));
};

// UPDATE STATUS
const updateStatus = async (user, status) => {
  await fetch(`https://sheetdb.io/api/v1/axmaxulx9jy0s/id/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { nextStep: status } })
  });

  reloadData();
};

// DELETE USER
const deleteUser = async (user) => {
  console.log("Deleting user:", user.email);

  const res = await fetch(`https://sheetdb.io/api/v1/axmaxulx9jy0s/email/${user.email}`, {
    method: "DELETE"
  });

  console.log("Delete response:", res);

  reloadData();
};

const [newUser, setNewUser] = useState({
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  nextStep: ""
});

const scrollToLetter = (letter) => {
  setActiveFilterLetter(letter);

  const el = letterRefs.current[letter];

  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};

const addUser = async () => {
  
if (!newUser.email) {
    alert("Email is required ❗");
    return;
  }

  
  await fetch("https://sheetdb.io/api/v1/axmaxulx9jy0s", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: newUser })
  });

  setNewUser({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    nextStep: ""
  });

  reloadData();
};

const saveEdit = async () => {
  await fetch(
    `https://sheetdb.io/api/v1/axmaxulx9jy0s/email/${selectedUser.email}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: editData
      })
    }
  );

  setIsEditing(false);
  setSelectedUser(null);
  reloadData();
};

return (
  <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui" }}>

    {/* SIDEBAR */}
    <div style={{
      
      backgroundColor: "#1C132D",
      color: "white",
      padding: "20px"
    }}>
    

</div>
  
<div style={{
  position: "fixed",        
  right: "5px",             
  top: "50%",                 
  transform: "translateY(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "2px",
  zIndex: 1000,
background: "rgba(28, 19, 45, 0.7)",
padding: "6px",
borderRadius: "10px",
boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
border: "1px solid rgba(255,255,255,0.1)"


}}>

    {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
      <span
  key={letter}
  onClick={() => scrollToLetter(letter)}
  style={{
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: "50%",
    fontSize: "10px",
    background:
      activeFilterLetter === letter ? "#8C84D9" : "transparent",
    color: activeFilterLetter === letter ? "#fff" : "#ccc"
  }}
>
        {letter}
      </span>
    ))}

    <div
      
onClick={() => {
  setActiveFilterLetter("All");
  window.scrollTo({ top: 0, behavior: "smooth" });
}}

      style={{ marginTop: "5px", cursor: "pointer" }}
    >
      🔄
    </div>


</div>

    {/* MAIN */}
    


<div style={{
  flex: 1,
  padding: "20px 60px 20px 20px",
  background: "#F3ECE2"
}}>



      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        <h1 style={{ textAlign: "center", color: "#1C132D" }}>
          Waitlist Dashboard
        </h1>

        {/* SEARCH */}
        <div style={{ position: "relative", marginTop: "10px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              width: "100%",
              padding: "10px",
              border: "2px solid #8C84D9",
              borderRadius: "8px"
            }}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            >
              ❌
            </button>
          )}
        </div>

        {/* ADD USER FORM */}
        <div style={{ marginTop: "15px", background: "#fff", padding: "10px", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "center"}}>
          
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px",
    transition: "0.2s"
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.border = "1px solid #8C84D9")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.border = "1px solid #ccc")
  }
  onFocus={(e) =>
    (e.currentTarget.style.border = "1px solid #8C84D9")
  }
  onBlur={(e) =>
    (e.currentTarget.style.border = "1px solid #ccc")
  }
 placeholder="First Name" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
          
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px",
    transition: "0.2s"
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.border = "1px solid #8C84D9")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.border = "1px solid #ccc")
  }
  onFocus={(e) =>
    (e.currentTarget.style.border = "1px solid #8C84D9")
  }
  onBlur={(e) =>
    (e.currentTarget.style.border = "1px solid #ccc")
  }
 placeholder="Last Name" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
          
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px",
    transition: "0.2s"
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.border = "1px solid #8C84D9")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.border = "1px solid #ccc")
  }
  onFocus={(e) =>
    (e.currentTarget.style.border = "1px solid #8C84D9")
  }
  onBlur={(e) =>
    (e.currentTarget.style.border = "1px solid #ccc")
  }
 placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          

          <button onClick={addUser} 
          
onMouseEnter={(e) =>
    (e.currentTarget.style.background = "#d94f34")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = "#EF5D41")
  }

          


style={{
    background: "#EF5D41",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap"
  }}
>
            ➕
          </button>
        </div>

        {/* LIST */}
        {filteredUsers.map((user, index) => (
          
<div
  key={index}
  ref={(el) => {
    const firstLetter = user.firstName?.charAt(0).toUpperCase();
    if (el && !letterRefs.current[firstLetter]) {
      letterRefs.current[firstLetter] = el;
    }
  }}

            
onClick={() => {
  setSelectedUser(user);
  setIsEditing(false);
  setEditData({});
}}

            style={{
              background: "#fff",
              marginTop: "10px",
              padding: "12px",
              borderRadius: "10px",
              borderLeft: `6px solid ${
                user.nextStep === "Approved"
                  ? "#66C6C4"
                  : user.nextStep === "Interview"
                  ? "#FFC774"
                  : "#EF5D41"
              }`
            }}
          >
            <b>
  {index + 1}. {user.firstName} {user.lastName}
</b>



            <div style={{ fontSize: "12px" }}>{user.location}</div>
          </div>
        ))}

{filteredUsers.length === 0 && (
  <p style={{ marginTop: "20px", textAlign: "center", color: "#888" }}>
    No users found
  </p>
)}

        {/* POPUP */}
        {selectedUser && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>

    {/* MODAL CARD */}
    <div style={{
      background: "#fff",
      padding: "25px",
      borderRadius: "16px",
      width: "320px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      
maxHeight: "90vh",
  overflowY: "auto",
  scrollbarWidth: "thin"

    }}>

      {/* NAME */}
      <h2 style={{
        marginBottom: "5px",
        color: "#1C132D"
      }}>
        {selectedUser.firstName} {selectedUser.lastName}
      </h2>

      {/* EMAIL */}
      <p style={{ color: "#666", marginBottom: "10px" }}>
        {selectedUser.email}
      </p>

      <hr style={{ margin: "10px 0" }} />

      {/* DETAILS */}
{isEditing ? (
  
<div style={{
  marginTop: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
}}>


    <label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333"
}}>
  First Name:
</label>
    
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.firstName || ""}
  onChange={(e) =>
    setEditData({ ...editData, firstName: e.target.value })
  }
/>



    <label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Last Name:
</label>
    
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.lastName || ""}
  onChange={(e) =>
    setEditData({ ...editData, lastName: e.target.value })
  }
/>



    <label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Email:
</label>
    
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.email || ""}
  onChange={(e) =>
    setEditData({ ...editData, email: e.target.value })
  }
/>



    <label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Location:
</label>
    
<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.location || ""}
  onChange={(e) =>
    setEditData({ ...editData, location: e.target.value })
  }
/>



    <label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Social:
</label>

<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.social || ""}
  onChange={(e) =>
    setEditData({ ...editData, social: e.target.value })
  }
/>



<label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Background:
</label>

<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.background || ""}
  onChange={(e) =>
    setEditData({ ...editData, background: e.target.value })
  }
/>



<label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Website:
</label>

<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.website || ""}
  onChange={(e) =>
    setEditData({ ...editData, website: e.target.value })
  }
/>



<label style={{
  fontWeight: "600",
  fontSize: "15px",
  color: "#333",
  marginBottom: "3px"
}}>
  Status:
</label>

<input
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  
style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "13px"
  }}
  onFocus={(e) => e.target.style.border = "1px solid #8C84D9"}
  onBlur={(e) => e.target.style.border = "1px solid #ccc"}
  value={editData.nextStep || ""}
  onChange={(e) =>
    setEditData({ ...editData, nextStep: e.target.value })
  }
/>



  </div>
) : (

  <div style={{
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
    marginBottom: "3px"
  }}>
    <div><b>Location:</b> {selectedUser.location}</div>
    <div><b>Social:</b> {selectedUser.social}</div>
    <div><b>Background:</b> {selectedUser.background}</div>
    <div><b>Website:</b> {selectedUser.website}</div>
    <div><b>Status:</b> {selectedUser.nextStep}</div>
  </div>
)}


{!isEditing && (
  <button
    onClick={() => {
      setIsEditing(true);
      setEditData({ ...selectedUser });
    }}
    style={{
      marginTop: "10px",
      width: "100%",
      background: "#FFC774",
      padding: "10px",
      borderRadius: "10px",
      cursor: "pointer"
    }}
  >
    ✏️ Edit
  </button>
)}

{isEditing && (
  <div style={{
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  }}>
    
    <button
      onClick={saveEdit}
      style={{
        flex: 1,
        background: "#66C6C4",
        padding: "10px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer"
      }}
    >
      ✅ Save
    </button>

    <button
      onClick={() => {
        setIsEditing(false);
        setEditData({});
      }}
      style={{
        flex: 1,
        background: "#ccc",
        padding: "10px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer"
      }}
    >
      ❌ Cancel
    </button>

  </div>
)}



      {/* DELETE */}
      
<button
  onClick={() => {
    deleteUser(selectedUser);
    setSelectedUser(null);   
    setIsEditing(false);     
  }}


        
        style={{
          marginTop: "12px",
          width: "100%",
          background: "#EF5D41",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Delete User
      </button>

      {/* CLOSE */}
      <button
        onClick={() => setSelectedUser(null)}
        style={{
          marginTop: "8px",
          width: "100%",
          background: "#8C84D9",
          color: "#fff",
          border: "none",
          padding: "10px",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        Close
      </button>
</div>
    </div>
  
)}

      </div>
    </div>
  </div>
);
}