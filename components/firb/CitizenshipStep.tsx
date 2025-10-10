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
    <Card className="border-none shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription className="text-base mt-2">{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Citizenship Status */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">{t('statusLabel')}</Label>
          <RadioGroup
            value={citizenshipStatus}
            onValueChange={(value) => onCitizenshipStatusChange(value as CitizenshipStatus)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {/* Australian Citizen */}
            <Label htmlFor="australian" className="cursor-pointer block">
              <div className="flex items-center space-x-3 rounded-xl border-2 border-border/50 p-4 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all h-20">
                <RadioGroupItem value="australian" id="australian" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {t('australian.title')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {t('australian.description')}
                  </p>
                </div>
              </div>
            </Label>

            {/* Permanent Resident */}
            <Label htmlFor="permanent" className="cursor-pointer block">
              <div className="flex items-center space-x-3 rounded-xl border-2 border-border/50 p-4 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all h-20">
                <RadioGroupItem value="permanent" id="permanent" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {t('permanent.title')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {t('permanent.description')}
                  </p>
                </div>
              </div>
            </Label>

            {/* Temporary Resident */}
            <Label htmlFor="temporary" className="cursor-pointer block">
              <div className="flex items-center space-x-3 rounded-xl border-2 border-border/50 p-4 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all h-20">
                <RadioGroupItem value="temporary" id="temporary" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {t('temporary.title')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {t('temporary.description')}
                  </p>
                </div>
              </div>
            </Label>

            {/* Foreign Person */}
            <Label htmlFor="foreign" className="cursor-pointer block">
              <div className="flex items-center space-x-3 rounded-xl border-2 border-border/50 p-4 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm transition-all h-20">
                <RadioGroupItem value="foreign" id="foreign" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {t('foreign.title')}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {t('foreign.description')}
                  </p>
                </div>
              </div>
            </Label>
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

