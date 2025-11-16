'use client';

import { useState, useMemo } from 'react';
import { Download, Search } from 'lucide-react';

// Sample data - will be replaced with Google Sheets API later
const sampleData = [
  {
    id: 1,
    dateFetched: '2024-11-10',
    datePublished: '2024-11-01',
    airportName: 'Heathrow Airport',
    projectName: 'Terminal 3 Expansion',
    description: 'Major expansion of Terminal 3 facilities',
    status: 'In Progress',
    city: 'London',
    country: 'United Kingdom',
    estimatedCompletion: '2026-Q2',
    cost: '£450M',
    summary: 'Expanding capacity by 25%',
    sourceUrl: 'https://example.com/heathrow',
    relevance: 'High',
    latitude: 51.4700,
    longitude: -0.4543
  },
  {
    id: 2,
    dateFetched: '2024-11-12',
    datePublished: '2024-10-28',
    airportName: 'JFK International',
    projectName: 'New Terminal One',
    description: 'Construction of state-of-the-art terminal',
    status: 'Planning',
    city: 'New York',
    country: 'United States',
    estimatedCompletion: '2028-Q4',
    cost: '$9.5B',
    summary: 'World-class terminal facility',
    sourceUrl: 'https://example.com/jfk',
    relevance: 'High',
    latitude: 40.6413,
    longitude: -73.7781
  },
  {
    id: 3,
    dateFetched: '2024-11-13',
    datePublished: '2024-11-05',
    airportName: 'Dubai International',
    projectName: 'Runway Enhancement',
    description: 'Upgrading runway systems and lighting',
    status: 'Completed',
    city: 'Dubai',
    country: 'United Arab Emirates',
    estimatedCompletion: '2024-Q3',
    cost: '$120M',
    summary: 'Enhanced safety and efficiency',
    sourceUrl: 'https://example.com/dubai',
    relevance: 'Medium',
    latitude: 25.2532,
    longitude: 55.3657
  },
  {
    id: 4,
    dateFetched: '2024-11-14',
    datePublished: '2024-11-08',
    airportName: 'Changi Airport',
    projectName: 'Terminal 5 Construction',
    description: 'New terminal to increase capacity',
    status: 'In Progress',
    city: 'Singapore',
    country: 'Singapore',
    estimatedCompletion: '2030-Q1',
    cost: '$3.5B',
    summary: 'Adding 50M passenger capacity',
    sourceUrl: 'https://example.com/changi',
    relevance: 'High',
    latitude: 1.3644,
    longitude: 103.9915
  },
  {
    id: 5,
    dateFetched: '2024-11-09',
    datePublished: '2024-10-15',
    airportName: 'Frankfurt Airport',
    projectName: 'Baggage System Upgrade',
    description: 'Modernizing baggage handling systems',
    status: 'In Progress',
    city: 'Frankfurt',
    country: 'Germany',
    estimatedCompletion: '2025-Q3',
    cost: '€85M',
    summary: 'Automated baggage handling',
    sourceUrl: 'https://example.com/frankfurt',
    relevance: 'Medium',
    latitude: 50.0379,
    longitude: 8.5622
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('table');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [data] = useState(sampleData);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'Completed': return '🟢';
      case 'In Progress': return '🔵';
      case 'Planning': return '🟡';
      default: return '⚪';
    }
  };

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(project => {
      const matchesCountry = selectedCountry === 'All' || project.country === selectedCountry;
      const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
      const matchesSearch = searchTerm === '' || 
        Object.values(project).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCountry && matchesStatus && matchesSearch;
    });
  }, [data, selectedCountry, selectedStatus, searchTerm]);

  const countries = useMemo(() => ['All', ...new Set(data.map(p => p.country))], [data]);
  const statuses = useMemo(() => ['All', ...new Set(data.map(p => p.status))], [data]);

  const statusCounts = useMemo(() => {
    return filteredData.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
  }, [filteredData]);

  const countryCounts = useMemo(() => {
    return filteredData.reduce((acc, project) => {
      acc[project.country] = (acc[project.country] || 0) + 1;
      return acc;
    }, {});
  }, [filteredData]);

  const downloadCSV = () => {
    const headers = Object.keys(filteredData[0] || {});
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(header => JSON.stringify(row[header] || '')).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airport_projects_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 fixed h-full overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 About</h2>
        <p className="text-sm text-gray-600 mb-6">
          This dashboard displays airport project data from the connected Google Sheet.
        </p>

        <hr className="my-6 border-gray-200" />

        <h3 className="text-sm font-semibold text-gray-800 mb-2">ℹ️ Info</h3>
        <p className="text-xs text-gray-500">
          Data is automatically updated once daily.
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
            {/* Data Table Tab */}
            {activeTab === 'table' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Data Table</h2>
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Airport Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Project Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">City</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Country</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Est. Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((project, index) => (
                        <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{project.airportName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{project.projectName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{project.city}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{project.country}</td>
                          <td className="px-4 py-3 text-sm border-b">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{project.estimatedCompletion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                      {new Set(filteredData.map(p => p.country)).size}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Airports</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {new Set(filteredData.map(p => p.airportName)).size}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-orange-600 font-medium">Status Types</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      {new Set(filteredData.map(p => p.status)).size}
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
    </div>
  );
}
