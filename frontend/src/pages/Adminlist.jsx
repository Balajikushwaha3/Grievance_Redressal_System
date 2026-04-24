import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminList = ({ type }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Type ke hisaab se endpoint decide karein
      let endpoint = '';
      if (type === 'history') endpoint = '/admin/history';
      else if (type === 'users') endpoint = '/admin/users';
      else if (type === 'messages') endpoint = '/messages';

      try {
        const response = await axios.get(`http://localhost:8000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) return <div className="text-center p-10">Loading data...</div>;
  if (data.length === 0) return <div className="text-center p-10">No records found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="px-4 py-3 text-sm font-semibold text-gray-700 uppercase">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
              {Object.values(row).map((val, i) => (
                <td key={i} className="px-4 py-3 text-sm text-gray-600">
                  {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminList;