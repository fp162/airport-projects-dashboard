import streamlit as st
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
import plotly.express as px
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Airport Projects Database",
    page_icon="✈️",
    layout="wide"
)

# Define the scope for Google Sheets API
SCOPE = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

@st.cache_data(ttl=300)  # Cache for 5 minutes
def load_data_from_sheet(sheet_url):
    """Load data from Google Sheets"""
    try:
        # Get credentials from Streamlit secrets
        credentials = Credentials.from_service_account_info(
            st.secrets["gcp_service_account"],
            scopes=SCOPE
        )
        
        # Authorize and open the sheet
        client = gspread.authorize(credentials)
        sheet = client.open_by_url(sheet_url)
        worksheet = sheet.get_worksheet(0)  # Get first sheet
        
        # Get all records as a list of dictionaries
        data = worksheet.get_all_records()
        df = pd.DataFrame(data)
        
        return df
    except Exception as e:
        st.error(f"Error loading data: {str(e)}")
        return pd.DataFrame()

def get_coordinates(city, country):
    """
    Helper function to get approximate coordinates for cities.
    In production, you'd want to use a geocoding API or have coordinates in your sheet.
    This is a placeholder that returns None - you'll need to add actual coordinates.
    """
    # TODO: Add geocoding logic or coordinates column in your sheet
    return None, None

def main():
    st.title("✈️ Airport Projects Database")
    st.markdown("---")
    
    # Sidebar for configuration
    with st.sidebar:
        st.header("⚙️ Configuration")
        sheet_url = st.text_input(
            "Google Sheet URL",
            placeholder="https://docs.google.com/spreadsheets/d/...",
            help="Paste your Google Sheet URL here"
        )
        
        if st.button("🔄 Refresh Data"):
            st.cache_data.clear()
            st.rerun()
    
    if not sheet_url:
        st.info("👈 Please enter your Google Sheet URL in the sidebar to get started.")
        st.markdown("""
        ### Setup Instructions:
        
        1. **Add your Google Sheet URL** in the sidebar
        2. **Configure credentials** in Streamlit secrets (see below)
        3. **Ensure your sheet has these columns:**
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
        """)
        return
    
    # Load data
    with st.spinner("Loading data from Google Sheets..."):
        df = load_data_from_sheet(sheet_url)
    
    if df.empty:
        st.warning("No data found or unable to load data. Please check your sheet URL and credentials.")
        return
    
    st.success(f"✅ Loaded {len(df)} projects")
    
    # Filters Section
    st.header("🔍 Filters & Search")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        # Country filter
        countries = ["All"] + sorted(df["Country"].unique().tolist())
        selected_country = st.selectbox("Country", countries)
    
    with col2:
        # Status filter
        statuses = ["All"] + sorted(df["Status"].unique().tolist())
        selected_status = st.selectbox("Status", statuses)
    
    with col3:
        # Search box
        search_term = st.text_input("🔎 Search", placeholder="Search in all fields...")
    
    # Apply filters
    filtered_df = df.copy()
    
    if selected_country != "All":
        filtered_df = filtered_df[filtered_df["Country"] == selected_country]
    
    if selected_status != "All":
        filtered_df = filtered_df[filtered_df["Status"] == selected_status]
    
    if search_term:
        # Search across all text columns
        mask = filtered_df.astype(str).apply(
            lambda row: row.str.contains(search_term, case=False, na=False).any(),
            axis=1
        )
        filtered_df = filtered_df[mask]
    
    st.markdown(f"**Showing {len(filtered_df)} of {len(df)} projects**")
    
    # Tabs for different views
    tab1, tab2, tab3 = st.tabs(["📊 Data Table", "🗺️ Map View", "📈 Analytics"])
    
    with tab1:
        st.header("Data Table")
        
        # Display options
        col1, col2 = st.columns([1, 3])
        with col1:
            columns_to_show = st.multiselect(
                "Select columns to display",
                options=df.columns.tolist(),
                default=["Airport Name", "Project Name", "City", "Country", "Status", "Estimated Completion"]
            )
        
        if columns_to_show:
            # Display dataframe with custom formatting
            display_df = filtered_df[columns_to_show].copy()
            
            st.dataframe(
                display_df,
                use_container_width=True,
                height=500,
                hide_index=True
            )
            
            # Download button
            csv = filtered_df.to_csv(index=False)
            st.download_button(
                label="📥 Download filtered data as CSV",
                data=csv,
                file_name=f"airport_projects_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )
        else:
            st.warning("Please select at least one column to display.")
    
    with tab2:
        st.header("Map View")
        
        st.info("""
        **Note:** To display projects on a map, you need to add latitude and longitude columns to your Google Sheet.
        
        **Option 1:** Add 'Latitude' and 'Longitude' columns manually
        **Option 2:** Use a geocoding service to automatically get coordinates from City/Country
        """)
        
        # Check if coordinates are available
        if 'Latitude' in filtered_df.columns and 'Longitude' in filtered_df.columns:
            # Filter out rows without coordinates
            map_df = filtered_df.dropna(subset=['Latitude', 'Longitude'])
            
            if not map_df.empty:
                # Create map using plotly
                fig = px.scatter_mapbox(
                    map_df,
                    lat='Latitude',
                    lon='Longitude',
                    hover_name='Airport Name',
                    hover_data={
                        'Project Name': True,
                        'City': True,
                        'Country': True,
                        'Status': True,
                        'Latitude': False,
                        'Longitude': False
                    },
                    color='Status',
                    zoom=1,
                    height=600
                )
                
                fig.update_layout(
                    mapbox_style="open-street-map",
                    margin={"r": 0, "t": 0, "l": 0, "b": 0}
                )
                
                st.plotly_chart(fig, use_container_width=True)
                
                st.caption(f"📍 Showing {len(map_df)} projects on map")
            else:
                st.warning("No projects with valid coordinates to display.")
        else:
            st.warning("Please add 'Latitude' and 'Longitude' columns to your Google Sheet to enable map visualization.")
            
            with st.expander("💡 How to add coordinates"):
                st.markdown("""
                You can add coordinates in several ways:
                
                1. **Manually:** Add two new columns called 'Latitude' and 'Longitude' and fill them in
                2. **Using Google Sheets formula:** Use the `=GEOCODE()` function if available
                3. **Using a geocoding API:** Services like Google Geocoding API, OpenCage, or Nominatim
                
                Example coordinates:
                - London, UK: 51.5074, -0.1278
                - New York, USA: 40.7128, -74.0060
                - Tokyo, Japan: 35.6762, 139.6503
                """)
    
    with tab3:
        st.header("Analytics Dashboard")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Projects by country
            st.subheader("Projects by Country")
            country_counts = filtered_df["Country"].value_counts()
            fig_country = px.bar(
                x=country_counts.values,
                y=country_counts.index,
                orientation='h',
                labels={'x': 'Number of Projects', 'y': 'Country'},
                height=400
            )
            fig_country.update_layout(showlegend=False)
            st.plotly_chart(fig_country, use_container_width=True)
        
        with col2:
            # Projects by status
            st.subheader("Projects by Status")
            status_counts = filtered_df["Status"].value_counts()
            fig_status = px.pie(
                values=status_counts.values,
                names=status_counts.index,
                height=400
            )
            st.plotly_chart(fig_status, use_container_width=True)
        
        # Timeline view (if dates are available)
        if "Date Published" in filtered_df.columns:
            st.subheader("Projects Timeline")
            try:
                # Try to parse dates
                timeline_df = filtered_df.copy()
                timeline_df["Date Published"] = pd.to_datetime(timeline_df["Date Published"], errors='coerce')
                timeline_df = timeline_df.dropna(subset=["Date Published"])
                
                if not timeline_df.empty:
                    timeline_counts = timeline_df.groupby(
                        timeline_df["Date Published"].dt.to_period("M")
                    ).size().reset_index()
                    timeline_counts.columns = ["Month", "Count"]
                    timeline_counts["Month"] = timeline_counts["Month"].astype(str)
                    
                    fig_timeline = px.line(
                        timeline_counts,
                        x="Month",
                        y="Count",
                        markers=True,
                        labels={'Count': 'Number of Projects', 'Month': 'Publication Month'}
                    )
                    st.plotly_chart(fig_timeline, use_container_width=True)
            except Exception as e:
                st.info("Unable to parse dates for timeline view.")
        
        # Summary statistics
        st.subheader("Summary Statistics")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Projects", len(filtered_df))
        with col2:
            st.metric("Countries", filtered_df["Country"].nunique())
        with col3:
            st.metric("Airports", filtered_df["Airport Name"].nunique())
        with col4:
            unique_statuses = filtered_df["Status"].nunique()
            st.metric("Status Types", unique_statuses)

if __name__ == "__main__":
    main()
