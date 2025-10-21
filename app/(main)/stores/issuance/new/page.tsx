'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Item {
  id: number;
  item_code: string;
  description: string;
  unit_of_issue: string;
  current_stock: number;
}

interface IssuanceItem {
  item_id: number;
  item_code: string;
  description: string;
  unit_of_issue: string;
  current_stock: number;
  quantity_ordered: number;
  quantity_approved: number;
  quantity_issued: number;
  remarks: string;
}

export default function NewIssuancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [issuanceItems, setIssuanceItems] = useState<IssuanceItem[]>([]);
  const [formData, setFormData] = useState({
    from_department: '',
    issuance_date: new Date().toISOString().split('T')[0],
    requisition_officer_name: '',
    issuing_officer_name: '',
    receiving_officer_name: '',
    head_of_department_name: '',
    approving_officer_name: '',
    remarks: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/stores/items?limit=1000');
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = () => {
    setIssuanceItems([...issuanceItems, {
      item_id: 0,
      item_code: '',
      description: '',
      unit_of_issue: '',
      current_stock: 0,
      quantity_ordered: 0,
      quantity_approved: 0,
      quantity_issued: 0,
      remarks: ''
    }]);
  };

  const removeItem = (index: number) => {
    setIssuanceItems(issuanceItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof IssuanceItem, value: any) => {
    const updatedItems = [...issuanceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If item_id changed, update other fields from the selected item
    if (field === 'item_id') {
      const selectedItem = items.find(item => item.id === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          item_code: selectedItem.item_code,
          description: selectedItem.description,
          unit_of_issue: selectedItem.unit_of_issue,
          current_stock: selectedItem.current_stock
        };
      }
    }
    
    setIssuanceItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (issuanceItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    if (!formData.from_department) {
      alert('Please select a department');
      return;
    }

    // Validate that all items have required fields
    const invalidItems = issuanceItems.some(item => 
      !item.item_id || item.quantity_ordered <= 0
    );

    if (invalidItems) {
      alert('Please fill in all required fields for all items');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/stores/issuance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: issuanceItems
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push(`/stores/issuance/${data.data.id}`);
      } else {
        alert(data.error || 'Failed to create issuance');
      }
    } catch (error) {
      console.error('Error creating issuance:', error);
      alert('Failed to create issuance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/stores/issuance">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Issuance</h1>
          <p className="text-gray-600">Stores Requisition / Issue Voucher - Ministry of Health Uganda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <Card>
          <CardHeader>
            <CardTitle>Issuance Header Information</CardTitle>
            <CardDescription>Enter the basic information for this requisition/issue voucher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_department">From Department/Unit</Label>
                <Select
                  value={formData.from_department}
                  onValueChange={(value) => setFormData({...formData, from_department: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="IT">Information Technology</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="issuance_date">Date</Label>
                <Input
                  id="issuance_date"
                  type="date"
                  value={formData.issuance_date}
                  onChange={(e) => setFormData({...formData, issuance_date: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Items Requested
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardTitle>
            <CardDescription>Add all items being requested</CardDescription>
          </CardHeader>
          <CardContent>
            {issuanceItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items added</h3>
                <p className="text-gray-500 mb-4">Click "Add Item" to start adding requested items</p>
                <Button type="button" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {issuanceItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Item</Label>
                        <Select
                          value={item.item_id.toString()}
                          onValueChange={(value) => updateItem(index, 'item_id', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select item" />
                          </SelectTrigger>
                          <SelectContent>
                            {items.map((itm) => (
                              <SelectItem key={itm.id} value={itm.id.toString()}>
                                {itm.item_code} - {itm.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Item Code</Label>
                        <Input
                          value={item.item_code}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <Label>Unit of Issue</Label>
                        <Input
                          value={item.unit_of_issue}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <Label>Current Stock</Label>
                        <Input
                          value={item.current_stock}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity Ordered *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity_ordered}
                          onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity Approved</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity_approved}
                          onChange={(e) => updateItem(index, 'quantity_approved', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity Issued</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity_issued}
                          onChange={(e) => updateItem(index, 'quantity_issued', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="md:col-span-2 lg:col-span-4">
                        <Label>Remarks</Label>
                        <Input
                          value={item.remarks}
                          onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                          placeholder="Any remarks about this item"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Officers Section */}
        <Card>
          <CardHeader>
            <CardTitle>Officers Information</CardTitle>
            <CardDescription>Enter the names of responsible officers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="requisition_officer_name">Requisition Officer</Label>
                <Input
                  id="requisition_officer_name"
                  value={formData.requisition_officer_name}
                  onChange={(e) => setFormData({...formData, requisition_officer_name: e.target.value})}
                  placeholder="Enter requisition officer name"
                />
              </div>
              <div>
                <Label htmlFor="issuing_officer_name">Issuing Officer</Label>
                <Input
                  id="issuing_officer_name"
                  value={formData.issuing_officer_name}
                  onChange={(e) => setFormData({...formData, issuing_officer_name: e.target.value})}
                  placeholder="Enter issuing officer name"
                />
              </div>
              <div>
                <Label htmlFor="receiving_officer_name">Receiving Officer</Label>
                <Input
                  id="receiving_officer_name"
                  value={formData.receiving_officer_name}
                  onChange={(e) => setFormData({...formData, receiving_officer_name: e.target.value})}
                  placeholder="Enter receiving officer name"
                />
              </div>
              <div>
                <Label htmlFor="head_of_department_name">Head of Department/Unit</Label>
                <Input
                  id="head_of_department_name"
                  value={formData.head_of_department_name}
                  onChange={(e) => setFormData({...formData, head_of_department_name: e.target.value})}
                  placeholder="Enter head of department name"
                />
              </div>
              <div>
                <Label htmlFor="approving_officer_name">Approving Officer</Label>
                <Input
                  id="approving_officer_name"
                  value={formData.approving_officer_name}
                  onChange={(e) => setFormData({...formData, approving_officer_name: e.target.value})}
                  placeholder="Enter approving officer name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                placeholder="Enter any additional remarks"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/stores/issuance">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Issuance
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
