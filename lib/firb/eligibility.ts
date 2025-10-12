/**
 * FIRB Eligibility Logic
 * Determines eligibility and requirements based on citizenship status and property type
 * Ported from eligibilityWizard.js
 */

import { CitizenshipStatus, PropertyType, PROPERTY_ELIGIBILITY, FIRB_PROCESSING_TIMES } from './constants';

export interface EligibilityResult {
  isEligible: boolean;
  requiresFIRB: boolean;
  firbApprovalType: 'required' | 'exempt' | 'notAllowed';
  canPurchase: boolean;
  restrictions: string[];
  recommendations: string[];
  allowedPropertyTypes: PropertyType[];
  processingTimeline?: {
    standard: string;
    expedited: string;
    complex?: string;
  };
}

/**
 * Check citizenship eligibility for property purchase
 */
export function checkCitizenshipEligibility(
  status: CitizenshipStatus,
  visaType?: string,
  isOrdinarilyResident?: boolean
): EligibilityResult {
  const eligibilityRules = PROPERTY_ELIGIBILITY[status];
  
  const baseResult: EligibilityResult = {
    isEligible: true,
    requiresFIRB: eligibilityRules.requiresFIRB,
    firbApprovalType: eligibilityRules.requiresFIRB ? 'required' : 'exempt',
    canPurchase: true,
    restrictions: [...eligibilityRules.restrictions],
    recommendations: [],
    allowedPropertyTypes: eligibilityRules.canBuy as PropertyType[]
  };

  // Australian Citizens
  if (status === 'australian') {
    if (isOrdinarilyResident === false) {
      // Australian citizens not ordinarily resident are treated as foreign
      baseResult.requiresFIRB = true;
      baseResult.firbApprovalType = 'required';
      baseResult.restrictions.push('As you are not ordinarily resident in Australia, FIRB approval is required');
      baseResult.recommendations.push('Ensure you apply for FIRB approval before signing any contract');
    } else {
      baseResult.recommendations.push('As an Australian citizen, you have no restrictions on property purchases');
      baseResult.recommendations.push('No FIRB approval required - you can purchase immediately');
    }
  }

  // Permanent Residents
  if (status === 'permanent') {
    baseResult.recommendations.push('As a permanent resident, you have the same rights as Australian citizens');
    baseResult.recommendations.push('No FIRB approval required for any residential property type');
    baseResult.recommendations.push('You can purchase established dwellings, new dwellings, or vacant land');
  }

  // Temporary Residents
  if (status === 'temporary') {
    baseResult.allowedPropertyTypes = ['newDwelling'];
    baseResult.processingTimeline = {
      standard: FIRB_PROCESSING_TIMES.standard,
      expedited: FIRB_PROCESSING_TIMES.expedited
    };
    
    baseResult.restrictions.push('You must occupy the property as your principal place of residence');
    baseResult.restrictions.push('You must sell the property within 6 months of it no longer being your principal residence or within 6 months of your visa ceasing');
    baseResult.restrictions.push('You cannot purchase established dwellings - only new dwellings or off-the-plan');
    
    baseResult.recommendations.push('Apply for FIRB approval before signing a contract');
    baseResult.recommendations.push('Budget for FIRB application fees ($13,200+ depending on property value)');
    baseResult.recommendations.push('Consider expedited processing if you need faster approval (double the fee)');
    
    if (visaType === '500') {
      baseResult.recommendations.push('As a student visa holder, ensure your property can serve as your primary residence');
    }
  }

  // Foreign Persons
  if (status === 'foreign') {
    baseResult.allowedPropertyTypes = ['newDwelling', 'vacantLand'];
    baseResult.processingTimeline = {
      standard: FIRB_PROCESSING_TIMES.standard,
      expedited: FIRB_PROCESSING_TIMES.expedited,
      complex: FIRB_PROCESSING_TIMES.complex
    };
    
    baseResult.restrictions.push('You can only purchase new dwellings, off-the-plan properties, or vacant land for development');
    baseResult.restrictions.push('Established dwellings are not permitted except in exceptional circumstances');
    baseResult.restrictions.push('Annual vacancy fee may apply if the property is not occupied or genuinely available for rent');
    baseResult.restrictions.push('You must notify the ATO within 30 days of settlement');
    
    baseResult.recommendations.push('FIRB approval is mandatory - do not sign any contract before obtaining approval');
    baseResult.recommendations.push('Budget for significant foreign buyer stamp duty surcharges (7-8% in most states)');
    baseResult.recommendations.push('Consider engaging a lawyer or conveyancer experienced in foreign purchases');
    baseResult.recommendations.push('Be aware of annual vacancy fees and land tax surcharges');
    baseResult.recommendations.push('Ensure you have the property genuinely available for rent or occupied at least 183 days per year to avoid vacancy fees');
  }

  return baseResult;
}

/**
 * Check if a specific property type is eligible for the citizenship status
 */
export function checkPropertyEligibility(
  propertyType: PropertyType,
  citizenshipStatus: CitizenshipStatus,
  isOrdinarilyResident?: boolean
): { eligible: boolean; reason?: string } {
  // Australian citizens who are not ordinarily resident are treated as foreign
  let effectiveStatus = citizenshipStatus;
  if (citizenshipStatus === 'australian' && isOrdinarilyResident === false) {
    effectiveStatus = 'foreign';
  }

  const eligibilityRules = PROPERTY_ELIGIBILITY[effectiveStatus];
  const canBuy = eligibilityRules.canBuy.includes(propertyType);

  if (!canBuy) {
    let reason = '';
    
    if (effectiveStatus === 'temporary') {
      if (propertyType === 'established') {
        reason = 'Temporary residents cannot purchase established dwellings. You can only purchase new dwellings or off-the-plan properties.';
      } else if (propertyType === 'vacantLand') {
        reason = 'Temporary residents cannot purchase vacant land. You can only purchase new dwellings or off-the-plan properties.';
      } else if (propertyType === 'commercial') {
        reason = 'Different rules apply for commercial property purchases. Please consult with FIRB directly.';
      }
    }
    
    if (effectiveStatus === 'foreign') {
      if (propertyType === 'established') {
        reason = 'Foreign persons cannot purchase established dwellings except in exceptional circumstances approved by FIRB.';
      } else if (propertyType === 'commercial') {
        reason = 'Commercial property purchases by foreign persons require separate FIRB approval and have different thresholds.';
      }
    }

    return { eligible: false, reason };
  }

  return { eligible: true };
}

/**
 * Get property restrictions based on citizenship and property type
 */
export function getPropertyRestrictions(
  propertyType: PropertyType,
  citizenshipStatus: CitizenshipStatus,
  isOrdinarilyResident?: boolean
): string[] {
  const eligibility = checkCitizenshipEligibility(citizenshipStatus, undefined, isOrdinarilyResident);
  const propertyCheck = checkPropertyEligibility(propertyType, citizenshipStatus, isOrdinarilyResident);

  const restrictions: string[] = [...eligibility.restrictions];

  if (!propertyCheck.eligible && propertyCheck.reason) {
    restrictions.unshift(propertyCheck.reason);
  }

  // Add property-type specific restrictions
  if (propertyType === 'newDwelling') {
    if (citizenshipStatus === 'temporary' || citizenshipStatus === 'foreign') {
      restrictions.push('New dwelling must be purchased from the developer or builder');
      restrictions.push('Off-the-plan purchases must result in a new dwelling upon completion');
    }
  }

  if (propertyType === 'vacantLand') {
    if (citizenshipStatus === 'foreign') {
      restrictions.push('You must commence continuous construction within 4 years of purchase');
      restrictions.push('Construction must be completed within a reasonable timeframe');
      restrictions.push('Failure to develop may result in penalties and forced sale');
    }
  }

  return restrictions;
}

/**
 * Get FIRB application requirements
 */
export function getFIRBRequirements(
  citizenshipStatus: CitizenshipStatus,
  propertyType: PropertyType,
  propertyValue: number
): {
  required: boolean;
  fee: number;
  processingTime: string;
  requirements: string[];
} {
  const eligibility = checkCitizenshipEligibility(citizenshipStatus);

  if (!eligibility.requiresFIRB) {
    return {
      required: false,
      fee: 0,
      processingTime: 'N/A',
      requirements: ['No FIRB approval required for your citizenship status']
    };
  }

  // Calculate FIRB fee based on property value (from constants)
  let fee = 0;
  if (propertyValue <= 1000000) fee = 13200;
  else if (propertyValue <= 2000000) fee = 26400;
  else if (propertyValue <= 3000000) fee = 39600;
  else if (propertyValue <= 4000000) fee = 52800;
  else if (propertyValue <= 5000000) fee = 66000;
  else if (propertyValue <= 6000000) fee = 79200;
  else if (propertyValue <= 7000000) fee = 92400;
  else if (propertyValue <= 8000000) fee = 105600;
  else if (propertyValue <= 9000000) fee = 118800;
  else if (propertyValue <= 10000000) fee = 132000;
  else {
    // Above $10M: $132,000 + $13,200 per additional million
    const additionalMillions = Math.ceil((propertyValue - 10000000) / 1000000);
    fee = 132000 + (additionalMillions * 13200);
  }

  const requirements: string[] = [
    'Complete FIRB online application form',
    'Provide proof of identity (passport, visa documents)',
    'Provide evidence of funds for purchase',
    'Pay application fee (non-refundable)',
    'Provide property details and contract information',
  ];

  if (citizenshipStatus === 'temporary') {
    requirements.push('Provide current visa documentation');
    requirements.push('Confirm property will be your principal place of residence');
  }

  if (propertyType === 'vacantLand') {
    requirements.push('Provide development plans and timeline');
    requirements.push('Commit to commencing construction within 4 years');
  }

  return {
    required: true,
    fee,
    processingTime: FIRB_PROCESSING_TIMES.standard,
    requirements
  };
}

/**
 * Comprehensive eligibility check with full details
 */
export function performFullEligibilityCheck(
  citizenshipStatus: CitizenshipStatus,
  propertyType: PropertyType,
  propertyValue: number,
  visaType?: string,
  isOrdinarilyResident?: boolean
): EligibilityResult {
  const baseEligibility = checkCitizenshipEligibility(citizenshipStatus, visaType, isOrdinarilyResident);
  const propertyCheck = checkPropertyEligibility(propertyType, citizenshipStatus, isOrdinarilyResident);
  const restrictions = getPropertyRestrictions(propertyType, citizenshipStatus, isOrdinarilyResident);
  const firbReqs = getFIRBRequirements(citizenshipStatus, propertyType, propertyValue);

  return {
    ...baseEligibility,
    isEligible: propertyCheck.eligible,
    canPurchase: propertyCheck.eligible,
    restrictions,
    processingTimeline: baseEligibility.requiresFIRB ? {
      standard: firbReqs.processingTime,
      expedited: FIRB_PROCESSING_TIMES.expedited
    } : undefined
  };
}


