import { describe, it, expect } from 'vitest'
import { adder } from '../../util/user'

describe('Adder', () => {
    it('should add numbers', () => {
        const results = adder(1, 2, 4)
        expect(results).toBe(7)
    })

    it('No args returns zero', () => {
        expect(adder()).toBe(0)
    })
})
