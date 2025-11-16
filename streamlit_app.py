import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Airport Projects Database",
    page_icon="✈️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .main > div {
        padding-top: 2rem;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 2px;
    }
    .stTabs [data-baseweb="tab"] {
        padding: 10px 20px;
    }
    div[data-testid="metric-container"] {
        background-color: #f0f2f6;
        border: 1px solid #e0e0e0;
        padding: 15px;
        border-radius: 5px;
    }
    </style>
""", unsafe_allow_html=True)

# Sample data for demonstration
@st.cache_data
def load_sample_data():
    """Load sample data - replace this with your Google Sheets connection"""
    data = {
        'Date Fetched': ['2024-11-10', '2024-11-12', '2024-11-13', '2024-11-14', '2024-11-09'],
        'Date Published': ['2024-11-01', '2024-10-28', '2024-11-05', '2024-11-08', '2024-10-15'],
        'Airport Name': ['Heathrow Airport', 'JFK International', 'Dubai International', 'Changi Airport', 'Frankfurt Airport'],
        'Project Name': ['Terminal 3 Expansion', 'New Terminal One', 'Runway Enhancement', 'Terminal 5 Construction', 'Baggage System Upgrade'],
        'Description': [
            'Major expansion of Terminal 3 facilities',
            'Construction of state-of-the-art terminal',
            'Upgrading runway systems and lighting',
            'New terminal to increase capacity',
            'Modernizing baggage handling systems'
        ],
        'Status': ['In Progress', 'Planning', 'Completed', 'In Progress', 'In Progress'],
        'City': ['London', 'New York', 'Dubai', 'Singapore', 'Frankfurt'],
        'Country': ['United Kingdom', 'United States', 'United Arab Emirates', 'Singapore', 'Germany'],
        'Estimated Completion': ['2026-Q2', '2028-Q4', '2024-Q3', '2030-Q1', '2025-Q3'],
        'Cost (N/A if it is not present in article)': ['£450M', '$9.5B', '$120M', '$3.5B', '€85M'],
        'Summary': [
            'Expanding capacity by 25%',
            'World-class terminal facility',
            'Enhanced safety and efficiency',
            'Adding 50M passenger capacity',
            'Automated baggage handling'
        ],
        'Source URL': [
            'https://example.com/heathrow',
            'https://example.com/jfk',
            'https://example.com/dubai',
            'https://example.com/changi',
            'https://example.com/frankfurt'
        ],
        'Relevance': ['High', 'High', 'Medium', 'High', 'Medium'],
        'Latitude': [51.4700, 40.6413, 25.2532, 1.3644, 50.0379],
        'Longitude': [-0.4543, -73.7781, 55.3657, 103.9915, 8.5622]
    }
    return pd.DataFrame(data)

def get_status_color(status):
    """Return color for status badge"""
    colors = {
        'Completed': '🟢',
        'In Progress': '🔵',
        'Planning': '🟡',
        'On Hold': '🔴'
    }
    return colors.get(status, '⚪')

def main():
    # Sidebar
    with st.sidebar:
        st.markdown("### ⚙️ Data Controls")
        
        if st.button("🔄 Refresh Data", use_container_width=True):
            st.cache_data.clear()
            st.rerun()
        
        st.markdown("---")
        
        st.markdown("### 📊 About")
        st.caption("This dashboard displays airport project data from the connected Google Sheet.")
        
        st.markdown("---")
        st.caption("💡 Tip: Add Latitude and Longitude columns to your sheet for map visualization")
    
    # Main content
    st.title("✈️ Airport Projects Database")
    st.markdown("---")
    
    # Load data
    df = load_sample_data()
    
    # Success message
    st.success(f"✅ Loaded {len(df)} projects")
    
    # Filters Section
    st.markdown("### 🔍 Filters & Search")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        countries = ['All'] + sorted(df['Country'].unique().tolist())
        selected_country = st.selectbox("Country", countries)
    
    with col2:
        statuses = ['All'] + sorted(df['Status'].unique().tolist())
        selected_status = st.selectbox("Status", statuses)
    
    with col3:
        search_term = st.text_input("🔎 Search", placeholder="Search in all fields...")
    
    # Apply filters
    filtered_df = df.copy()
    
    if selected_country != "All":
        filtered_df = filtered_df[filtered_df['Country'] == selected_country]
    
    if selected_status != "All":
        filtered_df = filtered_df[filtered_df['Status'] == selected_status]
    
    if search_term:
        mask = filtered_df.astype(str).apply(
            lambda row: row.str.contains(search_term, case=False, na=False).any(),
            axis=1
        )
        filtered_df = filtered_df[mask]
    
    st.markdown(f"**Showing {len(filtered_df)} of {len(df)} projects**")
    st.markdown("---")
    
    # Tabs
    tab1, tab2, tab3 = st.tabs(["📊 Data Table", "🗺️ Map View", "📈 Analytics"])
    
    # TAB 1: DATA TABLE
    with tab1:
        st.markdown("### Data Table")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            columns_to_show = st.multiselect(
                "Select columns to display",
                options=df.columns.tolist(),
                default=['Airport Name', 'Project Name', 'City', 'Country', 'Status', 'Estimated Completion']
            )
        
        with col2:
            st.markdown("")  # Spacing
            st.markdown("")  # Spacing
            csv = filtered_df.to_csv(index=False)
            st.download_button(
                label="📥 Download CSV",
                data=csv,
                file_name=f"airport_projects_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv",
                use_container_width=True
            )
        
        if columns_to_show:
            # Create a styled dataframe
            display_df = filtered_df[columns_to_show].copy()
            
            # Add status emoji if Status column is selected
            if 'Status' in display_df.columns:
                display_df['Status'] = display_df['Status'].apply(
                    lambda x: f"{get_status_color(x)} {x}"
                )
            
            st.dataframe(
                display_df,
                use_container_width=True,
                height=500,
                hide_index=True
            )
        else:
            st.warning("⚠️ Please select at least one column to display.")
    
    # TAB 2: MAP VIEW
    with tab2:
        st.markdown("### Map View")
        
        # Check if coordinates exist
        if 'Latitude' in filtered_df.columns and 'Longitude' in filtered_df.columns:
            map_df = filtered_df.dropna(subset=['Latitude', 'Longitude'])
            
            if not map_df.empty:
                # Create hover text
                map_df['hover_text'] = (
                    '<b>' + map_df['Airport Name'] + '</b><br>' +
                    map_df['Project Name'] + '<br>' +
                    map_df['City'] + ', ' + map_df['Country'] + '<br>' +
                    'Status: ' + map_df['Status']
                )
                
                # Create map
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
                        'Estimated Completion': True,
                        'Latitude': False,
                        'Longitude': False
                    },
                    color='Status',
                    color_discrete_map={
                        'Completed': '#10b981',
                        'In Progress': '#3b82f6',
                        'Planning': '#f59e0b',
                        'On Hold': '#ef4444'
                    },
                    zoom=1,
                    height=600,
                    size_max=15
                )
                
                fig.update_layout(
                    mapbox_style="open-street-map",
                    margin={"r": 0, "t": 0, "l": 0, "b": 0},
                    showlegend=True
                )
                
                st.plotly_chart(fig, use_container_width=True)
                st.caption(f"📍 Showing {len(map_df)} projects on map")
            else:
                st.warning("⚠️ No projects with valid coordinates to display.")
        else:
            st.info("""
            **📍 Map visualization requires coordinates**
            
            To enable the map view, add two columns to your Google Sheet:
            - `Latitude` (decimal degrees, e.g., 51.5074)
            - `Longitude` (decimal degrees, e.g., -0.1278)
            
            💡 You can find coordinates using [LatLong.net](https://www.latlong.net/) or Google Maps
            """)
    
    # TAB 3: ANALYTICS
    with tab3:
        st.markdown("### Analytics Dashboard")
        
        # Summary metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Projects", len(filtered_df))
        
        with col2:
            st.metric("Countries", filtered_df['Country'].nunique())
        
        with col3:
            st.metric("Airports", filtered_df['Airport Name'].nunique())
        
        with col4:
            st.metric("Status Types", filtered_df['Status'].nunique())
        
        st.markdown("---")
        
        # Charts row
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### Projects by Country")
            country_counts = filtered_df['Country'].value_counts().reset_index()
            country_counts.columns = ['Country', 'Count']
            
            fig_country = px.bar(
                country_counts,
                x='Count',
                y='Country',
                orientation='h',
                text='Count',
                color='Count',
                color_continuous_scale='Blues'
            )
            fig_country.update_traces(textposition='outside')
            fig_country.update_layout(
                showlegend=False,
                height=400,
                xaxis_title="Number of Projects",
                yaxis_title="",
                yaxis={'categoryorder': 'total ascending'}
            )
            st.plotly_chart(fig_country, use_container_width=True)
        
        with col2:
            st.markdown("#### Projects by Status")
            status_counts = filtered_df['Status'].value_counts().reset_index()
            status_counts.columns = ['Status', 'Count']
            
            colors = {
                'Completed': '#10b981',
                'In Progress': '#3b82f6',
                'Planning': '#f59e0b',
                'On Hold': '#ef4444'
            }
            status_counts['Color'] = status_counts['Status'].map(colors)
            
            fig_status = px.pie(
                status_counts,
                values='Count',
                names='Status',
                color='Status',
                color_discrete_map=colors,
                hole=0.4
            )
            fig_status.update_traces(textposition='inside', textinfo='percent+label')
            fig_status.update_layout(height=400, showlegend=True)
            st.plotly_chart(fig_status, use_container_width=True)
        
        # Timeline (if dates available)
        st.markdown("---")
        st.markdown("#### Projects Timeline")
        
        try:
            timeline_df = filtered_df.copy()
            timeline_df['Date Published'] = pd.to_datetime(timeline_df['Date Published'], errors='coerce')
            timeline_df = timeline_df.dropna(subset=['Date Published'])
            
            if not timeline_df.empty:
                timeline_df['Month'] = timeline_df['Date Published'].dt.to_period('M').astype(str)
                timeline_counts = timeline_df.groupby('Month').size().reset_index()
                timeline_counts.columns = ['Month', 'Count']
                
                fig_timeline = px.line(
                    timeline_counts,
                    x='Month',
                    y='Count',
                    markers=True,
                    labels={'Count': 'Number of Projects', 'Month': 'Publication Month'}
                )
                fig_timeline.update_traces(line_color='#3b82f6', marker=dict(size=10))
                fig_timeline.update_layout(height=350)
                st.plotly_chart(fig_timeline, use_container_width=True)
            else:
                st.info("📅 No valid dates available for timeline visualization")
        except Exception as e:
            st.info("📅 Unable to parse dates for timeline view")
        
        # Additional insights
        st.markdown("---")
        st.markdown("#### Quick Insights")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**Top 5 Countries by Project Count**")
            top_countries = filtered_df['Country'].value_counts().head(5)
            for country, count in top_countries.items():
                st.write(f"• {country}: **{count}** projects")
        
        with col2:
            st.markdown("**Status Distribution**")
            for status, count in filtered_df['Status'].value_counts().items():
                percentage = (count / len(filtered_df)) * 100
                st.write(f"{get_status_color(status)} {status}: **{count}** ({percentage:.1f}%)")

if __name__ == "__main__":
    main()
