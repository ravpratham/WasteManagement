import React from 'react';
import { Truck, Users, Trash2, Recycle } from 'lucide-react';

export const statsData = [
  {
    label: 'Tons Collected',
    value: '256',
    icon: <Trash2 className="h-6 w-6 text-primary-600" />,
    trend: 12
  },
  {
    label: 'Houses Served',
    value: '3,450',
    icon: <Users className="h-6 w-6 text-primary-600" />,
    trend: 8
  },
  {
    label: 'Collection Drives',
    value: '78',
    icon: <Truck className="h-6 w-6 text-primary-600" />,
    trend: 15
  },
  {
    label: 'Recycling Rate',
    value: '68%',
    icon: <Recycle className="h-6 w-6 text-primary-600" />,
    trend: 5
  }
];