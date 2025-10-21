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
  Upload,
  ArrowLeft,
  Package
} from 'lucide-react';
import Link from 'next/link';

interface Item {
  id: number;
  item_code: string;
  description: string;
  unit_of_issue: string;
  unit_cost: number;
}

interface GRNItem {
  item_id: number;
  item_code: string;
  description: string;
  unit_of_issue: string;
  quantity_ordered: number;
  quantity_delivered: number;
  unit_cost: number;
  remarks: string;
}

export default function NewGRNPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [grnItems, setGrnItems] = useState<GRNItem[]>([]);
  const [formData, setFormData] = useState({
    procurement_reference: '',
    lpo_number: '',
    delivery_note_number: '',
    tax_invoice_number: '',
    receiving_officer_name: '',
    issuing_officer_name: '',
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
    setGrnItems([...grnItems, {
      item_id: 0,
      item_code: '',
      description: '',
      unit_of_issue: '',
      quantity_ordered: 0,
      quantity_delivered: 0,
      unit_cost: 0,
      remarks: ''
    }]);
  };

  const removeItem = (index: number) => {
    setGrnItems(grnItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof GRNItem, value: any) => {
    const updatedItems = [...grnItems];
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
          unit_cost: selectedItem.unit_cost
        };
      }
    }
    
    setGrnItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (grnItems.length === 0) {
      alert('Please add at least one item');
      return;
    }

    // Validate that all items have required fields
    const invalidItems = grnItems.some(item => 
      !item.item_id || item.quantity_ordered <= 0 || item.quantity_delivered <= 0
    );

    if (invalidItems) {
      alert('Please fill in all required fields for all items');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/stores/grn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: grnItems
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push(`/stores/grn/${data.data.id}`);
      } else {
        alert(data.error || 'Failed to create GRN');
      }
    } catch (error) {
      console.error('Error creating GRN:', error);
      alert('Failed to create GRN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/stores/grn">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New GRN</h1>
          <p className="text-gray-600">Goods Received Note - Ministry of Health Uganda</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Information */}
        <Card>
          <CardHeader>
            <CardTitle>GRN Header Information</CardTitle>
            <CardDescription>Enter the basic information for this Goods Received Note</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="procurement_reference">Procurement Reference Number</Label>
                <Input
                  id="procurement_reference"
                  value={formData.procurement_reference}
                  onChange={(e) => setFormData({...formData, procurement_reference: e.target.value})}
                  placeholder="Enter procurement reference"
                />
              </div>
              <div>
                <Label htmlFor="lpo_number">LPO Number</Label>
                <Input
                  id="lpo_number"
                  value={formData.lpo_number}
                  onChange={(e) => setFormData({...formData, lpo_number: e.target.value})}
                  placeholder="Enter LPO number"
                />
              </div>
              <div>
                <Label htmlFor="delivery_note_number">Delivery Note Number</Label>
                <Input
                  id="delivery_note_number"
                  value={formData.delivery_note_number}
                  onChange={(e) => setFormData({...formData, delivery_note_number: e.target.value})}
                  placeholder="Enter delivery note number"
                />
              </div>
              <div>
                <Label htmlFor="tax_invoice_number">Tax Invoice Number</Label>
                <Input
                  id="tax_invoice_number"
                  value={formData.tax_invoice_number}
                  onChange={(e) => setFormData({...formData, tax_invoice_number: e.target.value})}
                  placeholder="Enter tax invoice number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Items Received
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </CardTitle>
            <CardDescription>Add all items received in this delivery</CardDescription>
          </CardHeader>
          <CardContent>
            {grnItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items added</h3>
                <p className="text-gray-500 mb-4">Click "Add Item" to start adding received items</p>
                <Button type="button" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {grnItems.map((item, index) => (
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
                        <Label>Quantity Ordered</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity_ordered}
                          onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Quantity Delivered</Label>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity_delivered}
                          onChange={(e) => updateItem(index, 'quantity_delivered', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Unit Cost (UGX)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_cost}
                          onChange={(e) => updateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div>
                        <Label>Remarks</Label>
                        <Input
                          value={item.remarks}
                          onChange={(e) => updateItem(index, 'remarks', e.target.value)}
                          placeholder="Any remarks"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="issuing_officer_name">Issuing Officer</Label>
                <Input
                  id="issuing_officer_name"
                  value={formData.issuing_officer_name}
                  onChange={(e) => setFormData({...formData, issuing_officer_name: e.target.value})}
                  placeholder="Enter issuing officer name"
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

        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>Upload supporting documents (Form 5, Technical Specifications)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Form 5</h4>
                <p className="text-sm text-gray-500 mb-2">Upload Form 5 document</p>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Form 5
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Technical Specifications</h4>
                <p className="text-sm text-gray-500 mb-2">Upload technical specifications</p>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Specs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Link href="/stores/grn">
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
                Create GRN
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
