import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const CheckInForm = ({ roomNumber, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    address: '',
    checkOut: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          id="firstName"
          name="firstName"
          type="text"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <FormField
          label="Last Name"
          id="lastName"
          name="lastName"
          type="text"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Email"
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <FormField
          label="Phone"
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <FormField
        label="ID Number"
        id="idNumber"
        name="idNumber"
        type="text"
        required
        value={formData.idNumber}
        onChange={handleChange}
      />

      <FormField
        label="Address"
        id="address"
        name="address"
        type="textarea"
        value={formData.address}
        onChange={handleChange}
        rows={2}
      />

      <FormField
        label="Check-out Date"
        id="checkOut"
        name="checkOut"
        type="date"
        required
        min={today}
        value={formData.checkOut}
        onChange={handleChange}
      />

      <FormField
        label="Notes"
        id="notes"
        name="notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        rows={2}
        placeholder="Special requests or notes..."
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-surface-300 rounded-lg hover:bg-surface-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          Check In
        </Button>
      </div>
    </form>
  );
};

export default CheckInForm;