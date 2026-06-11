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
const [view, setView] = useState("calendar");

const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

const getGroupFromStatus = (status: string) => {
  if (status === "Idea") return "topics";
  if (status === "Outreach") return "group_mm3ahc7c";
  if (status === "Confirmed") return "group_mm3a2tx5";
  if (status === "Online Interview") return "group_mm3manga3";
  // 👆 🔴 IMPORTANT: palitan mo ito ng actual group ID galing Monday
  if (status === "Completed") return "group_mm3an27k";

  return "topics";
};

const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
const fetchMonday = async () => {
  const res = await fetch("/api/monday");
  const data = await res.json();

  const items =
  data?.data?.boards?.[0]?.items_page?.items || [];
  console.log("✅ FULL BOARD DATA:", data?.data?.boards?.[0]);


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

console.log("GROUP ID 👉", item.group?.id);
console.log("GROUP TITLE 👉", item.group?.title);

    return {
      id: item.id,
      title: item.name,
      date,
      status: statusCol?.text || "",
      brand: brandCol?.text || "",
      niche: nicheCol?.text || "",
      social: socialCol?.text || "",
      contact: contactCol?.text || ""
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
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};
const getStatusColor = (status: string) => {
  switch (status) {
    case "Outreach":
      return "#F97316"; // orange
    case "Confirmed":
      return "#FACC15"; // yellow
    case "Completed":
      return "#15803D"; // green
    case "Idea":
      return "#DC2626"; // red
    default:
      return "#ccc";
      
case "Online Interview":
  return "#3B82F6";

  }
};

return (
  


<div
  id="background"
  style={{
    display: "flex",
    justifyContent: "center",  
    background: "linear-gradient(180deg, #F3ECE2, #EAE3D9)",
    minHeight: "100vh",
    fontFamily: "system-ui"
  }}
>


 
  

      




    {/* MAIN */}
    


<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "40px",
  width: "100%",
  maxWidth: "100%",
  padding: isMobile ? "10px" : "20px",
}}>



      <div style={{
  flex: 1,
  display: "flex",
  flexDirection: "column"
}}>


        
<div style={{
  background: "#ffffff",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  width: "100%",
}}>
  
<h2 style={{
  textAlign: "left",
  fontWeight: "600",
  fontSize: "20px"
}}>
  Interview Schedule
</h2>


<div style={{ marginTop: "30px" }}>
  <div
  style={{
    display: "flex",
flexDirection: isMobile ? "column" : "row",
gap: isMobile ? "10px" : "0",
alignItems: isMobile ? "stretch" : "center",
justifyContent: "space-between",
flexWrap: "wrap"
  }}
>
  <div style={{
  display: "flex",
justifyContent: isMobile ? "center" : "space-between",
alignItems: "center",
gap: "10px"
}}>
  <button onClick={() => setCurrentMonth(prev => prev - 1)}>
    ⬅️
  </button>

  
<h2 style={{ 
  margin: 0,
  fontSize: isMobile ? "16px" : "20px",
  textAlign: isMobile ? "center" : "left"
}}>

    📅 {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
  </h2>

  <button onClick={() => setCurrentMonth(prev => prev + 1)}>
    ➡️
  </button>
</div>
<button
  onClick={() => setView(view === "calendar" ? "kanban" : "calendar")}
  style={{
  marginLeft: 0,
  background: "#1C132D",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  width: isMobile ? "100%" : "auto"
}}
>
  {view === "calendar" ? "📊 Kanban" : "📅 Calendar"}
</button>
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
  background: "linear-gradient(135deg, #EF5D41, #D94C32)",
  boxShadow: "0 6px 16px rgba(239, 93, 65, 0.3), 0 4px 12px rgba(0,0,0,0.15)",
  transition: "0.2s",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  width: isMobile ? "100%" : "auto"
}}

    onMouseEnter={(e) =>
  (e.currentTarget.style.transform = "scale(1.05)")
}
onMouseLeave={(e) =>
  (e.currentTarget.style.transform = "scale(1)")
}
  >
    
    ➕ Add Event
  </button>
  
</div>

 
{view === "calendar" && (
  <div

  style={{
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(3, minmax(0, 1fr))" : "repeat(7, 1fr)",
    gap: "8px",
    marginTop: "10px",
    fontWeight: "600",
    alignItems: "stretch",
letterSpacing: "0.3px"
  }}
>
  {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, dayIndex) => {
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
    setSelectedDay(null);
setShowEditForm(false);
setActiveEvent(null);
setSelectedDay(day);

  }}

    style={{
  background: selectedDay === day
    ? "rgba(140, 132, 217, 0.15)"   // ✅ highlighted color
    : "#ffffff",

  border: selectedDay === day
    ? "2px solid #8C84D9"           // ✅ strong border
    : "1px solid #eee",

  minHeight: isMobile ? "100px" : "90px",
  padding: "10px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  transition: "all 0.2s",


    }}

    onMouseEnter={(e) =>
  (e.currentTarget.style.transform = "translateY(-2px)")
}
onMouseLeave={(e) =>
  (e.currentTarget.style.transform = "translateY(0)")
}

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
  setSelectedDay(null);
setShowEditForm(false);
setActiveEvent(event);
}}

    style={{
      marginTop: "3px",
      background: getStatusColor(event.status),

fontWeight: "500",
      color: "#fff",
      borderRadius: "4px",
      
fontSize: isMobile ? "12px" : "10px",
padding: isMobile ? "6px 8px" : "4px 6px",

      cursor: "pointer"
    }}
  >
    {event.title}
  </div>
))}
      </div>
    );
  })}
</div> )}
{view === "kanban" && (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "15px",
    marginTop: "20px"
  }}>

    {[
      { title: "Outreach", color: "#F97316" },
      { title: "Confirmed", color: "#FACC15" },
      { title: "Online Interview", color: "#3B82F6" },
      { title: "Completed", color: "#15803D" },
      { title: "Idea", color: "#DC2626" }
    ].map((col) => {

      const items = calendarEvents.filter(
        (event) => event.status === col.title
      );

      return (
        <div key={col.title} style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "10px",
          borderTop: `6px solid ${col.color}`
        }}>

          <h3 style={{ marginBottom: "10px" }}>
            {col.title} {items.length}
          </h3>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>

            {items.map((event) => (
              
  <div
    key={event.id}
    onClick={() => {
      setShowAddForm(false);
      setActiveEvent(null);

      setEditEvent({
        ...event,
        status: event.status || "Idea"
      });

      setShowEditForm(true);
    }}
    style={{
      border: "1px solid #eee",
      borderRadius: "10px",
      padding: "10px",
      background: "#fafafa",
      cursor: "pointer",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      transition: "0.2s"
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.transform = "scale(1.03)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.transform = "scale(1)")
    }
  >
                <b>{event.title}</b>

                <div style={{
                  fontSize: "12px",
                  marginTop: "4px",
                  color: "#666"
                }}>
                  {event.brand}
                </div>

                <div style={{
                  marginTop: "6px",
                  fontSize: "11px",
                  padding: "3px 6px",
                  background: col.color,
                  color: "#fff",
                  borderRadius: "6px",
                  display: "inline-block"
                }}>
                  {event.status}
                </div>

              </div>
            ))}

          </div>
        </div>
      );
    })}

  </div>
)}

</div>


  </div>
{/* ✅ WAITLIST BELOW CALENDAR */}
<div style={{
  marginTop: "20px",
  width: "100%"
}}>

  <div style={{
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",         
  gap: "10px",
  width: "100%",
  maxWidth: "100%",
  
}}>

    <h2 style={{
      textAlign: "center",
      color: "#1C132D",
      marginBottom: "15px"
    }}>
      Two Degrees - Waitlist 📋
    </h2>

{/* SEARCH */}
<div style={{ position: "relative", width: "100%" }}>
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search..."
    style={{
      width: "100%",
      padding: "12px",
      paddingRight: "35px", // ✅ space for icon
      borderRadius: "10px",
      border: "1px solid #ccc"
    }}
  />

  {/* ✅ CLEAR BUTTON INSIDE INPUT */}
  {search && (
    <span
      onClick={() => setSearch("")}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontSize: "14px",
        color: "#888",
        fontWeight: "bold"
      }}
    >
      ✕
    </span>
  )}
</div>
{/* ✅ A-Z FILTER (HORIZONTAL, CENTERED) */}
<div style={{
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "6px",
  marginTop: "12px",
  marginBottom: "16px"
}}>
  {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
    <span
      key={letter}
      onClick={() => scrollToLetter(letter)}
      style={{
        fontSize: "11px",
        padding: "6px 8px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        background:
          activeFilterLetter === letter ? "#8C84D9" : "#F3F3F3",
        color:
          activeFilterLetter === letter ? "#fff" : "#333",
        transition: "0.2s"
      }}
    >
      {letter}
    </span>
  ))}

{/* ✅ CLEAR BUTTON */}
<span
  onClick={() => setActiveFilterLetter("All")}
  style={{
    fontSize: "11px",
    padding: "6px 10px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "600",
    background: "#EF5D41",
    color: "#fff",
    transition: "0.2s"
  }}
>
  ✕
</span>

</div>

{/* ✅ FLEX WRAPPER */}
<div style={{ marginTop: "15px" }}>

  {/* ✅ USER LIST */}
  <div style={{
    flex: 1,
    
    paddingRight: "5px"
  }}>
    

    {filteredUsers.map((user, index) => (
      <div
        key={index}
        onClick={() => setSelectedUser(user)}
        style={{
  background:
    selectedUser?.email === user.email
      ? "#EFE7FF"          // ✅ highlighted background
      : "#ffffff",

  border:
    selectedUser?.email === user.email
      ? "2px solid #8C84D9" // ✅ purple border when selected
      : "1px solid #eee",

  padding: "12px",
  marginBottom: "8px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "0.2s"
}}
onMouseEnter={(e) => {
  if (selectedUser?.email !== user.email) {
    e.currentTarget.style.background = "#F9F9F9";
  }
}}
onMouseLeave={(e) => {
  if (selectedUser?.email !== user.email) {
    e.currentTarget.style.background = "#ffffff";
  }
}}

      >
        <b>
  {index + 1}. {user.firstName} {user.lastName}
</b>
      </div>
    ))}

  

 
  

</div>

      
    </div>
</div>

  
</div>





    {filteredUsers.length === 0 && (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        No users found
      </p>
    )}

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
  padding: "28px",
  borderRadius: "18px",
  width: isMobile ? "90%" : "450px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
}}>

     <h2 style={{
  marginTop: 0,
  marginBottom: "20px",
  color: "#1C132D"
}}>
  {selectedUser?.firstName} {selectedUser?.lastName}
</h2>

<div style={{
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginBottom: "20px"
}}>

  {/* EMAIL */}
  <div>
    <div style={{ fontSize: "11px", color: "#777" }}>Email</div>
    <div style={{ fontWeight: "500" }}>
      {selectedUser?.email || ""}
    </div>
  </div>

  {/* LOCATION */}
  <div>
    <div style={{ fontSize: "11px", color: "#777" }}>Location</div>
    <div style={{ fontWeight: "500" }}>
      {selectedUser?.location || ""}
    </div>
  </div>

  {/* SOCIAL */}
  <div>
    <div style={{ fontSize: "11px", color: "#777" }}>Social</div>
    <div style={{ fontWeight: "500" }}>
      {selectedUser?.social ? (
  <a
    href={selectedUser.social}
    target="_blank"
    style={{ color: "#3B82F6" }}
  >
    {selectedUser.social}
  </a>
) : ""}
    </div>
  </div>

  {/* BACKGROUND */}
  <div>
    <div style={{ fontSize: "11px", color: "#777" }}>Background</div>
    <div style={{ fontWeight: "500" }}>
      {selectedUser?.background || ""}
    </div>
  </div>

  {/* WEBSITE */}
  <div>
    <div style={{ fontSize: "11px", color: "#777" }}>Website</div>
    <div style={{ fontWeight: "500" }}>
      {selectedUser?.website || ""}
    </div>
  </div>

</div>



      

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
  top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  width: isMobile ? "90%" : "320px",
  maxHeight: "80vh",
  overflowY: "auto",  
  zIndex: 999
}}
>

          <h3>{activeEvent.title}</h3>
          <button
 onClick={() => {
  setShowAddForm(false); 
  setSelectedDay(null);

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
      width: isMobile ? "90%" : "300px",
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
      placeholder="Brand/Company"
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
  <option value="Online Interview">Online Interview</option>
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



// ✅ ONLY SEND IF CONFIRMED
if (status === "Confirmed") {

  const start = `${date}T10:00:00`;
  const end = `${date}T11:00:00`;

  const attendees = [
    "kayleen@2degreesconnections.com",
    "khate@2degreesconnections.com",
    "anna@2degreesconnections.com",
    "berit@2degreesconnections.com",
    "tasha@2degreesconnections.com"
  ].join(";");

  const subject = encodeURIComponent(newEventTitle);

 const outlookUrl = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${start}&enddt=${end}&to=${attendees}`;
  window.open(outlookUrl, "_blank");
}

    console.log("FETCH SENT ✅");

    await fetchMonday();

setNewEventTitle("");
setBrand("");
setNiche("");
setSocial("");
setContact("");
setStatus("");

setShowAddForm(false); 
setSelectedDay(null);
  }}
  style={{
    marginTop: "10px",
    background: "linear-gradient(135deg, #EF5D41, #D94C32)",
boxShadow: "0 6px 16px rgba(239, 93, 65, 0.3)",
transition: "0.2s",
    padding: "10px",
    width: "100%",
    cursor: "pointer"
  }}
  onMouseEnter={(e) =>
  (e.currentTarget.style.transform = "scale(1.05)")
}
onMouseLeave={(e) =>
  (e.currentTarget.style.transform = "scale(1)")
}
>
  ✅ Save
</button>

    
<button
  onClick={() => {
    setShowAddForm(false);
    setSelectedDay(null);
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
    <option value="Online Interview">Online Interview</option>
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


const dateOnly = editEvent.date?.split("T")[0];

const start = `${dateOnly}T10:00:00`;
const end = `${dateOnly}T11:00:00`;


const attendees = [
  "kayleen@2degreesconnections.com",
  "khate@2degreesconnections.com",
  "anna@2degreesconnections.com",
  "berit@2degreesconnections.com",
  "tasha@2degreesconnections.com"
].join(";");

const subject = encodeURIComponent(newEventTitle);

const outlookUrl = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${start}&enddt=${end}&to=${attendees}`;

window.open(outlookUrl, "_blank");

  await fetchMonday();

  setShowEditForm(false);
  setEditEvent(null);
}}
      style={{
        marginTop: "10px",
        background: "linear-gradient(135deg, #EF5D41, #D94C32)",
boxShadow: "0 6px 16px rgba(239, 93, 65, 0.3)",
transition: "0.2s",
        padding: "10px",
        width: "100%"
      }}
      onMouseEnter={(e) =>
  (e.currentTarget.style.transform = "scale(1.05)")
}
onMouseLeave={(e) =>
  (e.currentTarget.style.transform = "scale(1)")
}
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