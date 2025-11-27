/**
 * Loan/Mortgage Calculator
 * Calculates loan repayments, interest, and balance over time
 */

export interface LoanRepayment {
  monthlyPayment: number;
  annualPayment: number;
  totalInterest: number;
  totalPrincipal: number;
}

export interface LoanBalance {
  year: number;
  balance: number;
  principalPaid: number;
  interestPaid: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

/**
 * Calculate monthly loan repayment (Principal & Interest)
 * Using standard amortization formula
 */
export function calculateMonthlyRepayment(
  principal: number,
  annualInterestRate: number,
  loanTermYears: number
): number {
  if (annualInterestRate === 0) {
    return principal / (loanTermYears * 12);
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return monthlyPayment;
}

/**
 * Calculate monthly interest-only repayment
 */
export function calculateInterestOnlyRepayment(
  principal: number,
  annualInterestRate: number
): number {
  return (principal * (annualInterestRate / 100)) / 12;
}

/**
 * Calculate loan repayment details
 */
export function calculateLoanRepayment(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number,
  loanType: "principalAndInterest" | "interestOnly",
  interestOnlyPeriodYears: number = 0
): LoanRepayment {
  let monthlyPayment: number;
  let totalInterest = 0;
  let totalPrincipal = 0;

  if (loanType === "interestOnly" || interestOnlyPeriodYears > 0) {
    // Interest only period
    const ioMonthly = calculateInterestOnlyRepayment(loanAmount, annualInterestRate);
    const ioMonths = Math.min(interestOnlyPeriodYears, loanTermYears) * 12;
    const ioInterest = ioMonthly * ioMonths;

    if (loanType === "interestOnly" || interestOnlyPeriodYears >= loanTermYears) {
      // Fully interest only
      monthlyPayment = ioMonthly;
      totalInterest = ioInterest;
      totalPrincipal = 0;
    } else {
      // Interest only then P&I
      const remainingTerm = loanTermYears - interestOnlyPeriodYears;
      const piMonthly = calculateMonthlyRepayment(loanAmount, annualInterestRate, remainingTerm);
      const piMonths = remainingTerm * 12;
      const piTotal = piMonthly * piMonths;
      const piInterest = piTotal - loanAmount;

      // Use P&I payment for monthly (more relevant for ongoing)
      monthlyPayment = piMonthly;
      totalInterest = ioInterest + piInterest;
      totalPrincipal = loanAmount;
    }
  } else {
    // Principal and interest from start
    monthlyPayment = calculateMonthlyRepayment(loanAmount, annualInterestRate, loanTermYears);
    const totalPayments = monthlyPayment * loanTermYears * 12;
    totalInterest = totalPayments - loanAmount;
    totalPrincipal = loanAmount;
  }

  return {
    monthlyPayment,
    annualPayment: monthlyPayment * 12,
    totalInterest,
    totalPrincipal,
  };
}

/**
 * Calculate loan balance over time (year by year)
 */
export function calculateLoanSchedule(
  loanAmount: number,
  annualInterestRate: number,
  loanTermYears: number,
  loanType: "principalAndInterest" | "interestOnly",
  interestOnlyPeriodYears: number = 0,
  projectionYears: number = 10
): LoanBalance[] {
  const schedule: LoanBalance[] = [];
  let balance = loanAmount;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  const monthlyRate = annualInterestRate / 100 / 12;

  for (let year = 1; year <= Math.min(projectionYears, loanTermYears); year++) {
    let yearPrincipalPaid = 0;
    let yearInterestPaid = 0;

    // Determine payment type for this year
    const isIOPeriod = year <= interestOnlyPeriodYears;

    if (isIOPeriod || loanType === "interestOnly") {
      // Interest only payments
      const monthlyPayment = calculateInterestOnlyRepayment(balance, annualInterestRate);
      yearInterestPaid = monthlyPayment * 12;
      yearPrincipalPaid = 0;
    } else {
      // Principal and interest payments
      const remainingTerm = loanTermYears - year + 1;
      const monthlyPayment = calculateMonthlyRepayment(balance, annualInterestRate, remainingTerm);

      // Calculate principal and interest for each month of this year
      let yearBalance = balance;
      for (let month = 0; month < 12; month++) {
        const interestPayment = yearBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        yearInterestPaid += interestPayment;
        yearPrincipalPaid += principalPayment;
        yearBalance -= principalPayment;
      }
      balance = yearBalance;
    }

    cumulativePrincipal += yearPrincipalPaid;
    cumulativeInterest += yearInterestPaid;

    schedule.push({
      year,
      balance,
      principalPaid: yearPrincipalPaid,
      interestPaid: yearInterestPaid,
      cumulativePrincipal,
      cumulativeInterest,
    });
  }

  return schedule;
}

/**
 * Calculate Loan-to-Value Ratio (LVR)
 */
export function calculateLVR(loanAmount: number, propertyValue: number): number {
  return (loanAmount / propertyValue) * 100;
}

/**
 * Calculate Debt Service Coverage Ratio (DSCR)
 */
export function calculateDSCR(annualRentalIncome: number, annualLoanPayment: number): number {
  if (annualLoanPayment === 0) return Infinity;
  return annualRentalIncome / annualLoanPayment;
}

/**
 * Estimate required deposit based on LVR limits
 */
export function calculateRequiredDeposit(
  propertyValue: number,
  isForeignBuyer: boolean = true
): number {
  // Foreign buyers typically need 20% deposit minimum
  // Australian residents can get 80% LVR (20% deposit)
  // Some lenders require 30-40% for foreign buyers
  const minDepositPercent = isForeignBuyer ? 20 : 20;
  return propertyValue * (minDepositPercent / 100);
}
