# Airport Projects Database - Streamlit App

A Streamlit application that interfaces with Google Sheets to display, filter, search, and visualize airport project data on an interactive map.

## Features

✅ **Data Display** - View all your airport projects in a clean table format
✅ **Advanced Filtering** - Filter by country, status, and search across all fields
✅ **Map Visualization** - See projects plotted on an interactive map (requires coordinates)
✅ **Analytics Dashboard** - View statistics and charts about your projects
✅ **Export Data** - Download filtered data as CSV
✅ **Auto-refresh** - Data refreshes every 5 minutes automatically

## Setup Instructions

### 1. Google Cloud Setup

#### Create a Service Account:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API** and **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it
   - Search for "Google Drive API" and enable it

4. Create a Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Give it a name (e.g., "streamlit-sheets-reader")
   - Click "Create and Continue"
   - Grant role: "Editor" (or "Viewer" if you only need read access)
   - Click "Done"

5. Create a Key:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the JSON file (keep it secure!)

### 2. Share Your Google Sheet

1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as `client_email`)
4. Give it "Viewer" or "Editor" permission
5. Copy your sheet URL

### 3. Configure Streamlit Secrets

#### For Local Development:

Create a file `.streamlit/secrets.toml` in your project directory:

```toml
[gcp_service_account]
type = "service_account"
project_id = "your-project-id"
private_key_id = "your-private-key-id"
private_key = "-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
client_email = "your-service-account@your-project.iam.gserviceaccount.com"
client_id = "your-client-id"
auth_uri = "https://accounts.google.com/o/oauth2/auth"
token_uri = "https://oauth2.googleapis.com/token"
auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
client_x509_cert_url = "your-cert-url"
```

**⚠️ Important:** Copy these values from your downloaded JSON file

#### For Streamlit Cloud Deployment:

1. Go to your Streamlit Cloud dashboard
2. Click on your app
3. Go to Settings > Secrets
4. Paste the entire contents of your JSON file in this format:

```toml
[gcp_service_account]
type = "service_account"
project_id = "your-project-id"
private_key_id = "key-id"
private_key = "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
client_email = "your-email@project.iam.gserviceaccount.com"
client_id = "123456789"
auth_uri = "https://accounts.google.com/o/oauth2/auth"
token_uri = "https://oauth2.googleapis.com/token"
auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs"
client_x509_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/your-email%40project.iam.gserviceaccount.com"
```

### 4. Prepare Your Google Sheet

Your Google Sheet should have these columns (in any order):
- Date Fetched
- Date Published
- Airport Name
- Project Name
- Description
- Status
- City
- Country
- Estimated Completion
- Cost
- Summary
- Source URL
- Relevance

#### Optional: Add Coordinates for Map View

To enable map visualization, add two additional columns:
- **Latitude** (decimal degrees, e.g., 51.5074)
- **Longitude** (decimal degrees, e.g., -0.1278)

You can find coordinates:
- Using [LatLong.net](https://www.latlong.net/)
- Using Google Maps (right-click > coordinates)
- Using a geocoding service

## Installation

### Local Development:

```bash
# Clone or download the project
git clone <your-repo-url>
cd airport-projects-app

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run airport_projects_app.py
```

### Deploy to Streamlit Cloud:

1. Push your code to GitHub (exclude `.streamlit/secrets.toml`!)
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Click "New app"
4. Select your repository and branch
5. Set main file: `airport_projects_app.py`
6. Add secrets (see step 3 above)
7. Click "Deploy"

## Usage

1. **Enter Google Sheet URL**: Paste your sheet URL in the sidebar
2. **Apply Filters**: Use the filters to narrow down projects by country, status
3. **Search**: Use the search box to find specific projects
4. **View Data**: 
   - **Data Table** tab: See all project details, select columns, download CSV
   - **Map View** tab: See projects on an interactive map (requires coordinates)
   - **Analytics** tab: View charts and statistics

## Features Breakdown

### Data Table View
- Select which columns to display
- Responsive table with scrolling
- Download filtered data as CSV

### Map View
- Interactive map using Plotly
- Color-coded by project status
- Hover for project details
- Zoom and pan capabilities

### Analytics Dashboard
- Projects by country (bar chart)
- Projects by status (pie chart)
- Timeline of project publications
- Summary statistics (total projects, countries, airports, status types)

## Troubleshooting

### "Error loading data"
- Check that your service account email is shared on the Google Sheet
- Verify that APIs are enabled in Google Cloud Console
- Ensure secrets are properly formatted

### "No data found"
- Verify the sheet URL is correct
- Check that the sheet has data in the first worksheet
- Make sure column names match exactly

### Map not showing
- Add Latitude and Longitude columns to your sheet
- Ensure coordinates are in decimal degrees format
- Check that coordinates are not empty

## Data Security

- **Never commit** your `secrets.toml` file or JSON credentials to Git
- Add `.streamlit/` to your `.gitignore` file
- Keep your service account credentials secure
- Regularly rotate service account keys

## License

MIT License - Feel free to modify and use as needed!

## Support

For issues or questions, please create an issue in the repository.
