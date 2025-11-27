/**
 * Enhanced FIRB Eligibility Result Card
 * Comprehensive display of eligibility status, user selections, requirements, and recommendations
 */

'use client';

import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Home, 
  Globe, 
  MapPin, 
  DollarSign, 
  Building,
  FileText,
  Clock
} from 'lucide-react';
import { EligibilityResult } from '@/lib/firb/eligibility';
import { PropertyType, AustralianState, CitizenshipStatus, EntityType } from '@/lib/firb/constants';
import { 
  formatCitizenshipStatus, 
  formatPropertyType, 
  formatEntityType, 
  getInvestmentPropertyLabel,
  formatState
} from '@/lib/firb/formatters';
import { useTranslations } from 'next-intl';

interface EligibilityResultCardProps {
  eligibility: EligibilityResult;
  formData?: {
    citizenshipStatus?: CitizenshipStatus;
    visaType?: string;
    isOrdinarilyResident?: boolean;
    propertyType?: PropertyType;
    propertyValue?: number;
    state?: AustralianState;
    propertyAddress?: string;
    isFirstHome?: boolean;
    entityType?: EntityType;
    depositPercent?: number;
  };
}

export default function EligibilityResultCard({ eligibility, formData }: EligibilityResultCardProps) {
  const t = useTranslations('FIRBCalculator.results.eligibility');
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Determine header color and icon based on eligibility
  const getHeaderStyles = () => {
    if (!eligibility.canPurchase) {
      return {
        bgClass: 'bg-gradient-to-br from-red-500 to-red-600',
        icon: <XCircle className="w-5 h-5 mr-2" />,
        badgeText: t('approval.prohibited'),
        titleText: t('approval.prohibitedDesc')
      };
    }
    if (eligibility.requiresFIRB) {
      return {
        bgClass: 'bg-gradient-to-br from-amber-500 to-amber-600',
        icon: <AlertTriangle className="w-5 h-5 mr-2" />,
        badgeText: t('approval.required'),
        titleText: t('approval.requiredDesc')
      };
    }
    return {
      bgClass: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: <CheckCircle className="w-5 h-5 mr-2" />,
      badgeText: t('approval.notRequired'),
      titleText: t('approval.notRequiredDesc')
    };
  };

  const headerStyles = getHeaderStyles();

  return (
    <Card className="shadow-lg border-blue-200/50 overflow-hidden">
      <div className={`${headerStyles.bgClass} text-white rounded-t-lg -mt-6`}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl font-bold">{t('header')}</CardTitle>
          <Badge 
            variant={!eligibility.canPurchase ? "destructive" : eligibility.requiresFIRB ? "default" : "default"}
            className={`text-base px-3 py-1.5 ${
              !eligibility.canPurchase 
                ? "bg-red-500 text-white" 
                : eligibility.requiresFIRB 
                  ? "bg-amber-500 text-white" 
                  : "bg-green-500 text-white"
            }`}
          >
            {headerStyles.icon} {headerStyles.badgeText}
          </Badge>
        </div>
          <CardDescription className="text-white/90 text-base">
            {headerStyles.titleText}
          </CardDescription>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Summary Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t('summary.title')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('summary.description')}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-lg border border-blue-100">
            {/* Citizenship Status */}
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('summary.citizenshipStatus')}</p>
                <p className="font-semibold">{formData?.citizenshipStatus ? formatCitizenshipStatus(formData.citizenshipStatus) : 'Not specified'}</p>
                {formData?.visaType && (
                  <p className="text-xs text-muted-foreground">Visa: {formData.visaType}</p>
                )}
              </div>
            </div>

            {/* Property Type */}
            <div className="flex items-start gap-3">
              <Home className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('summary.propertyType')}</p>
                <p className="font-semibold">{formData?.propertyType ? formatPropertyType(formData.propertyType) : 'Not specified'}</p>
              </div>
            </div>

            {/* Investment Property Type */}
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('summary.investmentProperty')}</p>
                <p className="font-semibold">{formData?.isFirstHome !== undefined ? getInvestmentPropertyLabel(formData.isFirstHome) : 'Not specified'}</p>
              </div>
            </div>

            {/* Entity Type */}
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('summary.entityType')}</p>
                <p className="font-semibold">{formData?.entityType ? formatEntityType(formData.entityType) : 'Not specified'}</p>
              </div>
            </div>

            {/* Property Value */}
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('summary.propertyValue')}</p>
                <p className="font-semibold">{formData?.propertyValue ? formatCurrency(formData.propertyValue) : 'Not specified'}</p>
              </div>
            </div>

            {/* State */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-600 font-medium">{t('summary.state')}</p>
                <p className="font-semibold">{formData?.state ? formatState(formData.state) : 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section - Only show if FIRB is required */}
        {eligibility.requiresFIRB && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('requirements.title')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">{t('requirements.firbApplication')}</p>
                  <p className="text-sm text-green-700">
                    Required before contract signing
                  </p>
                </div>
              </div>

              {eligibility.processingTimeline && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{t('requirements.processingTime')}</p>
                    <p className="text-sm text-blue-700">
                      Standard: {eligibility.processingTimeline.standard} | 
                      Expedited: {eligibility.processingTimeline.expedited}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{t('requirements.documentation')}</p>
                  <p className="text-sm text-blue-700">
                    Identification, proof of funds, property contract
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restrictions Section */}
        {eligibility.restrictions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('restrictions.title')}</h3>
            <div className="space-y-3">
              {eligibility.restrictions.map((restriction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-900">{restriction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {eligibility.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('recommendations.title')}</h3>
            <div className="space-y-3">
              {eligibility.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

