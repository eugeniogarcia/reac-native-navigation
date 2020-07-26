//Usa el almancenamiento local
export default {
  getItem(key: string) {
    //Convierte el método en asincrono al retornar uan Promise. La Promise contiene el item que este guardado en el local storage
    //Usa la misma técnica con el resto de métodos
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem(key: string, value: string) {
    return Promise.resolve(localStorage.setItem(key, value));
  },
  removeItem(key: string) {
    return Promise.resolve(localStorage.removeItem(key));
  },
  clear() {
    return Promise.resolve(localStorage.clear());
  },
};
