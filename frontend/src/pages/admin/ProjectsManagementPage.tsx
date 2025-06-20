import React, { useState, useEffect } from 'react';
import { WasteManagementProject } from '../../data/projectsData';
import { fetchProjects, createProject, deleteProject } from '../../api/wasteManagementProjectsApi';
import { Calendar, Edit, Trash2, Plus, X, Check } from 'lucide-react';

const ProjectsManagementPage: React.FC = () => {
  const [projects, setProjects] = useState<WasteManagementProject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Omit<WasteManagementProject, 'id'> & { id?: string }>({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'Upcoming',
    wasteType: '',
    houses: 0,
    weight: 0,
    image: '',
    featured: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchProjects()
      .then(data => setProjects(data))
      .catch(err => alert('Failed to fetch projects: ' + err))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (project: WasteManagementProject) => {
    setFormData(project);
    setEditingId(project.id);
    setIsAddingNew(false);
    window.scrollTo(0, 0);
  };

  const handleAddNew = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      status: 'Upcoming',
      wasteType: '',
      houses: 0,
      weight: 0,
      image: 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg',
      featured: false,
    });
    setEditingId(null);
    setIsAddingNew(true);
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isAddingNew) {
        // Add new project
        const { id, ...projectData } = formData;
        const newProject = await createProject(projectData);
        setProjects(prev => [newProject, ...prev]);
        alert('Project added successfully!');
        window.location.reload();
      } else if (editingId) {
        // Update logic would go here (not implemented in API)
        alert('Update functionality is not implemented in the API.');
      }
    } catch (err) {
      alert('Failed to save project: ' + err);
    } finally {
      setLoading(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        status: 'Upcoming',
        wasteType: '',
        houses: 0,
        weight: 0,
        image: '',
        featured: false,
      });
      setEditingId(null);
      setIsAddingNew(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      status: 'Upcoming',
      wasteType: '',
      houses: 0,
      weight: 0,
      image: '',
      featured: false,
    });
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setLoading(true);
      try {
        await deleteProject(id);
        setProjects(prev => prev.filter(project => project.id !== id));
        alert('Project deleted successfully!');
      } catch (err) {
        alert('Failed to delete project: ' + err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h1>
          <p className="text-gray-600">Create, edit, and manage Green Dream Foundation projects.</p>
        </div>

        {/* Project Form */}
        {(isAddingNew || editingId) && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isAddingNew ? 'Add New Project' : 'Edit Project'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                    Project Title <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
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
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                    Status <span className="text-error-600">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="wasteType" className="block text-gray-700 font-medium mb-2">
                    Waste Type <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="wasteType"
                    name="wasteType"
                    value={formData.wasteType}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Mixed, Plastic, Paper"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                    Image URL <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
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
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
                    Weight (tons) <span className="text-error-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="input-field"
                    step="0.1"
                    min="0"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Description <span className="text-error-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    required
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-gray-700">
                      Feature this project on the homepage
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-outline inline-flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary inline-flex items-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  {isAddingNew ? 'Add Project' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Projects List</h2>
            <button
              onClick={handleAddNew}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Project
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            project.status === 'Completed' ? 'bg-success-100 text-success-800' : 
                            project.status === 'Ongoing' ? 'bg-primary-100 text-primary-800' : 
                            'bg-accent-100 text-accent-800'
                          }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.featured ? (
                        <span className="text-success-600">Yes</span>
                      ) : (
                        <span>No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-primary-600 hover:text-primary-800 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-error-600 hover:text-error-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {projects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No projects found. Add your first project!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsManagementPage;