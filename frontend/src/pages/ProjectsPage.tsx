import React, { useState, useEffect } from 'react';
import { projectsData } from '../data/projectsData';
import { Calendar, Search, Filter } from 'lucide-react';

type ProjectStatus = 'All' | 'Completed' | 'Ongoing' | 'Upcoming';

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('All');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let results = projectsData;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'All') {
      results = results.filter(project => project.status === selectedStatus);
    }
    
    setFilteredProjects(results);
  }, [searchTerm, selectedStatus]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
          <p className="text-xl max-w-3xl">
            Explore our waste management initiatives across different communities, from completed projects to ongoing efforts and upcoming plans.
          </p>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Status:</span>
              <select
                className="input-field"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ProjectStatus)}
              >
                <option value="All">All Projects</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects List */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="card group transform transition duration-300 hover:-translate-y-2">
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className={`inline-block px-3 py-1 text-white text-sm font-medium rounded-full mb-2 ${
                        project.status === 'Completed' ? 'bg-success-600' : 
                        project.status === 'Ongoing' ? 'bg-primary-600' : 'bg-accent-600'
                      }`}>
                        {project.status}
                      </span>
                      <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">{project.location}</span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {project.date}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {project.wasteType}
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {project.houses} Houses
                        </span>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                          {project.weight} Tons
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Projects Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                }}
                className="btn btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;