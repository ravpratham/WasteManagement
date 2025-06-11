import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Save, Filter, FileText, Trash2, BarChart3, TrendingUp } from 'lucide-react';
import { WasteCollectionEntry } from '../../data/wasteCollectionData';
import { fetchWasteCollectionRecords, createWasteCollectionRecord, deleteWasteCollectionRecord } from '../../api/wasteCollectionApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const DataEntryPage: React.FC = () => {
  // State for the new data entry form
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    society: '',
    location: '',
    driveType: '',
    houses: '',
    weight: '',
    vehicle: '',
    remarks: '',
  });

  // State for the waste collection data table
  const [collections, setCollections] = useState<WasteCollectionEntry[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<WasteCollectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [societyFilter, setSocietyFilter] = useState('');
  const [selectedSociety, setSelectedSociety] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch waste collection records
  useEffect(() => {
    const loadRecords = async () => {
      try {
        setIsLoading(true);
        const records = await fetchWasteCollectionRecords();
        setCollections(records);
        setFilteredCollections(records);
        setError(null);
      } catch (err) {
        setError('Failed to load waste collection records');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, []);

  useEffect(() => {
    // Apply filters to collections
    let results = collections;
    
    if (searchTerm) {
      results = results.filter(item => 
        item.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.driveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remarks.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateFilter) {
      results = results.filter(item => item.date.includes(dateFilter));
    }
    
    if (societyFilter) {
      results = results.filter(item => item.society === societyFilter);
    }
    
    setFilteredCollections(results);
  }, [searchTerm, dateFilter, societyFilter, collections]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a new collection entry
      const newRecord = {
        date: formData.date,
        society: formData.society,
        location: formData.location,
        driveType: formData.driveType,
        houses: parseInt(formData.houses) || 0,
        weight: parseFloat(formData.weight) || 0,
        vehicle: formData.vehicle,
        remarks: formData.remarks,
      };
      
      const createdRecord = await createWasteCollectionRecord(newRecord);
      
      // Add to the beginning of the collections array
      setCollections(prev => [createdRecord, ...prev]);
      
      // Reset form
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        society: '',
        location: '',
        driveType: '',
        houses: '',
        weight: '',
        vehicle: '',
        remarks: '',
      });
      
      // Show success message
      alert('Data entry saved successfully!');
    } catch (err) {
      alert('Failed to save data entry. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteWasteCollectionRecord(id);
        setCollections(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        alert('Failed to delete entry. Please try again.');
        console.error(err);
      }
    }
  };

  // Get unique societies for the filter dropdown
  const societies = [...new Set(collections.map(item => item.society))];

  // Generate monthly collection data for organization
  const generateMonthlyData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    collections.forEach(collection => {
      const date = new Date(collection.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + collection.weight;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, weight]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        weight: Math.round(weight * 100) / 100
      }));
  };

  // Generate monthly data for selected society
  const generateSocietyMonthlyData = (society: string) => {
    const monthlyData: { [key: string]: number } = {};
    
    collections
      .filter(collection => collection.society === society)
      .forEach(collection => {
        const date = new Date(collection.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + collection.weight;
      });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, weight]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        weight: Math.round(weight * 100) / 100
      }));
  };

  // Generate society comparison data
  const generateSocietyComparisonData = () => {
    const societyData: { [key: string]: number } = {};
    
    collections.forEach(collection => {
      societyData[collection.society] = (societyData[collection.society] || 0) + collection.weight;
    });

    return Object.entries(societyData)
      .map(([society, weight]) => ({
        society,
        weight: Math.round(weight * 100) / 100
      }))
      .sort((a, b) => b.weight - a.weight);
  };

  // Generate vehicle usage data
  const generateVehicleData = () => {
    const vehicleData: { [key: string]: number } = {};
    
    collections.forEach(collection => {
      vehicleData[collection.vehicle] = (vehicleData[collection.vehicle] || 0) + 1;
    });

    return Object.entries(vehicleData).map(([vehicle, count]) => ({
      vehicle,
      count
    }));
  };

  const monthlyOrgData = generateMonthlyData();
  const societyComparisonData = generateSocietyComparisonData();
  const vehicleData = generateVehicleData();
  const societyMonthlyData = selectedSociety ? generateSocietyMonthlyData(selectedSociety) : [];

  const COLORS = ['#2F855A', '#38B2AC', '#4299E1', '#805AD5', '#D53F8C', '#F6AD55'];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Collection Data Management</h1>
          <p className="text-gray-600">Record waste collection data and analyze trends with comprehensive visualizations.</p>
        </div>

        {/* Data Entry Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary-600" />
            New Data Entry
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
                  Date <span className="text-error-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="society" className="block text-gray-700 font-medium mb-2">
                  Society <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  id="society"
                  name="society"
                  value={formData.society}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Green Valley"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                  Location <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Sector 121, Noida"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="driveType" className="block text-gray-700 font-medium mb-2">
                  Drive Type <span className="text-error-600">*</span>
                </label>
                <select
                  id="driveType"
                  name="driveType"
                  value={formData.driveType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select drive type</option>
                  <option value="IEI">IEI</option>
                  <option value="Independent">Independent</option>
                  
                </select>
              </div>
              
              <div>
                <label htmlFor="houses" className="block text-gray-700 font-medium mb-2">
                  Number of Houses <span className="text-error-600">*</span>
                </label>
                <input
                  type="number"
                  id="houses"
                  name="houses"
                  value={formData.houses}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 120"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
                  Weight (kg) <span className="text-error-600">*</span>
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 450.5"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="vehicle" className="block text-gray-700 font-medium mb-2">
                  Vehicle Used <span className="text-error-600">*</span>
                </label>
                <select
                  id="vehicle"
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select vehicle</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Large Truck">Large Truck</option>
                  <option value="Van">Van</option>
                  <option value="Bicycle Cart">Bicycle Cart</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-3">
                <label htmlFor="remarks" className="block text-gray-700 font-medium mb-2">
                  Remarks
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                  placeholder="Additional notes or observations about this collection"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary inline-flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Data Entry
              </button>
            </div>
          </form>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Collection Trend */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Monthly Collection Trend</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyOrgData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis unit="kg" />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Weight Collected']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    name="Total Collection"
                    stroke="#2F855A" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Society Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Collection by Society</h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={societyComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="society" angle={-45} textAnchor="end" height={100} />
                  <YAxis unit="kg" />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Total Weight']} />
                  <Legend />
                  <Bar 
                    dataKey="weight" 
                    name="Total Collection"
                    fill="#2F855A" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vehicle Usage */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Usage Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ vehicle, percent }) => `${vehicle}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} times`, 'Usage Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Society-specific Monthly Data */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Society Monthly Trend</h2>
              <select
                value={selectedSociety}
                onChange={(e) => setSelectedSociety(e.target.value)}
                className="input-field w-48"
              >
                <option value="">Select Society</option>
                {societies.map((society, index) => (
                  <option key={index} value={society}>{society}</option>
                ))}
              </select>
            </div>
            <div className="h-80">
              {selectedSociety && societyMonthlyData.length > 0 ? (
                <ResponsiveContainer width="100%\" height="100%">
                  <LineChart data={societyMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis unit="kg" />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Weight Collected']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      name={`${selectedSociety} Collection`}
                      stroke="#38B2AC" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {selectedSociety ? 'No data available for selected society' : 'Please select a society to view monthly trends'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Waste Collection Records</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full md:w-64"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={societyFilter}
                  onChange={(e) => setSocietyFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="">All Societies</option>
                  {societies.map((society, index) => (
                    <option key={index} value={society}>{society}</option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Filter by date"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Society
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drive Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Houses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (kg)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((collection) => (
                    <tr key={collection.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collection.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {collection.society}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {collection.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collection.driveType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collection.houses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {collection.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {collection.vehicle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => handleDelete(collection.id)}
                          className="text-error-600 hover:text-error-800 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No records found. Adjust your filters or add new data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredCollections.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredCollections.length}</span> of{' '}
                <span className="font-medium">{collections.length}</span> entries
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataEntryPage;