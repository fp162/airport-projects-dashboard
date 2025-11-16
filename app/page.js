'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { BUILD_INFO } from './build-info';

// Sample data - will be replaced with Google Sheets API later
const sampleData = [
  {
    id: 1,
    'Date Fetched': '2025-11-07',
    'Date Published': '2025-11-04',
    'Airport Name': 'Techo International Airport',
    'Project Name': 'Techo International Airport Construction',
    'Description': 'The project involves the construction of a new airport in Phnom Penh, Cambodia, under a phased expansion plan.',
    'Status': 'Completed',
    'City': 'Phnom Penh',
    'Country': 'Cambodia',
    'Estimated Completion': 'N/A',
    'Cost (N/A if it is not present in article)': 'N/A',
    'Summary': 'The new Techo International Airport has been inaugurated by the Cambodian Prime Minister, marking a significant development in the country\'s aviation infrastructure.',
    'Source URL': 'https://www.ainonline.com/aviation-news/air-transport/2025-11-04/cambodian-prime-minister-inaugurates-new-airport-phnom-penh',
    'Relevance': 'High',
    'Impact Summary': 'The new airport is expected to improve air travel services and boost the local economy in Phnom Penh, Cambodia.'
  },
  {
    id: 2,
    'Date Fetched': '2025-11-07',
    'Date Published': '2025-11-06',
    'Airport Name': 'Van Nuys Airport',
    'Project Name': 'Taxiway Repairs',
    'Description': 'The $19 million project involves repairs to taxiways, resulting in overnight runway closures through February.',
    'Status': 'In Progress',
    'City': 'Van Nuys',
    'Country': 'USA',
    'Estimated Completion': 'February 2026',
    'Cost (N/A if it is not present in article)': '$19 million',
    'Summary': 'Taxiway repairs at Van Nuys Airport are underway, causing overnight runway closures through February, as part of a $19 million project.',
    'Source URL': 'https://www.ainonline.com/aviation-news/business-aviation/2025-11-05/taxiway-repairs-spur-overnight-runway-closures-kvny',
    'Relevance': 'Medium',
    'Impact Summary': 'The project affects airport operations, causing overnight runway closures through February.'
  },
  {
    id: 3,
    'Date Fetched': '2025-11-07',
    'Date Published': '2025-11-04',
    'Airport Name': 'Hong Kong International Airport',
    'Project Name': 'Three-runway System',
    'Description': 'The Three-runway System is one of the biggest infrastructure projects in Hong Kong\'s history, laying the foundation for long-term growth and development of intermodal services.',
    'Status': 'In Progress',
    'City': 'Hong Kong',
    'Country': 'China',
    'Estimated Completion': 'N/A',
    'Cost (N/A if it is not present in article)': 'N/A',
    'Summary': 'The Three-runway System project at Hong Kong International Airport aims to enhance the airport\'s infrastructure and intermodal services, driving growth and development in the region.',
    'Source URL': 'https://aviationweek.com/air-transport/super-terminal-expo-2025-opens-grand-ceremony-creating-new-milestones-asian',
    'Relevance': 'High',
    'Impact Summary': 'The project is expected to drive long-term growth and development in the region, enhancing the airport\'s infrastructure and intermodal services.'
  },
  {
    id: 4,
    'Date Fetched': '2025-11-10',
    'Date Published': '2025-11-09',
    'Airport Name': 'Sardar Vallabhbhai Patel International Airport (SVPI)',
    'Project Name': 'New Parallel Taxiway Construction',
    'Description': 'The construction of a new parallel taxiway for Code C aircraft to enhance ground handling efficiency and reduce delays at Ahmedabad Airport.',
    'Status': 'In Progress',
    'City': 'Ahmedabad',
    'Country': 'India',
    'Estimated Completion': 'December 2025',
    'Cost (N/A if it is not present in article)': 'N/A',
    'Summary': 'The new parallel taxiway aims to increase aircraft movement capacity by 20%, reducing fuel consumption and turnaround time, and improving overall efficiency at Ahmedabad Airport.',
    'Source URL': 'https://propnewstime.com/getdetailsStories/MjI3NTA=/ahmedabad-airport-adds-new-parallel-taxiway-to-ease-congestion-and-improve-aircraft-movement',
    'Relevance': 'Medium',
    'Impact Summary': 'The new taxiway is expected to increase aircraft movement capacity, reduce delays, and improve overall efficiency at Ahmedabad Airport, benefiting passengers and airlines.'
  },
  {
    id: 5,
    'Date Fetched': '2025-11-10',
    'Date Published': '2025-11-08',
    'Airport Name': 'Navi Mumbai International Airport',
    'Project Name': 'Navi Mumbai International Airport Development',
    'Description': 'The project includes the development of a new international airport with multiple medical centers, emergency medical support, and disaster-management facilities.',
    'Status': 'In Progress',
    'City': 'Navi Mumbai',
    'Country': 'India',
    'Estimated Completion': 'Not specified',
    'Cost (N/A if it is not present in article)': 'N/A',
    'Summary': 'The Navi Mumbai International Airport is being developed as a major new hub for the Mumbai metropolitan region, with Apollo Hospitals providing 24x7 healthcare services.',
    'Source URL': 'https://propnewstime.com/getdetailsStories/MjI3MjM=/apollo-hospitals-to-provide-24x7-healthcare-services-at-navi-mumbai-international-airport',
    'Relevance': 'High',
    'Impact Summary': 'The project will improve the overall travel experience and safety of passengers at the Navi Mumbai International Airport.'
  },
  {
    id: 6,
    'Date Fetched': '2025-11-10',
    'Date Published': '2025-11-10',
    'Airport Name': 'Salt Lake City International Airport',
    'Project Name': 'Concourse Expansion',
    'Description': 'Salt Lake City International Airport opened 10 new gates and more than 8,000 ft.² of new concessions space, which will be used by Delta Air Lines and Southwest Airlines.',
    'Status': 'Completed',
    'City': 'Salt Lake City',
    'Country': 'USA',
    'Estimated Completion': 'N/A',
    'Cost (N/A if it is not present in article)': 'N/A',
    'Summary': 'The expansion adds new gates and concessions space to the airport, enhancing its capacity and passenger experience.',
    'Source URL': 'https://aviationweek.com/air-transport/airports-networks/airport-updates-latest-news-global-market-wc-nov-10-2025',
    'Relevance': 'Medium',
    'Impact Summary': 'The expansion will increase the airport\'s capacity and improve the passenger experience for Delta Air Lines and Southwest Airlines customers.'
  },
  {
    id: 7,
    'Date Fetched': '2025-11-10',
    'Date Published': '2025-11-10',
    'Airport Name': 'Singapore Changi Airport',
    'Project Name': 'First-Class Lounge Revamp',
    'Description': 'Singapore Airlines opened a new first-class lounge at Singapore Changi Airport, which is 11% larger than the previous lounge and has a capacity for 130 passengers.',
    'Status': 'Completed',
    'City': 'Singapore',
    'Country': 'Singapore',
    'Estimated Completion': 'N/A',
    'Cost (N/A if it is not present in article)': '$34 million',
    'Summary': 'The new lounge is part of a larger project to revamp Singapore Airlines\' lounges at the airport, enhancing the premium passenger experience.',
    'Source URL': 'https://aviationweek.com/air-transport/airports-networks/airport-updates-latest-news-global-market-wc-nov-10-2025',
    'Relevance': 'Low',
    'Impact Summary': 'The new lounge will provide an improved experience for Singapore Airlines\' first-class passengers, enhancing the airline\'s premium product.'
  },
  {
    id: 8,
    'Date Fetched': '2025-11-10',
    'Date Published': '2025-11-10',
    'Airport Name': 'San Francisco International Airport',
    'Project Name': 'Cargo Facility Construction',
    'Description': 'Skanska broke ground on a new cargo facility at San Francisco International Airport, which will include a 95,000-ft.² cargo area and 25,000 ft.² of office space.',
    'Status': 'In Progress',
    'City': 'San Francisco',
    'Country': 'USA',
    'Estimated Completion': '2028',
    'Cost (N/A if it is not present in article)': 'N/A',
    'Summary': 'The new cargo facility will enhance the airport\'s cargo handling capabilities and support growing demand for air cargo.',
    'Source URL': 'https://aviationweek.com/air-transport/airports-networks/airport-updates-latest-news-global-market-wc-nov-10-2025',
    'Relevance': 'Medium',
    'Impact Summary': 'The new cargo facility will increase the airport\'s cargo handling capacity, supporting the growth of e-commerce and other industries reliant on air cargo.'
  },
  {
    id: 9,
    'Date Fetched': '2025-11-10',
    'Date Published': '2025-11-10',
    'Airport Name': 'Stuttgart Airport',
    'Project Name': 'Security Checkpoint Reconstruction',
    'Description': 'Stuttgart Airport started reconstructing passenger security checkpoint lanes in Terminal 3 to expand the screening lanes and prepare for state-of-the-art CT screening equipment.',
    'Status': 'In Progress',
    'City': 'Stuttgart',
    'Country': 'Germany',
    'Estimated Completion': 'March 2026',
    'Cost (N/A if it is not present in article)': '$6 million',
    'Summary': 'The reconstruction will enhance the airport\'s security screening capabilities and improve the passenger experience.',
    'Source URL': 'https://aviationweek.com/air-transport/airports-networks/airport-updates-latest-news-global-market-wc-nov-10-2025',
    'Relevance': 'Low',
    'Impact Summary': 'The reconstructed security checkpoints will provide a more efficient and secure experience for passengers, reducing wait times and enhancing the overall airport experience.'
  },
  {
    id: 10,
    'Date Fetched': '2025-11-13',
    'Date Published': '2025-11-11',
    'Airport Name': 'Heathrow',
    'Project Name': 'Heathrow Expansion',
    'Description': 'The expansion includes the construction of a third runway, which would allow low-cost airlines to operate at the airport, increasing the range of products and services offered.',
    'Status': 'Proposed',
    'City': 'London',
    'Country': 'United Kingdom',
    'Estimated Completion': '2035',
    'Cost (N/A if it is not present in article)': '£49 billion',
    'Summary': 'Heathrow\'s expansion plan aims to increase capacity and attract low-cost airlines, with the potential to create growth and benefit passengers in the region.',
    'Source URL': 'https://www.flightglobal.com/airlines/enlarged-heathrow-would-open-door-to-low-cost-airlines/165249.article',
    'Relevance': 'High',
    'Impact Summary': 'The expansion of Heathrow would increase capacity, attract low-cost airlines, and create growth, benefiting passengers in the region.'
  },
  {
    id: 11,
    'Date Fetched': '2025-11-13',
    'Date Published': '2025-11-12',
    'Airport Name': 'Pittsburgh International Airport',
    'Project Name': 'Landside Terminal',
    'Description': 'A new $1.7 billion landside terminal to better accommodate origin and destination passengers, featuring a streamlined security experience, reduced baggage delivery times, and increased parking capacity.',
    'Status': 'Completed',
    'City': 'Pittsburgh',
    'Country': 'USA',
    'Estimated Completion': 'November 18, 2025',
    'Cost (N/A if it is not present in article)': '$1.7 billion',
    'Summary': 'Pittsburgh International Airport\'s new landside terminal aims to improve the passenger experience and increase capacity to handle up to 15 million annual passengers.',
    'Source URL': 'https://aviationweek.com/air-transport/airports-networks/pittsburgh-international-ready-open-17-billion-landside-terminal',
    'Relevance': 'High',
    'Impact Summary': 'The new terminal is expected to reduce baggage delivery times, streamline the security experience, and increase the airport\'s capacity to handle more passengers.'
  },
  {
    id: 12,
    'Date Fetched': '2025-11-14',
    'Date Published': '2025-11-13',
    'Airport Name': 'Sydney Airport',
    'Project Name': 'Sydney Airport Terminal Expansion and Capital Works Program',
    'Description': 'A $6 billion five-year capital works program to enhance capacity, improve efficiency, and elevate the passenger experience, including a landmark terminal upgrade project linking T2 and T3 domestic terminals.',
    'Status': 'Planned',
    'City': 'Sydney',
    'Country': 'Australia',
    'Estimated Completion': '2045',
    'Cost (N/A if it is not present in article)': '$6 billion',
    'Summary': 'Sydney Airport\'s capital works program aims to enhance capacity, improve efficiency, and elevate the passenger experience through major upgrades and a landmark terminal upgrade project.',
    'Source URL': 'https://travelweekly.com.au/sydney-airport-launches-global-tender-to-support-6b-five-year-capital-works-program/',
    'Relevance': 'High',
    'Impact Summary': 'The project will improve connectivity between terminals, unlock capacity, and support future growth, enhancing the overall passenger experience and efficiency for airlines.'
  },
  {
    id: 13,
    'Date Fetched': '2025-11-15',
    'Date Published': '2025-11-15',
    'Airport Name': 'Watertown International Airport',
    'Project Name': 'New Terminal Construction',
    'Description': 'The project includes a new 25,000 square foot terminal with an updated baggage carousel, more seating, and a new passenger jet bridge. Phase two of the project will turn the old terminal into a restaurant and improve the parking lot.',
    'Status': 'Completed',
    'City': 'Watertown',
    'Country': 'USA',
    'Estimated Completion': 'November 2025',
    'Cost (N/A if it is not present in article)': '$28 million',
    'Summary': 'The new terminal at Watertown International Airport has been completed, providing improved facilities for passengers. The project was supported by a state grant and will also include the redevelopment of the old terminal into a restaurant and parking lot improvements.',
    'Source URL': 'https://www.northcountrypublicradio.org/news/story/52647/20251115/watertown-airport-s-new-terminal-completed',
    'Relevance': 'Medium',
    'Impact Summary': 'The new terminal will improve the travel experience for passengers, providing a more comfortable and efficient environment.'
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('table');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [data] = useState(sampleData);
  const [expandedId, setExpandedId] = useState(null);
  const [showSourceDataModal, setShowSourceDataModal] = useState(false);

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase();
    switch(normalized) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-purple-100 text-purple-800';
      case 'proposed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelevanceColor = (relevance) => {
    const normalized = relevance?.toLowerCase();
    switch(normalized) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusEmoji = (status) => {
    const normalized = status?.toLowerCase();
    switch(normalized) {
      case 'completed': return '🟢';
      case 'in progress': return '🔵';
      case 'planned': return '🟣';
      case 'proposed': return '🟡';
      default: return '⚪';
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(project => {
      const matchesCountry = selectedCountry === 'All' || project['Country'] === selectedCountry;
      const matchesStatus = selectedStatus === 'All' || project['Status'] === selectedStatus;
      const matchesSearch = searchTerm === '' || 
        Object.values(project).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCountry && matchesStatus && matchesSearch;
    });
  }, [data, selectedCountry, selectedStatus, searchTerm]);

  const countries = useMemo(() => ['All', ...new Set(data.map(p => p['Country']))], [data]);
  const statuses = useMemo(() => ['All', ...new Set(data.map(p => p['Status']))], [data]);

  const statusCounts = useMemo(() => {
    return filteredData.reduce((acc, project) => {
      acc[project['Status']] = (acc[project['Status']] || 0) + 1;
      return acc;
    }, {});
  }, [filteredData]);

  const countryCounts = useMemo(() => {
    return filteredData.reduce((acc, project) => {
      acc[project['Country']] = (acc[project['Country']] || 0) + 1;
      return acc;
    }, {});
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full overflow-y-auto">
        {/* Logo */}
        <a 
          href="https://amygdalabs.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block mb-6"
        >
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-3">
            <img 
              src="/amygda-logo.png" 
              alt="Amygda Labs" 
              className="w-full h-auto"
            />
          </div>
        </a>

        <h2 className="text-lg font-semibold text-gray-800 mb-2">✈️ Airport Projects Tracker</h2>
        <p className="text-sm text-gray-600 mb-4">
          Stay ahead of global airport infrastructure developments with real-time project intelligence.
        </p>

        {/* Last Updated */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500 mb-1">Last Updated</p>
          <p className="text-sm font-semibold text-gray-900">
            {(() => {
              const lastUpdateDate = new Date(BUILD_INFO.timestamp);
              const today = new Date();
              const diffTime = Math.abs(today - lastUpdateDate);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 0) return '🟢 Today';
              if (diffDays === 1) return '🟡 Yesterday';
              if (diffDays <= 3) return `🟡 ${diffDays} days ago`;
              if (diffDays <= 7) return `🟠 ${diffDays} days ago`;
              return `🔴 ${diffDays} days ago`;
            })()}
          </p>
        </div>

        <hr className="my-6 border-gray-200" />

        <h3 className="text-sm font-semibold text-gray-800 mb-2">💡 About Amygda Labs</h3>
        <p className="text-xs text-gray-600 mb-4">
          We build <strong>predictive intelligence systems</strong> that work across any equipment in your fleet.
        </p>
        <p className="text-xs text-gray-600 mb-4">
          We help engineering teams maintain operational reliability through insights they trust and act on.
        </p>

        <hr className="my-6 border-gray-200" />

        <h3 className="text-sm font-semibold text-gray-800 mb-2">📬 Get in Touch</h3>
        <p className="text-xs text-gray-600 mb-3">
          Want predictive intelligence for your operations?
        </p>
        <div className="space-y-2">
          <a 
            href="mailto:faizan@amygdalabs.com"
            className="block text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            📧 faizan@amygdalabs.com
          </a>
          <a 
            href="https://www.linkedin.com/in/faizanpatankar/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            💼 Connect on LinkedIn
          </a>
          <a 
            href="https://amygdalabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            🌐 amygdalabs.com
          </a>
        </div>

        <hr className="my-6 border-gray-200" />

        <p className="text-xs text-gray-500">
          ℹ️ Data refreshes automatically with each deployment.
        </p>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">✈️ Airport Projects Database</h1>
        <div className="h-1 bg-gray-200 rounded mb-6"></div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">✅ Loaded {data.length} projects</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Filters & Search</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔎 Search</label>
              <input
                type="text"
                placeholder="Search in all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <p className="mt-4 text-sm font-medium text-gray-700">
            Showing {filteredData.length} of {data.length} projects
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('table')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'table'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Data Table
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                📈 Analytics
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Data Table Tab - Card List View */}
            {activeTab === 'table' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Projects List</h2>
                  <button 
                    onClick={() => setShowSourceDataModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    Source Data
                  </button>
                </div>

                <div className="space-y-4">
                  {filteredData.map((project) => (
                    <div 
                      key={project.id} 
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Card Header - Always Visible */}
                      <div 
                        onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                        className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {project['Airport Name']}
                                </h3>
                                <p className="text-base text-blue-600 font-medium">
                                  {project['Project Name']}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRelevanceColor(project['Relevance'])}`}>
                                  {project['Relevance']}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project['Status'])}`}>
                                  {project['Status']}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {project['Description']}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">💰</span>
                                <span className="font-semibold text-gray-900">{project['Cost (N/A if it is not present in article)']}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">🌍</span>
                                <span>{project['Country']}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">📅</span>
                                <span>{project['Date Fetched']}</span>
                              </div>
                            </div>
                          </div>

                          {/* Expand/Collapse Icon */}
                          <div className="flex-shrink-0 pt-1">
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === project.id ? 'rotate-180' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedId === project.id && (
                        <div className="border-t border-gray-200 bg-gray-50 p-5">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Project Details</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-500">City</p>
                                  <p className="text-sm text-gray-900">{project['City']}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Estimated Completion</p>
                                  <p className="text-sm text-gray-900">{project['Estimated Completion']}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Date Published</p>
                                  <p className="text-sm text-gray-900">{project['Date Published']}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">Summary</h4>
                              <p className="text-sm text-gray-700 mb-4">
                                {project['Summary']}
                              </p>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Impact</p>
                                <p className="text-sm text-gray-900">
                                  {project['Impact Summary']}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <a 
                              href={project['Source URL']} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              <span>View Source</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredData.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No projects found matching your filters.</p>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h2>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-600 font-medium">Total Projects</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{filteredData.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-green-600 font-medium">Countries</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {new Set(filteredData.map(p => p['Country'])).size}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Airports</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {new Set(filteredData.map(p => p['Airport Name'])).size}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">Status Types</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      {new Set(filteredData.map(p => p['Status'])).size}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Projects by Country */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Country</h3>
                    <div className="space-y-3">
                      {Object.entries(countryCounts)
                        .sort(([, a], [, b]) => b - a)
                        .map(([country, count]) => (
                          <div key={country} className="flex items-center gap-3">
                            <div className="w-32 text-sm text-gray-700 flex-shrink-0">{country}</div>
                            <div className="flex-1">
                              <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-full flex items-center justify-end pr-2"
                                  style={{ width: `${(count / data.length) * 100}%` }}
                                >
                                  <span className="text-xs text-white font-medium">{count}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Projects by Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
                    <div className="space-y-3">
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getStatusEmoji(status)}</span>
                            <span className="text-sm font-medium text-gray-700">{status}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{count}</div>
                            <div className="text-xs text-gray-500">
                              {((count / filteredData.length) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Insights */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Top Countries</h4>
                      {Object.entries(countryCounts)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([country, count]) => (
                          <div key={country} className="text-sm text-gray-600 mb-1">
                            • {country}: <strong>{count}</strong> projects
                          </div>
                        ))}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Status Distribution</h4>
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} className="text-sm text-gray-600 mb-1">
                          {getStatusEmoji(status)} {status}: <strong>{count}</strong> ({((count / filteredData.length) * 100).toFixed(1)}%)
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Source Data Modal */}
      {showSourceDataModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowSourceDataModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal content */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Access Source Data
              </h3>
              
              <p className="text-gray-600 mb-6">
                Interested in the complete dataset and raw source data?
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 font-medium">
                  📧 Email me to get access to source data
                </p>
              </div>

              <a
                href="mailto:faizan@amygdalabs.com?subject=Airport Projects - Source Data Access Request"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium w-full"
                onClick={() => setShowSourceDataModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Faizan
              </a>

              <p className="text-xs text-gray-500 mt-4">
                Or connect on{' '}
                <a 
                  href="https://www.linkedin.com/in/faizanpatankar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  LinkedIn
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
