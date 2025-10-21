'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  RefreshCw, 
  Download,
  Calendar,
  Package,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import Link from 'next/link';

interface Item {
  id: number;
  item_code: string;
  description: string;
  unit_of_issue: string;
  category: string;
  subcategory: string;
  minimum_stock_level: number;
  maximum_stock_level: number;
  current_stock: number;
  unit_cost: number;
  supplier: string;
}

interface LedgerEntry {
  id: number;
  transaction_date: string;
  grn_number: string;
  issuance_serial: string;
  opening_stock: number;
  received_quantity: number;
  issued_quantity: number;
  closing_balance: number;
  transaction_type: 'opening' | 'received' | 'issued' | 'adjustment';
  remarks: string;
  created_at: string;
}

export default function ItemLedgerPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.itemId as string;
  
  const [item, setItem] = useState<Item | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [openingStock, setOpeningStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (itemId) {
      fetchLedgerData();
    }
  }, [itemId, currentPage, startDate, endDate]);

  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50'
      });
      
      if (startDate) {
        params.append('startDate', startDate);
      }
      
      if (endDate) {
        params.append('endDate', endDate);
      }

      const response = await fetch(`/api/stores/ledger/${itemId}?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setItem(data.data.item);
        setLedgerEntries(data.data.ledgerEntries);
        setOpeningStock(data.data.openingStock);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching ledger data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    try {
      setRecalculating(true);
      const response = await fetch(`/api/stores/ledger/${itemId}/recalculate`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchLedgerData(); // Refresh the data
      }
    } catch (error) {
      console.error('Error recalculating ledger:', error);
    } finally {
      setRecalculating(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'received':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'issued':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'opening':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'adjustment':
        return <Minus className="w-4 h-4 text-yellow-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'issued':
        return 'bg-red-100 text-red-800';
      case 'opening':
        return 'bg-blue-100 text-blue-800';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!item) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Item not found</h3>
          <p className="text-gray-500 mb-4">The requested item could not be found</p>
          <Link href="/stores/ledger">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ledger
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/stores/ledger">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{item.item_code}</h1>
          <p className="text-gray-600">{item.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRecalculate} disabled={recalculating}>
            {recalculating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Recalculate
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Item Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Item Summary</CardTitle>
          <CardDescription>Current status and details for this item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Current Stock</h4>
              <p className="text-2xl font-bold text-blue-600">{item.current_stock}</p>
              <p className="text-sm text-gray-500">{item.unit_of_issue}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Opening Stock</h4>
              <p className="text-2xl font-bold text-gray-600">{openingStock}</p>
              <p className="text-sm text-gray-500">{item.unit_of_issue}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Unit Cost</h4>
              <p className="text-2xl font-bold text-green-600">UGX {item.unit_cost?.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-500">per {item.unit_of_issue}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Total Value</h4>
              <p className="text-2xl font-bold text-purple-600">UGX {(item.current_stock * item.unit_cost)?.toLocaleString() || '0'}</p>
              <p className="text-sm text-gray-500">current inventory value</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Category:</span> {item.category || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Subcategory:</span> {item.subcategory || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Supplier:</span> {item.supplier || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Minimum Level:</span> {item.minimum_stock_level}
            </div>
            <div>
              <span className="font-medium">Maximum Level:</span> {item.maximum_stock_level}
            </div>
            <div>
              <span className="font-medium">Stock Status:</span> 
              <Badge className={`ml-2 ${item.current_stock <= item.minimum_stock_level ? 'bg-red-100 text-red-800' : item.current_stock >= item.maximum_stock_level ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {item.current_stock <= item.minimum_stock_level ? 'Low' : item.current_stock >= item.maximum_stock_level ? 'High' : 'Normal'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setStartDate(''); setEndDate(''); }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Movement Ledger</CardTitle>
          <CardDescription>Detailed transaction history for this item</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : ledgerEntries.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">No stock movements recorded for this item</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Type</th>
                    <th className="text-left py-2 px-4">Reference</th>
                    <th className="text-right py-2 px-4">Opening</th>
                    <th className="text-right py-2 px-4">Received</th>
                    <th className="text-right py-2 px-4">Issued</th>
                    <th className="text-right py-2 px-4">Closing</th>
                    <th className="text-left py-2 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerEntries.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(entry.transaction_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <Badge className={getTransactionColor(entry.transaction_type)}>
                          {getTransactionIcon(entry.transaction_type)}
                          <span className="ml-1 capitalize">{entry.transaction_type}</span>
                        </Badge>
                      </td>
                      <td className="py-2 px-4">
                        {entry.grn_number && (
                          <span className="text-blue-600 font-mono text-sm">{entry.grn_number}</span>
                        )}
                        {entry.issuance_serial && (
                          <span className="text-green-600 font-mono text-sm">{entry.issuance_serial}</span>
                        )}
                        {!entry.grn_number && !entry.issuance_serial && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-right font-mono">{entry.opening_stock}</td>
                      <td className="py-2 px-4 text-right font-mono text-green-600">
                        {entry.received_quantity > 0 ? `+${entry.received_quantity}` : '-'}
                      </td>
                      <td className="py-2 px-4 text-right font-mono text-red-600">
                        {entry.issued_quantity > 0 ? `-${entry.issued_quantity}` : '-'}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-semibold">{entry.closing_balance}</td>
                      <td className="py-2 px-4 text-sm text-gray-600">{entry.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
