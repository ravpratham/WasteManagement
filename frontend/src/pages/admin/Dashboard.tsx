import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trash2, TrendingUp, Truck, Home, FileText, ArrowRight, BarChart3 } from 'lucide-react';
import { statsData } from '../../data/statsData';
import { WasteCollectionEntry } from '../../data/wasteCollectionData';
import { fetchWasteCollectionRecords } from '../../api/wasteCollectionApi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Dashboard: React.FC = () => {
  const [wasteCollectionData, setWasteCollectionData] = useState<WasteCollectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setIsLoading(true);
        const records = await fetchWasteCollectionRecords();
        setWasteCollectionData(records);
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

  // Recent waste collections for the table
  const recentCollections = wasteCollectionData.slice(0, 5);

  // Generate monthly collection data
  const generateMonthlyData = () => {
    const monthlyData: { [key: string]: number } = {};
    
    wasteCollectionData.forEach(collection => {
      const date = new Date(collection.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + collection.weight;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, weight]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        weight: Math.round(weight * 100) / 100,
        houses: wasteCollectionData
          .filter(c => {
            const cDate = new Date(c.date);
            const cMonthKey = `${cDate.getFullYear()}-${String(cDate.getMonth() + 1).padStart(2, '0')}`;
            return cMonthKey === month;
          })
          .reduce((sum, c) => sum + c.houses, 0)
      }));
  };

  // Generate society comparison data
  const generateSocietyData = () => {
    const societyData: { [key: string]: { weight: number; collections: number } } = {};
    
    wasteCollectionData.forEach(collection => {
      if (!societyData[collection.society]) {
        societyData[collection.society] = { weight: 0, collections: 0 };
      }
      societyData[collection.society].weight += collection.weight;
      societyData[collection.society].collections += 1;
    });

    return Object.entries(societyData)
      .map(([society, data]) => ({
        name: society,
        weight: Math.round(data.weight * 100) / 100,
        collections: data.collections,
        avgWeight: Math.round((data.weight / data.collections) * 100) / 100
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 6); // Top 6 societies
  };

  // Data for pie chart - waste types distribution by vehicle
  const generateVehicleData = () => {
    const vehicleData: { [key: string]: number } = {};
    
    wasteCollectionData.forEach(collection => {
      vehicleData[collection.vehicle] = (vehicleData[collection.vehicle] || 0) + collection.weight;
    });

    return Object.entries(vehicleData).map(([vehicle, weight]) => ({
      name: vehicle,
      value: Math.round(weight * 100) / 100
    }));
  };

  // Generate drive type distribution
  const generateDriveTypeData = () => {
    const driveTypeData: { [key: string]: number } = {};
    
    wasteCollectionData.forEach(collection => {
      driveTypeData[collection.driveType] = (driveTypeData[collection.driveType] || 0) + collection.weight;
    });

    return Object.entries(driveTypeData).map(([type, weight]) => ({
      name: type,
      weight: Math.round(weight * 100) / 100
    }));
  };

  const monthlyData = generateMonthlyData();
  const societyData = generateSocietyData();
  const vehicleData = generateVehicleData();
  const driveTypeData = generateDriveTypeData();
  
  const COLORS = ['#2F855A', '#38B2AC', '#4299E1', '#805AD5', '#D53F8C', '#F6AD55'];

  // Calculate total statistics
  const totalWeight = wasteCollectionData.reduce((sum, c) => sum + c.weight, 0);
  const totalHouses = wasteCollectionData.reduce((sum, c) => sum + c.houses, 0);
  const uniqueSocieties = new Set(wasteCollectionData.map(c => c.society)).size;
  const avgWeightPerCollection = totalWeight / wasteCollectionData.length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of Green Dream Foundation's waste management operations.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            to="/admin/data-entry" 
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center"
          >
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Data Entry & Analytics</h3>
              <p className="text-gray-600 text-sm">Record data and view detailed analytics</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
          </Link>
          
          <Link 
            to="/admin/projects" 
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center"
          >
            <div className="bg-secondary-100 p-3 rounded-full mr-4">
              <Home className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage Projects</h3>
              <p className="text-gray-600 text-sm">Update project information</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
          </Link>
          
          <Link 
            to="/" 
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center"
          >
            <div className="bg-accent-100 p-3 rounded-full mr-4">
              <Truck className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">View Public Site</h3>
              <p className="text-gray-600 text-sm">See what visitors see</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
          </Link>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Trash2 className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-500 ml-2">Total Weight Collected</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{Math.round(totalWeight)} kg</div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-sm text-success-600">Active collections</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Home className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-500 ml-2">Houses Served</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{totalHouses.toLocaleString()}</div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-sm text-success-600">Across {uniqueSocieties} societies</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-500 ml-2">Avg per Collection</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{Math.round(avgWeightPerCollection)} kg</div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-sm text-success-600">Efficiency metric</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <Calendar className="h-6 w-6 text-primary-600" />
              <span className="text-sm font-medium text-gray-500 ml-2">Total Collections</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{wasteCollectionData.length}</div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-sm text-success-600">Data entries</span>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Collection Trend with Houses */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Collection Trends</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" unit="kg" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'weight' ? `${value} kg` : `${value} houses`,
                      name === 'weight' ? 'Weight Collected' : 'Houses Served'
                    ]} 
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="weight" 
                    name="Weight"
                    stroke="#2F855A" 
                    fill="#2F855A"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="houses" 
                    name="Houses"
                    stroke="#38B2AC" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Society Performance */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Societies</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={societyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" unit="kg" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Total Weight']} />
                  <Legend />
                  <Bar 
                    dataKey="weight" 
                    name="Total Collection"
                    fill="#2F855A" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vehicle Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Collection by Vehicle Type</h2>
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
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehicleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg`, 'Weight Collected']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Drive Type Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Collection by Drive Type</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={driveTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis unit="kg" />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Weight Collected']} />
                  <Legend />
                  <Bar 
                    dataKey="weight" 
                    name="Total Collection"
                    fill="#38B2AC" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Collections Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Collections</h2>
            <Link to="/admin/data-entry" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All & Add New
            </Link>
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentCollections.map((collection, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {collection.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {collection.society}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {collection.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collection.driveType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {collection.weight} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {collection.vehicle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Drives */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Collection Drives</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Schedule New Drive
            </button>
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
                    Drive Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Houses
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
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      June 15, 2025
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Green Valley
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Door-to-Door
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    120
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Mini Truck
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-600 hover:text-gray-900 mr-3">Edit</button>
                    <button className="text-error-600 hover:text-error-800 flex items-center">
                      <Trash2 className="h-4 w-4 mr-1" /> Cancel
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      June 18, 2025
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Eco Heights
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Collection Center
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    85
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Large Truck
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-600 hover:text-gray-900 mr-3">Edit</button>
                    <button className="text-error-600 hover:text-error-800 flex items-center">
                      <Trash2 className="h-4 w-4 mr-1" /> Cancel
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      June 22, 2025
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Pine Gardens
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Door-to-Door
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    150
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Mini Truck
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-600 hover:text-gray-900 mr-3">Edit</button>
                    <button className="text-error-600 hover:text-error-800 flex items-center">
                      <Trash2 className="h-4 w-4 mr-1" /> Cancel
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;