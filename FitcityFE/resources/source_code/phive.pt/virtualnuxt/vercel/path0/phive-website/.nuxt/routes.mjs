
if (import.meta.hot) {
  import.meta.hot.accept((mod) => {
    const router = import.meta.hot.data.router
    const generateRoutes = import.meta.hot.data.generateRoutes
    if (!router || !generateRoutes) {
      import.meta.hot.invalidate('[nuxt] Cannot replace routes because there is no active router. Reloading.')
      return
    }
    router.clearRoutes()
    const routes = generateRoutes(mod.default || mod)
    function addRoutes (routes) {
      for (const route of routes) {
        router.addRoute(route)
      }
      router.replace(router.currentRoute.value.fullPath)
    }
    if (routes && 'then' in routes) {
      routes.then(addRoutes)
    } else {
      addRoutes(routes)
    }
  })
}

export function handleHotUpdate(_router, _generateRoutes) {
  if (import.meta.hot) {
    import.meta.hot.data ||= {}
    import.meta.hot.data.router = _router
    import.meta.hot.data.generateRoutes = _generateRoutes
  }
}
import { default as _91_46_46_46path_93V4lCQBw_jjJewgWrj0mzBHSs3Z3kU9mWVWTSh7_jNR0Meta } from "/vercel/path0/phive-website/pages/[...path].vue?macro=true";
import { default as component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta } from "/vercel/path0/phive-website/node_modules/nuxt/dist/pages/runtime/component-stub.js?macro=true";
import { default as component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784 } from "/vercel/path0/phive-website/node_modules/nuxt/dist/pages/runtime/component-stub.js";
export default [
  {
    name: "path",
    path: "/:path(.*)*",
    meta: _91_46_46_46path_93V4lCQBw_jjJewgWrj0mzBHSs3Z3kU9mWVWTSh7_jNR0Meta || {},
    component: () => import("/vercel/path0/phive-website/pages/[...path].vue")
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/clubes/leiria",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/zumba",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/politica-de-privacidade",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/mobilidade",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/yoga",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/rpm",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/clubes",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/clubes/lisboa",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/clubes/lagrimas",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/lm-core",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/clubes/porto",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/body-balance",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/kick-kids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/dancekids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/clubes/celas",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/flyoga",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/trx",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/bodypump",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/step-coreografado",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/bootcamp-kids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/horario",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/form/campanha-online",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/form/saber-mais",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/abdominal",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/lmdance",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/bootcamp",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/natacao-babies",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/pilates",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/crossphive",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/natacao-kids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/yoguitos-kids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/bodyattack",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/bodycombat",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/stretching",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/boxecamp",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/gap",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/bodystep",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/localizada",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/spinning",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/hybrid",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/hidroginastica",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/form/explora-o-teu-phive",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/flyoguitos-kids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/hidrobike",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/aulas/pilateskids",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/fitness-hub",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/pt/form/marcar-visita",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/modalidades",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/instrutores",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/ginasios",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/horarios",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/en/activities",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/en/instrutores",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/en/ginasios",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/ginasios/lagrimas-health-club",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/ginasios/leiria-health-club",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/ginasios/celas-fitness-club",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/blog",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/corporate",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/promo-lightbox",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/clubes/boavista",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  },
  {
    name: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784Meta?.name,
    path: "/clubes/5deoutubro",
    component: component_45stubj2l5ExwxUyyRyhN3yvICK2zaZvYbrCRhCmHpT7W_784
  }
]