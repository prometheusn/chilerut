import {
    validateRut,
    formatRut,
    fullySanitiseRut,
    generateMulRut,
    generateRut,
    GenerateMulRutOpts,
    GenerateRutOpts,
    getCheckDigit,
    sanitiseRut,
} from "./index";
import { describe, expect, it } from "vitest"


const rutExamples = [
    "10-8",
    "50.323-1",
    '262.554-7',
    "2.323.434-3",
    '15.638.169-1',
    '23.831.058-K',
]

const invalidRutExamples = [
    '10-3',
    '100.220-3',
    '103.403.202-4',
    "random",
    "32",
    "11.553.392-3"
]

const testValidateRutValid = (rut: string): boolean => expect(validateRut(rut)).toBe(true) as unknown as boolean;
const testValidateRutInvalid = (rut: string): boolean => expect(validateRut(rut)).toBe(false) as unknown as boolean;


describe('validateRut', () => {
    it('Valid RUTs', () => {
        for (const el of rutExamples) {
            testValidateRutValid(el)
        }
    });
    it('Invalid RUTs', () => {
        for (const el of invalidRutExamples) {
            testValidateRutInvalid(el)
        }
    });
});

const testSanitiseRut = (rut: string, expectedRut: string): Chai.Assertion => expect(sanitiseRut(rut)).is.equal(expectedRut)

// Test against specified set of RUT' which include the letter K
describe("sanitiseRut", () => {
    it('RUT with K/k', () => {
        testSanitiseRut("23.831.058-K", "23831058K")
        testSanitiseRut("23.964.368-K", "23964368K")
        testSanitiseRut("13.750.460-k", "13750460k")
        testSanitiseRut("17.907.812-0", "179078120")
        testSanitiseRut("1.108.244-0", "11082440")
        testSanitiseRut("238.620-8", "2386208")
    });
    it('Invalid RUT', () => {
        testSanitiseRut("sound", "")
        testSanitiseRut("soundk", "k")
        testSanitiseRut("soundK", "K")
        testSanitiseRut("12.443-3", "124433")
        testSanitiseRut("12.345.678-9", "123456789")
        testSanitiseRut("9.765.432-1", "97654321")
    });
})


const testFullySanitiseRut = (rut: string, expectedRut: string): Chai.Assertion => expect(fullySanitiseRut(rut)).is.equal(expectedRut)

describe("fullySanitiseRut", () => {
    it('Leaving only numbers', () => {
        testFullySanitiseRut("23.831.058-K", "23831058")
        testFullySanitiseRut("23.964.368-K", "23964368")
        testFullySanitiseRut("13.750.460-k", "13750460")
        testFullySanitiseRut("17.907.812-0", "179078120")
        testFullySanitiseRut("1.108.244-0", "11082440")
        testFullySanitiseRut("238.620-8", "2386208")
    });
    it('Invalid RUT', () => {
        testFullySanitiseRut("12.443-3", "124433")
        testFullySanitiseRut("12.345.678-9", "123456789")
        testFullySanitiseRut("9.765.432-1", "97654321")
        testFullySanitiseRut("sound", "")
        testFullySanitiseRut("soundk", "")
        testFullySanitiseRut("soundK", "")
    });
})


const testGetVerificationDigit = (rut: string, expectedDigit: string): Chai.Assertion => expect(getCheckDigit(rut)).is.equal(expectedDigit)

describe("getVerificationDigit", () => {
    it('Get verification digit of RUTs', () => {
        testGetVerificationDigit("23.831.058", "K")
        testGetVerificationDigit("23.964.368", "K")
        testGetVerificationDigit("13.750.460", "K")
        testGetVerificationDigit("17.907.812", "0")
        testGetVerificationDigit("1.108.244", "0")
        testGetVerificationDigit("238.620", "8")
    });
})

interface MinMaxLen {
    min: number,
    max: number
}

const testGenerateRut = (opts: GenerateRutOpts, within: MinMaxLen): Chai.Assertion => {
    const rut = generateRut(opts)
    return expect(rut).to.have.length.within(within.min, within.max)
}
describe("generateRut", () => {
    it('Generate random, valid RUT with different opts', () => {
        testGenerateRut({ dots: true, hyphen: false }, { min: 8, max: 11 })
        testGenerateRut({ dots: true, hyphen: false }, { min: 8, max: 11 })
        testGenerateRut({ dots: true, hyphen: false }, { min: 8, max: 11 })
        testGenerateRut({ dots: true, hyphen: true }, { min: 9, max: 12 })
        testGenerateRut({ dots: true, hyphen: true }, { min: 9, max: 12 })
        testGenerateRut({ dots: true, hyphen: true }, { min: 9, max: 12 })
    });
    it('Generate random, valid RUT with false opts', () => {
        testGenerateRut({ dots: false, hyphen: false }, { min: 7, max: 9 })
        testGenerateRut({ dots: false, hyphen: false }, { min: 7, max: 9 })
        testGenerateRut({ dots: false, hyphen: false }, { min: 7, max: 9 })
    });
})


const testGenerateMulRut = (opts: GenerateMulRutOpts): Chai.Assertion => {
    const rut = generateMulRut(opts)
    const optsCount = opts.count ? opts.count : 0
    return expect(rut).to.be.length(optsCount)
}
describe("generateMulRut", () => {
    it('Generate random, valid RUTs with different opts', () => {
        testGenerateMulRut({ count: 50 })
        testGenerateMulRut({ count: 103 })
        testGenerateMulRut({ count: 232 })
        testGenerateMulRut({ count: 0 })
        testGenerateMulRut({})
    });
})


const testFormatRut = (rut: string, expectedRut: string): Chai.Assertion => expect(formatRut(rut)).to.be.equal(expectedRut)

describe("formatRut", () => {
    it('Format RUT according to the standard', () => {
        testFormatRut("23831058k", "23.831.058-k")
        testFormatRut("23964368k", "23.964.368-k")
        testFormatRut("13750460K", "13.750.460-K")
        testFormatRut("179078120", "17.907.812-0")
        testFormatRut("11082440", "1.108.244-0")
        testFormatRut("2386208", "238.620-8")
        testFormatRut("123856", "12.385-6")
        testFormatRut("108", "10-8")
    });
})