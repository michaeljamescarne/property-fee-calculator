/**
 * FIRB Formatting Utilities
 * Helper functions to format citizenship, property, and entity types for display
 */

import { CitizenshipStatus, PropertyType, EntityType, AustralianState } from './constants';

export function formatCitizenshipStatus(status: CitizenshipStatus): string {
  const labels: Record<CitizenshipStatus, string> = {
    australian: 'Australian Citizen',
    permanent: 'Permanent Resident',
    temporary: 'Temporary Resident',
    foreign: 'Foreign National'
  };
  return labels[status];
}

export function formatPropertyType(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    newDwelling: 'New Dwelling',
    established: 'Established Dwelling',
    vacantLand: 'Vacant Land',
    commercial: 'Commercial Property'
  };
  return labels[type];
}

export function formatEntityType(type: EntityType): string {
  const labels: Record<EntityType, string> = {
    individual: 'Individual',
    company: 'Company',
    trust: 'Trust'
  };
  return labels[type];
}

export function getInvestmentPropertyLabel(isFirstHome: boolean): string {
  return isFirstHome ? 'Owner-Occupier' : 'Investment Property';
}

export function formatState(state: AustralianState): string {
  const stateNames: Record<AustralianState, string> = {
    'NSW': 'New South Wales',
    'VIC': 'Victoria',
    'QLD': 'Queensland',
    'SA': 'South Australia',
    'WA': 'Western Australia',
    'TAS': 'Tasmania',
    'ACT': 'Australian Capital Territory',
    'NT': 'Northern Territory'
  };
  return stateNames[state];
}

