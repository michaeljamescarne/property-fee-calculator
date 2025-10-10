/**
 * Citizenship Step Component
 * Collects citizenship status and related information
 */

'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CitizenshipStatus, TEMPORARY_VISA_TYPES } from '@/lib/firb/constants';
import { Info } from 'lucide-react';

interface CitizenshipStepProps {
  citizenshipStatus: CitizenshipStatus | '';
  visaType?: string;
  isOrdinarilyResident?: boolean;
  onCitizenshipStatusChange: (status: CitizenshipStatus) => void;
  onVisaTypeChange: (visaType: string) => void;
  onOrdinarilyResidentChange: (isResident: boolean) => void;
}

export default function CitizenshipStep({
  citizenshipStatus,
  visaType,
  isOrdinarilyResident,
  onCitizenshipStatusChange,
  onVisaTypeChange,
  onOrdinarilyResidentChange
}: CitizenshipStepProps) {
  const t = useTranslations('FIRBCalculator.citizenship');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Citizenship Status */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">{t('statusLabel')}</Label>
          <RadioGroup
            value={citizenshipStatus}
            onValueChange={(value) => onCitizenshipStatusChange(value as CitizenshipStatus)}
            className="space-y-3"
          >
            {/* Australian Citizen */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="australian" id="australian" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="australian" className="font-medium cursor-pointer">
                  {t('australian.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('australian.description')}
                </p>
              </div>
            </div>

            {/* Permanent Resident */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="permanent" id="permanent" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="permanent" className="font-medium cursor-pointer">
                  {t('permanent.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('permanent.description')}
                </p>
              </div>
            </div>

            {/* Temporary Resident */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="temporary" id="temporary" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="temporary" className="font-medium cursor-pointer">
                  {t('temporary.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('temporary.description')}
                </p>
              </div>
            </div>

            {/* Foreign Person */}
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="foreign" id="foreign" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="foreign" className="font-medium cursor-pointer">
                  {t('foreign.title')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('foreign.description')}
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>

        {/* Conditional: Visa Type for Temporary Residents */}
        {citizenshipStatus === 'temporary' && (
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <Label htmlFor="visa-type" className="text-base font-medium">
                  {t('visaType.label')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {t('visaType.description')}
                </p>
                <Select value={visaType} onValueChange={onVisaTypeChange}>
                  <SelectTrigger id="visa-type" className="bg-background">
                    <SelectValue placeholder={t('visaType.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPORARY_VISA_TYPES.map((visa) => (
                      <SelectItem key={visa.value} value={visa.value}>
                        {visa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Conditional: Ordinarily Resident for Australian Citizens */}
        {citizenshipStatus === 'australian' && (
          <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-3">
              <Checkbox
                id="ordinarily-resident"
                checked={isOrdinarilyResident ?? true}
                onCheckedChange={(checked) => onOrdinarilyResidentChange(checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="ordinarily-resident" className="font-medium cursor-pointer">
                  {t('ordinaril yResident.label')}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('ordinaril yResident.description')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Information Box */}
        {citizenshipStatus && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {citizenshipStatus === 'australian' && t('info.australian')}
                {citizenshipStatus === 'permanent' && t('info.permanent')}
                {citizenshipStatus === 'temporary' && t('info.temporary')}
                {citizenshipStatus === 'foreign' && t('info.foreign')}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

