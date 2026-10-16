import * as c from './charts.jsx';
import Icc from './Icc.jsx';

// Figure id (used in question data) → component.
export const figures = {
  icc: Icc,
  'tu-mu': c.TuMu,
  'indifference-map': c.IndifferenceMap,
  'ic-complements': c.IcComplements,
  'ic-substitutes': c.IcSubstitutes,
  'budget-read-price': c.BudgetReadPrice,
  'budget-income-shift': c.BudgetIncomeShift,
  'budget-price-rotate': c.BudgetPriceRotate,
  'consumer-optimum': c.ConsumerOptimum,
  engel: c.EngelNormal,
  'engel-inferior': c.EngelInferior,
  'engel-luxury': c.EngelLuxury,
  pcc: c.Pcc,
  'subst-income': c.SubstIncome,
  'market-demand-sum': c.MarketDemandSum,
  'demand-shift': c.DemandShift,
  'supply-curve': c.SupplyCurve,
  'supply-shift': c.SupplyShift,
  'market-equilibrium': c.MarketEquilibrium,
  'dd-ss-both': c.DdSsBoth,
  'wine-ppf': c.WinePpf,
  'wine-trade': c.WineTrade,
  'isoquant-isocost': c.IsoquantIsocost,
};
