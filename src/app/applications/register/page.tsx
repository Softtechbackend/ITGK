'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Personal Information
    applicant_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    aadhar_number: '',
    
    // Business Information
    business_name: '',
    gst_number: '',
    business_type: '',
    years_in_business: '',
    
    // Property Details
    address: '',
    city: '',
    state: '',
    pincode: '',
    location: '',
    
    // Solar Installation Details
    roof_type: '',
    roof_area: '',
    current_electricity: '',
    monthly_consumption: '',
    preferred_capacity: '',
    existing_installation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/applications/${data.application.id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit registration');
      }
    } catch (err) {
      setError('Error submitting registration');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>PM SURYAGHAR ROOFTOP SOLAR SCHEME</CardTitle>
            <CardDescription>Partner Registration for Solar Installation Services</CardDescription>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4].map(s => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      name="applicant_name"
                      value={formData.applicant_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Birth</label>
                    <Input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                    <Input
                      name="aadhar_number"
                      value={formData.aadhar_number}
                      onChange={handleChange}
                      placeholder="12-digit Aadhar number"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Business Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <Input
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GST Number</label>
                    <Input
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleChange}
                      placeholder="15-digit GST number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Business Type *</label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="installer">Installer</option>
                      <option value="vendor">Vendor</option>
                      <option value="distributor">Distributor</option>
                      <option value="consultant">Consultant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Years in Business *</label>
                    <Input
                      type="number"
                      name="years_in_business"
                      value={formData.years_in_business}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Property Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Property Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State *</label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Pincode *</label>
                      <Input
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location Type *</label>
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-input rounded-md"
                        required
                      >
                        <option value="">Select location</option>
                        <option value="urban">Urban</option>
                        <option value="semi-urban">Semi-Urban</option>
                        <option value="rural">Rural</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Solar Installation Details */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Solar Installation Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Roof Type *</label>
                    <select
                      name="roof_type"
                      value={formData.roof_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    >
                      <option value="">Select roof type</option>
                      <option value="concrete">Concrete</option>
                      <option value="metal">Metal</option>
                      <option value="tile">Tile</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Roof Area (sq ft) *</label>
                    <Input
                      type="number"
                      name="roof_area"
                      value={formData.roof_area}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Current Electricity Type *</label>
                    <select
                      name="current_electricity"
                      value={formData.current_electricity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    >
                      <option value="">Select electricity type</option>
                      <option value="grid">Grid Connection</option>
                      <option value="off-grid">Off-Grid</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Monthly Electricity Consumption (kWh) *</label>
                    <Input
                      type="number"
                      name="monthly_consumption"
                      value={formData.monthly_consumption}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred System Capacity (kW)</label>
                    <Input
                      type="number"
                      name="preferred_capacity"
                      value={formData.preferred_capacity}
                      onChange={handleChange}
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Existing Solar Installation?</label>
                    <select
                      name="existing_installation"
                      value={formData.existing_installation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handlePrev}>
                    Previous
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button type="button" onClick={handleNext} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="ml-auto">
                    {loading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
