export async function GET() {
  
const query = `
  query {
    boards(ids: 18412930770) {
      groups {
        id
        title
      }
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

  const { name, date, group, brand, niche, social, contact } = body;
  const statusMap: any = {
  topics: "Idea",
  group_mm3ahc7c: "Outreach",
  group_mm3a2tx5: "Confirmed",
  group_mm3an27k: "Completed"
};
``


  const safeName = name.replace(/"/g, '\\"');

  
const columnValues = JSON.stringify({
  date_mm3a5hvm: { date },
  color_mm3anqa3: { label: statusMap[group] },

  text_mm3ayaff: brand || "",
  
text_mm3mf4yc0: {
  text: niche || ""
},

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
  Authorization: "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY2NjY5NTAzNSwiYWFpIjoxMSwidWlkIjo5NTQwMzYxMiwiaWFkIjoiMjAyNi0wNi0wM1QyMDoyODoyOS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MzAzNDM5MTMsInJnbiI6InVzZTEifQ._VZ7_sBN34oUXmumJtn-EWIe6yhVPFqNZs2K9dWDynk",
  "Content-Type": "application/json"
},

    body: JSON.stringify({ query })
  });

  const data = await res.json();

  console.log("MONDAY RESPONSE:", data);

  return Response.json(data);
}