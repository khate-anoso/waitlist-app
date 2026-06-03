export async function GET() {
  const query = `
    query {
      boards(ids: 18412930770) {
        items_page {
  items {
    name
    column_values {
      id
      text
    }
  }
}

      }
    }
  `;

  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY2NjY5NTAzNSwiYWFpIjoxMSwidWlkIjo5NTQwMzYxMiwiaWFkIjoiMjAyNi0wNi0wM1QyMDoyODoyOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MzAzNDM5MTMsInJnbiI6InVzZTEifQ._VZ7_sBN34oUXmumJtn-EWIe6yhVPFqNZs2K9dWDynk",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();

  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const { name, date } = body;

  const query = `
    mutation {
      create_item(
        board_id: 18412930770,
        item_name: "${name}",
        column_values: "{\"date_mm3a5hvm\": {\"date\": \"${date}\"}}"
      ) {
        id
      }
    }
  `;

  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      Authorization: "eyJhbGciOiJIUzI1NiJ9...", // SAME TOKEN MO
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();

  return Response.json(data);
}