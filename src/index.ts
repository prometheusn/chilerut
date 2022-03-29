/**
 * The **reverseStr()** returns a reversed string from the rut param.
 * @param rut The string to be reversed.
 * @returns A new reversed string.
 */
function reverseStr(rut: string): string {
    return rut.split("").reduce((acc, char) => char + acc, "");
}

/**
 * The **sanitiseRut()** returns a sanitised RUT string, which leaves only numbers and the char “K/k”.
 * @param rut A RUT string.
 * @returns A new string of numbers and the char "K/k" if applicable.
 */
function sanitiseRut(rut: string): string {
    return rut.toString().replace(/[^\dKk]/g, "");
}

/**
 * The **fullySanitiseRut()** returns a sanitised RUT string, which leaves only numbers.
 * @param rut A RUT string.
 * @returns A new string of numbers.
 */
function fullySanitiseRut(rut: string): string {
    return rut.toString().replace(/\D/g, '');
}


/**
 * The **getCheckDigit()** returns a check digit. A string char calculated on a [modulo 11 based algorithm](https://es.wikipedia.org/wiki/Rol_%C3%9Anico_Tributario#Algoritmo)
 * @param rut A RUT string without the check digit, i.s., the last char.
 * @returns A valid check digit.
 */
function getCheckDigit(rut: string): string {
    const local = [ ...reverseStr(fullySanitiseRut(rut)) ];
    let sum = 0;
    let v = 2;
    for (let i = 0; i < local.length; i++, v < 7 ? v++ : v = 2) {
        sum += +local[i] * v;
    }

    const result = 11 - (sum % 11);
    if (result === 11) {
        return "0";
    } else if (result <= 9) {
        return result.toString()
    } else {
        return "K";
    }
}

/**
 * The **validateRut()** returns a boolean value based on the rut provided.
 *
 * It verifies the pattern and its check digit. If it's valid, it returns **true** and if it's not, it returns **false**.
 * @param rut The RUT string.
 * @returns A boolean value according to the validity of the rut string.
 */
function validateRut(rut: string): boolean {
    const format = /^(?=.{4,12}$)((\d{1,3}(\.\d{3}){0,2})-([\dkK]))$/;
    if (!format.test(rut)) {
        return false
    }
    const sanitised = sanitiseRut(rut)
    const correlative = sanitised.slice(0, -1)
    const checkDigit = sanitised[sanitised.length - 1]
    const verifiedDigit = getCheckDigit(correlative)
    return checkDigit.toLowerCase() === verifiedDigit.toLowerCase()
}

/**
 *  Object parameter type for **generateMulRun()** options.
 */
interface GenerateMulRutOpts {
    // The number of RUTs to generate.
    count?: number,
    // If the RUTs must contain dots as a thousand separator.
    dots?: boolean,
    // If the RUTs must contain a hyphen between the correlative number and the check digit.
    hyphen?: boolean
}

// Object parameter type for **generateRut()** options.
type GenerateRutOpts = Omit<GenerateMulRutOpts, "count">


const defaultMulOpts: GenerateMulRutOpts = {
    count: 30,
    dots: true,
    hyphen: true
}
const defaultOpts: GenerateRutOpts = { dots: true, hyphen: true }

/**
 * The **generateRut()** returns a random, valid RUT.
 *
 * It takes an optional object, which determines if the string is returned with a thousand separators and/or a hyphen. By default, these options are **true**.
 * @param opts An object with predetermined formatting options.
 * @returns A random, valid generated RUT.
 */
function generateRut(opts: GenerateRutOpts = defaultOpts): string {
    const rut = Math.floor(100_000 + Math.random() * 29_000_000)
    return "" + (opts.dots ? rut.toLocaleString("es-CL") : rut.toString()) + (opts?.hyphen ? '-' : '') + getCheckDigit("" + rut)
}

/**
 * The **generateMulRut()** returns an array of random, valid RUT strings.
 *
 * It takes an optional object, which determines the number of RUTs to generate, and if they are returned with a thousand separators and/or a hyphen. By default, the amount of RUTs to create is **30**, and the formatting options are **true**.
 * @param opts An object with predetermined formatting options.
 * @returns An array of strings, which are random, valid generated RUTs.
 */
function generateMulRut(opts: GenerateMulRutOpts = defaultMulOpts): string[] {
    if (Object.keys(opts).length === 0) {
        return []
    }
    const mulRut: string[] = new Array(opts.count)
    for (let i = 0; i < mulRut.length; i++) {
        mulRut[i] = generateRut(opts)
    }
    return mulRut
}

/**
 * The **formatRut()** returns a formatted RUT string.
 *
 * A RUT with **dots** as a thousand separator and a **hyphen** between the correlative number and the check digit.
 * @param rut A RUT string to format.
 * @returns A new formatted RUT string.
 */
function formatRut(rut: string): string {
    return new Intl.NumberFormat("es-CL").format(+rut.slice(0, -1)) + "-" + rut[rut.length - 1]
}

export {
    sanitiseRut,
    fullySanitiseRut,
    validateRut,
    getCheckDigit,
    generateRut,
    generateMulRut,
    formatRut,
    GenerateRutOpts,
    GenerateMulRutOpts,
}
