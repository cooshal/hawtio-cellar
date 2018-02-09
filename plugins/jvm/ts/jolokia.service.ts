namespace JVM {

  export class JolokiaService {

    constructor(private $q: ng.IQService, private jolokia: Jolokia.IJolokia) {
      'ngInject';
    }
    
    getAttribute(mbean: string, attribute: string): ng.IPromise<any> {
      return this.$q((resolve, reject) => {
        this.jolokia.request(
          { type: 'read', mbean: mbean, attribute: attribute },
          { success: response => resolve(response.value) },
          { error: response => {
              log.error(`JolokiaService.getAttribute('${mbean}', '${attribute}') failed. Error: ${response.error}`);
              reject(response.error);
            }
          });
      });
    }

    execute(mbean: string, operation: string, ...args: any[]): ng.IPromise<any> {
      return this.$q((resolve, reject) => {
        this.jolokia.request(
          { type: 'exec', mbean: mbean, operation: operation, arguments: args },
          { success: response => resolve(response.value) },
          { error: response => {
              log.error(`JolokiaService.execute('${mbean}', '${operation}', '${args}') failed. Error: ${response.error}`);
              reject(response.error);
            }
          });
      });
    }
  }

  _module.service("jolokiaService", JolokiaService);

}