/**
 * Property Details Step Component
 * Collects property information for FIRB calculations
 */

'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyType, AustralianState, EntityType } from '@/lib/firb/constants';
import { Home, Building, MapPin, DollarSign, Percent } from 'lucide-react';

interface PropertyDetailsStepProps {
  propertyType: PropertyType | '';
  propertyValue: number;
  state: AustralianState | '';
  propertyAddress?: string;
  isFirstHome: boolean;
  depositPercent: number;
  entityType: EntityType;
  onPropertyTypeChange: (type: PropertyType) => void;
  onPropertyValueChange: (value: number) => void;
  onStateChange: (state: AustralianState) => void;
  onPropertyAddressChange: (address: string) => void;
  onFirstHomeChange: (isFirstHome: boolean) => void;
  onDepositPercentChange: (percent: number) => void;
  onEntityTypeChange: (type: EntityType) => void;
}

export default function PropertyDetailsStep({
  propertyType,
  propertyValue,
  state,
  propertyAddress,
  isFirstHome,
  depositPercent,
  entityType,
  onPropertyTypeChange,
  onPropertyValueChange,
  onStateChange,
  onPropertyAddressChange,
  onFirstHomeChange,
  onDepositPercentChange,
  onEntityTypeChange
}: PropertyDetailsStepProps) {
  const t = useTranslations('FIRBCalculator.property');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Type */}
        <div className="space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Home className="h-5 w-5" />
            {t('typeLabel')}
          </Label>
          <RadioGroup
            value={propertyType}
            onValueChange={(value) => onPropertyTypeChange(value as PropertyType)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="newDwelling" id="newDwelling" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="newDwelling" className="font-medium cursor-pointer">
                  {t('types.newDwelling.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('types.newDwelling.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="established" id="established" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="established" className="font-medium cursor-pointer">
                  {t('types.established.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('types.established.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="vacantLand" id="vacantLand" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="vacantLand" className="font-medium cursor-pointer">
                  {t('types.vacantLand.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('types.vacantLand.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="commercial" id="commercial" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="commercial" className="font-medium cursor-pointer">
                  {t('types.commercial.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('types.commercial.description')}
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Property Value */}
        <div className="space-y-3">
          <Label htmlFor="property-value" className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('valueLabel')}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="property-value"
              type="number"
              value={propertyValue || ''}
              onChange={(e) => onPropertyValueChange(Number(e.target.value))}
              placeholder="1000000"
              className="pl-8"
            />
          </div>
          {propertyValue > 0 && (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(propertyValue)}
            </p>
          )}
        </div>

        {/* State/Territory */}
        <div className="space-y-3">
          <Label htmlFor="state" className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('stateLabel')}
          </Label>
          <Select value={state} onValueChange={(value) => onStateChange(value as AustralianState)}>
            <SelectTrigger id="state">
              <SelectValue placeholder={t('statePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NSW">New South Wales (NSW)</SelectItem>
              <SelectItem value="VIC">Victoria (VIC)</SelectItem>
              <SelectItem value="QLD">Queensland (QLD)</SelectItem>
              <SelectItem value="SA">South Australia (SA)</SelectItem>
              <SelectItem value="WA">Western Australia (WA)</SelectItem>
              <SelectItem value="TAS">Tasmania (TAS)</SelectItem>
              <SelectItem value="ACT">Australian Capital Territory (ACT)</SelectItem>
              <SelectItem value="NT">Northern Territory (NT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Address (Optional) */}
        <div className="space-y-3">
          <Label htmlFor="property-address" className="text-base font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            {t('addressLabel')}
            <span className="text-sm font-normal text-muted-foreground">({t('optional')})</span>
          </Label>
          <Input
            id="property-address"
            type="text"
            value={propertyAddress || ''}
            onChange={(e) => onPropertyAddressChange(e.target.value)}
            placeholder={t('addressPlaceholder')}
          />
        </div>

        {/* First Home Buyer */}
        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
          <Checkbox
            id="first-home"
            checked={isFirstHome}
            onCheckedChange={(checked) => onFirstHomeChange(checked as boolean)}
            className="mt-1"
          />
          <div className="flex-1">
            <Label htmlFor="first-home" className="font-medium cursor-pointer">
              {t('firstHome.label')}
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              {t('firstHome.description')}
            </p>
          </div>
        </div>

        {/* Deposit Percentage */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Percent className="h-5 w-5" />
            {t('depositLabel')}
          </Label>
          <div className="space-y-4">
            <Slider
              value={[depositPercent]}
              onValueChange={(values) => onDepositPercentChange(values[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">0%</span>
              <span className="font-semibold text-primary">{depositPercent}%</span>
              <span className="text-muted-foreground">100%</span>
            </div>
            {propertyValue > 0 && (
              <p className="text-sm text-muted-foreground">
                {t('depositAmount')}: {formatCurrency((propertyValue * depositPercent) / 100)}
              </p>
            )}
          </div>
        </div>

        {/* Entity Type */}
        <div className="space-y-3">
          <Label htmlFor="entity-type" className="text-base font-semibold">
            {t('entityLabel')}
          </Label>
          <Select value={entityType} onValueChange={(value) => onEntityTypeChange(value as EntityType)}>
            <SelectTrigger id="entity-type">
              <SelectValue placeholder={t('entityPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">{t('entities.individual')}</SelectItem>
              <SelectItem value="company">{t('entities.company')}</SelectItem>
              <SelectItem value="trust">{t('entities.trust')}</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {t('entityDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

