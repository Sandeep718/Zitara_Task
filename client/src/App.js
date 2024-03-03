import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Datatable = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/customers');
        setCustomers(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setError('Error fetching data. Please try again.');
      }
    };
    fetchCustomers();
  }, []);

  // Sort customers based on created_at date
  const sortedCustomers = [...customers].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Filter and sort customers based on search term
  const filteredAndSortedCustomers = sortedCustomers.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the index of the first and last item to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  // Change page
  const nextPage = () => setCurrentPage(currentPage + 1);

  const prevPage = () => setCurrentPage(currentPage - 1);
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when the search term changes
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Pagination numbers
  const pageNumbers = Array.from({ length: Math.ceil(filteredAndSortedCustomers.length / itemsPerPage) }, (_, index) => index + 1);

  return (
    <div>
      <h1 bold>Customers List</h1>
      {error && <div className="error">{error}</div>}
      <input type="text" className="search-input" value={searchTerm} onChange={handleSearchChange} placeholder="Search by name or location" />

      <button onClick={toggleSortOrder}>Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})</button>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Created At (Date)</th>
            <th>Created At (Time)</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedCustomers.slice(indexOfFirstItem, indexOfLastItem).map((customer, index) => (
            <tr key={customer.sno}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span onClick={prevPage} className={`pagination-link ${currentPage === 1 ? 'disabled' : ''}`}>Previous</span>
        {pageNumbers.map(number => (
          <span key={number} onClick={() => setCurrentPage(number)} className={`pagination-link ${currentPage === number ? 'active' : ''}`}>
            {number}
          </span>
        ))}
        <span onClick={nextPage} className={`pagination-link ${indexOfLastItem >= filteredAndSortedCustomers.length ? 'disabled' : ''}`}>Next</span>
      </div>
    </div>
  );
};

export default Datatable;
