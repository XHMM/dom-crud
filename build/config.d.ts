interface ICrudConfig {
    doms: {
        "+=": {
            beforeScript: boolean;
        };
    };
    debug: boolean;
}
declare let _console: Console;
declare function getCrudConfig(): ICrudConfig;
declare function updateCrudConfig(newConfig: Partial<ICrudConfig>): void;
declare function readConfigByKey(key: string): any;
export { getCrudConfig, updateCrudConfig, readConfigByKey, _console };
