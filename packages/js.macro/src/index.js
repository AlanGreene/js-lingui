import { createMacro, MacroError } from "babel-plugin-macros"
import Transformer from "./transformer"

function index({ references, state, babel }) {
  const { types: t } = babel
  const transformer = new Transformer(babel, { standalone: true })

  for (let [tagName, tags] of Object.entries(references)) {
    tags.forEach(tag => {
      let path
      if (tagName === "t" && t.isCallExpression(tag.parentPath)) {
        path = tag.parentPath.parentPath
      } else {
        path = tag.parentPath
      }

      if (!path.scope.hasBinding("i18n")) {
        throw new MacroError("i18n object must be in scope when using macros")
      }

      transformer.transform(path, state.file)
    })
  }
}

const t = () => {}
const plural = () => {}
const select = () => {}
const selectOrdinal = () => {}
const date = () => {}
const number = () => {}

// type PluralForms = {
//   zero?: string,
//   one?: string,
//   two?: string,
//   few?: string,
//   many?: string,
//   other: string
// }
//
// type PluralProps = {
//   value: number,
//   offset?: number,
//   locales?: Locales,
//   format?: NumberFormat
// } & PluralForms
//
// declare var Intl: {
//   NumberFormat: any
// }

export default createMacro(index)
export { t, plural, select, selectOrdinal, date, number }