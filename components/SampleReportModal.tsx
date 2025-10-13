'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleReportModal({ isOpen, onClose }: SampleReportModalProps) {
  const locale = useLocale();

  const handleDownloadSample = () => {
    // TODO: Implement actual sample PDF download
    console.log('Downloading sample PDF...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Sample FIRB Investment Report
          </DialogTitle>
          <p className="text-muted-foreground text-center mt-2">
            See what you'll receive after completing your calculation
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Sample Report Preview */}
          <div className="border rounded-lg overflow-hidden bg-muted/20">
            <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">Comprehensive Investment Report</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Your personalized 7-page analysis includes eligibility status, cost breakdown, and 10-year investment projections.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white/50 rounded p-2 flex justify-between">
                    <span className="text-xs text-muted-foreground">Total Investment</span>
                    <span className="font-bold text-green-600">$2,430,183</span>
                  </div>
                  <div className="bg-white/50 rounded p-2 flex justify-between">
                    <span className="text-xs text-muted-foreground">10-Year ROI</span>
                    <span className="font-bold text-blue-600">+142%</span>
                  </div>
                  <div className="bg-white/50 rounded p-2 flex justify-between">
                    <span className="text-xs text-muted-foreground">Eligibility</span>
                    <span className="font-bold text-green-600">✓ Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownloadSample}
              className="flex-1"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample PDF
            </Button>
            <Link href={`/${locale}/firb-calculator`} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full"
                size="lg"
                onClick={onClose}
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start My Calculation
              </Button>
            </Link>
          </div>

          {/* Features List */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-semibold mb-4 text-blue-900">What's Included in Your Report:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>FIRB eligibility assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Complete cost breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>10-year ROI projections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Cash flow analysis</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Equity growth forecasts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Risk assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Tax implications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Market comparison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}