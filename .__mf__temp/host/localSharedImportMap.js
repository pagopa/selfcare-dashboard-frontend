
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    import {loadShare} from "@module-federation/runtime";
    const importMap = {
      
        "@emotion/react": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_emotion_mf_1_react__prebuild__.js");
            return pkg;
        }
      ,
        "@emotion/styled": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_emotion_mf_1_styled__prebuild__.js");
            return pkg;
        }
      ,
        "@mui/icons-material": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_mui_mf_1_icons_mf_2_material__prebuild__.js");
            return pkg;
        }
      ,
        "@mui/lab": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_mui_mf_1_lab__prebuild__.js");
            return pkg;
        }
      ,
        "@mui/material": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_mui_mf_1_material__prebuild__.js");
            return pkg;
        }
      ,
        "@pagopa/mui-italia": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_pagopa_mf_1_mui_mf_2_italia__prebuild__.js");
            return pkg;
        }
      ,
        "@pagopa/ts-commons": async () => {
          let pkg = await import("__mf__virtual/host__prebuild___mf_0_pagopa_mf_1_ts_mf_2_commons__prebuild__.js");
            return pkg;
        }
      ,
        "i18next": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__i18next__prebuild__.js");
            return pkg;
        }
      ,
        "mixpanel-browser": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__mixpanel_mf_2_browser__prebuild__.js");
            return pkg;
        }
      ,
        "react": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__react__prebuild__.js");
            return pkg;
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__react_mf_2_dom__prebuild__.js");
            return pkg;
        }
      ,
        "react-i18next": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__react_mf_2_i18next__prebuild__.js");
            return pkg;
        }
      ,
        "react-redux": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__react_mf_2_redux__prebuild__.js");
            return pkg;
        }
      ,
        "react-router-dom": async () => {
          let pkg = await import("__mf__virtual/host__prebuild__react_mf_2_router_mf_2_dom__prebuild__.js");
            return pkg;
        }
      
    }
      const usedShared = {
      
          "@emotion/react": {
            name: "@emotion/react",
            version: "11.14.0",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@emotion/react"}' must be provided by host`);
              }
              usedShared["@emotion/react"].loaded = true
              const {"@emotion/react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^11.11.1",
              
            }
          }
        ,
          "@emotion/styled": {
            name: "@emotion/styled",
            version: "11.14.1",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@emotion/styled"}' must be provided by host`);
              }
              usedShared["@emotion/styled"].loaded = true
              const {"@emotion/styled": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^11.11.0",
              
            }
          }
        ,
          "@mui/icons-material": {
            name: "@mui/icons-material",
            version: "5.18.0",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@mui/icons-material"}' must be provided by host`);
              }
              usedShared["@mui/icons-material"].loaded = true
              const {"@mui/icons-material": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.8.2",
              
            }
          }
        ,
          "@mui/lab": {
            name: "@mui/lab",
            version: "5.0.0-alpha.177",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@mui/lab"}' must be provided by host`);
              }
              usedShared["@mui/lab"].loaded = true
              const {"@mui/lab": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.0.0-alpha.80",
              
            }
          }
        ,
          "@mui/material": {
            name: "@mui/material",
            version: "5.18.0",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@mui/material"}' must be provided by host`);
              }
              usedShared["@mui/material"].loaded = true
              const {"@mui/material": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.8.2",
              
            }
          }
        ,
          "@pagopa/mui-italia": {
            name: "@pagopa/mui-italia",
            version: "1.10.0",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@pagopa/mui-italia"}' must be provided by host`);
              }
              usedShared["@pagopa/mui-italia"].loaded = true
              const {"@pagopa/mui-italia": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "1.10",
              
            }
          }
        ,
          "@pagopa/ts-commons": {
            name: "@pagopa/ts-commons",
            version: "10.15.0",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"@pagopa/ts-commons"}' must be provided by host`);
              }
              usedShared["@pagopa/ts-commons"].loaded = true
              const {"@pagopa/ts-commons": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^13.1.2",
              
            }
          }
        ,
          "i18next": {
            name: "i18next",
            version: "25.5.2",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"i18next"}' must be provided by host`);
              }
              usedShared["i18next"].loaded = true
              const {"i18next": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^25.4.2",
              
            }
          }
        ,
          "mixpanel-browser": {
            name: "mixpanel-browser",
            version: "2.74.0",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"mixpanel-browser"}' must be provided by host`);
              }
              usedShared["mixpanel-browser"].loaded = true
              const {"mixpanel-browser": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^2.74.0",
              
            }
          }
        ,
          "react": {
            name: "react",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react"}' must be provided by host`);
              }
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.2.0",
              
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-dom"}' must be provided by host`);
              }
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^18.2.0",
              
            }
          }
        ,
          "react-i18next": {
            name: "react-i18next",
            version: "15.7.3",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-i18next"}' must be provided by host`);
              }
              usedShared["react-i18next"].loaded = true
              const {"react-i18next": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^15.1.2",
              
            }
          }
        ,
          "react-redux": {
            name: "react-redux",
            version: "7.2.9",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-redux"}' must be provided by host`);
              }
              usedShared["react-redux"].loaded = true
              const {"react-redux": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^7.2.6",
              
            }
          }
        ,
          "react-router-dom": {
            name: "react-router-dom",
            version: "5.3.4",
            scope: ["default"],
            loaded: false,
            from: "host",
            async get () {
              if (false) {
                throw new Error(`Shared module '${"react-router-dom"}' must be provided by host`);
              }
              usedShared["react-router-dom"].loaded = true
              const {"react-router-dom": pkgDynamicImport} = importMap
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "^5.3.4",
              
            }
          }
        
    }
      const usedRemotes = [
                {
                  entryGlobalName: "http://localhost:3003/remoteEntry.js",
                  name: "selfcareAdmin",
                  type: "var",
                  entry: "http://localhost:3003/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "http://localhost:3002/remoteEntry.js",
                  name: "selfcareGroups",
                  type: "var",
                  entry: "http://localhost:3002/remoteEntry.js",
                  shareScope: "default",
                }
          ,
                {
                  entryGlobalName: "http://localhost:3001/remoteEntry.js",
                  name: "selfcareUsers",
                  type: "var",
                  entry: "http://localhost:3001/remoteEntry.js",
                  shareScope: "default",
                }
          
      ]
      export {
        usedShared,
        usedRemotes
      }
      