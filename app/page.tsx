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
const [mondayItems, setMondayItems] = useState<any[]>([]);
const [editData, setEditData] = useState<any>({});
const [activeFilterLetter, setActiveFilterLetter] = useState("All");
const letterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
const [selectedDay, setSelectedDay] = useState<number | null>(null); 
const [newEventTitle, setNewEventTitle] = useState("");
const [brand, setBrand] = useState("");
const [niche, setNiche] = useState("");
const [social, setSocial] = useState("");
const [contact, setContact] = useState("");
const [selectedGroup, setSelectedGroup] = useState("topics");
const [activeEvent, setActiveEvent] = useState<any>(null);

useEffect(() => {
  const fetchData = () => {
    fetch("https://sheetdb.io/api/v1/axmaxulx9jy0s", {
      cache: "no-store"
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

  const fetchMonday = async () => {
  const res = await fetch("/api/monday");
  const data = await res.json();

  console.log("MONDAY DATA:", data);

  const items = data.data.boards[0].items_page.items;

  setMondayItems(items);

const events = items.map((item: any) => {
  const dateColumn = item.column_values.find(
    (col: any) => col.id === "date_mm3a5hvm"
  );

  const statusColumn = item.column_values.find(
    (col: any) => col.id === "color_mm3anqa3"
  );

  const brandColumn = item.column_values.find(
    (col: any) => col.id === "text_mm3ayaff"
  );

  const nicheColumn = item.column_values.find(
    (col: any) => col.id === "text_mm404sek"
  );

  const socialColumn = item.column_values.find(
    (col: any) => col.id === "link_mm3ybwmx"
  );

  const contactColumn = item.column_values.find(
    (col: any) => col.id === "text_mm3ad018"
  );

  let date = dateColumn?.text;

  if (!date && dateColumn?.value) {
    const parsed = JSON.parse(dateColumn.value);
    date = parsed?.date;
  }

  return {
    title: item.name,
    date: date,
    status: statusColumn?.text,
    brand: brandColumn?.text,
    niche: nicheColumn?.text,
    social: socialColumn?.text,
    contact: contactColumn?.text
  };
}).filter((event: any) => event.date);


setCalendarEvents(events);


};

  fetchMonday();

}, []);


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
const updateStatus = async (user: User, status: string) => {
  await fetch(`https://sheetdb.io/api/v1/axmaxulx9jy0s/id/${user.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { nextStep: status } })
  });

  reloadData();
};

// DELETE USER
const deleteUser = async (user: User) => {
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

const scrollToLetter = (letter: string) => {
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
  


<div 
  id="background"
  onClick={(e) => {
    if ((e.target as HTMLElement).id === "background") {
      setSelectedDay(null);
    }
  }}
  style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui" }}
>


    {/* SIDEBAR */}
    <div style={{
      
      backgroundColor: "#1C132D",
      color: "white",
      padding: "20px"
    }}>
    

</div>
  
<div style={{
  position: "fixed",        
  right: "12px",             
  top: "50%",      
  transform: "translateY(-50%) scale(0.85)",           
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
  display: "flex",
  gap: "20px",
  padding: "20px",
  background: "#F3ECE2",
  flex: 1
}}>



      <div style={{ flex: 1 }}>

        
<div style={{ marginTop: "20px" }}>
  

<div style={{ marginTop: "30px" }}>
  <h2 style={{ color: "#1C132D" }}>📅 Interview Calendar</h2>

  <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginTop: "10px"
  }}
>
  {Array.from({ length: 30 }).map((_, dayIndex) => {
    const day = dayIndex + 1;

    const eventsForDay = calendarEvents.filter(event =>
  parseInt(event.date.split("-")[2]) === day
);

    return (
  
<div
  key={day}
  onClick={(e) => {
    e.stopPropagation();
    setSelectedDay(day);
  }}

    style={{
      background: "#fff",
      minHeight: "80px",
      padding: "5px",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      fontSize: "12px",
      cursor: "pointer",
      border: selectedDay === day ? "2px solid #EF5D41" : "none"
    }}
  >

        <div style={{ fontWeight: "bold" }}>{day}</div>

        {eventsForDay.map((event, i) => (
  <div
    key={i}
    onClick={() => setActiveEvent(event)} 
    style={{
      marginTop: "3px",
      padding: "2px 4px",
      background: "#8C84D9",
      color: "#fff",
      borderRadius: "4px",
      fontSize: "10px",
      cursor: "pointer"
    }}
  >
    {event.title}
  </div>
))}
      </div>
    );
  })}
</div>
</div>
<h2 style={{
  marginTop: "20px", 
  color: "#1C132D",
  textAlign: "center"
}}>
  Waitlist Dashboard
</h2>
{selectedDay && (
  <div
    onClick={(e) => e.stopPropagation()}
    style={{
    marginTop: "20px",
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
  }}>
    <h3>Events on Day {selectedDay}</h3>

    <input
  type="text"
  placeholder="Add interview..."
  value={newEventTitle}
  onChange={(e) => setNewEventTitle(e.target.value)}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

<input
  type="text"
  placeholder="Brand / Company"
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

<input
  type="text"
  placeholder="Niche"
  value={niche}
  onChange={(e) => setNiche(e.target.value)}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

<input
  type="text"
  placeholder="Social Handle"
  value={social}
  onChange={(e) => setSocial(e.target.value)}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

<input
  type="text"
  placeholder="Contact Info"
  value={contact}
  onChange={(e) => setContact(e.target.value)}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>


<select
  value={selectedGroup}
  onChange={(e) => setSelectedGroup(e.target.value)}
  style={{
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px"
  }}
>
  <option value="topics">Ideas</option>
  <option value="group_mm3ahc7c">Outreach</option>
  <option value="group_mm3a2tx5">Confirmed</option>
  <option value="group_mm3an27k">Completed</option>
</select>


<button
  
onClick={async () => {
  if (!newEventTitle) return;

  const date = `2026-06-${selectedDay.toString().padStart(2, "0")}`;


  console.log("SENDING:", newEventTitle, date);

 
  const newEvent = {
    title: newEventTitle,
    date: date
  };

  setCalendarEvents([...calendarEvents, newEvent]);

  setNewEventTitle("");

 
  const res = await fetch("/api/monday", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  name: newEventTitle,
  date: date,
  group: selectedGroup,
  brand: brand,
  niche: niche,
  social: social,
  contact: contact
})
  });

  const data = await res.json();
  console.log("MONDAY RESPONSE:", data);
}}

>
  ➕ Add Event
</button>

    {calendarEvents
      .filter(event => parseInt(event.date.split("-")[2]) === selectedDay)
      .map((event, index) => (
        <div key={index} style={{ marginTop: "5px" }}>
          {event.title}
        </div>
      ))}

    {calendarEvents.filter(event =>
  parseInt(event.date.split("-")[2]) === selectedDay
).length === 0 && <p>No events</p>}

  </div>
)}


  
</div>
<div style={{ flex: 1 }}>
        <div style={{ position: "relative", marginTop: "10px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            style={{
              color: "#1C132D",
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
        <div style={{ marginTop: "15px", background: "#fff", padding: "10px", borderRadius: "10px", display: "flex", gap: "10px", alignItems: "center",flexWrap: "wrap"}}>
          
<input
  style={{
    color: "#1C132D",
    padding: "8px",
    flex: "1 1 45%",
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
    color: "#1C132D",
    padding: "8px",
    flex: "1 1 45%",
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
    color: "#1C132D",
    padding: "8px",
    flex: "1 1 100%",
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
  flex: "1 1 100%",
  background: "#EF5D41",
  color: "#fff",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer"
}}

>
            ADD
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
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderLeft: `6px solid ${
                user.nextStep === "Approved"
                  ? "#66C6C4"
                  : user.nextStep === "Interview"
                  ? "#FFC774"
                  : "#EF5D41"
              }`
            }}
          >
            
<b style={{ color: "#1C132D" }}>
  {index + 1}. {user.firstName} {user.lastName}
</b>




            
<div style={{ fontSize: "12px", color: "#333" }}>
  {user.location}
</div>

          </div>
        ))}

{filteredUsers.length === 0 && (
  <p style={{ marginTop: "20px", textAlign: "center", color: "#444" }}>
    No users found
  </p>
)}

        {/* POPUP */}
        </div>
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
      <p style={{ color: "#333", marginBottom: "10px" }}>
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

      {activeEvent && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          width: "300px",
          zIndex: 999
        }}>
          <h3>{activeEvent.title}</h3>

          <p><b>Status:</b> {activeEvent.status}</p>
          <p><b>Brand:</b> {activeEvent.brand}</p>
          <p><b>Niche:</b> {activeEvent.niche}</p>
          <p><b>Social:</b> {activeEvent.social}</p>
          <p><b>Contact:</b> {activeEvent.contact}</p>
          <p><b>Date:</b> {activeEvent.date}</p>

          <button
            onClick={() => setActiveEvent(null)}
            style={{
              marginTop: "10px",
              background: "#EF5D41",
              color: "#fff",
              border: "none",
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      )}

    </div>
);
}