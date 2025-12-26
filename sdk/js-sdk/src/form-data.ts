// @ts-ignore
const FormData =
    globalThis.FormData ||
    (typeof window !== 'undefined' && window.FormData) ||
    (typeof global !== 'undefined' && global.FormData) ||
    (typeof require !== 'undefined' &&
        (() => {
            try {
                return require('form-data');
            } catch {
                return null;
            }
        })()) ||
    class FormData {
        constructor() {
            throw new Error('FormData not available in this environment');
        }
    };

export default FormData as typeof globalThis.FormData;
