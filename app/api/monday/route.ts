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
          boards(limit:1) {
            items_page {
              items {
                id
                name
                column_values {
                  id
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

  return Response.json(data);
}


// ✅ CREATE EVENT
export async function POST(req: Request) {
  const body = await req.json();
  const { name, date, group, brand, niche, social, contact } = body;

  const statusMap: any = {
    topics: "Idea",
    group_mm3ahc7c: "Outreach",
    group_mm3a2tx5: "Confirmed",
    group_mm3an27k: "Completed"
  };

  const safeName = name.replace(/"/g, '\\"');

  const columnValues = JSON.stringify({
    date_mm3a5hvm: { date },
    color_mm3anqa3: { label: statusMap[group] },
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
  return Response.json(data);
}


// ✅ EDIT EVENT
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, newTitle } = body;

  const query = `
    mutation {
      change_multiple_column_values(
        item_id: ${id},
        board_id: 18412930770,
        column_values: "{\\"name\\": \\"${newTitle}\\"}"
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
    body: JSON.stringify({ query })
  });

  return Response.json({ success: true });
}


// ✅ DELETE EVENT
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

  await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: process.env.MONDAY_API_KEY!,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  return Response.json({ success: true });
}