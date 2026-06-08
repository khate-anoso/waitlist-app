export async function GET() {
  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.MONDAY_API_KEY || "",
    },
    body: JSON.stringify({
      query: `
  {
    boards(ids: 18412930770) {
      items_page(limit: 100) {
        items {
          id
          name
          column_values {
            id
            type
            text
            value
          }
        }
      }
    }
  }

      `,
    }),
  });

  const data = await res.json();

  console.log("FULL DATA 👉", JSON.stringify(data, null, 2)); // ✅ ADD THIS

  return Response.json(data);
}


// ✅ CREATE
export async function POST(req: Request) {
  const body = await req.json();
  const { name, date, group, brand, niche, social, contact, status } = body;

  const safeName = name.replace(/"/g, '\\"');

  const columnValues = JSON.stringify({
  date_mm3a5hvm: { date },
  color_mm3anqa3: {
  label: status
},
  text_mm3ayaff: brand || "",
  text_mm404sek: niche || "",
  text_mm3ad018: contact || "",
  link_mm3ybwmx: { url: social || "", text: social || "" }
}).replace(/"/g, '\\"');

  const query = `
    mutation {
      create_item(
        board_id: 18412930770,
        group_id: "${group}",
        item_name: "${safeName}",
        column_values: "${columnValues}"
      ) {
        id
      }
    }
  `;

  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: process.env.MONDAY_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log("CREATE RESPONSE:", data);

  return Response.json(data);
}


export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, newTitle, status, brand, niche, social, contact } = body;
    const safeTitle = newTitle.replace(/"/g, '\\"');

    // ✅ status → group mapping
    const groupMap: any = {
      Idea: "topics",
      Outreach: "group_mm3ahc7c",
      Confirmed: "group_mm3a2tx5",
      Completed: "group_mm3an27k"
    };

    const newGroup = groupMap[status] || "topics";

    // ✅ 1. UPDATE NAME
    const nameQuery = `
      mutation {
        change_item_name(
          item_id: ${id},
          board_id: 18412930770,
          name: "${safeTitle}"
        ) {
          id
        }
      }
    `;

    await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        Authorization: process.env.MONDAY_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: nameQuery })
    });

    // ✅ 2. UPDATE STATUS COLUMN
    const otherFieldsQuery = `
  mutation {
    change_multiple_column_values(
      board_id: 18412930770,
      item_id: ${id},
      column_values: "{\\"text_mm3ayaff\\": \\"${brand || ""}\\", \\"text_mm404sek\\": \\"${niche || ""}\\", \\"text_mm3ad018\\": \\"${contact || ""}\\", \\"link_mm3ybwmx\\": {\\"url\\": \\"${social || ""}\\", \\"text\\": \\"${social || ""}\\"}}"
    ) {
      id
    }
  }
`;
``
await fetch("https://api.monday.com/v2", {
  method: "POST",
  headers: {
    Authorization: process.env.MONDAY_API_KEY!,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query: otherFieldsQuery })
});
    const statusQuery = `
  mutation {
    change_column_value(
      board_id: 18412930770,
      item_id: ${id},
      column_id: "color_mm3anqa3",
      value: "{\\"label\\": \\"${status}\\"}"
    ) {
      id
    }
  }
`;

    await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        Authorization: process.env.MONDAY_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: statusQuery })
    });

    // ✅ 3. MOVE GROUP
    const moveQuery = `
      mutation {
        move_item_to_group(
          item_id: ${id},
          group_id: "${newGroup}"
        ) {
          id
        }
      }
    `;

    await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        Authorization: process.env.MONDAY_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: moveQuery })
    });

    return Response.json({ success: true });

  } catch (err) {
    console.log("PUT ERROR:", err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}



// ✅ DELETE
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  const query = `
    mutation {
      delete_item(item_id: ${id}) {
        id
      }
    }
  `;

  const res = await fetch("https://api.monday.com/v2", {
  method: "POST",
  headers: {
    Authorization: process.env.MONDAY_API_KEY!,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ query })
});

const data = await res.json();
console.log("DELETE RESPONSE:", data);


  return Response.json({ success: true });
}
