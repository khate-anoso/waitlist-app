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
const [status, setStatus] = useState("");
const [selectedUser, setSelectedUser] = useState<any>(null);
const [search, setSearch] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [mondayItems, setMondayItems] = useState<any[]>([]);
const [editData, setEditData] = useState<any>({});
const [activeFilterLetter, setActiveFilterLetter] = useState("All");
const letterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
const [selectedDay, setSelectedDay] = useState<number | null>(null); 
const [currentMonth, setCurrentMonth] = useState(5); // June (0-based)
const [currentYear] = useState(2026);
const [newEventTitle, setNewEventTitle] = useState("");
const [brand, setBrand] = useState("");
const [niche, setNiche] = useState("");
const [social, setSocial] = useState("");
const [contact, setContact] = useState("");
const [selectedGroup, setSelectedGroup] = useState("topics");
const [activeEvent, setActiveEvent] = useState<any>(null);
const [showAddForm, setShowAddForm] = useState(false);
const [showEditForm, setShowEditForm] = useState(false);
const [editEvent, setEditEvent] = useState<any>(null);

const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

const getGroupFromStatus = (status: string) => {
  if (status === "Idea") return "topics";
  if (status === "Outreach") return "group_mm3ahc7c";
  if (status === "Confirmed") return "group_mm3a2tx5";
  if (status === "Completed") return "group_mm3an27k";
  return "topics";
};

const fetchMonday = async () => {
  const res = await fetch("/api/monday");
  const data = await res.json();

  const items =
  data?.data?.boards?.[0]?.items_page?.items || [];


    console.log("✅ ITEMS NOW:", items);

  const events = items.map((item: any) => {
    console.log("COLUMNS 👉", item.column_values);
   const dateColumn = item.column_values.find(
  (col: any) => col.value && col.value.includes("date")
);

    const statusCol = item.column_values.find(
      (col: any) => col.id === "color_mm3anqa3"
    );
    console.log("STATUS RAW 👉", statusCol);

    const brandCol = item.column_values.find(
      (col: any) => col.id === "text_mm3ayaff"
    );

    const nicheCol = item.column_values.find(
      (col: any) => col.id === "text_mm404sek"
    );

    const socialCol = item.column_values.find(
      (col: any) => col.text && col.text.includes("http")
    );

    const contactCol = item.column_values.find(
      (col: any) => col.id === "text_mm3ad018"
    );

    let date = "";

if (dateColumn?.value) {
  try {
    const parsed = JSON.parse(dateColumn.value);
    date = parsed?.date || "";
  } catch {}
}

if (!date && dateColumn?.text) {
  date = new Date(dateColumn.text).toISOString();
}

    return {
      id: item.id,
      title: item.name,
      date,
      status: statusCol?.text || "—",
      brand: brandCol?.text || "(no brand)",
      niche: nicheCol?.text || "—",
      social: socialCol?.text || "(no social)",
      contact: contactCol?.text || "—"
    };
  });

  setCalendarEvents(events);
};


useEffect(() => {
  reloadData();   

  fetchMonday();

  const interval = setInterval(() => {
    fetchMonday();
  }, 5000);

  return () => clearInterval(interval);
}, []);
useEffect(() => {
  if (currentMonth < 0) setCurrentMonth(11);
  if (currentMonth > 11) setCurrentMonth(0);
}, [currentMonth]);

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



      <div style={{
  flex: 1,
  display: "flex",
  flexDirection: "column"
}}>


        
<div>
  
<h2 style={{
  textAlign: "center",
  color: "#1C132D",
  marginBottom: "10px"
}}>
  Interview Schedule
</h2>


<div style={{ marginTop: "30px" }}>
  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px"
  }}
>
  <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
}}>
  <button onClick={() => setCurrentMonth(prev => prev - 1)}>
    ⬅️
  </button>

  <h2 style={{ margin: 0 }}>
    📅 {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
  </h2>

  <button onClick={() => setCurrentMonth(prev => prev + 1)}>
    ➡️
  </button>
</div>

  <button
   onClick={() => {
  if (!selectedDay) {
    alert("Please select a date first 📅");
    return;
  }

  setShowEditForm(false);
  setActiveEvent(null);
  setShowAddForm(true);
}}

    style={{
      background: "#5FB3B3",
      color: "#fff",
      padding: "8px 14px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500"
    }}
  >
    ➕ Add Event
  </button>
</div>

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

  const eventsForDay = calendarEvents.filter(event => {
  if (!event.date) return false;

  const [year, month, dayStr] = event.date.split("-");
  const eventDay = parseInt(dayStr);

  return (
    parseInt(month) === currentMonth + 1 &&
    parseInt(year) === currentYear &&
    eventDay === day
  );
});

    return (
  
<div
  key={day}
  onClick={(e) => {
    e.stopPropagation();
    setShowAddForm(false);
setShowEditForm(false);
setActiveEvent(null);
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
    
onClick={(e) => {
  e.stopPropagation();

  setPopupPosition({
    x: e.clientX,
    y: e.clientY
  });

  setShowAddForm(false);
setShowEditForm(false);
setActiveEvent(event);
}}

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


  </div>

</div>

  
</div>



{/* ✅ WAITLIST BELOW CALENDAR */}
<div style={{ marginTop: "40px", width: "100%", padding: "20px" }}>

  <h2 style={{
    textAlign: "center",
    color: "#1C132D",
    marginBottom: "15px"
  }}>
    Two Degrees - Waitlist 📋
  </h2>

  {/* SEARCH */}
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search..."
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc"
    }}
  />

  {/* LIST */}
  <div style={{ marginTop: "20px" }}>
    {filteredUsers.map((user, index) => (
      <div
        key={index}
        onClick={() => setSelectedUser(user)}
        style={{
          background: "#fff",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        <b>
          {index + 1}. {user.firstName} {user.lastName}
        </b>
      </div>
    ))}
  </div>

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
    <div style={{
      background: "#fff",
      padding: "25px",
      borderRadius: "16px",
      width: "340px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
    }}>

      <h2>
        {selectedUser?.firstName} {selectedUser?.lastName}
      </h2>

      <input
        value={selectedUser?.email || ""}
        readOnly
        style={{ width: "100%", marginTop: "10px", padding: "8px" }}
      />

      <input
        value={selectedUser?.location || ""}
        readOnly
        style={{ width: "100%", marginTop: "10px", padding: "8px" }}
      />

      <input
        value={selectedUser?.nextStep || ""}
        readOnly
        style={{ width: "100%", marginTop: "10px", padding: "8px" }}
      />

      <button
        onClick={() => setSelectedUser(null)}
        style={{
          marginTop: "15px",
          background: "#EF5D41",
          color: "#fff",
          padding: "10px",
          width: "100%",
          borderRadius: "8px"
        }}
      >
        Close
      </button>

    </div>
  </div>
)}


  



{activeEvent && (
        <div 
style={{
  position: "fixed",

  top: Math.min(popupPosition.y, window.innerHeight - 200),  // ✅ prevents going off screen
  left: Math.min(popupPosition.x, window.innerWidth - 340), // ✅ prevents right overflow

  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  
  width: "320px",
  maxHeight: "80vh",     // ✅ limit height
  overflowY: "auto",     // ✅ enable scroll
  
  zIndex: 999
}}

>
          <h3>{activeEvent.title}</h3>
          <button
 onClick={() => {
  setShowAddForm(false); // ✅ close add form

  setEditEvent({
    ...activeEvent,
    status: activeEvent.status || "Idea"
  });

  setShowEditForm(true);
  setActiveEvent(null);
}}

  style={{
    marginTop: "10px",
    background: "#FFC774",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }}
>
  ✏️ Edit
</button>
<button
  onClick={async () => {
    await fetch("/api/monday", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: Number(activeEvent.id)
      })
    });

    await fetchMonday();
    setActiveEvent(null);
  }}
  style={{
    marginTop: "8px",
    background: "#EF5D41",
    color: "#fff",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }}
>
  🗑️ Delete
</button>

          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>

  <label style={{ fontSize: "12px", color: "#555" }}>Status</label>
  <input value={activeEvent.status} readOnly style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />

  <label style={{ fontSize: "12px", color: "#555" }}>Brand</label>
  <input value={activeEvent.brand} readOnly style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />

  <label style={{ fontSize: "12px", color: "#555" }}>Niche</label>
  <input value={activeEvent.niche} readOnly style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />

  <label style={{ fontSize: "12px", color: "#555" }}>Social</label>
  <input value={activeEvent.social} readOnly style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />

  <label style={{ fontSize: "12px", color: "#555" }}>Contact</label>
  <input value={activeEvent.contact} readOnly style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />

  <label style={{ fontSize: "12px", color: "#555" }}>Date</label>
  <input value={activeEvent.date} readOnly style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }} />

</div>

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
{showAddForm && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      width: "300px",
      zIndex: 1000
    }}
  >
    <h3>Add Event</h3>

    <input
      placeholder="Name"
      value={newEventTitle}
      onChange={(e) => setNewEventTitle(e.target.value)}
      style={{ width: "100%", marginTop: "8px", padding: "8px" }}
    />

    <input
      placeholder="Brand"
      value={brand}
      onChange={(e) => setBrand(e.target.value)}
      style={{ width: "100%", marginTop: "8px", padding: "8px" }}
    />

    <input
      placeholder="Niche"
      value={niche}
      onChange={(e) => setNiche(e.target.value)}
      style={{ width: "100%", marginTop: "8px", padding: "8px" }}
    />

    <input
      placeholder="Social"
      value={social}
      onChange={(e) => setSocial(e.target.value)}
      style={{ width: "100%", marginTop: "8px", padding: "8px" }}
    />

    <input
      placeholder="Contact"
      value={contact}
      onChange={(e) => setContact(e.target.value)}
      style={{ width: "100%", marginTop: "8px", padding: "8px" }}
    />
    <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  style={{ width: "100%", marginTop: "8px", padding: "8px" }}
>
  <option value="">Select Status</option>
  <option value="Idea">Idea</option>
  <option value="Completed">Completed</option>
  <option value="Confirmed">Confirmed</option>
  <option value="Outreach">Outreach</option>
</select>

    <button
  type="button"
  onClick={async () => {
    console.log("CLICK SAVE HIT ✅");

    if (!newEventTitle) {
  alert("No title!");
  return;
}
if (!status) {
  alert("Select a status first!");
  return;
}

    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

await fetch("/api/monday", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: newEventTitle,
    date,
    group: getGroupFromStatus(status),
    brand,
    niche,
    social,
    contact,
    status
  })
});

    console.log("FETCH SENT ✅");

    await fetchMonday();

setNewEventTitle("");
setBrand("");
setNiche("");
setSocial("");
setContact("");
setStatus("");

setShowAddForm(false); 
  }}
  style={{
    marginTop: "10px",
    background: "#5FB3B3",
    padding: "10px",
    width: "100%",
    cursor: "pointer"
  }}
>
  ✅ Save
</button>

    
<button
  onClick={() => {
    setShowAddForm(false);
    setNewEventTitle("");
    setBrand("");
    setNiche("");
    setSocial("");
    setContact("");
    setStatus("");
  }}
  style={{
    marginTop: "8px",
    background: "#eee",
    color: "#333",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "500"
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = "#ddd")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = "#eee")
  }
>
  ❌ Cancel
</button>

  </div>
)}

{showEditForm && editEvent && (
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      width: "300px",
      pointerEvents: "auto",
      zIndex: 1000
    }}
  >
    <h3>Edit Event</h3>

    {/* NAME */}
<div style={{ marginTop: "10px" }}>
  <label style={{ fontSize: "12px", color: "#555" }}>Name</label>
  <input
    value={editEvent?.title || ""}
    onChange={(e) =>
      setEditEvent({ ...editEvent, title: e.target.value })
    }
    
style={{
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  border: "1px solid #ccc",
  borderRadius: "6px"
}}

  />
</div>

{/* BRAND */}
<div style={{ marginTop: "10px" }}>
  <label style={{ fontSize: "12px", color: "#555" }}>Brand</label>
  <input
    value={editEvent?.brand || ""}
    onChange={(e) =>
      setEditEvent({ ...editEvent, brand: e.target.value })
    }
    
style={{
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  border: "1px solid #ccc",
  borderRadius: "6px"
}}

  />
</div>

{/* NICHE */}
<div style={{ marginTop: "10px" }}>
  <label style={{ fontSize: "12px", color: "#555" }}>Niche</label>
  <input
    value={editEvent?.niche || ""}
    onChange={(e) =>
      setEditEvent({ ...editEvent, niche: e.target.value })
    }
    
style={{
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  border: "1px solid #ccc",
  borderRadius: "6px"
}}

  />
</div>

{/* SOCIAL */}
<div style={{ marginTop: "10px" }}>
  <label style={{ fontSize: "12px", color: "#555" }}>Social</label>
  <input
    value={editEvent?.social || ""}
    onChange={(e) =>
      setEditEvent({ ...editEvent, social: e.target.value })
    }
    
style={{
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  border: "1px solid #ccc",
  borderRadius: "6px"
}}

  />
</div>

{/* CONTACT */}
<div style={{ marginTop: "10px" }}>
  <label style={{ fontSize: "12px", color: "#555" }}>Contact</label>
  <input
    value={editEvent?.contact || ""}
    onChange={(e) =>
      setEditEvent({ ...editEvent, contact: e.target.value })
    }
    
style={{
  width: "100%",
  padding: "8px",
  marginTop: "4px",
  border: "1px solid #ccc",
  borderRadius: "6px"
}}

  />
</div>
{/* STATUS */}
<div style={{ marginTop: "10px" }}>
  <label style={{ fontSize: "12px", color: "#555" }}>Status</label>
  <select
  value={editEvent?.status || "Idea"}
    onChange={(e) =>
      setEditEvent({ ...editEvent, status: e.target.value })
    }
    style={{
      width: "100%",
      padding: "10px",
      marginTop: "4px",
      border: "1px solid #ddd",
      borderRadius: "8px"
    }}
  >
    <option value="">Select Status</option>
    <option value="Idea">Idea</option>
    <option value="Outreach">Outreach</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Completed">Completed</option>
  </select>
</div>


    <button
      onClick={async () => {
  console.log("EDIT DATA:", editEvent);

  if (!editEvent?.title) {
    alert("No title!");
    return;
  }

 await fetch("/api/monday", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  id: editEvent.id,
  newTitle: editEvent.title,
  status: editEvent.status || "Idea",
  brand: editEvent.brand,
  niche: editEvent.niche,
  social: editEvent.social,
  contact: editEvent.contact
})
});

  await fetchMonday();

  setShowEditForm(false);
  setEditEvent(null);
}}
      style={{
        marginTop: "10px",
        background: "#5FB3B3",
        padding: "10px",
        width: "100%"
      }}
    >
      ✅ Save
    </button>

    
<button
  onClick={() => {
    setShowEditForm(false);
    setEditEvent(null);
  }}
  style={{
    marginTop: "8px",
    background: "#eee",
    color: "#333",
    padding: "10px",
    width: "100%",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer"
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = "#ddd")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = "#eee")
  }
>
  ❌ Cancel
</button>

</div>
)}
</div>

);
}