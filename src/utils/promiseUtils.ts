/**
 * Utilitários para lidar com Promises e Timeouts
 */

/**
 * Executa uma promise com um limite de tempo (timeout)
 * @param promise A promise a ser executada
 * @param ms Tempo limite em milissegundos
 * @param timeoutError Mensagem de erro caso o tempo expire
 */
export async function withTimeout<T>(
  promise: Promise<T>, 
  ms: number = 5000, 
  timeoutError: string = `Timeout de ${ms}ms excedido`
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(timeoutError));
    }, ms);
    
    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(reason => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}
