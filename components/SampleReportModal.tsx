'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface SampleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleReportModal({ isOpen, onClose }: SampleReportModalProps) {
  const locale = useLocale();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Sample FIRB Investment Report</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-muted-foreground">
            This is an example of the comprehensive report you&apos;ll receive after completing your calculation. 
            The report includes eligibility assessment, detailed cost breakdown, and 10-year investment analytics.
          </p>

          {/* Sample report preview placeholders */}
          <div className="border rounded-lg overflow-hidden bg-muted/30">
            <div className="aspect-[8.5/11] bg-white flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-4xl font-bold text-blue-600">FIRB</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Investment Analysis Report</h3>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Property Value:</span>
                    <span className="font-medium">$850,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">FIRB Fee:</span>
                    <span className="font-medium">$14,200</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Total Investment:</span>
                    <span className="font-medium">$917,350</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">10-Year ROI:</span>
                    <span className="font-medium text-green-600">+142%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  (Sample data for demonstration purposes)
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1" variant="outline" asChild>
              <Link href={`/${locale}/firb-calculator`}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Start My Calculation
              </Link>
            </Button>
            <Button className="flex-1" disabled>
              <Download className="w-4 h-4 mr-2" />
              Download Sample PDF
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your actual report will include personalized data based on your property details and investment parameters.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

