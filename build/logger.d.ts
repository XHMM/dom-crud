interface ILogger {
    log(methodName: string, msg: any): void;
    warn(methodName: string, msg: any): void;
    error(methodName: string, msg: any): void;
}
declare let logger: ILogger;
declare function muteConsole(): void;
declare function activateConsole(): void;
export default logger;
export { muteConsole, activateConsole };
