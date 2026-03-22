import { useScriptGoogleTagManager, useScript, defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: "scripts:init",
  env: { islands: false },
  parallel: true,
  setup() {
    const googleTagManager = useScriptGoogleTagManager({"id":"GTM-PT7R2LMZ","async":true,"defer":true})
    return { provide: { $scripts: { googleTagManager } } }
  }
})