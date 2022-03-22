import { Compilation, Compiler } from "webpack"

const PLUGIN_NAME = "RuntimeDefine"
const WINDOW_PROVIDER_FILENAME = "window-provider.js"
const PROVIDER_BRIDGE_FILENAME = "provider-bridge.js"

export default class InjectWindowProvider {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap(
      PLUGIN_NAME,
      (compilation: Compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: PLUGIN_NAME,
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
          },
          (assets) => {
            let windowProviderSource =
              // @ts-expect-error this exist
              // eslint-disable-next-line no-underscore-dangle
              assets[WINDOW_PROVIDER_FILENAME]._children[0]._value

            // need to encode so it can be used as a string
            // in non optimised builds the source is a multi line string > `` needs to be used
            // but ${ needs to be escaped separatly otherwise it breaks the ``
            windowProviderSource = encodeURI(windowProviderSource).replaceAll(
              "${",
              "\\${"
            )
            windowProviderSource = `\`${windowProviderSource}\``
            const providerBridgeSource =
              // @ts-expect-error this exist
              // eslint-disable-next-line no-underscore-dangle
              assets[PROVIDER_BRIDGE_FILENAME]._children[0]._value

            // @ts-expect-error this exist
            // eslint-disable-next-line no-underscore-dangle,no-param-reassign
            assets[PROVIDER_BRIDGE_FILENAME]._children[0]._value =
              providerBridgeSource.replace(
                // eslint-disable-next-line no-useless-escape
                `\"@@@WINDOW_PROVIDER@@@\"`,
                windowProviderSource
              )

            // eslint-disable-next-line no-param-reassign
            delete assets[WINDOW_PROVIDER_FILENAME]
            // eslint-disable-next-line no-param-reassign
            delete assets[`${WINDOW_PROVIDER_FILENAME}.map`]
          }
        )
      }
    )
  }
}
