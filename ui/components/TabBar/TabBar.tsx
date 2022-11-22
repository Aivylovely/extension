import React, { ReactElement } from "react"

import { matchPath, useHistory, useLocation } from "react-router-dom"
import { selectCurrentNetwork } from "@tallyho/tally-background/redux-slices/selectors"
import { NETWORKS_SUPPORTING_SWAPS } from "@tallyho/tally-background/constants/networks"
import { EVMNetwork } from "@tallyho/tally-background/networks"
import TabBarIcon from "./TabBarIcon"
import tabs, { defaultTab, TabInfo } from "../../utils/tabs"
import { useBackgroundSelector } from "../../hooks"

const isTabSupportedByNetwork = (tab: TabInfo, network: EVMNetwork) => {
  switch (tab.path) {
    case "/swap":
      return NETWORKS_SUPPORTING_SWAPS.has(network.chainID)
    default:
      return true
  }
}

export default function TabBar(): ReactElement {
  const location = useLocation()
  const selectedNetwork = useBackgroundSelector(selectCurrentNetwork)
  const history = useHistory()

  const activeTab =
    tabs.find(({ path }) =>
      matchPath(location.pathname, { path, exact: false })
    ) ?? defaultTab

  return (
    <nav>
      {tabs
        .filter((tab) => isTabSupportedByNetwork(tab, selectedNetwork))
        .map(({ path, title, icon }) => {
          return (
            <TabBarIcon
              key={path}
              icon={icon}
              title={title}
              onClick={() => history.push(path)}
              isActive={activeTab.path === path}
            />
          )
        })}
      <style jsx>
        {`
          nav {
            width: 100%;
            height: 56px;
            background-color: var(--hunter-green);
            display: flex;
            justify-content: space-around;
            padding: 0px 46px;
            box-sizing: border-box;
            align-items: center;
            flex-shrink: 0;
            box-shadow: 0 0 5px rgba(0, 20, 19, 0.5);
            z-index: 10;
          }
        `}
      </style>
    </nav>
  )
}
