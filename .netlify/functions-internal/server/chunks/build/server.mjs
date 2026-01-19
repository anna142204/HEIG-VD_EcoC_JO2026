import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, shallowRef, h, resolveComponent, computed, hasInjectionContext, inject, getCurrentInstance, defineAsyncComponent, createElementBlock, provide, cloneVNode, createApp, onServerPrefetch, ref, useAttrs, useTemplateRef, mergeProps, toRef, onErrorCaptured, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, toValue, getCurrentScope, nextTick, withCtx, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { j as parseQuery, k as hasProtocol, l as joinURL, w as withQuery, m as withTrailingSlash, n as withoutTrailingSlash, o as isScriptProtocol, s as sanitizeStatusCode, q as getContext, $ as $fetch$1, r as baseURL, p as publicAssetsURL, t as klona, v as defuFn, x as createHooks, e as createError$1, y as isEqual, z as stringifyParsedURL, A as stringifyQuery, B as toRouteMatcher, C as createRouter, D as defu, E as withLeadingSlash, F as parseURL, G as encodeParam, H as encodePath } from '../nitro/nitro.mjs';
import { Icon, _api, addAPIProvider, setCustomIconsLoader, getIcon, loadIcon as loadIcon$1 } from '@iconify/vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { getIconCSS } from '@iconify/utils/lib/css/icon';
import { debounce } from 'perfect-debounce';
import { u as useHead$1, h as headSymbol } from '../routes/renderer.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'node:url';
import 'ipx';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url),
      replace: (url) => handleNavigation(url),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index2 = routes.findIndex((route2) => route2.name === name);
        if (index2 !== -1) {
          routes.splice(index2, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(() => index).then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const inlineConfig = {
  "nuxt": {},
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "mode": "svg",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const __appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(__appConfig);
  return nuxtApp._appConfig;
}
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8
];
async function loadIcon(name, timeout) {
  if (!name)
    return null;
  const _icon = getIcon(name);
  if (_icon)
    return _icon;
  let timeoutWarn;
  const load = loadIcon$1(name).catch(() => {
    console.warn(`[Icon] failed to load icon \`${name}\``);
    return null;
  });
  if (timeout > 0)
    await Promise.race([
      load,
      new Promise((resolve) => {
        timeoutWarn = setTimeout(() => {
          console.warn(`[Icon] loading icon \`${name}\` timed out after ${timeout}ms`);
          resolve();
        }, timeout);
      })
    ]).finally(() => clearTimeout(timeoutWarn));
  else
    await load;
  return getIcon(name);
}
function useResolvedName(getName) {
  const options = useAppConfig().icon;
  const collections = (options.collections || []).sort((a, b) => b.length - a.length);
  return computed(() => {
    const name = getName();
    const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
    const resolved = options.aliases?.[bare] || bare;
    if (!resolved.includes(":")) {
      const collection = collections.find((c) => resolved.startsWith(c + "-"));
      return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
    }
    return resolved;
  });
}
function resolveCustomizeFn(customize, globalCustomize) {
  if (customize === false) return void 0;
  if (customize === true || customize === null) return globalCustomize;
  return customize;
}
const SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
  return selector.replace(/([^\w-])/g, "\\$1");
}
const NuxtIconCss = /* @__PURE__ */ defineComponent({
  name: "NuxtIconCss",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props) {
    const nuxt = useNuxtApp();
    const options = useAppConfig().icon;
    const cssClass = computed(() => props.name ? options.cssSelectorPrefix + props.name : "");
    const selector = computed(() => "." + escapeCssSelector(cssClass.value));
    function getCSS(icon, withLayer = true) {
      let iconSelector = selector.value;
      if (options.cssWherePseudo) {
        iconSelector = `:where(${iconSelector})`;
      }
      const css = getIconCSS(icon, {
        iconSelector,
        format: "compressed",
        customise: resolveCustomizeFn(props.customize, options.customize)
      });
      if (options.cssLayer && withLayer) {
        return `@layer ${options.cssLayer} { ${css} }`;
      }
      return css;
    }
    onServerPrefetch(async () => {
      {
        const configs = (/* @__PURE__ */ useRuntimeConfig()).icon || {};
        if (!configs?.serverKnownCssClasses?.includes(cssClass.value)) {
          const icon = await loadIcon(props.name, options.fetchTimeout).catch(() => null);
          if (!icon)
            return null;
          let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
          if (!ssrCSS) {
            ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
            nuxt.runWithContext(() => {
              useHead({
                style: [
                  () => {
                    const sep = "";
                    let css = Array.from(ssrCSS.values()).sort().join(sep);
                    if (options.cssLayer) {
                      css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
                    }
                    return { innerHTML: css };
                  }
                ]
              }, {
                tagPriority: "low"
              });
            });
          }
          if (props.name && !ssrCSS.has(props.name)) {
            const css = getCSS(icon, false);
            ssrCSS.set(props.name, css);
          }
          return null;
        }
      }
    });
    return () => h("span", { class: ["iconify", cssClass.value] });
  }
});
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry2 = nuxtApp._asyncData[key.value];
      if (entry2?._abortController) {
        try {
          entry2._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry2._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] && nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
const NuxtIconSvg = /* @__PURE__ */ defineComponent({
  name: "NuxtIconSvg",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    useNuxtApp();
    const options = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const storeKey = "i-" + name.value;
    if (name.value) {
      onServerPrefetch(async () => {
        {
          await useAsyncData(
            storeKey,
            async () => await loadIcon(name.value, options.fetchTimeout),
            { deep: false }
          );
        }
      });
    }
    return () => h(Icon, {
      icon: name.value,
      ssr: true,
      // Iconify uses `customise`, where we expose `customize` for consistency
      customise: resolveCustomizeFn(props.customize, options.customize)
    }, slots);
  }
});
const __nuxt_component_0$2 = defineComponent({
  name: "NuxtIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: [Number, String],
      required: false,
      default: null
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    const nuxtApp = useNuxtApp();
    const runtimeOptions = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const component = computed(
      () => nuxtApp.vueApp?.component(name.value) || ((props.mode || runtimeOptions.mode) === "svg" ? NuxtIconSvg : NuxtIconCss)
    );
    const style = computed(() => {
      const size = props.size || runtimeOptions.size;
      return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
    });
    return () => h(
      component.value,
      {
        ...runtimeOptions.attrs,
        name: name.value,
        class: runtimeOptions.class,
        style: style.value,
        customize: props.customize
      },
      slots
    );
  }
});
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$2
}, Symbol.toStringTag, { value: "Module" }));
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$u = {
  __name: "BaseIcon",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: "currentColor"
    },
    ariaLabel: {
      type: String,
      default: ""
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_Icon, mergeProps({
        name: __props.title,
        size: __props.size,
        style: { color: __props.color },
        "aria-label": __props.ariaLabel || __props.title,
        role: "img",
        class: __props.border ? "border" : ""
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseIcon.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const BaseIcon = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-f9e9b2bd"]]);
const _sfc_main$t = {
  __name: "TheTopBar",
  __ssrInlineRender: true,
  props: {
    text: {
      type: Array,
      required: true,
      validator: (value) => Array.isArray(value) && value.every((v) => typeof v === "string")
    },
    links: {
      type: Array,
      required: false,
      validator: (value) => Array.isArray(value) && value.every(
        (link) => link.txt && link.src && link.icon && link.external && typeof link.icon === "object"
      )
    },
    wrapperClass: {
      type: String,
      default: ""
    },
    contentClass: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: __props.wrapperClass }, _attrs))} data-v-b6b5713f><div class="hidden md:flex flex-row items-center justify-between bg-[var(--color-dark-blue)] text-[var(--color-white)] text-sm font-[Poppins]d" data-v-b6b5713f><div class="flex items-center" data-v-b6b5713f><!--[-->`);
      ssrRenderList(__props.text, (txt, index2) => {
        _push(`<span class="${ssrRenderClass(["top-bar-txt", __props.contentClass])}" data-v-b6b5713f>${ssrInterpolate(txt)}</span>`);
      });
      _push(`<!--]--></div><div class="flex items-center m-4 gap-4" data-v-b6b5713f><!--[-->`);
      ssrRenderList(__props.links, (link, index2) => {
        _push(`<a${ssrRenderAttr("href", link.src)}${ssrRenderAttr("target", link.external ? "_blank" : "_self")}${ssrRenderAttr("rel", link.external ? "noopener noreferrer" : null)} class="flex items-center gap-2 hover:underline text-white" data-v-b6b5713f>`);
        _push(ssrRenderComponent(BaseIcon, mergeProps({ ref_for: true }, link.icon), null, _parent));
        _push(`<span data-v-b6b5713f>${ssrInterpolate(link.txt)}</span></a>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheTopBar.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const TheTopBar = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-b6b5713f"]]);
const _sfc_main$s = {
  __name: "TheNavBar",
  __ssrInlineRender: true,
  props: {
    logo: {
      type: Object,
      required: true
    },
    navigation: {
      type: Array,
      default: () => []
    },
    showSearch: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const isMobileMenuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full px-4 md:px-0 mx-auto max-w-[1362px] relative z-40" }, _attrs))}><nav class="bg-[var(--color-blue)] text-white rounded-full shadow-md px-6 py-3 md:px-8 flex items-center justify-between relative min-h-[70px]"><a${ssrRenderAttr("href", __props.logo.url || "/")} class="shrink-0 flex items-center"><img${ssrRenderAttr("src", __props.logo.src)}${ssrRenderAttr("alt", __props.logo.alt)} class="h-[40px] md:h-[50px] w-auto object-contain brightness-0 invert"></a><div class="hidden xl:flex items-center gap-10"><ul class="flex items-center gap-8"><!--[-->`);
      ssrRenderList(__props.navigation, (item, index2) => {
        _push(`<li><a${ssrRenderAttr("href", item.url)} class="font-[Poppins] font-medium text-[16px] text-white hover:text-[var(--color-light-green)] transition-colors relative group py-2">${ssrInterpolate(item.label)} <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span></a></li>`);
      });
      _push(`<!--]--></ul></div><div class="flex items-center gap-5 md:gap-8">`);
      if (__props.showSearch) {
        _push(`<button class="p-2 rounded-full hover:bg-white/10 text-white hover:text-[var(--color-light-green)] transition-colors" aria-label="Rechercher">`);
        _push(ssrRenderComponent(BaseIcon, {
          title: "lucide:search",
          size: 24,
          color: "currentColor"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="hidden lg:flex items-center gap-1 font-[Poppins] font-medium text-[16px] text-white hover:text-[var(--color-light-green)] transition-colors"><span>FR</span>`);
      _push(ssrRenderComponent(BaseIcon, {
        title: "lucide:chevron-down",
        size: 16,
        color: "currentColor"
      }, null, _parent));
      _push(`</button><a href="#" class="hidden lg:block font-[Poppins] font-medium text-[16px] text-white hover:text-[var(--color-light-green)] transition-colors whitespace-nowrap"> S&#39;inscrire </a><button class="flex items-center gap-3 pl-2 transition-colors group" aria-label="Menu"><div class="p-2 bg-white rounded-full text-[var(--color-blue)] group-hover:bg-[var(--color-light-green)] transition-all duration-300 flex items-center justify-center shadow-sm">`);
      _push(ssrRenderComponent(BaseIcon, {
        title: isMobileMenuOpen.value ? "lucide:x" : "lucide:menu",
        size: 20,
        color: "currentColor"
      }, null, _parent));
      _push(`</div></button></div>`);
      if (isMobileMenuOpen.value) {
        _push(`<div class="absolute top-[calc(100%+12px)] left-0 w-full bg-[var(--color-blue)] rounded-[20px] shadow-xl border border-white/10 py-4 px-2 flex flex-col gap-1 z-50 xl:hidden overflow-hidden"><!--[-->`);
        ssrRenderList(__props.navigation, (item, index2) => {
          _push(`<a${ssrRenderAttr("href", item.url)} class="block px-6 py-3 font-[Poppins] font-medium text-[16px] text-white hover:bg-[var(--color-light-green)] hover:text-[var(--color-dark-blue)] rounded-lg transition-colors">${ssrInterpolate(item.label)}</a>`);
        });
        _push(`<!--]--><div class="border-t border-white/20 my-2 mx-4"></div><a href="#" class="block px-6 py-3 font-[Poppins] font-medium text-[16px] text-white hover:bg-[var(--color-light-green)] hover:text-[var(--color-dark-blue)] rounded-lg"> S&#39;inscrire </a><button class="w-full text-left px-6 py-3 font-[Poppins] font-medium text-[16px] text-white hover:bg-[var(--color-light-green)] hover:text-[var(--color-dark-blue)] rounded-lg flex items-center justify-between"><span>Langue : FR</span>`);
        _push(ssrRenderComponent(BaseIcon, {
          title: "lucide:chevron-down",
          size: 16,
          color: "currentColor"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav></div>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheNavBar.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const topBarText = ["Jeux Olympiques d'hiver™ · Du 6 au 22 février 2026", "Jeux Paralympiques d'hiver™ · Du 6 au 15 mars 2026"];
const topBarLinks = [{ "txt": "Billetterie", "src": "https://tickets.milanocortina2026.org/en/", "icon": { "title": "lucide:ticket", "size": 24, "color": "inherit" }, "external": true }, { "txt": "Hospitalités", "src": "https://olympics.com/fr/", "icon": { "title": "lucide:bell", "size": 24, "color": "inherit" }, "external": true }, { "txt": "Boutique", "src": "https://shop.olympics.com/en/", "icon": { "title": "lucide:shopping-bag", "size": 24, "color": "inherit" }, "external": true }];
const logoConfig = { "src": "/images/mico-logo.avif", "alt": "Milano Cortina 2026", "url": "/" };
const navItems$1 = [{ "label": "Relais de la Flamme Olympique", "url": "/relais-de-la-flamme-olympique" }, { "label": "Calendrier", "url": "/calendrier" }, { "label": "Play & Win", "url": "/play-and-win" }];
const headerData = {
  topBarText,
  topBarLinks,
  logoConfig,
  navItems: navItems$1
};
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return ((key) => key !== void 0 ? map[key] || key : map.missingValue);
}
function createOperationsGenerator(config = {}) {
  const formatter = config.formatter;
  const keyMap = config.keyMap && typeof config.keyMap !== "function" ? createMapper(config.keyMap) : config.keyMap;
  const map = {};
  for (const key in config.valueMap) {
    const valueKey = key;
    const value = config.valueMap[valueKey];
    map[valueKey] = typeof value === "object" ? createMapper(value) : value;
  }
  return (modifiers) => {
    const operations = [];
    for (const _key in modifiers) {
      const key = _key;
      if (typeof modifiers[key] === "undefined") {
        continue;
      }
      const value = typeof map[key] === "function" ? map[key](modifiers[key]) : modifiers[key];
      operations.push([keyMap ? keyMap(key) : key, value]);
    }
    if (formatter) {
      return operations.map((entry2) => formatter(...entry2)).join(config.joinWith ?? "&");
    }
    return new URLSearchParams(operations).toString();
  };
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry2 of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry2.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = ((input, modifiers, options) => getImage(input, defu({ modifiers }, options)).url);
  for (const presetName in globalOptions.presets) {
    $img[presetName] = ((source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options }));
  }
  $img.options = globalOptions;
  $img.getImage = getImage;
  $img.getMeta = ((input, options) => getMeta(ctx, input, options));
  $img.getSizes = ((input, options) => getSizes(ctx, input, options));
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { setup, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const provider = setup();
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  const resolvedOptions = {
    ..._options,
    modifiers: {
      ..._options.modifiers,
      width: _options.modifiers?.width ? parseSize(_options.modifiers.width) : void 0,
      height: _options.modifiers?.height ? parseSize(_options.modifiers.height) : void 0
    }
  };
  const image = provider.getImage(input, resolvedOptions, ctx);
  image.format ||= resolvedOptions.modifiers.format || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  const preset = getPreset(ctx, opts.preset);
  const merged = defu(opts, preset);
  const width = parseSize(merged.modifiers?.width);
  const height = parseSize(merged.modifiers?.height);
  const sizes = merged.sizes ? parseSizes(merged.sizes) : {};
  const _densities = merged.densities?.trim();
  const densities = _densities ? parseDensities(_densities) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: opts.modifiers?.width,
          _cHeight: opts.modifiers?.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant?.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = sizeVariants[i + 1]?.media || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
function defineProvider(setup) {
  let result;
  return () => {
    if (result) {
      return result;
    }
    result = typeof setup === "function" ? setup() : setup;
    return result;
  };
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b",
    position: "pos"
  },
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val.toString())
});
const ipxRuntime$_19z4_45ZI3zN_sO1uyTyXpKI94MaGaiwwh97IYnI1sYGE = defineProvider({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL: baseURL2 }, ctx) => {
    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}x${modifiers.height}`;
      delete modifiers.width;
      delete modifiers.height;
    }
    const params = operationsGenerator(modifiers) || "_";
    if (!baseURL2) {
      baseURL2 = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
    }
    return {
      url: joinURL(baseURL2, params, encodePath(src))
    };
  }
});
const imageOptions = {
  ...{
    "screens": {
      "sm": 640,
      "md": 768,
      "lg": 1024,
      "xl": 1280,
      "2xl": 1536,
      "xs": 320,
      "xxl": 1536
    },
    "presets": {
      "card": {
        "modifiers": {
          "format": "avif",
          "quality": 80,
          "width": 384,
          "height": 216
        }
      },
      "hero": {
        "modifiers": {
          "format": "avif",
          "quality": 85,
          "width": 1920
        }
      },
      "logo": {
        "modifiers": {
          "format": "avif",
          "quality": 90,
          "width": 200
        }
      }
    },
    "provider": "ipx",
    "domains": [],
    "alias": {},
    "densities": [
      1,
      2,
      1,
      2
    ],
    "format": [
      "webp"
    ],
    "quality": 80
  },
  /** @type {"ipx"} */
  provider: "ipx",
  providers: {
    ["ipx"]: { setup: ipxRuntime$_19z4_45ZI3zN_sO1uyTyXpKI94MaGaiwwh97IYnI1sYGE, defaults: {} }
  }
};
const useImage = (event) => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
const useImageProps = (props) => {
  const $img = useImage();
  const providerOptions = computed(() => ({
    provider: props.provider,
    preset: props.preset
  }));
  const normalizedAttrs = computed(() => ({
    width: parseSize(props.width),
    height: parseSize(props.height),
    crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
    nonce: props.nonce
  }));
  const imageModifiers = computed(() => {
    return {
      ...props.modifiers,
      width: props.width,
      height: props.height,
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return { providerOptions, normalizedAttrs, imageModifiers };
};
const _sfc_main$r = {
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: {
    custom: { type: Boolean, required: false },
    placeholder: { type: [Boolean, String, Number, Array], required: false },
    placeholderClass: { type: String, required: false },
    src: { type: String, required: false },
    format: { type: String, required: false },
    quality: { type: [String, Number], required: false },
    background: { type: String, required: false },
    fit: { type: String, required: false },
    modifiers: { type: Object, required: false },
    preset: { type: String, required: false },
    provider: { type: null, required: false },
    sizes: { type: [String, Object], required: false },
    densities: { type: String, required: false },
    preload: { type: [Boolean, Object], required: false },
    width: { type: [String, Number], required: false },
    height: { type: [String, Number], required: false },
    crossorigin: { type: [String, Boolean], required: false },
    nonce: { type: String, required: false }
  },
  emits: ["load", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const $img = useImage();
    const { providerOptions, normalizedAttrs, imageModifiers } = useImageProps(props);
    const sizes = computed(() => $img.getSizes(props.src, {
      ...providerOptions.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: imageModifiers.value
    }));
    const placeholderLoaded = ref(false);
    const attrs = useAttrs();
    const imgAttrs = computed(() => ({
      ...normalizedAttrs.value,
      "data-nuxt-img": "",
      ...!props.placeholder || placeholderLoaded.value ? { sizes: sizes.value.sizes, srcset: sizes.value.srcset } : {},
      ...{ onerror: "this.setAttribute('data-error', 1)" },
      ...attrs
    }));
    const placeholder = computed(() => {
      if (placeholderLoaded.value) {
        return false;
      }
      const placeholder2 = props.placeholder === "" ? [10, 10] : props.placeholder;
      if (!placeholder2) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2] : [];
      return $img(props.src, {
        ...imageModifiers.value,
        width,
        height,
        quality,
        blur
      }, providerOptions.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, imageModifiers.value, providerOptions.value)
    );
    const src = computed(() => placeholder.value || mainSrc.value);
    if (props.preload) {
      const hasMultipleDensities = sizes.value.srcset.includes("x, ");
      const isResponsive = hasMultipleDensities || !!sizes.value.sizes;
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          crossorigin: normalizedAttrs.value.crossorigin,
          href: isResponsive ? sizes.value.src : src.value,
          ...sizes.value.sizes && { imagesizes: sizes.value.sizes },
          ...hasMultipleDensities && { imagesrcset: sizes.value.srcset },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    useNuxtApp().isHydrating;
    const imgEl = useTemplateRef("imgEl");
    __expose({ imgEl });
    return (_ctx, _push, _parent, _attrs) => {
      if (!__props.custom) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          ref_key: "imgEl",
          ref: imgEl,
          class: placeholder.value ? __props.placeholderClass : void 0
        }, imgAttrs.value, { src: src.value }, _attrs))}>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {
          imgAttrs: imgAttrs.value,
          isLoaded: placeholderLoaded.value,
          src: src.value
        }, null, _push, _parent);
      }
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$r, { __name: "NuxtImg" });
const _sfc_main$q = {
  __name: "BaseImg",
  __ssrInlineRender: true,
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    wrapperClass: {
      type: String,
      default: ""
    },
    imgClass: {
      type: String,
      default: ""
    },
    preset: {
      type: String,
      default: void 0
    },
    copyright: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["", __props.wrapperClass]
      }, _attrs))} data-v-91126af4>`);
      if (typeof __props.src === "string" && __props.src.length > 0) {
        _push(ssrRenderComponent(_component_NuxtImg, {
          src: __props.src,
          alt: __props.alt,
          class: __props.imgClass,
          preset: __props.preset
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.copyright) {
        _push(`<div class="" data-v-91126af4>${ssrInterpolate(__props.copyright)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseImg.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const BaseImg = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-91126af4"]]);
const _sfc_main$p = {
  __name: "TheCountdown",
  __ssrInlineRender: true,
  setup(__props) {
    const startDate = /* @__PURE__ */ new Date("2026-02-06T23:30:00");
    const currentTime = /* @__PURE__ */ new Date();
    const deltaTime = startDate - currentTime;
    const days = Math.ceil(deltaTime / (24 * 3600 * 1e3));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-5" }, _attrs))}><div class="w-full bg-white rounded-[12px] shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#01647C]/10"><div class="flex flex-col items-center md:items-start gap-1 text-center md:text-left"><h4 class="font-[Poppins] font-bold text-[20px] md:text-[24px] text-[var(--color-dark-blue)] leading-tight"> Jeux Olympiques d’hiver de Milan Cortina 2026 </h4><span class="font-[Poppins] font-medium text-[16px] text-[var(--color-blue)] bg-[var(--color-light-green)] px-3 py-1 rounded-full w-fit mt-1"> 6 au 22 février 2026 </span></div><div class="flex items-center gap-6 md:gap-8"><div class="flex flex-col items-center md:items-end">`);
      if (unref(days) > 0) {
        _push(`<p class="font-[Poppins] text-[var(--color-dark-blue)] text-[16px] md:text-[18px] font-medium"> Débute dans <span class="font-bold text-[32px] text-[var(--color-blue)] mx-1">${ssrInterpolate(unref(days))}</span> jour${ssrInterpolate(unref(days) > 1 ? "s" : "")}</p>`);
      } else {
        _push(`<p class="font-[Poppins] font-bold text-[var(--color-blue)] text-[20px]"> Ça commence bientôt ! </p>`);
      }
      _push(`</div><div class="hidden md:block w-[1px] h-[50px] bg-[var(--color-blue)] opacity-20"></div><div class="shrink-0">`);
      _push(ssrRenderComponent(BaseImg, {
        src: "/images/omega.avif",
        alt: "Logo Omega - Chronométreur Officiel",
        imgClass: "h-auto w-[80px] md:w-[100px] object-contain",
        preset: "logo"
      }, null, _parent));
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheCountdown.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = {
  __name: "BaseButton",
  __ssrInlineRender: true,
  props: {
    text: { type: String, default: "" },
    url: { type: String, default: "" },
    inverted: { type: Boolean, default: false },
    icon: { type: Object, default: null }
  },
  setup(__props) {
    const props = __props;
    const isIconOnly = !props.text || props.text.trim() === "";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d5cbaa7c><button class="${ssrRenderClass([
        "inline-flex justify-center items-center border-none cursor-pointer",
        "rounded-full transition-all duration-200 ease-out",
        unref(isIconOnly) ? "p-2.5" : [
          "gap-3 py-[6px] md:py-[10px] pl-5",
          __props.icon ? "pr-2.5" : "pr-5",
          "font-[Poppins] font-normal text-[1rem] md:text-[1.125rem]"
        ],
        __props.inverted ? "bg-white text-[var(--color-blue)] hover:bg-[var(--color-light-green)]" : "text-white bg-custom-gradient"
      ])}" data-v-d5cbaa7c>`);
      if (!unref(isIconOnly)) {
        _push(`<span data-v-d5cbaa7c>${ssrInterpolate(__props.text)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.icon) {
        _push(ssrRenderComponent(BaseIcon, __props.icon, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div>`);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseButton.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const BaseButton = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-d5cbaa7c"]]);
const _sfc_main$n = {
  __name: "TheHeroSection",
  __ssrInlineRender: true,
  props: {
    elements: {
      type: Array,
      required: true,
      validator: (value) => Array.isArray(value) && value.every(
        (el) => el.txt && el.img && el.button && typeof el.img === "object" && typeof el.button === "object"
      )
    }
  },
  setup(__props) {
    const props = __props;
    const currentIndex = ref(0);
    const currentElement = computed(() => props.elements[currentIndex.value]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 mb-8 relative group" }, _attrs))} data-v-f6ea2be0><div class="relative w-full max-w-[1362px] mx-auto h-[300px] md:h-auto md:aspect-[2/1] rounded-[15px] overflow-hidden shadow-md group bg-gray-900" data-v-f6ea2be0><div class="absolute inset-0 w-full h-full" data-v-f6ea2be0>`);
      _push(ssrRenderComponent(BaseImg, {
        src: currentElement.value.img.src,
        alt: currentElement.value.img.alt,
        wrapperClass: "absolute inset-0 w-full h-full z-0",
        imgClass: "object-cover w-full h-full",
        preset: "hero"
      }, null, _parent));
      _push(`</div><div class="absolute inset-0 z-10 bg-gradient-to-t from-[var(--color-dark-blue)] via-transparent to-transparent opacity-80 pointer-events-none" data-v-f6ea2be0></div><div class="absolute inset-0 z-20 flex flex-col justify-end items-start p-4 md:p-8 lg:p-12 pb-[40px] md:pb-[40px] lg:pb-[50px]" data-v-f6ea2be0><div class="w-full max-w-full md:max-w-[85%] mb-3 md:mb-5" data-v-f6ea2be0><p class="font-[Poppins] font-semibold text-white whitespace-pre-wrap drop-shadow-lg text-[18px] leading-[24px] md:text-[30px] md:leading-[38px] lg:text-[42px] lg:leading-[52px]" data-v-f6ea2be0>${ssrInterpolate(currentElement.value.txt)}</p></div><div data-v-f6ea2be0>`);
      _push(ssrRenderComponent(BaseButton, {
        text: currentElement.value.button.text,
        url: currentElement.value.button.url,
        inverted: true,
        icon: currentElement.value.button.icon,
        class: "transform scale-90 md:scale-100 origin-left"
      }, null, _parent));
      _push(`</div></div>`);
      if (__props.elements.length > 1) {
        _push(`<!--[--><button class="absolute left-2 md:left-5 top-[40%] md:top-1/2 z-30 -translate-y-1/2 bg-white/80 md:bg-white/90 backdrop-blur-sm rounded-full p-1.5 md:p-2 shadow-sm hover:bg-[var(--color-light-green)] transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:opacity-0 opacity-100" aria-label="Précédent" data-v-f6ea2be0>`);
        _push(ssrRenderComponent(BaseIcon, {
          title: "ph:arrow-left",
          size: 18,
          class: "md:hidden",
          color: "var(--color-blue)"
        }, null, _parent));
        _push(ssrRenderComponent(BaseIcon, {
          title: "ph:arrow-left",
          size: 24,
          class: "hidden md:block",
          color: "var(--color-blue)"
        }, null, _parent));
        _push(`</button><button class="absolute right-2 md:right-5 top-[40%] md:top-1/2 z-30 -translate-y-1/2 bg-white/80 md:bg-white/90 backdrop-blur-sm rounded-full p-1.5 md:p-2 shadow-sm hover:bg-[var(--color-light-green)] transition-all duration-300 hover:scale-110 group-hover:opacity-100 md:opacity-0 opacity-100" aria-label="Suivant" data-v-f6ea2be0>`);
        _push(ssrRenderComponent(BaseIcon, {
          title: "ph:arrow-right",
          size: 18,
          class: "md:hidden",
          color: "var(--color-blue)"
        }, null, _parent));
        _push(ssrRenderComponent(BaseIcon, {
          title: "ph:arrow-right",
          size: 24,
          class: "hidden md:block",
          color: "var(--color-blue)"
        }, null, _parent));
        _push(`</button><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheHeroSection.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const TheHeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-f6ea2be0"]]);
const heroElements = [
  {
    txt: "En savoir plus sur les sports olympiques d'hiver avec les Explications des sports",
    img: {
      src: "/images/hero1.avif",
      alt: "Allianz illustration"
    },
    button: {
      text: "Regarder maintenant",
      url: "https://www.olympics.com/fr/milano-cortina-2026/allianz-sport-explainers",
      inverted: true,
      icon: {
        title: "ph:arrow-right",
        size: 24,
        color: "inherit"
      }
    }
  },
  {
    txt: "Débloquez l'accès privilégié à Milano Cortina 2026",
    img: {
      src: "/images/hero2.avif",
      alt: "Iceskating illustration"
    },
    button: {
      text: "Rejoignez-nous dès maintenant",
      url: "https://www.olympics.com/en/sign-in?origin=https%3A%2F%2Fwww.olympics.com%2Fen%2Fmilano-cortina-2026&entry_point_type=regular_cta&entry_point_tag=BAU&template=mico-2026-gtwa",
      inverted: true,
      icon: {
        title: "ph:arrow-right",
        size: 24,
        color: "inherit"
      }
    }
  },
  {
    txt: "Votre guide ultime de cadeaux est arrivé",
    img: {
      src: "/images/hero3.avif",
      alt: "Boutique illustration"
    },
    button: {
      text: "Acheter maintenant",
      url: "https://shop.olympics.com/fr/x-8409?_s=bm-fi-ioc-prtsite-Gifting25-december25-am&loc=fr-FR",
      inverted: true,
      icon: {
        title: "ph:arrow-right",
        size: 24,
        color: "inherit"
      }
    }
  }
];
const _sfc_main$m = {
  __name: "HeaderView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col w-full relative z-50 gap-8" }, _attrs))}>`);
      _push(ssrRenderComponent(TheTopBar, {
        text: unref(headerData).topBarText,
        links: unref(headerData).topBarLinks
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$s, {
        logo: unref(headerData).logoConfig,
        navigation: unref(headerData).navItems
      }, null, _parent));
      _push(`<div class="flex flex-col md:gap-5">`);
      _push(ssrRenderComponent(TheHeroSection, { elements: unref(heroElements) }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$p, null, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/HeaderView.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = {
  __name: "BaseLinkCard",
  __ssrInlineRender: true,
  props: {
    text: {
      type: String,
      default: "Text"
    },
    url: {
      type: String,
      default: ""
    },
    icon: {
      type: Object,
      default: null
    },
    external: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({ class: [
        "w-full h-[96px] flex items-center gap-3",
        "px-6 py-4 md:px-8 md:py-6",
        "rounded-[16px] border-none cursor-pointer",
        "transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]",
        "shadow-sm hover:shadow-md",
        "bg-card-conic text-white"
      ] }, _attrs))} data-v-1f89400e><div class="shrink-0 flex items-center justify-center" data-v-1f89400e>`);
      if (__props.icon) {
        _push(ssrRenderComponent(BaseIcon, {
          title: __props.icon.title,
          size: __props.icon.size || 35,
          color: "white"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="font-[Poppins] font-semibold text-[18px] md:text-[20px] text-left leading-tight" data-v-1f89400e>${ssrInterpolate(__props.text)}</span></button>`);
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseLinkCard.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const BaseLinkCard = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-1f89400e"]]);
const items = [
  {
    text: "Achetez vos billets",
    url: "https://tickets.milanocortina2026.org/en/?utm_medium=ioc_website&utm_source=olympics.com&utm_campaign=mico_gtweb",
    icon: {
      title: "lucide:ticket",
      size: 35
    },
    external: true
  },
  {
    text: "Réserver votre séjour",
    url: "https://www.airbnb.com/widgets/events/mico2026?locale=en-GB&currency=EUR&c=.pi129.pkew_homepage_ioc",
    icon: {
      title: "simple-icons:airbnb",
      size: 35
    },
    external: true
  },
  {
    text: "Hospitalité",
    url: "https://hospitality.milanocortina2026.org/en?utm_source=web&utm_medium=display&utm_campaign=int_ioc_mc26_web_nav",
    icon: {
      title: "lucide:concierge-bell",
      size: 35
    },
    external: true
  },
  {
    text: "Boutique olympique",
    url: "https://shop.olympics.com/fr/?_s=bm-fi-olympic-shop-prtsite-GTWA-homepage-carousel-140925-am",
    icon: {
      title: "lucide:shopping-bag",
      size: 35
    },
    external: true
  },
  {
    text: "Fan26",
    url: "https://www.olympics.com/fr/milano-cortina-2026",
    icon: {
      title: "lucide:gamepad-2",
      size: 35
    },
    external: true
  },
  {
    text: "Compte",
    url: "https://www.olympics.com/fr/sign-in?origin=https://www.olympics.com/fr/milano-cortina-2026&template=mico-2026-gtwa&entry_point_tag=mico-2026&entry_point_type=action_collection",
    icon: {
      title: "lucide:user",
      size: 35
    },
    external: false
  },
  {
    text: "Calendrier",
    url: "https://www.olympics.com/fr/milano-cortina-2026/schedule/overview",
    icon: {
      title: "lucide:calendar",
      size: 35
    },
    external: false
  },
  {
    text: "Info spectateurs",
    url: "https://www.olympics.com/fr/milano-cortina-2026/sites",
    icon: {
      title: "lucide:info",
      size: 35
    },
    external: false
  }
];
const _sfc_main$k = {
  __name: "TheCategorySection",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Profitez des Jeux"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-1 md:px-0 flex flex-col gap-6" }, _attrs))}><h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)]">${ssrInterpolate(__props.title)}</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[23px] w-full"><!--[-->`);
      ssrRenderList(unref(items), (item, index2) => {
        _push(ssrRenderComponent(BaseLinkCard, {
          key: index2,
          text: item.text,
          url: item.url,
          icon: item.icon,
          external: item.external
        }, null, _parent));
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheCategorySection.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "ContentView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-5" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$k, null, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/ContentView.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const articles = [
  {
    title: "Programme de la Coupe du monde à Courchevel",
    category: "Ski-Alpinisme",
    img: {
      src: "/images/article1.avif",
      alt: "Emily Harrop",
      copyright: "Getty Images"
    },
    link: "https://www.olympics.com/fr/milano-cortina-2026/actualite/coupe-du-monde-ski-alpinisme-2025-2026-programme-etape-courchevel-calendrier-date-heure-comment-regarder-en-direct"
  },
  {
    title: "Avec Andrea Bocelli et Mariah Carey, quels artistes à la cérémonie d'ouverture des JO 2026 ?",
    category: "",
    img: {
      src: "/images/article2.avif",
      alt: "Andrea Bocelli, Laura Pausini et Mariah Carey",
      copyright: "Getty images"
    },
    link: "https://www.olympics.com/fr/milano-cortina-2026/actualite/jo-hiver-milano-cortina-2026-liste-artistes-participants-ceremonie-ouverture-san-siro-olympic-stadium-mariah-carey-laura-pausini"
  },
  {
    title: "Les courses du jour à Ruhpolding",
    category: "Biathlon",
    img: {
      src: "/images/article3.avif",
      alt: "Course à Oberhof",
      copyright: "Svoboda/IBU"
    },
    link: "https://www.olympics.com/fr/milano-cortina-2026/actualite/coupe-monde-biathlon-ruhpolding-2025-2026-calendrier-complet-programme-courses-week-end-dates-heures-comment-regarder-en-direct"
  }
];
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            return props.replace ? router.replace(href.value) : router.push(href.value);
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_0 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const _sfc_main$i = {
  __name: "BaseArticleCard",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    img: {
      type: Object,
      default: () => ({ src: "", alt: "" }),
      validator: (img) => {
        return typeof img.src === "string" && typeof img.alt === "string";
      }
    },
    category: {
      type: String
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-start w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: __props.link,
        class: "w-full",
        "aria-label": `Lire l'article ${__props.title}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(BaseImg, {
              src: __props.img.src,
              alt: __props.img.alt,
              wrapperClass: "h-[200px] md:h-[250px] w-full rounded-[15px] overflow-hidden",
              imgClass: "w-full h-full object-cover",
              preset: "card"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-col gap-[4px] items-start justify-center pt-[10px] pb-[10px] pr-[10px] w-full"${_scopeId}>`);
            if (__props.category) {
              _push2(`<span class="inline-flex items-center justify-center px-[5px] bg-[var(--color-light-green)] rounded-[50px] text-[var(--color-blue)] text-[14px] font-semibold"${_scopeId}>${ssrInterpolate(__props.category)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h3 class="text-[18px] md:text-[20px] font-semibold text-black break-words w-full"${_scopeId}>${ssrInterpolate(__props.title)}</h3></div>`);
          } else {
            return [
              createVNode(BaseImg, {
                src: __props.img.src,
                alt: __props.img.alt,
                wrapperClass: "h-[200px] md:h-[250px] w-full rounded-[15px] overflow-hidden",
                imgClass: "w-full h-full object-cover",
                preset: "card"
              }, null, 8, ["src", "alt"]),
              createVNode("div", { class: "flex flex-col gap-[4px] items-start justify-center pt-[10px] pb-[10px] pr-[10px] w-full" }, [
                __props.category ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "inline-flex items-center justify-center px-[5px] bg-[var(--color-light-green)] rounded-[50px] text-[var(--color-blue)] text-[14px] font-semibold"
                }, toDisplayString(__props.category), 1)) : createCommentVNode("", true),
                createVNode("h3", { class: "text-[18px] md:text-[20px] font-semibold text-black break-words w-full" }, toDisplayString(__props.title), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</article>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseArticleCard.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  __name: "ArticlesView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-6" }, _attrs))}><h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)]"> Dernières actualités </h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full"><!--[-->`);
      ssrRenderList(unref(articles), (article, index2) => {
        _push(ssrRenderComponent(_sfc_main$i, {
          key: index2,
          title: article.title,
          link: article.link,
          category: article?.category,
          img: article.img
        }, null, _parent));
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/ArticlesView.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const faqQuestionsRaw = [
  {
    category: "Milano Cortina 2026",
    question: "Où et quand les Jeux Olympiques d'hiver 2026 se dérouleront-ils ?",
    answer: "Les Jeux Olympiques d'hiver de Milano Cortina 2026 se dérouleront du 6 au 22 février 2026.\n\nLes Jeux Paralympiques d'hiver se dérouleront du 6 au 15 mars 2026."
  },
  {
    category: "Milano Cortina 2026",
    question: "Comment obtenir des billets pour les Jeux d'hiver 2026 ?",
    answer: "Il existe deux façons principales de regarder les Jeux Olympiques d'hiver 2026 en direct en Italie : les billets seuls et les forfaits hospitalité avec billets. Vous trouverez où acheter vos billets sur notre page",
    link: {
      href: "https://www.olympics.com/fr/milano-cortina-2026-ticketing-and-hospitality",
      txt: "Comment assister aux Jeux d'hiver."
    }
  },
  {
    category: "Milano Cortina 2026",
    question: "Comment se qualifier pour les Jeux d'hiver 2026 ?",
    answer: "La façon de se qualifier pour les Jeux Olympiques d'hiver est différente pour chaque sport. Au final, ce sont les Comités nationaux olympiques qui ont le dernier mot sur la composition de l'équipe olympique et qui l'annonceront en janvier 2026. Vous pouvez découvrir les modalités de qualification pour chaque sport ici et sur les sites internet des fédérations internationales."
  },
  {
    category: "Milano Cortina 2026",
    question: "Combien de pays participeront aux Jeux d'hiver 2026 ?",
    answer: "Plus de 3500 athlètes de 93 pays s'affronteront pour remporter 195 médailles dans 16 disciplines olympiques et six sports paralympiques."
  },
  {
    category: "Milano Cortina 2026",
    question: "Quelle est la mascotte des Jeux d'hiver 2026 ?",
    answer: "Tina et Milo sont respectivement les mascottes des Jeux Olympiques et Paralympiques d'hiver. Leurs noms sont des diminutifs de ceux des deux villes hôtes : Tina pour Cortina et Milo pour Milano."
  },
  {
    category: "Milano Cortina 2026",
    question: "Quels sports seront disputés aux Jeux Olympiques d’hiver de Milano Cortina 2026 ?",
    answer: "Au total, 16 sports seront au programme des Jeux Olympiques d’hiver de Milano Cortina 2026 : biathlon, bobsleigh, combiné nordique, curling, hockey sur glace, luge, patinage artistique, patinage de vitesse, patinage de vitesse sur piste courte (short track), saut à ski, skeleton, ski acrobatique, ski alpin, ski de fond, ski-alpinisme et snowboard."
  },
  {
    category: "Milano Cortina 2026",
    question: "Où et comment regarder les Jeux Olympiques d’hiver de Milano Cortina 2026 ?",
    answer: "Les Jeux Olympiques d’hiver seront diffusés en direct à travers le monde. Les diffuseurs sont différents en fonction du lieu où vous vous situez, veuillez vous diriger vers votre fournisseur local pour plus d’informations sur la retransmission des Jeux."
  },
  {
    category: "Milano Cortina 2026",
    question: "Combien de sites de compétition y aura-t-il aux Jeux Olympiques d’hiver de Milano Cortina 2026 ?",
    answer: "Au total, 15 différents sites accueilleront les compétitions des Jeux Olympiques d’hiver de Milano Cortina 2026 : Milano Ice Skating Arena, Milano San Siro Olympic Stadium, Milano Santagiulia Ice Hockey Arena, Milano Speed Skating Stadium, Milano Rho Ice Hockey Arena, Cortina Curling Olympic Stadium, Cortina Sliding Centre, Tofane Alpine Skiing Centre, Anterselva Biathlon Arena, Stelvio Ski Centre, Livigno Snow Park, Livigno Aerials & Moguls Park, Tesero Cross-Country Skiing Stadium, Predazzo Ski Jumping Stadium et Verona Olympic Arena."
  },
  {
    category: "Milano Cortina 2026",
    question: "Quels sont les nouveaux sports des Jeux Olympiques d’hiver de Milano Cortina 2026 ?",
    answer: "Le ski-alpinisme est le seul sport qui fera ses débuts à Milano Cortina 2026. Les athlètes de skimo doivent parcourir une portion ascendante et descendante à skis et alternent avec des parties à pied en montée, les skis attachés sur le dos. Les médailles seront attribuées en sprint hommes et femmes, ainsi qu’en relais mixte. Au-delà des nouveaux sports, de nouvelles épreuves seront ajoutées à des sports déjà présents au programme des JO : double femmes en luge, grand tremplin femmes en saut à ski, relais mixte en skeleton, bosses parallèles hommes et femmes en ski acrobatique et combiné par équipes en ski alpin."
  },
  {
    category: "Jeux Olympiques",
    question: "Où se dérouleront les Jeux Olympiques 2028 et 2032 ?",
    answer: "Los Angeles, aux États-Unis, accueillera les prochains Jeux Olympiques du 14 au 30 juillet 2028. Brisbane, en Australie, accueillera les Jeux en 2032."
  },
  {
    category: "Jeux Olympiques",
    question: "Qui a inventé les Jeux Olympiques ?",
    answer: "L'histoire des Jeux remonte à l'Antiquité et prend ses racines en Grèce dans le Péloponnèse, il y a environ 3000 ans. Des concours sportifs organisés à Olympie avaient lieu tous les quatre ans et ont pris le nom de Jeux Olympiques. On ne sait pas précisément quand ils ont commencé, mais la date de 776 av. J.-C. est souvent citée dans les sources écrites. Les raisons exactes de la naissance des Jeux restent aujourd'hui inconnues car l'histoire se mêle à la mythologie. En 1894, Pierre de Coubertin lance son projet de rénovation des Jeux Olympiques et en 1896 a lieu la célébration des 1ers Jeux de l'ère moderne, à Athènes."
  }
];
const _sfc_main$g = {
  __name: "BaseFAQCard",
  __ssrInlineRender: true,
  props: {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    link: {
      type: Object,
      default: () => ({ href: "", txt: "" }),
      validator: (link) => {
        return typeof link.href === "string" && typeof link.txt === "string";
      }
    }
  },
  setup(__props) {
    const opened = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "w-full bg-white rounded-[12px] p-[19px] flex flex-col gap-[10px] shadow-sm transition-all duration-300" }, _attrs))}><div class="flex justify-between items-start gap-[25px] cursor-pointer group select-none"><h4 class="font-[Poppins] font-semibold text-[22px] text-[var(--color-dark-blue)] flex-1 leading-tight">${ssrInterpolate(__props.question)}</h4><div class="${ssrRenderClass([{ "rotate-180": opened.value }, "shrink-0 transition-transform duration-300 flex items-center justify-center w-[24px] h-[24px]"])}">`);
      _push(ssrRenderComponent(BaseIcon, {
        title: "mdi:chevron-down",
        size: 30,
        color: "var(--color-blue)",
        ariaLabel: opened.value ? "cacher la réponse" : "afficher la réponse"
      }, null, _parent));
      _push(`</div></div><div class="flex flex-col gap-4 text-[var(--color-dark-blue)] text-base font-[Poppins] pt-2" style="${ssrRenderStyle(opened.value ? null : { display: "none" })}"><p class="opacity-90 leading-relaxed">${__props.answer.replace(/\n\n/g, "<br>") ?? ""}</p>`);
      if (__props.link.href) {
        _push(`<a${ssrRenderAttr("href", __props.link.href)} target="_blank" class="text-[var(--color-blue)] font-medium hover:underline inline-flex items-center gap-1 w-fit">${ssrInterpolate(__props.link.txt)} `);
        _push(ssrRenderComponent(BaseIcon, {
          title: "ph:arrow-right",
          size: 16,
          color: "currentColor"
        }, null, _parent));
        _push(`</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></article>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseFAQCard.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = {
  __name: "FAQView",
  __ssrInlineRender: true,
  setup(__props) {
    const selectedCategory = ref(null);
    const categories = computed(() => {
      return [
        ...new Set(
          faqQuestionsRaw.map((q) => q.category).filter(Boolean)
        )
      ];
    });
    const filteredFaqQuestions = computed(() => {
      if (!selectedCategory.value) {
        return faqQuestionsRaw;
      }
      return faqQuestionsRaw.filter(
        (q) => q.category === selectedCategory.value
      );
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-5 py-12" }, _attrs))}><div class="flex flex-col md:flex-row items-start gap-10"><div class="w-full md:w-[50%] flex flex-col gap-6"><h2 class="font-[Poppins] font-bold text-[32px] text-[var(--color-dark-blue)] leading-tight"> Questions posées fréquemment </h2><div class="flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(BaseButton, {
        text: "Toutes les catégories",
        inverted: selectedCategory.value === null ? false : true,
        onClick: ($event) => selectedCategory.value = null
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(categories.value, (category) => {
        _push(ssrRenderComponent(BaseButton, {
          text: category,
          inverted: category === selectedCategory.value ? false : true,
          onClick: ($event) => selectedCategory.value = category
        }, null, _parent));
      });
      _push(`<!--]--></div></div><div class="w-full md:w-[50%] flex flex-col gap-6"><!--[-->`);
      ssrRenderList(filteredFaqQuestions.value, (faqQuestion, index2) => {
        _push(ssrRenderComponent(_sfc_main$g, {
          key: index2,
          question: faqQuestion.question,
          answer: faqQuestion.answer,
          link: faqQuestion.link
        }, null, _parent));
      });
      _push(`<!--]-->`);
      if (filteredFaqQuestions.value.length === 0) {
        _push(`<div class="text-center py-10 opacity-60 font-[Poppins]"> Aucune question trouvée. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></section>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/FAQView.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const cta = [
  {
    title: "Réservez votre séjour pour les Jeux d'hiver™",
    text: "Réservez votre séjour avec Airbnb",
    img: {
      src: "/images/cta1.avif",
      alt: "Carte de Airbnb"
    },
    button: {
      text: "Réservez maintenant",
      url: "https://www.airbnb.com/s/Italy/homes?refinement_paths%5B%5D=%2Fhomes&search_type=DIRECT_REQUEST&c=.pi129.pkew_milano_cortina_ioc&checkin=2026-02-13&checkout=2026-02-15&date_picker_type=calendar&event_widget_code=mico2026&flexible_date_search_filter_type=2&place_id=ChIJA9KNRIL-1BIRb15jJFz1LOI&ne_lat=47.33731380408&ne_lng=12.358927012123&sw_lat=45.145918679216&sw_lng=9.103055606724&zoom=9.10622199036&zoom_level=9.10622199036",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    },
    flipped: false
  },
  {
    title: "Les Jeux Paralympiques d'hiver",
    text: "Une célébration du courage, du talent et de l'inclusion. Les athlètes paralympiques redéfinissent les performances sur neige et glace.",
    img: {
      src: "/images/cta2.avif",
      alt: "Image d'un skieur"
    },
    button: {
      text: "En savoir plus",
      url: "https://www.olympics.com/fr/milano-cortina-2026/jeux-paralympiques",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    },
    flipped: false
  },
  {
    title: "Télécharger l'application des Jeux Olympiques™",
    text: "Votre place au premier rang pour Milano Cortina 2026",
    img: {
      src: "/images/cta3.avif",
      alt: "Application des JO"
    },
    button: {
      text: "Télécharger maintenant",
      url: "https://www.olympics.com/fr/milano-cortina-2026/download-the-app",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    },
    flipped: true
  }
];
const _sfc_main$e = {
  __name: "BaseCTACard",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    img: {
      type: Object,
      default: () => ({ src: "", alt: "" }),
      validator: (img) => {
        return typeof img.src === "string" && typeof img.alt === "string";
      }
    },
    button: {
      type: Object,
      default: () => ({ text: "", url: "", inverted: false, icon: { title: "arrow-right-circle", size: 30, color: "inherit" } }),
      validator: (button) => {
        return typeof button.text === "string" && typeof button.url === "string" && typeof button.inverted === "boolean" && typeof button.icon.title === "string" && typeof button.icon.size === "number" && typeof button.icon.color === "string";
      }
    },
    flipped: {
      type: Boolean
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-6 md:gap-[5rem] items-start", { "md:flex-row-reverse": __props.flipped }]
      }, _attrs))}><div class="flex-shrink-0 w-full md:w-[35.6875rem] h-[15rem] md:h-[20.5346rem]">`);
      _push(ssrRenderComponent(BaseImg, {
        src: __props.img.src,
        alt: __props.img.alt,
        wrapperClass: "w-full h-full rounded-[0.9375rem] overflow-hidden",
        imgClass: "w-full h-full object-cover rounded-[0.9375rem]",
        preset: "hero"
      }, null, _parent));
      _push(`</div><div class="flex flex-col gap-6 md:gap-[2.1875rem] items-start flex-shrink-0 w-full md:w-[36.25rem]"><div class="flex flex-col items-start w-full"><h2 class="font-[Poppins] font-semibold text-[1.75rem] md:text-[2.2rem] leading-normal text-[var(--color-dark-blue)] m-0 md:py-[0.625rem] md:pr-[0.625rem]">${ssrInterpolate(__props.title)}</h2><p class="font-[Poppins] font-normal text-[1.125rem] md:text-[1.5rem] leading-normal text-black m-0 whitespace-pre-wrap">${ssrInterpolate(__props.text)}</p></div>`);
      _push(ssrRenderComponent(BaseButton, {
        text: __props.button.text,
        url: __props.button.url,
        inverted: __props.button.inverted,
        icon: __props.button.icon
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseCTACard.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const banners = [
  {
    title: "Profitez de billets garantis, d'un accès exclusif et bien plus encore",
    img: {
      src: "/images/banner1.avif",
      alt: "Official hospitality"
    },
    button: {
      text: "À ne pas manquer",
      url: "https://waiting.hospitality.milanocortina2026.org/?c=onlocationexp&e=mc26pa&ver=fastly-vcl-1.0%26cver%3D0&t=https%3A%2F%2Fhospitality.milanocortina2026.org%2Fen&utm_source=meta&utm_medium=social&utm_campaign=int_ioc_mc26_in-story",
      icon: {
        title: "ph:arrow-right",
        size: 24,
        color: "inherit"
      }
    }
  },
  {
    title: "Testez vos connaissances avec le Trivia Sportif ",
    img: {
      src: "/images/banner2.avif",
      alt: "Sport Trivia"
    },
    button: {
      text: "Jouer",
      url: "https://www.olympics.com/fr/milano-cortina-2026/play-and-win/trivia",
      icon: {
        title: "ph:arrow-right",
        size: 24,
        color: "inherit"
      }
    }
  }
];
const _sfc_main$d = {
  __name: "BaseBanner",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    img: {
      type: Object,
      default: () => ({ src: "", alt: "" }),
      validator: (img) => {
        return typeof img.src === "string" && typeof img.alt === "string";
      }
    },
    button: {
      type: Object,
      default: () => ({ text: "", url: "", inverted: true, icon: { title: "arrow-right-circle", size: 30, color: "inherit" } }),
      validator: (button) => {
        return typeof button.text === "string" && typeof button.url === "string";
      }
    },
    presentedBy: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-6" }, _attrs))} data-v-13548860><div class="${ssrRenderClass([["h-[23rem] md:h-[16rem]", "flex flex-col md:block"], "relative rounded-[0.9375rem] overflow-hidden banner-background"])}" data-v-13548860><div class="absolute top-0 h-[12rem] md:h-full w-full md:w-[30.125rem] md:left-0 clip-diagonal-mobile clip-diagonal z-0" data-v-13548860>`);
      _push(ssrRenderComponent(BaseImg, {
        src: __props.img.src,
        alt: __props.img.alt,
        wrapperClass: "h-full w-full",
        imgClass: "h-full w-full object-cover",
        preset: "hero"
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass([[
        "p-4 md:py-[0.75rem] md:pl-[1.0625rem] md:pr-[1.5625rem]",
        "justify-end gap-6 md:gap-0 md:justify-between"
      ], "relative flex flex-col h-full z-10"])}" data-v-13548860>`);
      if (__props.presentedBy) {
        _push(`<div class="flex items-center gap-[0.75rem] justify-start md:ml-[32rem]" data-v-13548860><p class="font-[Poppins] font-light text-[0.625rem] text-white m-0" data-v-13548860> Presented by </p>`);
        _push(ssrRenderComponent(BaseImg, {
          src: __props.presentedBy,
          alt: "sponsors",
          wrapperClass: "h-[1.3125rem] w-[7.125rem]",
          imgClass: "h-full w-full object-cover",
          preset: "logo"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-4 md:gap-6 items-start md:flex-1 md:justify-center md:ml-[32rem]" data-v-13548860><h3 class="${ssrRenderClass([["text-[1.4rem] md:text-[2rem]", "md:max-w-[42rem] md:whitespace-pre-wrap"], "font-[Poppins] font-semibold leading-[1.2] text-white m-0"])}" data-v-13548860>${ssrInterpolate(__props.title)}</h3>`);
      _push(ssrRenderComponent(BaseButton, {
        text: __props.button.text,
        url: __props.button.url,
        inverted: true,
        icon: __props.button.icon
      }, null, _parent));
      _push(`</div></div></div></section>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseBanner.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const BaseBanner = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-13548860"]]);
const boutiqueLinks = [
  {
    title: "Tina & Milo Collection",
    img: {
      src: "/images/boutique1.avif",
      alt: "Macottes des JO 2026"
    },
    button: {
      text: "Achetez",
      url: "https://shop.olympics.com/fr/milano-cortina-2026/mascot-collection/t-13364516+c-1223135966+z-98-1285011308?_s=bm-fi-olympic-shop-prtsite-GTWA-homepage-carousel-140925-am&loc=fr-FR",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Vêtements",
    img: {
      src: "/images/boutique2.avif",
      alt: "Vêtements des JO 2026"
    },
    button: {
      text: "Achetez",
      url: "https://shop.olympics.com/milano-cortina-2026/t-35589049+z-9774796-1238555770?_s=bm-fi-olympic-shop-prtsite-GTWA-homepage-carousel-140925-am&loc=fr-FR&query=milano%20cortina&sortOption=NewestArrivals",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Accessoires",
    img: {
      src: "/images/boutique3.avif",
      alt: "Accessoires des JO 2026"
    },
    button: {
      text: "Achetez",
      url: "https://shop.olympics.com/fr/milano-cortina-2026/collectibles-and-memorabilia/t-46146727+d-19558893+z-971-3390822431?_s=bm-fi-olympic-shop-prtsite-GTWA-homepage-carousel-140925-am&loc=fr-FR",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Posters",
    img: {
      src: "/images/boutique4.avif",
      alt: "Posters des JO 2026"
    },
    button: {
      text: "Achetez",
      url: "https://shop.olympics.com/fr/milano-cortina-2026/posters/t-57699371+d-19119026+z-93-2531530063?_s=bm-fi-olympic-shop-prtsite-GTWA-homepage-carousel-140925-am&loc=fr-FR",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  }
];
const _sfc_main$c = {
  __name: "BaseCard",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    button: {
      type: Object,
      default: () => ({ text: "", url: "", inverted: false, icon: { title: "arrow-right-circle", size: 30, color: "inherit" } }),
      validator: (button) => {
        return typeof button.text === "string" && typeof button.url === "string" && typeof button.inverted === "boolean" && typeof button.icon.title === "string" && typeof button.icon.size === "number" && typeof button.icon.color === "string";
      }
    },
    img: {
      type: Object,
      default: () => ({ src: "", alt: "" }),
      validator: (img) => {
        return typeof img.src === "string" && typeof img.alt === "string";
      }
    },
    imgClass: {
      type: String,
      default: "w-full h-full object-contain"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-start w-full max-w-sm h-full" }, _attrs))} data-v-fb786811>`);
      _push(ssrRenderComponent(BaseImg, {
        src: __props.img.src,
        alt: __props.img.alt,
        wrapperClass: "aspect-video w-full rounded-t-2xl overflow-hidden bg-gradient-card",
        imgClass: __props.imgClass,
        preset: "card"
      }, null, _parent));
      _push(`<div class="bg-white flex flex-col items-end p-5 rounded-b-2xl w-full flex-1" data-v-fb786811><h3 class="text-2xl font-semibold text-black break-words w-full line-clamp-2 min-h-[3.5rem]" data-v-fb786811>${ssrInterpolate(__props.title)}</h3>`);
      _push(ssrRenderComponent(BaseButton, {
        text: __props.button.text,
        url: __props.button.url,
        inverted: __props.button.inverted,
        icon: __props.button.icon
      }, null, _parent));
      _push(`</div></article>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BaseCard.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const BaseCard = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-fb786811"]]);
const _sfc_main$b = {
  __name: "BasePagination",
  __ssrInlineRender: true,
  props: {
    currentIndex: {
      type: Number,
      required: true
    },
    maxIndex: {
      type: Number,
      required: true
    },
    isPrevDisabled: {
      type: Boolean,
      default: false
    },
    isNextDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["prev", "next"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white flex items-center justify-center gap-[22px] px-[10px] py-[9px] rounded-[52px] w-fit mx-auto" }, _attrs))}><button${ssrIncludeBooleanAttr(__props.isPrevDisabled) ? " disabled" : ""} aria-label="Précédent" class="${ssrRenderClass([
        "flex items-center justify-center w-[34px] h-[34px] rounded-full transition-all",
        __props.isPrevDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--color-blue)] hover:bg-[var(--color-dark-blue)]"
      ])}">`);
      _push(ssrRenderComponent(BaseIcon, {
        title: "ph:arrow-left",
        size: 20,
        color: __props.isPrevDisabled ? "#9CA3AF" : "white"
      }, null, _parent));
      _push(`</button><span class="font-[Poppins] text-[24px] text-[var(--color-blue)]">${ssrInterpolate(__props.currentIndex + 1)}/${ssrInterpolate(__props.maxIndex + 1)}</span><button${ssrIncludeBooleanAttr(__props.isNextDisabled) ? " disabled" : ""} aria-label="Suivant" class="${ssrRenderClass([
        "flex items-center justify-center w-[34px] h-[34px] rounded-full transition-all",
        __props.isNextDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--color-blue)] hover:bg-[var(--color-dark-blue)]"
      ])}">`);
      _push(ssrRenderComponent(BaseIcon, {
        title: "ph:arrow-right",
        size: 20,
        color: __props.isNextDisabled ? "#9CA3AF" : "white"
      }, null, _parent));
      _push(`</button></div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/Base/BasePagination.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "BoutiqueView",
  __ssrInlineRender: true,
  setup(__props) {
    const windowWidth = ref(1024);
    const currentIndex = ref(0);
    const ITEMS_PER_PAGE = computed(() => {
      if (windowWidth.value < 640) return 1;
      if (windowWidth.value < 1024) return 2;
      return 4;
    });
    const currentElements = computed(() => {
      const start = currentIndex.value * ITEMS_PER_PAGE.value;
      return boutiqueLinks.slice(start, start + ITEMS_PER_PAGE.value);
    });
    const maxIndex = computed(
      () => Math.ceil(boutiqueLinks.length / ITEMS_PER_PAGE.value) - 1
    );
    const prev = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= 1;
      }
    };
    const next = () => {
      if (currentIndex.value < maxIndex.value) {
        currentIndex.value += 1;
      }
    };
    const isPrevDisabled = computed(() => currentIndex.value === 0);
    const isNextDisabled = computed(() => currentIndex.value === maxIndex.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-4" }, _attrs))}><h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)] pr-[10px]"> La Boutique Olympique </h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full auto-rows-fr"><!--[-->`);
      ssrRenderList(currentElements.value, (link, index2) => {
        _push(ssrRenderComponent(BaseCard, {
          key: index2,
          title: link.title,
          button: link.button,
          img: link.img,
          imgClass: "w-full h-full object-cover object-top"
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      if (maxIndex.value > 0) {
        _push(ssrRenderComponent(_sfc_main$b, {
          currentIndex: currentIndex.value,
          maxIndex: maxIndex.value,
          isPrevDisabled: isPrevDisabled.value,
          isNextDisabled: isNextDisabled.value,
          onPrev: prev,
          onNext: next
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/BoutiqueView.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const sportsCards = [
  {
    title: "Biathlon",
    img: {
      src: "/images/sport1.svg",
      alt: "Biathlon"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/biathlon",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Bobsleigh",
    img: {
      src: "/images/sport2.svg",
      alt: "Bobsleigh"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/bobsleigh",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Combiné nordique",
    img: {
      src: "/images/sport3.svg",
      alt: "Combiné nordique"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/combine-nordique",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Curling",
    img: {
      src: "/images/sport4.svg",
      alt: "Curling"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/curling",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Hockey sur glace",
    img: {
      src: "/images/sport5.svg",
      alt: "Hockey sur glace"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/hockey-sur-glace",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Luge",
    img: {
      src: "/images/sport6.svg",
      alt: "Luge"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/luge",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Patinage artistique",
    img: {
      src: "/images/sport7.svg",
      alt: "Patinage artistique"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/patinage-artistique",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Patinage de vitesse",
    img: {
      src: "/images/sport8.svg",
      alt: "Patinage de vitesse"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/patinage-de-vitesse",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Patinage de vitesse sur piste courte",
    img: {
      src: "/images/sport9.svg",
      alt: "Patinage de vitesse sur piste courte"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/patinage-de-vitesse-sur-piste-courte",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Saut à ski",
    img: {
      src: "/images/sport10.svg",
      alt: "Saut à ski"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/saut-a-ski",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Skeleton",
    img: {
      src: "/images/sport11.svg",
      alt: "Skeleton"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/skeleton",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Ski acrobatique",
    img: {
      src: "/images/sport12.svg",
      alt: "Ski acrobatique"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/ski-acrobatique",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Ski alpin",
    img: {
      src: "/images/sport13.svg",
      alt: "Ski alpin"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/ski-alpin",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Ski de fond",
    img: {
      src: "/images/sport14.svg",
      alt: "Ski de fond"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/ski-de-fond",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Ski-Alpinisme",
    img: {
      src: "/images/sport15.svg",
      alt: "Ski-Alpinisme"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/ski-alpinisme",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  },
  {
    title: "Snowboard",
    img: {
      src: "/images/sport16.svg",
      alt: "Snowboard"
    },
    button: {
      text: "",
      url: "https://www.olympics.com/fr/milano-cortina-2026/sports/snowboard",
      inverted: false,
      icon: {
        title: "ph:arrow-right",
        size: 32,
        color: "inherit"
      }
    }
  }
];
const _sfc_main$9 = {
  __name: "SportsView",
  __ssrInlineRender: true,
  setup(__props) {
    const windowWidth = ref(1024);
    const currentIndex = ref(0);
    const ITEMS_PER_PAGE = computed(() => {
      if (windowWidth.value < 640) return 1;
      if (windowWidth.value < 1024) return 1;
      return 4;
    });
    const currentElements = computed(() => {
      const start = currentIndex.value * ITEMS_PER_PAGE.value;
      return sportsCards.slice(start, start + ITEMS_PER_PAGE.value);
    });
    const maxIndex = computed(
      () => Math.ceil(sportsCards.length / ITEMS_PER_PAGE.value) - 1
    );
    const prev = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= 1;
      }
    };
    const next = () => {
      if (currentIndex.value < maxIndex.value) {
        currentIndex.value += 1;
      }
    };
    const isPrevDisabled = computed(() => currentIndex.value === 0);
    const isNextDisabled = computed(() => currentIndex.value === maxIndex.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-4" }, _attrs))}><h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)]"> Sports </h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full auto-rows-fr"><!--[-->`);
      ssrRenderList(currentElements.value, (card, index2) => {
        _push(ssrRenderComponent(BaseCard, {
          key: index2,
          title: card.title,
          button: card.button,
          img: card.img
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(_sfc_main$b, {
        currentIndex: currentIndex.value,
        maxIndex: maxIndex.value,
        isPrevDisabled: isPrevDisabled.value,
        isNextDisabled: isNextDisabled.value,
        onPrev: prev,
        onNext: next
      }, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/SportsView.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "TheBottomBar",
  __ssrInlineRender: true,
  props: {
    text: {
      type: Array,
      required: true,
      validator: (value) => Array.isArray(value) && value.every((v) => typeof v === "string")
    },
    links: {
      type: Array,
      required: false,
      validator: (value) => Array.isArray(value) && value.every(
        (link) => link.txt && link.src && link.external
      )
    },
    wrapperClass: {
      type: String,
      default: ""
    },
    contentClass: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: __props.wrapperClass }, _attrs))} data-v-1531776e><div class="hidden md:flex flex-row items-center justify-between bg-[var(--color-dark-blue)] text-[var(--color-white)] text-sm font-[Poppins]d" data-v-1531776e><div class="flex items-center m-4 gap-4" data-v-1531776e><!--[-->`);
      ssrRenderList(__props.links, (link, index2) => {
        _push(`<a${ssrRenderAttr("href", link.src)}${ssrRenderAttr("target", link.external ? "_blank" : "_self")}${ssrRenderAttr("rel", link.external ? "noopener noreferrer" : null)} class="flex items-center gap-2 hover:underline text-white" data-v-1531776e><span data-v-1531776e>${ssrInterpolate(link.txt)}</span></a>`);
      });
      _push(`<!--]--></div><div class="flex items-center" data-v-1531776e><!--[-->`);
      ssrRenderList(__props.text, (txt, index2) => {
        _push(`<span class="${ssrRenderClass(["top-bar-txt", __props.contentClass])}" data-v-1531776e>${ssrInterpolate(txt)}</span>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheBottomBar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const TheBottomBar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-1531776e"]]);
const _sfc_main$7 = {
  __name: "TheBottomNavBar",
  __ssrInlineRender: true,
  props: {
    navigation: {
      type: Array,
      default: () => []
    },
    socials: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full px-4 md:px-0 mx-auto max-w-[1362px] relative z-40" }, _attrs))}><nav class="bg-[var(--color-white)] text-white rounded-full shadow-md px-6 py-3 md:px-8 flex items-center justify-between relative min-h-[70px]"><div class="hidden xl:flex items-center gap-10"><ul class="flex items-center gap-8"><!--[-->`);
      ssrRenderList(__props.navigation, (item, index2) => {
        _push(`<li><a${ssrRenderAttr("href", item.url)} class="font-[Poppins] font-medium text-[16px] text-[var(--color-blue)] hover:text-[var(--color-blue)] transition-colors relative group py-2">${ssrInterpolate(item.label)} <span class="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-blue)] transition-all duration-300 group-hover:w-full"></span></a></li>`);
      });
      _push(`<!--]--></ul></div><div class="flex items-center gap-5 md:gap-8"><!--[-->`);
      ssrRenderList(__props.socials, (social, index2) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: index2,
          to: social.url,
          class: "text-[var(--color-blue)] hover:text-[var(--color-blue)]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(BaseIcon, {
                title: social.icon,
                size: "32"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(BaseIcon, {
                  title: social.icon,
                  size: "32"
                }, null, 8, ["title"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></nav></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheBottomNavBar.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const bottomBar = ["Copyright 2025. Tous droits réservés"];
const bottomBarLinks = [{ "txt": "Politique des cookies", "src": "https://www.olympics.com/fr/cookie-policy", "external": false }, { "txt": "Cookie settings", "src": "https://www.olympics.com/fr/milano-cortina-2026#", "external": false }, { "txt": "Politique de confidentialité", "src": "https://www.olympics.com/fr/privacy-policy", "external": false }, { "txt": "Condition d'utilisation", "src": "https://www.olympics.com/fr/terms-of-service", "external": false }, { "txt": "Contactez-nous", "src": "https://www.olympics.com/fr/milano-cortina-2026/web-accessibilite", "external": false }];
const navItems = [{ "label": "Olympics Channel", "url": "https://www.olympics.com/fr/olympic-channel" }, { "label": "CIO", "url": "https://www.olympics.com/cio" }, { "label": "Musée Olympique", "url": "https://www.olympics.com/musee" }, { "label": "Boutique", "url": "https://shop.olympics.com/en/milano-cortina-2026/t-35589049+z-9774796-1238555770?_s=bm-fi-ioc-prtsite-IOC-MiCo26-topbutton-am" }, { "label": "Contactez-nous", "url": "https://support.olympics.com/hc/fr" }];
const socials = [{ "icon": "ph:spotify-logo", "url": "https://open.spotify.com/artist/1h6Xm6QBDGfKihrrtNiD7R" }, { "icon": "ph:facebook-logo", "url": "https://www.facebook.com/OlimpiadiMilanoCortina2026" }, { "icon": "ph:tiktok-logo", "url": "https://www.tiktok.com/@milanocortina2026" }, { "icon": "ph:youtube-logo", "url": "https://www.youtube.com/channel/UC-3ef0mTN_RDliSRsrIEbHg" }, { "icon": "ph:x-logo", "url": "https://x.com/milanocortina26" }, { "icon": "ph:linkedin-logo", "url": "https://www.linkedin.com/company/milano-cortina-2026" }, { "icon": "ph:instagram-logo", "url": "https://www.instagram.com/milanocortina2026" }];
const content = { "sponsor": [], "paraGames": { "url": "https://www.olympics.com/fr/milano-cortina-2026/jeux-paralympiques", "alt": "Passez aux Jeux Paralympiques" }, "games": [{ "url": "https://www.olympics.com/fr/milano-cortina-2026/schedule/overview", "alt": "Calendrier" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/sports", "alt": "Sports" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/territoires", "alt": "Territoires" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/sites", "alt": "Sites" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/relais-de-la-flamme-olympique", "alt": "Relais de la Flamme Olympique" }], "joinGames": [{ "url": "https://fan26.olympics.com/fr/fan26", "alt": "Fan26" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/italia-dei-giochi", "alt": "Italia dei Giochi" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/devenez-partenaire", "alt": "Devenez partenaire" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/nos-projets/impact-2026", "alt": "Devenez un fournisseur Impact" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/devenez-licencie", "alt": "Devenez Licencié" }], "about": [{ "url": "https://www.olympics.com/fr/milano-cortina-2026/a-propos", "alt": "À propos de Milano Cortina 2026" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/a-propos/le-board", "alt": "Conseil d'administration" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/a-propos/commission-athletes", "alt": "Commission des athlètes Cat26" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/marque", "alt": "L'Esprit italien" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/marque/mascotte", "alt": "Mascottes" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/marque/look-of-the-games", "alt": "Identité visuelle des Jeux" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/marque/les-medailles", "alt": "Les médailles" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/documents", "alt": "Documents" }], "projects": [{ "url": "https://www.olympics.com/fr/milano-cortina-2026/nos-projets/", "alt": "Explorer les projets" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/nos-projets/label-gen26", "alt": "Label Gen26" }, { "url": "https://www.olympics.com/fr/milano-cortina-2026/nos-projets/cultural-olympiad", "alt": "Vue d'ensemble" }] };
const footerData = {
  bottomBar,
  bottomBarLinks,
  navItems,
  socials,
  content
};
const _imports_0 = publicAssetsURL("/images/Airbnb_Logo_Belo.svg");
const _imports_1 = publicAssetsURL("/images/alibabalogo.svg");
const _imports_2 = publicAssetsURL("/images/Allianz.svg");
const _imports_3 = publicAssetsURL("/images/Coca-Cola_logo.svg");
const _imports_4 = publicAssetsURL("/images/coronalogo.svg");
const _imports_5 = publicAssetsURL("/images/Logo_of_Deloitte.svg");
const _imports_6 = publicAssetsURL("/images/omega.avif");
const _imports_7 = publicAssetsURL("/images/P&G_logo.svg");
const _imports_8 = publicAssetsURL("/images/samsungLogo.svg");
const _imports_9 = publicAssetsURL("/images/tclLogo.svg");
const _imports_10 = publicAssetsURL("/images/Visa_Inc_logo.svg");
const _imports_11 = publicAssetsURL("/images/mico-logo.avif");
const _sfc_main$6 = {
  __name: "TheFooter",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full min-h-screen md:h-auto pt-7 pb-7 bg-[var(--color-blue)] flex flex-col justify-center items-center" }, _attrs))}><div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 pb-5 flex flex-col justify-start items-start gap-20"><div class="w-full flex flex-col justify-start items-start gap-5"><div class="w-full inline-flex justify-start items-center gap-2.5"><div class="justify-start text-[var(--color-white)] text-2xl sm:text-3xl md:text-4xl font-semibold font-[&#39;Poppins&#39;]">Partenaires Olympiques et Paralympiques Mondiaux</div></div><div class="flex flex-col justify-start items-start gap-9 w-full"><div class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 items-center"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_0)} alt="airbnb"><img class="w-full h-24 object-contain filter brightness-0 invert"${ssrRenderAttr("src", _imports_1)} alt="alibaba"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_2)} alt="allianz"><img class="w-full h-24 object-contain filter brightness-0 invert"${ssrRenderAttr("src", _imports_3)} alt="coca-cola"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_4)} alt="corona"></div><div class="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 items-center"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_5)} alt="deloitte"><img class="w-full h-24 object-contain filter brightness-0 invert"${ssrRenderAttr("src", _imports_6)} alt="omega"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_7)} alt="p&amp;g"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_8)} alt="samsung"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_9)} alt="tcl"><img class="w-full h-24 object-contain"${ssrRenderAttr("src", _imports_10)} alt="visa"></div></div></div><div class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 px-0 items-start"><div class="w-full p-0 inline-flex flex-col justify-center items-start gap-8"><div class="inline-flex justify-center items-center gap-2.5"><div class="w-36 h-40 relative overflow-hidden"><img${ssrRenderAttr("src", _imports_11)} alt=""></div></div><div class="self-stretch flex flex-col justify-center items-start gap-5"><a${ssrRenderAttr("href", unref(footerData).content.paraGames.url)} class="self-stretch justify-start text-[var(--color-white)] text-sm font-light font-[&#39;Poppins&#39;] underline">${ssrInterpolate(unref(footerData).content.paraGames.alt)}</a></div></div><div class="w-full p-0 inline-flex flex-col justify-center items-start gap-8"><div class="inline-flex justify-center items-center gap-2.5"><div class="justify-start text-[var(--color-white)] text-xl md:text-2xl font-semibold font-[&#39;Poppins&#39;]">Les Jeux</div></div><div class="self-stretch flex flex-col justify-center items-start gap-5"><!--[-->`);
      ssrRenderList(unref(footerData).content.games, (item) => {
        _push(`<a${ssrRenderAttr("href", item.url)} class="justify-start text-[var(--color-white)] text-sm font-light font-[&#39;Poppins&#39;]">${ssrInterpolate(item.alt)}</a>`);
      });
      _push(`<!--]--></div></div><div class="w-full p-0 inline-flex flex-col justify-start items-start gap-8"><div class="inline-flex justify-center items-center gap-2.5"><div class="justify-start text-[var(--color-white)] text-xl md:text-2xl font-semibold font-[&#39;Poppins&#39;]">Rejoindre les jeux</div></div><div class="self-stretch flex flex-col justify-center items-start gap-5"><!--[-->`);
      ssrRenderList(unref(footerData).content.joinGames, (item) => {
        _push(`<a${ssrRenderAttr("href", item.url)} class="justify-start text-[var(--color-white)] text-base font-light font-[&#39;Poppins&#39;]">${ssrInterpolate(item.alt)}</a>`);
      });
      _push(`<!--]--></div></div><div class="w-full p-0 inline-flex flex-col justify-start items-start gap-8"><div class="inline-flex justify-center items-center gap-2.5"><div class="justify-start text-[var(--color-white)] text-xl md:text-2xl font-semibold font-[&#39;Poppins&#39;]">À propos de nous</div></div><div class="self-stretch flex flex-col justify-center items-start gap-5"><!--[-->`);
      ssrRenderList(unref(footerData).content.about, (item) => {
        _push(`<a${ssrRenderAttr("href", item.url)} class="self-stretch justify-start text-[var(--color-white)] text-base font-light font-[&#39;Poppins&#39;]">${ssrInterpolate(item.alt)}</a>`);
      });
      _push(`<!--]--></div></div><div class="w-full p-0 inline-flex flex-col justify-start items-start gap-8"><div class="inline-flex justify-center items-center gap-2.5"><div class="justify-start text-[var(--color-white)] text-xl md:text-2xl font-semibold font-[&#39;Poppins&#39;]">Nos projets</div></div><div class="self-stretch flex flex-col justify-center items-start gap-5"><!--[-->`);
      ssrRenderList(unref(footerData).content.projects, (item) => {
        _push(`<a${ssrRenderAttr("href", item.url)} class="self-stretch justify-start text-[var(--color-white)] text-base font-light font-[&#39;Poppins&#39;]">${ssrInterpolate(item.alt)}</a>`);
      });
      _push(`<!--]--></div></div></div><div class="w-full flex justify-center items-center pt-8 border-t border-white/20"><p class="text-[var(--color-white)] text-base md:text-lg font-semibold font-[&#39;Poppins&#39;]">Ce site a été éco-conçu pour minimiser son impact environnemental</p></div></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheFooter.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "FooterView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col w-full bg-[var(--color-blue)] relative z-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
      _push(`<div class="flex flex-col md:gap-5">`);
      _push(ssrRenderComponent(_sfc_main$7, {
        navigation: unref(footerData).navItems,
        socials: unref(footerData).socials
      }, null, _parent));
      _push(ssrRenderComponent(TheBottomBar, {
        text: unref(footerData).bottomBar,
        links: unref(footerData).bottomBarLinks
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/FooterView.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "TheMap",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 mb-8 relative group" }, _attrs))} data-v-76b50e58><div class="relative w-full max-w-[1362px] mx-auto h-[300px] md:h-auto rounded-[15px] overflow-hidden shadow-md group bg-gray-900" data-v-76b50e58>`);
      _push(ssrRenderComponent(BaseImg, {
        src: "/images/map.jpeg",
        alt: "map",
        wrapperClass: "inset-0 w-full h-full z-0 overflow-hidden wrapper",
        imgClass: "object-cover w-full h-full",
        preset: ""
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/The/TheMap.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const TheMap = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-76b50e58"]]);
const _sfc_main$3 = {
  __name: "TheMapView",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full max-w-[1362px] mx-auto px-4 md:px-0 flex flex-col gap-4" }, _attrs))}><h2 class="font-[Poppins] font-bold text-[28px] md:text-[32px] text-[var(--color-dark-blue)] pr-[10px]"> Découvrez Milan Cortina 2026 </h2>`);
      _push(ssrRenderComponent(TheMap, null, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../views/TheMapView.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-12 md:gap-14 lg:gap-20" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$m, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$j, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$e, {
        title: unref(cta)[0].title,
        text: unref(cta)[0].text,
        img: unref(cta)[0].img,
        button: unref(cta)[0].button,
        flipped: unref(cta)[0].flipped
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$a, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
      _push(ssrRenderComponent(BaseBanner, {
        title: unref(banners)[0].title,
        img: unref(banners)[0].img,
        button: unref(banners)[0].button
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$h, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$e, {
        title: unref(cta)[1].title,
        text: unref(cta)[1].text,
        img: unref(cta)[1].img,
        button: unref(cta)[1].button,
        flipped: unref(cta)[1].flipped
      }, null, _parent));
      _push(ssrRenderComponent(BaseBanner, {
        title: unref(banners)[1].title,
        img: unref(banners)[1].img,
        button: unref(banners)[1].button,
        "presented-by": "/images/presented_by.avif"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$e, {
        title: unref(cta)[2].title,
        text: unref(cta)[2].text,
        img: unref(cta)[2].img,
        button: unref(cta)[2].button,
        flipped: unref(cta)[2].flipped
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$f, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-7hBy5Kvl.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-CVoq-ZVA.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, __nuxt_component_0 as a, entry_default as default, useHead as u };
//# sourceMappingURL=server.mjs.map
