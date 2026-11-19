import { describe, expect, it } from 'vitest'
import { crc32, crc32Hex } from '../src/index.js'

describe('crc32', () => {
  it('returns 0 for empty string and empty Uint8Array', () => {
    expect(crc32('')).toBe(0)
    expect(crc32(new Uint8Array(0))).toBe(0)
  })

  it('matches the IEEE 802.3 standard check value for "123456789"', () => {
    expect(crc32('123456789')).toBe(0xcbf43926)
  })

  it('computes the expected checksum for the standard ASCII pangram', () => {
    expect(crc32('The quick brown fox jumps over the lazy dog')).toBe(0x414fa339)
  })

  it('returns an unsigned 32-bit integer when the most significant bit is 1', () => {
    const fourMaxBytes = new Uint8Array([0xff, 0xff, 0xff, 0xff])

    expect(crc32(fourMaxBytes)).toBe(0xffffffff)
    expect(crc32(fourMaxBytes)).toBe(4294967295)
  })

  it('handles zero-filled byte arrays', () => {
    const fourZeroBytes = new Uint8Array([0x00, 0x00, 0x00, 0x00])

    expect(crc32(fourZeroBytes)).toBe(0x2144df1c)
  })

  it('produces identical checksums for strings and their UTF-8 Uint8Array equivalents', () => {
    const asciiBytes = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f])
    const rocketEmojiBytes = new Uint8Array([0xf0, 0x9f, 0x9a, 0x80])
    const cyrillicBytes = new TextEncoder().encode('Привет')

    expect(crc32('hello')).toBe(crc32(asciiBytes))
    expect(crc32('🚀')).toBe(crc32(rocketEmojiBytes))
    expect(crc32('Привет')).toBe(crc32(cyrillicBytes))
  })

  it('reuses the lazy TextEncoder across multiple string calls without state leakage', () => {
    const firstCall = crc32('first-input')
    const secondCall = crc32('second-input')
    const repeatedFirstCall = crc32('first-input')

    expect(firstCall).not.toBe(secondCall)
    expect(firstCall).toBe(repeatedFirstCall)
  })

  it('reads only the view range when given a Uint8Array subarray', () => {
    const paddedBuffer = new TextEncoder().encode('__123456789__')
    const slice = paddedBuffer.subarray(2, 11)

    expect(crc32(slice)).toBe(0xcbf43926)
  })

  it('does not mutate the input Uint8Array', () => {
    const input = new Uint8Array([1, 2, 3, 4])
    const snapshot = new Uint8Array(input)

    crc32(input)

    expect(input).toEqual(snapshot)
  })
})

describe('crc32Hex', () => {
  it('pads results shorter than 8 hex characters with leading zeros', () => {
    expect(crc32Hex('')).toBe('00000000')
    expect(crc32Hex(new Uint8Array(0))).toBe('00000000')
    expect(crc32Hex('o')).toBe('0f0f9344')
  })

  it('formats standard test vectors as 8-character lowercase hex strings', () => {
    expect(crc32Hex('123456789')).toBe('cbf43926')
    expect(crc32Hex('The quick brown fox jumps over the lazy dog')).toBe('414fa339')
    expect(crc32Hex(new Uint8Array([0xff, 0xff, 0xff, 0xff]))).toBe('ffffffff')
  })
})
