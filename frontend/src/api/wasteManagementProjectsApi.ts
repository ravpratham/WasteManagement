import { WasteManagementProject } from '../data/projectsData';

const API_BASE_URL = '/api';

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON response but got ${contentType}`);
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const fetchProjects = async (): Promise<WasteManagementProject[]> => {
  try {
    console.log('Fetching waste management projects...');
    const response = await fetch(`${API_BASE_URL}/projects`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const createProject = async (project: Omit<WasteManagementProject, 'id'>): Promise<WasteManagementProject> => {
  try {
    console.log('Creating new project:', project);
    const response = await fetch(`${API_BASE_URL}/projects/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    console.log('Deleting project:', id);
    const response = await fetch(`${API_BASE_URL}/projects/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to delete project: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}; 