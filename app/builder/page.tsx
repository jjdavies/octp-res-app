'use client';
import React from 'react';
import { DataProvider } from '../component/DataContext';
import Builder from '../component/Builder';

export default function Page() {
  return (
    <div>
      <DataProvider>
        <Builder data={null} />
      </DataProvider>
    </div>
  );
}
