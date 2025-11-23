// app/page.js

import Papa from 'papaparse';
import DashboardClient from './dashboard-client'; // Import the interactive UI component we just created

// --- IMPORTANT ---
// This is the special URL to your Google Sheet.
// Make sure your Google Sheet is shared as "Anyone with the link" -> "Viewer".
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1djoDy2f_To38nS6K1TUFTepNcYIWENvYz7x4rw0Qtbw/export?format=csv';


/**
 * This function runs on the server to fetch the latest data from Google Sheets.
 */
async function getSheetData() {
  try {
    // Fetch the raw CSV data. { cache: 'no-store' } is a key part that tells Next.js
    // to always get the freshest data and not use a saved copy.
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const csvText = await response.text();

    // Parse the CSV text into a JavaScript array of objects.
    return new Promise(resolve => {
      Papa.parse(csvText, {
        header: true, // Use the first row of the sheet as object keys
        skipEmptyLines: true,
        complete: (results) => {
          // The original component uses `project.id` for keys. We add a unique ID here.
          const dataWithIds = results.data.map((row, index) => ({ id: index + 1, ...row }));
          resolve(dataWithIds);
        },
        error: () => resolve([]), // Return empty array on error
      });
    });
  } catch (error) {
    console.error("Error fetching or processing sheet data:", error);
    return []; // Return an empty array if anything goes wrong
  }
}

/**
 * This is your main page. It's an "async" Server Component.
 * It fetches data and then passes it to our interactive client component.
 */
export default async function Home() {
  // 1. Wait for the data to be fetched from Google Sheets
  const projects = await getSheetData();

  // 2. Render the interactive dashboard and pass the live data to it as a prop
  return <DashboardClient initialData={projects} />;
}
