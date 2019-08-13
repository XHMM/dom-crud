interface ILogger {
  log(methodName: string, msg: any): void;
  warn(methodName: string, msg: any): void;
  error(methodName: string, msg: any): void;
}

let logger: ILogger = {
  log: function() {},
  warn: function() {},
  error: function() {}
};
function muteConsole(): void {
  logger.log = function() {};
  logger.warn = function() {};
  logger.error = function() {};
}
function activateConsole(): void {
  logger.log = function(methodName: string, msg: any) {
    console.log(
      '%c[dom-crud:log][%s]\n %c%s',
      'color:#18b7ff;background:rgba(0,0,0,0.02);padding:0.2rem',
      methodName,
      'background:rgba(0,0,0,0.02);padding:0.2rem',
      msg
    );
  };
  logger.warn = function(methodName: string, msg: any) {
    console.log(
      '%c[dom-crud:warn][%s]\n %c%s',
      'color:orange;background:rgba(0,0,0,0.02);padding:0.2rem',
      methodName,
      'background:rgba(0,0,0,0.02);padding:0.2rem',
      msg
    );
  };
  logger.error = function(methodName: string, msg: any) {
    console.log(
      '%c[dom-crud:error][%s]\n %c%s',
      'color:red;background:rgba(0,0,0,0.02);padding:0.2rem',
      methodName,
      'background:rgba(0,0,0,0.02);padding:0.2rem',
      msg
    );
  };
}

// default muted
muteConsole();

// @ts-ignore
export default logger;
export { muteConsole, activateConsole };
