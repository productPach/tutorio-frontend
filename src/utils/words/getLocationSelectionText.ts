import { pluralize } from "numeralize-ru";

export function getLocationSelectionText(cityCount: number, areaCount: number): string {
  const total = cityCount + areaCount;
  if (total === 0) return "";
  const verb = total === 1 ? "Выбрана" : "Выбраны";
  const noun = pluralize(total, "локация", "локации", "локаций");
  return `и ещё ${total} ${noun} для вашего региона`;
}