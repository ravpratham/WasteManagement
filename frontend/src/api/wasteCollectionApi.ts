import { WasteCollectionEntry } from '../data/wasteCollectionData';

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

export const fetchWasteCollectionRecords = async (): Promise<WasteCollectionEntry[]> => {
  try {
    console.log('Fetching waste collection records...');
    const response = await fetch(`${API_BASE_URL}/records`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching waste collection records:', error);
    throw error;
  }
};

export const createWasteCollectionRecord = async (record: Omit<WasteCollectionEntry, 'id'>): Promise<WasteCollectionEntry> => {
  try {
    console.log('Creating new waste collection record:', record);
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error creating waste collection record:', error);
    throw error;
  }
};

export const deleteWasteCollectionRecord = async (id: string): Promise<void> => {
  try {
    console.log('Deleting waste collection record:', id);
    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to delete record: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting waste collection record:', error);
    throw error;
  }
};