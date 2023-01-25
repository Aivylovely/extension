import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { Ability } from "../../abilities"
import { filterAbility } from "../utils/abilities"

const selectAbilities = createSelector(
  (state: RootState) => state.abilities,
  (abilitiesSlice) => abilitiesSlice.abilities
)

export const selectHideDescription = createSelector(
  (state: RootState) => state.abilities.hideDescription,
  (hideDescription) => hideDescription
)

/* Filtering selectors */
export const selectAbilityFilters = createSelector(
  (state: RootState) => state.abilities,
  (abilitiesSlice) => abilitiesSlice.filters
)

/* Items selectors */
export const selectFilteredAbilities = createSelector(
  selectAbilityFilters,
  selectAbilities,
  (filters, abilities) => {
    const activeAbilities: Ability[] = []
    Object.values(abilities).forEach((addressAbilities) => {
      activeAbilities.push(
        ...Object.values(addressAbilities).filter((ability) =>
          filterAbility(ability, filters)
        )
      )
    })
    return activeAbilities
  }
)

/* Counting selectors  */
export const selectAbilityCount = createSelector(
  selectFilteredAbilities,
  (abilities) => abilities.length
)
