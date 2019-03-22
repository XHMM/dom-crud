interface ICrudConfig {
    doms: {
        "+=": {
            beforeScript: boolean;
        };
    };
}
declare function getCrudConfig(): ICrudConfig;
declare function updateCrudConfig(newConfig: Partial<ICrudConfig>): void;
declare function readConfigByKey(key: string): any;
export { getCrudConfig, updateCrudConfig, readConfigByKey };
