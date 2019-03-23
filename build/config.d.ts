interface ICrudConfig {
    doms: {
        "+=": {
            beforeScript: boolean;
        };
    };
    debug: boolean;
}
interface IConsole {
    log(methodName: string, msg: any): void;
    warn(methodName: string, msg: any): void;
    error(methodName: string, msg: any): void;
}
declare let _console: IConsole;
declare function getCrudConfig(): ICrudConfig;
declare function updateCrudConfig(newConfig: Partial<ICrudConfig>): void;
declare function readConfigByKey(key: string): any;
export { getCrudConfig, updateCrudConfig, readConfigByKey, _console };
